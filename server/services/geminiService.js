import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDestinationContext } from './destinationService.js';

const systemInstruction = `You are TripAssistant, a closed-domain travel assistant for JawaBali Trip.
Your only knowledge source is the DESTINATION CONTEXT supplied in the user prompt, which comes from the JawaBali Trip database.
Never use general knowledge, web knowledge, or memory to add destinations or factual claims.
Only answer travel-planning questions about Java and Bali, Indonesia. Refuse unrelated subjects and destinations outside Java and Bali.
If the database context does not contain enough information, say so clearly and ask a relevant follow-up question. Never guess.
Users may ask about hotels, accommodation, restaurants, food, transportation, healthcare facilities, and safety facilities around a database destination. Help with these needs using the destination's database location, map link, activities, and travel notes. You may provide the supplied Google Maps nearby-search links, but never invent a business or facility name, phone number, capability, price, schedule, route, distance, rating, or availability that is absent from the context. Do not diagnose or provide medical treatment advice. For an urgent health or safety situation, tell the user to contact local emergency services or on-site authorities immediately.
Only recommend destinations present in the context and preserve their exact names and IDs.
Database IDs are internal metadata. Never show an ID, ID label, or number beside a destination in the visible reply. Put IDs only in the final DESTINATION_IDS machine-readable line.
Answer in friendly, concise Indonesian for language=id and English for language=en.`;

const scopeReplies = {
  outside: {
    id: 'Maaf, TripAssistant hanya membantu topik perjalanan di Jawa dan Bali berdasarkan data yang tersedia di database JawaBali Trip. Silakan tanyakan destinasi, itinerary, aktivitas, akses, waktu kunjungan, atau kebutuhan perjalanan di Jawa dan Bali.',
    en: 'Sorry, TripAssistant only helps with Java and Bali travel using information available in the JawaBali Trip database. You can ask about destinations, itineraries, activities, access, visiting times, or travel needs in Java and Bali.'
  },
  clarify: {
    id: 'Saya siap membantu berdasarkan database destinasi JawaBali Trip. Sebutkan wilayah Jawa atau Bali, durasi perjalanan, jenis tempat, budget, atau gaya liburan yang kamu inginkan.',
    en: 'I can help using the JawaBali Trip destination database. Please mention a Java or Bali area, trip duration, place type, budget, or preferred travel style.'
  },
  greeting: {
    id: 'Halo! Saya TripAssistant. Saya hanya menjawab berdasarkan database destinasi JawaBali Trip untuk Jawa dan Bali. Kamu bisa menyebutkan wilayah, durasi, budget, dan minat perjalananmu.',
    en: 'Hello! I am TripAssistant. I answer only from the JawaBali Trip destination database for Java and Bali. Tell me your preferred area, duration, budget, and travel interests.'
  }
};

const TRAVEL_TERMS = /\b(wisata|liburan|trip|travel|tour|destinasi|destination|itinerary|itinerari|hotel|penginapan|pantai|beach|gunung|mountain|air terjun|waterfall|danau|lake|pura|temple|kuliner|food|transport|akses|route|rute|budget|biaya|harga|ticket|tiket|family|keluarga|honeymoon|backpacker|visit|kunjung|aktivitas|activity|photo|foto|sunrise|sunset|rumah sakit|hospital|klinik|clinic|apotek|pharmacy|dokter|doctor|kesehatan|healthcare|polisi|police|keamanan|security|darurat|emergency|jawa|java|bali|jakarta|bandung|bogor|yogyakarta|jogja|solo|semarang|surabaya|malang|banyuwangi|denpasar|ubud|badung|gianyar|tabanan)\b/i;
const OUTSIDE_TERMS = /\b(lombok|sumatra|sulawesi|kalimantan|papua|tokyo|japan|jepang|singapore|malaysia|thailand|paris|london|australia|coding|programming|javascript|python|saham|crypto|politik|presiden|diagnosis|obat|matematika|homework)\b/i;
const GREETING = /^\s*(halo|hai|hi|hello|hey|selamat (pagi|siang|sore|malam))[!.,\s]*$/i;

