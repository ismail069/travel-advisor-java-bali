# JawaBali Trip AI

Mobile-first travel recommendation app for tourist destinations in Java and Bali, Indonesia. It includes a bilingual destination dashboard, AI chatbot, local reviews, saved places, and light/dark mode.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, lucide-react
- Backend: Node.js, Express.js, SQLite
- AI: Gemini API through the Express backend only
- Storage: local SQLite database in `server/data/jawabali.sqlite`

## Features

- AI chatbot for Java and Bali travel recommendations
- Destination search, island/category filters, and sorting
- Destination detail modal with map embed, activities, travel notes, and reviews
- Rating and review form stored in SQLite
- Saved places wishlist stored in SQLite
- Indonesian and English UI, default Indonesian
- Light and dark theme with localStorage preference

## Folder Structure

```text
client/   React app, components, pages, i18n, API service
server/   Express routes, controllers, services, SQLite db, seed data
```

## Environment Setup

Copy `.env.example` to `.env` in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=5000
CLIENT_URL=http://localhost:5173
```

If `GEMINI_API_KEY` is missing, the chatbot returns a graceful fallback and local destination suggestions.

## Install And Run

```bash
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

Run separately:

```bash
npm run dev:client
npm run dev:server
```

## API Endpoints

- `GET /api/health`
- `GET /api/destinations`
- `GET /api/destinations?search=&island=&category=&sort=`
- `GET /api/destinations/:id`
- `GET /api/destinations/:id/reviews`
- `POST /api/destinations/:id/reviews`

```json
{
  "rating": 5,
  "review_text": "Tempatnya sangat indah dan cocok untuk keluarga."
}
```

- `GET /api/saved`
- `POST /api/saved`

```json
{
  "destination_id": 1
}
```

- `DELETE /api/saved/:destinationId`
- `POST /api/chat`

```json
{
  "message": "Saya ingin liburan 3 hari di Bali dengan budget 2 juta",
  "language": "id",
  "history": [
    { "role": "user", "content": "Saya ingin wisata alam di Bali" },
    { "role": "assistant", "content": "Tentu, saya bisa bantu..." }
  ]
}
```

Response:

```json
{
  "reply": "AI response text",
  "recommendedDestinationIds": [1, 2, 3]
}
```

## SQLite And Ratings Notes

The database is created automatically when the backend starts. If `destinations` is empty, the app seeds 20 Java and Bali destinations.

Seed ratings and seed review counts are generated sample data for the local app. They are not scraped and are not claimed to come from Google, TripAdvisor, or any live internet source. User-submitted reviews are stored locally in SQLite. Average rating is calculated from seed rating/count plus local user reviews.

## Troubleshooting

- If the frontend cannot reach the API, check `CLIENT_URL`, backend port, and browser console errors.
- If SQLite install fails, make sure Node.js build tools are available for the `sqlite3` package on your machine.
- If the chatbot does not answer with Gemini, confirm `GEMINI_API_KEY` and `GEMINI_MODEL` in `.env`.
- To reset local data, stop the server and delete `server/data/jawabali.sqlite`.
