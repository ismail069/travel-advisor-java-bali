import app, { ensureDatabase } from './app.js';
const port = process.env.PORT || 5000;

ensureDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`JawaBali Trip AI API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  });
