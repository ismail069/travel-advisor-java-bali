import { supabase } from '../db/supabase.js';
import { getDestinationById } from './destinationService.js';

export async function listSaved() {
  const { data, error } = await supabase
    .from('saved_places')
    .select('destination_id,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const rows = await Promise.all((data || []).map((item) => getDestinationById(item.destination_id)));
  return rows.filter(Boolean);
}

export async function saveDestination(destinationId) {
  const { error } = await supabase.from('saved_places').upsert({ destination_id: destinationId }, { onConflict: 'destination_id' });
  if (error) throw error;
}

export async function removeSaved(destinationId) {
  const { error } = await supabase.from('saved_places').delete().eq('destination_id', destinationId);
  if (error) throw error;
}