export function classifyChatScope(message) {
  const value = String(message || '').trim();
  if (GREETING.test(value)) return 'greeting';
  if (OUTSIDE_TERMS.test(value)) return 'outside';
  if (TRAVEL_TERMS.test(value)) return 'travel';
  return 'outside';
}

const fallback = {
  id: 'Maaf, TripAssistant AI sedang belum tersedia. Kamu tetap bisa jelajahi rekomendasi lokal di dashboard destinasi.',
  en: 'Sorry, TripAssistant AI is not available right now. You can still explore local recommendations in the destination dashboard.'
};

const DEFAULT_GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash'
];

export function getGeminiModels(env = process.env) {
  const configuredModels = String(env.GEMINI_MODELS || '')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);
  const models = configuredModels.length
    ? configuredModels
    : [env.GEMINI_MODEL, ...DEFAULT_GEMINI_MODELS].filter(Boolean);

  return [...new Set(models)];
}

export async function generateWithModelFallback(genAI, prompt, models = getGeminiModels()) {
  const failures = [];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text.trim()) throw new Error('Gemini returned an empty response.');
      return { text, model: modelName };
    } catch (error) {
      failures.push({ model: modelName, message: error.message, status: error.status });
      console.warn(`Gemini model ${modelName} failed; trying the next fallback.`, {
        message: error.message,
        status: error.status
      });
    }
  }

  const error = new Error(`All configured Gemini models failed: ${models.join(', ')}`);
  error.failures = failures;
  throw error;
}

