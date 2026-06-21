import { all, run } from '../db/db.js';

export function getReviews(destinationId) {
  return all('SELECT * FROM reviews WHERE destination_id = ? ORDER BY created_at DESC', [destinationId]);
}

export function createReview(destinationId, { rating, review_text }) {
  return run('INSERT INTO reviews (destination_id, rating, review_text) VALUES (?, ?, ?)', [
    destinationId,
    rating,
    review_text.trim()
  ]);
}
