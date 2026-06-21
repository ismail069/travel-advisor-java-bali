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

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(value) {
  return normalizeText(value).split(/\s+/).filter((word) => word.length > 2);
}

function destinationText(destination) {
  return normalizeText([
    destination.name,
    destination.name_id,
    destination.island,
    destination.province,
    destination.city,
    destination.category_key,
    destination.category_id,
    destination.category_en,
    destination.short_description_id,
    destination.short_description_en,
    destination.description_id,
    destination.description_en,
    destination.activities_id,
    destination.activities_en
  ].filter(Boolean).join(' '));
}

function scoreDestination(destination, words, normalizedMessage) {
  const text = destinationText(destination);
  let score = 0;

  if (normalizedMessage.includes('jawa barat') && normalizeText(destination.province).includes('jawa barat')) score += 20;
  if (normalizedMessage.includes('west java') && normalizeText(destination.province).includes('jawa barat')) score += 20;
  if (normalizedMessage.includes('jawa tengah') && normalizeText(destination.province).includes('jawa tengah')) score += 20;
  if (normalizedMessage.includes('central java') && normalizeText(destination.province).includes('jawa tengah')) score += 20;
  if (normalizedMessage.includes('jawa timur') && normalizeText(destination.province).includes('jawa timur')) score += 20;
  if (normalizedMessage.includes('east java') && normalizeText(destination.province).includes('jawa timur')) score += 20;
  if (normalizedMessage.includes('bali') && normalizeText(destination.island).includes('bali')) score += 20;

  if (/(alam|nature|natural|outdoor|gunung|mountain|waterfall|air terjun|curug|danau|lake|pantai|beach|viewpoint|titik pandang)/.test(normalizedMessage)) {
    if (/(nature|mountain|waterfall|lake|beach|viewpoint|marine)/.test(normalizeText(destination.category_key))) score += 12;
    if (/(wisata alam|gunung|air terjun|danau|pantai|titik pandang)/.test(normalizeText(destination.category_id))) score += 12;
  }

  for (const word of words) {
    if (text.includes(word)) score += 2;
  }

  return score;
}

export async function getDestinationContext(message) {
  const normalizedMessage = normalizeText(message);
  const words = tokenize(message).filter((word) => !['yang', 'untuk', 'dengan', 'saya', 'ingin', 'rekomendasikan', 'recommend', 'destinasi', 'wisata', 'tourist', 'places'].includes(word)).slice(0, 12);
  const rows = await listDestinations({});
  const scoredRows = rows
    .map((destination) => ({ destination, score: scoreDestination(destination, words, normalizedMessage) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.destination.rating - a.destination.rating || a.destination.id - b.destination.id);

  return (scoredRows.length ? scoredRows.map((item) => item.destination) : rows).slice(0, 15);
}
