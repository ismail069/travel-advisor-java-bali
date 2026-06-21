import { getDestinationById } from '../services/destinationService.js';
import { listSaved, removeSaved, saveDestination } from '../services/savedService.js';

export async function index(_req, res) {
  res.json({ destinations: await listSaved() });
}

export async function create(req, res) {
  const destination = await getDestinationById(req.body.destination_id);
  if (!destination) return res.status(404).json({ message: 'Destination not found.' });
  await saveDestination(req.body.destination_id);
  res.status(201).json({ message: 'Destination saved.', destinations: await listSaved() });
}

export async function destroy(req, res) {
  await removeSaved(Number(req.params.destinationId));
  res.json({ message: 'Destination removed.', destinations: await listSaved() });
}
