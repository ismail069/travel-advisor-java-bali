import app from './app.js';
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`JawaBali Trip AI API running on http://localhost:${port}`);
});
