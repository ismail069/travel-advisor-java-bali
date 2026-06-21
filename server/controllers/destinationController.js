import { getCategories, getDestinationById, listDestinations } from '../services/destinationService.js';

export async function index(req, res) {
  const destinations = await listDestinations(req.query);
  const categories = await getCategories();
  res.json({ destinations, categories });
}

export async function show(req, res) {
  const destination = await getDestinationById(Number(req.params.id));
  if (!destination) return res.status(404).json({ message: 'Destination not found.' });
  res.json({ destination });
}
