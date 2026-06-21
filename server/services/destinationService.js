import { supabase } from '../db/supabase.js';

function withStats(destination, reviews = [], savedIds = new Set()) {
  const localReviews = reviews.filter((review) => review.destination_id === destination.id);
  const localTotal = localReviews.reduce((sum, review) => sum + Number(review.rating), 0);
  const seedTotal = Number(destination.seed_rating || 0) * Number(destination.seed_review_count || 0);
  const count = Number(destination.seed_review_count || 0) + localReviews.length;
  return {
    ...destination,
    rating: count ? Number(((seedTotal + localTotal) / count).toFixed(1)) : 0,
    review_count: count,
    is_saved: savedIds.has(destination.id) ? 1 : 0
  };
}

async function loadDecorators() {
  const [{ data: reviews, error: reviewError }, { data: saved, error: savedError }] = await Promise.all([
    supabase.from('reviews').select('destination_id,rating'),
    supabase.from('saved_places').select('destination_id')
  ]);
  if (reviewError) throw reviewError;
  if (savedError) throw savedError;
  return {
    reviews: reviews || [],
    savedIds: new Set((saved || []).map((item) => item.destination_id))
  };
}

export async function listDestinations({ search = '', island = '', category = '', sort = 'name_asc' }) {
  let query = supabase.from('destinations').select('*');
  if (search) {
    query = query.or(`name.ilike.%${search}%,name_id.ilike.%${search}%`);
  }
  if (island) {
    query = query.eq('island', island);
  }
  if (category) {
    query = query.eq('category_key', category);
  }
  const { data, error } = await query.order('name');
  if (error) throw error;
  const { reviews, savedIds } = await loadDecorators();
  const rows = (data || []).map((destination) => withStats(destination, reviews, savedIds));
  if (sort === 'rating_desc') return rows.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
  if (sort === 'review_count_desc') return rows.sort((a, b) => b.review_count - a.review_count || a.name.localeCompare(b.name));
  return rows;
}

export async function getDestinationById(id) {
  const { data, error } = await supabase.from('destinations').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { reviews, savedIds } = await loadDecorators();
  return withStats(data, reviews, savedIds);
}

export async function getCategories() {
  const { data, error } = await supabase.from('destinations').select('category_key,category_id,category_en').order('category_key');
  if (error) throw error;
  const map = new Map();
  for (const item of data || []) map.set(item.category_key, item);
  return [...map.values()];
}

export async function getDestinationContext(message) {
  const words = String(message || '').toLowerCase().split(/\W+/).filter((word) => word.length > 3).slice(0, 8);
  const rows = await listDestinations({});
  return rows.filter((destination) => {
    const haystack = `${destination.name} ${destination.name_id || ''} ${destination.island} ${destination.province} ${destination.city} ${destination.category_key} ${destination.description_id} ${destination.description_en}`.toLowerCase();
    return words.length === 0 || words.some((word) => haystack.includes(word));
  }).slice(0, 8);
}
