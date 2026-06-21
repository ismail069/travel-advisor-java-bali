export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'production' ? {} : { detail: error.detail })
  });
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
