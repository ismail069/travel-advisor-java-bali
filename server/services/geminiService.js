import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDestinationContext } from './destinationService.js';

const systemInstruction = `You are an AI travel assistant for tourist destinations in Java and Bali, Indonesia. Help users find suitable travel recommendations based on their preferences, budget, travel duration, starting location, trip type, number of travelers, and interests. Also you may ask trip itenary when the user provide destination and how long they stay. Only recommend destinations in Java and Bali. Use the destination context only good reputation source in the internet. If the selected language is Indonesian, respond in friendly, concise, and informative Bahasa Indonesia. If the selected language is English, respond in friendly, concise, and informative English. If the user's information is incomplete, ask helpful follow-up questions. Do not provide irrelevant information outside Java and Bali tourism.`;

const fallback = {
  id: 'Maaf, TripAssistant AI sedang belum tersedia. Kamu tetap bisa jelajahi rekomendasi lokal di dashboard destinasi.',
  en: 'Sorry, TripAssistant AI is not available right now. You can still explore local recommendations in the destination dashboard.'
};

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

export async function askGemini({ message, language = 'id', travelerName = 'Traveler', history = [] }) {
  const context = await getDestinationContext(message);
  if (!process.env.GEMINI_API_KEY) {
    return { reply: fallback[language] || fallback.id, recommendedDestinationIds: context.slice(0, 3).map((d) => d.id) };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    systemInstruction
  });

  const contextText = context.map((d) => {
    const name = displayName(d, language);
    const alternateName = d.name_id && d.name_id !== d.name ? ` / English name: ${d.name}` : '';
    return `ID ${d.id}: ${name}${alternateName}, ${d.city}, ${d.province}, ${d.island}, ${d.category_en}/${d.category_id}. ${language === 'id' ? d.short_description_id : d.short_description_en}. Source: ${d.source_name || 'trusted travel source'} ${d.source_url || ''}`;
  }).join('\n');
  const prompt = `
Selected language: ${language}
Traveler name: ${travelerName || 'Traveler'}
Destination context from Supabase PostgreSQL, seeded from reputable tourism/heritage sources:
${contextText || 'No direct local match. Recommend only Java and Bali destinations and ask follow-up questions if needed.'}

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
- Every ID in DESTINATION_IDS must be mentioned by exact name in the visible reply.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const reply = text.replace(/DESTINATION_IDS:\s*\[[^\]]*\]/i, '').trim();
  const idsMatch = text.match(/DESTINATION_IDS:\s*\[([^\]]*)\]/i);
  const parsedIds = idsMatch
    ? idsMatch[1].split(',').map((id) => Number(id.trim())).filter(Boolean)
    : [];
  const contextIds = new Set(context.map((destination) => destination.id));
  const mentionedIds = extractMentionedDestinationIds(reply, context, language);
  const recommendedDestinationIds = mentionedIds.length
    ? mentionedIds
    : parsedIds.filter((id) => contextIds.has(id));

  return { reply, recommendedDestinationIds };
}
