import { askGemini } from '../services/geminiService.js';

export async function create(req, res) {
  try {
    res.json(await askGemini(req.body));
  } catch (_error) {
    res.status(503).json({
      reply: req.body.language === 'en'
        ? 'The AI service is temporarily unavailable. Please try again soon.'
        : 'Layanan AI sedang tidak tersedia. Silakan coba lagi nanti.',
      recommendedDestinationIds: []
    });
  }
}
