import { all, get } from '../db/db.js';

const ratingSelect = `
  d.*,
  ROUND(CASE
    WHEN COUNT(r.id) = 0 THEN d.seed_rating
    ELSE ((d.seed_rating * d.seed_review_count) + COALESCE(SUM(r.rating), 0)) / (d.seed_review_count + COUNT(r.id))
  END, 1) AS rating,
  (d.seed_review_count + COUNT(r.id)) AS review_count,
  CASE WHEN sp.id IS NULL THEN 0 ELSE 1 END AS is_saved
`;

export async function listDestinations({ search = '', island = '', category = '', sort = 'name_asc' }) {
  const filters = [];
  const params = [];
  if (search) {
    filters.push('LOWER(d.name) LIKE ?');
    params.push(`%${search.toLowerCase()}%`);
  }
  if (island) {
    filters.push('LOWER(d.island) = ?');
    params.push(island.toLowerCase());
  }
  if (category) {
    filters.push('d.category_key = ?');
    params.push(category);
  }
  const order = {
    rating_desc: 'rating DESC, d.name ASC',
    review_count_desc: 'review_count DESC, d.name ASC',
    name_asc: 'd.name ASC'
  }[sort] || 'd.name ASC';

  return all(
    `SELECT ${ratingSelect}
     FROM destinations d
     LEFT JOIN reviews r ON r.destination_id = d.id
     LEFT JOIN saved_places sp ON sp.destination_id = d.id
     ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
     GROUP BY d.id
     ORDER BY ${order}`,
    params
  );
}

export async function getDestinationById(id) {
  return get(
    `SELECT ${ratingSelect}
     FROM destinations d
     LEFT JOIN reviews r ON r.destination_id = d.id
     LEFT JOIN saved_places sp ON sp.destination_id = d.id
     WHERE d.id = ?
     GROUP BY d.id`,
    [id]
  );
}

export async function getCategories() {
  return all('SELECT DISTINCT category_key, category_id, category_en FROM destinations ORDER BY category_key');
}

export async function getDestinationContext(message) {
  const words = String(message || '').toLowerCase().split(/\W+/).filter((word) => word.length > 3).slice(0, 8);
  const rows = await listDestinations({});
  return rows.filter((destination) => {
    const haystack = `${destination.name} ${destination.island} ${destination.province} ${destination.city} ${destination.category_key} ${destination.description_id} ${destination.description_en}`.toLowerCase();
    return words.length === 0 || words.some((word) => haystack.includes(word));
  }).slice(0, 8);
}
