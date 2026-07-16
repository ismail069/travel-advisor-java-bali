export function requireReview(req, _res, next) {
  const rating = Number(req.body.rating);
  const reviewText = String(req.body.review_text || '').trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || reviewText.length < 10 || reviewText.length > 1000) {
    const error = new Error('Rating must be 1-5 and review text must contain 10-1000 characters.');
    error.status = 400;
    return next(error);
  }
  req.body.rating = rating;
  req.body.review_text = reviewText;
  next();
}

export function requireSaved(req, _res, next) {
  const id = Number(req.body.destination_id);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('destination_id is required.');
    error.status = 400;
    return next(error);
  }
  req.body.destination_id = id;
  next();
}

export function requireChat(req, _res, next) {
  if (!req.body || typeof req.body.message !== 'string' || !req.body.message.trim() || req.body.message.trim().length > 1000) {
    const error = new Error('Message is required.');
    error.status = 400;
    return next(error);
  }
  req.body.message = req.body.message.trim();
  req.body.language = req.body.language === 'en' ? 'en' : 'id';
  req.body.history = Array.isArray(req.body.history)
    ? req.body.history.slice(-8).map((item) => ({
        role: item?.role === 'assistant' ? 'assistant' : 'user',
        content: String(item?.content || '').slice(0, 2000)
      }))
    : [];
  next();
}
