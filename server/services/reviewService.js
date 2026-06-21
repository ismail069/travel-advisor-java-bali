import { supabase } from '../db/supabase.js';

export async function getReviews(destinationId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('destination_id', destinationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createReview(destinationId, { rating, review_text }) {
  const { error } = await supabase.from('reviews').insert({
    destination_id: destinationId,
    rating,
    review_text: review_text.trim()
  });
  if (error) throw error;
}
