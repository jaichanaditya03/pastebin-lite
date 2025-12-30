# Pastebin Lite

A minimal pastebin application built with Next.js 14, TypeScript, and Upstash Redis.

## Live Demo

- **Deployed URL**: https://pastebin-lite-lemon-five.vercel.app/

## Features

- Create text pastes with optional expiry time and view limits
- Share pastes via unique URLs
- Automatic expiry by time or view count
- Serverless deployment on Vercel
- Serverless Redis persistence using Upstash

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Upstash Redis
- **Deployment**: Vercel

## Architecture Notes

This application uses Next.js API routes for backend logic and Upstash Redis as a serverless persistence layer, allowing both frontend and backend to be deployed together on Vercel without a separate server.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Upstash Redis database (create one at [upstash.com](https://upstash.com))

### Installation

1. Clone the repository:
```bash
git clone <this-repo-url>
cd pastebin-lite
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
UPSTASH_REDIS_REST_URL=your_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns `{ "ok": true }` and verifies Redis connectivity.

### Create Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "string (required)",
  "ttl_seconds": number (optional, >= 1),
  "max_views": number (optional, >= 1)
}
```
Returns `{ "id": "string", "url": "string" }`

### Fetch Paste
```
GET /api/pastes/:id
```
Returns paste data or 404 if unavailable. Counts as one view.

### View Paste
```
GET /p/:id
```
Renders HTML page with paste content.

## Environment Variables

- `UPSTASH_REDIS_REST_URL` - Your Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Your Upstash Redis REST token
- `TEST_MODE` - Set to "1" to enable deterministic testing mode

## Testing

The application supports deterministic testing via the `TEST_MODE` environment variable and `x-test-now-ms` header for time-based operations.
