import { all, run } from '../db/db.js';

export async function listSaved() {
  return all(`
    SELECT d.*, sp.created_at AS saved_at,
      ROUND(CASE
        WHEN COUNT(r.id) = 0 THEN d.seed_rating
        ELSE ((d.seed_rating * d.seed_review_count) + COALESCE(SUM(r.rating), 0)) / (d.seed_review_count + COUNT(r.id))
      END, 1) AS rating,
      (d.seed_review_count + COUNT(r.id)) AS review_count,
      1 AS is_saved
    FROM saved_places sp
    JOIN destinations d ON d.id = sp.destination_id
    LEFT JOIN reviews r ON r.destination_id = d.id
    GROUP BY d.id
    ORDER BY sp.created_at DESC
  `);
}

export function saveDestination(destinationId) {
  return run('INSERT OR IGNORE INTO saved_places (destination_id) VALUES (?)', [destinationId]);
}

export function removeSaved(destinationId) {
  return run('DELETE FROM saved_places WHERE destination_id = ?', [destinationId]);
}
