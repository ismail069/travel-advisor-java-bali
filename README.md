# JawaBali Trip AI

Mobile-first travel recommendation app for tourist destinations in Java and Bali, Indonesia. It includes a bilingual destination dashboard, TripAssistant AI, traveler reviews, saved places, and light/dark mode.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, lucide-react
- Backend: Node.js, Express.js, Supabase PostgreSQL
- AI: Gemini API through the Express backend only
- Storage: Supabase PostgreSQL

## Features

- TripAssistant AI for Java and Bali travel recommendations
- Destination search, island/category filters, and sorting
- Destination detail modal with map embed, activities, travel notes, and reviews
- Rating and review form stored in Supabase PostgreSQL
- Saved places wishlist stored in Supabase PostgreSQL
- Indonesian and English UI, default Indonesian
- Light and dark theme with localStorage preference

## Folder Structure

```text
client/   React app, components, pages, i18n, API service
server/   Express routes, controllers, services, Supabase schema, seed data
```

## Environment Setup

Copy `.env.example` to `.env` in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

If `GEMINI_API_KEY` is missing, TripAssistant AI returns a graceful fallback and destination suggestions. Keep `SUPABASE_SERVICE_ROLE_KEY` only on the backend project; never add it to the Vite frontend.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the SQL in `server/db/schema.sql`.
4. Add these backend environment variables in Vercel:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash-lite
CLIENT_URL=https://client-travel-advisor-java-bali.vercel.app
```

When the backend starts and finds an empty `destinations` table, it seeds 20 famous Java and Bali destinations. The seed includes reputable source names and URLs such as UNESCO, Indonesia Travel, Jakarta Tourism, and UNESCO Global Geoparks.

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

## Database And Ratings Notes

The PostgreSQL tables are created by running `server/db/schema.sql` in Supabase. If `destinations` is empty, the backend seeds 20 Java and Bali destinations.

Seed ratings and seed review counts are generated sample data for the app. They are not claimed to come from Google, TripAdvisor, or any live review platform. Traveler-submitted reviews are stored in Supabase. Average rating is calculated from seed rating/count plus traveler reviews.

## Vercel Deployment

Frontend project:

```bash
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
VITE_API_URL=https://travel-advisor-java-bali.vercel.app/api
```

Backend project:

```bash
Root Directory: server
Build Command: npm install
Output: leave empty
```

Backend environment variables:

```bash
SUPABASE_URL=your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=your Supabase service role key
GEMINI_API_KEY=your Gemini key
GEMINI_MODEL=gemini-2.5-flash-lite
CLIENT_URL=https://client-travel-advisor-java-bali.vercel.app
```

## Troubleshooting

- If the frontend cannot reach the API, check `CLIENT_URL`, backend port, and browser console errors.
- If `/api/health` works but `/api/destinations` fails, check `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and whether `server/db/schema.sql` was run.
- If the chatbot does not answer with Gemini, confirm `GEMINI_API_KEY` and `GEMINI_MODEL` in `.env`.
- To reset seed data, clear the Supabase tables and restart the backend.
