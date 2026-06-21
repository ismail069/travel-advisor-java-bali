import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDestinationContext } from './destinationService.js';

const systemInstruction = `You are an AI travel assistant for tourist destinations in Java and Bali, Indonesia. Help users find suitable travel recommendations based on their preferences, budget, travel duration, starting location, trip type, number of travelers, and interests. Also you may ask trip itenary when the user provide destination and how long they stay. Only recommend destinations in Java and Bali. Use the destination context only good reputation source in the internet. If the selected language is Indonesian, respond in friendly, concise, and informative Bahasa Indonesia. If the selected language is English, respond in friendly, concise, and informative English. If the user's information is incomplete, ask helpful follow-up questions. Do not provide irrelevant information outside Java and Bali tourism.`;

const fallback = {
  id: 'Maaf, TripAssistant AI sedang belum tersedia. Kamu tetap bisa jelajahi rekomendasi lokal di dashboard destinasi.',
  en: 'Sorry, TripAssistant AI is not available right now. You can still explore local recommendations in the destination dashboard.'
};

export async function askGemini({ message, language = 'id', history = [] }) {
  const context = await getDestinationContext(message);
  if (!process.env.GEMINI_API_KEY) {
    return { reply: fallback[language] || fallback.id, recommendedDestinationIds: context.slice(0, 3).map((d) => d.id) };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    systemInstruction
  });

  const contextText = context.map((d) => `ID ${d.id}: ${d.name}, ${d.city}, ${d.province}, ${d.island}, ${d.category_en}/${d.category_id}. ${language === 'id' ? d.short_description_id : d.short_description_en}. Source: ${d.source_name || 'trusted travel source'} ${d.source_url || ''}`).join('\n');
  const prompt = `
Selected language: ${language}
Destination context from Supabase PostgreSQL, seeded from reputable tourism/heritage sources:
${contextText || 'No direct local match. Recommend only Java and Bali destinations and ask follow-up questions if needed.'}

Recent conversation:
${history.slice(-8).map((item) => `${item.role}: ${item.content}`).join('\n')}

User message: ${message}

Reply naturally. At the end include a machine-readable line exactly like:
DESTINATION_IDS: [1,2,3]
Only include IDs from the local context when clearly recommended.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const idsMatch = text.match(/DESTINATION_IDS:\s*\[([^\]]*)\]/i);
  const recommendedDestinationIds = idsMatch
    ? idsMatch[1].split(',').map((id) => Number(id.trim())).filter(Boolean)
    : [];
  const reply = text.replace(/DESTINATION_IDS:\s*\[[^\]]*\]/i, '').trim();
  return { reply, recommendedDestinationIds };
}
