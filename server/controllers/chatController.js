import { askGemini } from '../services/geminiService.js';
import { getDestinationContext } from '../services/destinationService.js';

function buildFallbackReply(language, destinations) {
  const displayName = (destination) => language === 'id' && destination.name_id ? destination.name_id : destination.name;
  if (language === 'en') {
    const names = destinations.map(displayName).join(', ');
    return destinations.length
      ? `TripAssistant AI is having trouble reaching Gemini right now, but I can still suggest options from our destination database: ${names}. Tell me your travel duration, starting location, budget, and travel style so I can narrow this down.`
      : 'TripAssistant AI is having trouble reaching Gemini right now. Please try again soon, or explore the destination dashboard while the AI service recovers.';
  }

  const names = destinations.map(displayName).join(', ');
  return destinations.length
    ? `TripAssistant AI sedang sulit menghubungi Gemini, tetapi saya tetap bisa memberi rekomendasi dari database destinasi: ${names}. Ceritakan durasi perjalanan, titik berangkat, budget, dan gaya liburan agar saya bisa mempersempit pilihan.`
    : 'TripAssistant AI sedang sulit menghubungi Gemini. Silakan coba lagi sebentar lagi, atau jelajahi dashboard destinasi terlebih dahulu.';
}

export async function create(req, res) {
  try {
    res.json(await askGemini(req.body));
  } catch (error) {
    console.error('TripAssistant AI error:', {
      message: error.message,
      status: error.status,
      details: error.details
    });

    const destinations = await getDestinationContext(req.body.message).catch(() => []);
    res.status(200).json({
      reply: buildFallbackReply(req.body.language, destinations.slice(0, 3)),
      recommendedDestinationIds: destinations.slice(0, 3).map((item) => item.id),
      recommendedDestinations: destinations.slice(0, 3).map((item) => ({
        id: item.id,
        name: req.body.language === 'en' ? item.name : (item.name_id || item.name),
        city: item.city,
        province: item.province,
        island: item.island,
        category: req.body.language === 'en' ? item.category_en : item.category_id,
        description: req.body.language === 'en' ? item.short_description_en : item.short_description_id,
        imageUrl: item.image_url || null
      }))
    });
  }
}
