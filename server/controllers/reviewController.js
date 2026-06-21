import { getDestinationById } from '../services/destinationService.js';
import { createReview, getReviews } from '../services/reviewService.js';

export async function index(req, res) {
  res.json({ reviews: await getReviews(Number(req.params.id)) });
}

export async function create(req, res) {
  const destinationId = Number(req.params.id);
  const destination = await getDestinationById(destinationId);
  if (!destination) return res.status(404).json({ message: 'Destination not found.' });
  await createReview(destinationId, req.body);
  res.status(201).json({
    message: 'Review created.',
    reviews: await getReviews(destinationId),
    destination: await getDestinationById(destinationId)
  });
}