function displayName(destination, language) {
  return language === 'id' && destination.name_id ? destination.name_id : destination.name;
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function extractMentionedDestinationIds(reply, context, language) {
  const normalizedReply = ` ${normalizeText(reply)} `;
  const matches = context
    .map((destination) => {
      const names = [displayName(destination, language), destination.name, destination.name_id].filter(Boolean);
      const matchedName = names.find((name) => {
        const normalizedName = normalizeText(name);
        return normalizedName.length > 2 && normalizedReply.includes(` ${normalizedName} `);
      });
      return matchedName ? { id: destination.id, index: normalizedReply.indexOf(` ${normalizeText(matchedName)} `) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index);

  return [...new Set(matches.map((match) => match.id))];
}

function publicDestination(destination, language) {
  return {
    id: destination.id,
    name: displayName(destination, language),
    city: destination.city,
    province: destination.province,
    island: destination.island,
    category: language === 'id' ? destination.category_id : destination.category_en,
    description: language === 'id' ? destination.short_description_id : destination.short_description_en,
    imageUrl: destination.image_url || null
  };
}

export async function askGemini({ message, language = 'id', travelerName = 'Traveler', history = [] }) {
  const safeLanguage = language === 'en' ? 'en' : 'id';
  const scope = classifyChatScope(message);
  if (scope === 'outside' || scope === 'greeting') {
    return { reply: scopeReplies[scope][safeLanguage], recommendedDestinationIds: [], recommendedDestinations: [] };
  }

  const context = await getDestinationContext(message);
  if (!context.length) {
    return { reply: scopeReplies.clarify[safeLanguage], recommendedDestinationIds: [], recommendedDestinations: [] };
  }
  if (!process.env.GEMINI_API_KEY) {
    const selected = context.slice(0, 3);
    return { reply: fallback[safeLanguage] || fallback.id, recommendedDestinationIds: selected.map((d) => d.id), recommendedDestinations: selected.map((d) => publicDestination(d, safeLanguage)) };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const contextText = context.map((d) => {
    const name = displayName(d, safeLanguage);
    const alternateName = d.name_id && d.name_id !== d.name ? ` / English name: ${d.name}` : '';
    const locationQuery = d.latitude != null && d.longitude != null
      ? `${d.latitude},${d.longitude}`
      : [d.address, d.city, d.province].filter(Boolean).join(', ');
    const nearbyHotels = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hotel near ${locationQuery}`)}`;
    const nearbyRestaurants = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`restaurants near ${locationQuery}`)}`;
    const nearbyHospitals = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hospital or clinic near ${locationQuery}`)}`;
    const nearbyPharmacies = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`pharmacy near ${locationQuery}`)}`;
    const nearbyPolice = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`police station near ${locationQuery}`)}`;
    return `ID ${d.id}: ${name}${alternateName}; location=${d.city}, ${d.province}, ${d.island}; coordinates=${d.latitude ?? 'not available'},${d.longitude ?? 'not available'}; category=${safeLanguage === 'id' ? d.category_id : d.category_en}; summary=${safeLanguage === 'id' ? d.short_description_id : d.short_description_en}; activities=${safeLanguage === 'id' ? d.activities_id : d.activities_en}; travel_notes=${safeLanguage === 'id' ? d.travel_notes_id : d.travel_notes_en}; best_time=${d.best_time_to_visit || 'not available'}; address=${d.address || 'not available'}; destination_map=${d.google_maps_url || 'not available'}; nearby_hotel_search=${nearbyHotels}; nearby_restaurant_search=${nearbyRestaurants}; nearby_hospital_or_clinic_search=${nearbyHospitals}; nearby_pharmacy_search=${nearbyPharmacies}; nearby_police_search=${nearbyPolice}; source=${d.source_name || 'database record'} ${d.source_url || ''}`;
  }).join('\n');
  const prompt = `
Selected language: ${safeLanguage}
Traveler name: ${travelerName || 'Traveler'}
DESTINATION CONTEXT from the JawaBali Trip Supabase database:
${contextText}

Recent conversation:
${history.slice(-8).map((item) => `${item.role}: ${item.content}`).join('\n')}

User message: ${message}

Reply naturally. At the end include a machine-readable line exactly like:
DESTINATION_IDS: [1,2,3]
Only include IDs from the local context when clearly recommended.
Important rules:
- Recommend ONLY destinations listed in the Destination context above.
- Use the exact destination names and exact IDs from the Destination context.
- Do not invent destinations or reuse IDs from memory.
- Every destination you recommend in the visible reply must appear in DESTINATION_IDS.
- Every ID in DESTINATION_IDS must be mentioned by exact name in the visible reply.
- Never display database IDs in the visible reply. IDs belong only in DESTINATION_IDS.
- For hotel/accommodation or restaurant questions, do not name individual businesses unless their names explicitly appear in the context. Explain that live listings are not stored when applicable, and offer the supplied nearby Google Maps search link.
- For transport questions, use only the address, coordinates, map link, and travel_notes in the context. Ask for the user's starting point when it is needed; never invent fares, schedules, journey times, or routes.
- For healthcare or safety facility questions, do not claim that a facility is open, suitable, nearest, or capable of a service unless that is explicitly in the context. Offer the relevant supplied Google Maps search link and advise the user to verify the facility by phone. For an active emergency, prioritize immediate contact with local emergency services or on-site authorities.`;

  const { text } = await generateWithModelFallback(genAI, prompt);
  const reply = text
    .replace(/DESTINATION_IDS:\s*\[[^\]]*\]/i, '')
    .replace(/\s*\(\s*ID\s*#?\s*\d+\s*\)/gi, '')
    .replace(/\bID\s*#?\s*\d+\b/gi, '')
    .trim();
  const idsMatch = text.match(/DESTINATION_IDS:\s*\[([^\]]*)\]/i);
  const parsedIds = idsMatch
    ? idsMatch[1].split(',').map((id) => Number(id.trim())).filter(Boolean)
    : [];
  const contextIds = new Set(context.map((destination) => destination.id));
  const mentionedIds = extractMentionedDestinationIds(reply, context, safeLanguage);
  const recommendedDestinationIds = mentionedIds.length
    ? mentionedIds
    : parsedIds.filter((id) => contextIds.has(id));

  const recommendedSet = new Set(recommendedDestinationIds);
  const recommendedDestinations = context
    .filter((destination) => recommendedSet.has(destination.id))
    .map((destination) => publicDestination(destination, safeLanguage));

  return { reply, recommendedDestinationIds, recommendedDestinations };
}
