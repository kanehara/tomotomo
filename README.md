# tomotomo

A minimal event RSVP web app built on Cloudflare infrastructure.

**User flow:**
1. Organiser creates an event → gets a shareable URL + QR code
2. Guests scan the QR code → see the event page
3. Guest enters their name to RSVP
4. After RSVP, the LINE group invite link is revealed

**Stack:**
- Runtime: [Cloudflare Workers](https://workers.cloudflare.com/) via [vinext](https://github.com/cloudflare/vinext)
- Database: [Cloudflare D1](https://developers.cloudflare.com/d1/)
- Framework: Next.js (App Router) compiled with Vite

---

## Project Structure

```
app/
  layout.tsx                  # Root layout + global CSS
  page.tsx                    # / — Landing page
  create/page.tsx             # /create — Create event form
  e/[slug]/page.tsx           # /e/{slug} — Event RSVP page
  e/[slug]/qr/route.ts        # GET /e/{slug}/qr — QR code PNG
  api/events/route.ts         # POST /api/events
  api/events/[slug]/route.ts  # GET /api/events/{slug}
  api/rsvp/route.ts           # POST /api/rsvp
lib/
  db.ts                       # D1 database helpers
migrations/
  0001_initial.sql            # Database schema
worker-configuration.d.ts     # Cloudflare binding types
wrangler.jsonc                # Cloudflare Workers config
```

---

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the D1 database

```bash
npm run db:create
```

Copy the `database_id` from the output and paste it into `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "tomotomo",
    "database_id": "<YOUR_D1_DATABASE_ID_HERE>"
  }]
}
```

### 3. Apply migrations

```bash
# Local development (uses a local SQLite file in .wrangler/)
npm run db:migrate:local
```

### 4. Regenerate TypeScript types (optional)

```bash
npm run types
```

This regenerates `worker-configuration.d.ts` with accurate types from your `wrangler.jsonc`.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 2. Add your account ID to `wrangler.jsonc`

```jsonc
{
  "account_id": "<your-cloudflare-account-id>"
}
```

### 3. Apply migrations to production D1

```bash
npm run db:migrate:remote
```

### 4. Deploy

```bash
npm run deploy
```

This runs `vinext deploy` which builds and deploys to Cloudflare Workers in one step.

---

## API Reference

### `POST /api/events`

Create a new event.

**Request:**
```json
{
  "name": "Team Dinner",
  "description": "Optional description",
  "participant_limit": 20,
  "line_group_url": "https://line.me/R/ti/g/..."
}
```

**Response:**
```json
{
  "event_url": "/e/abc123",
  "qr_url": "/e/abc123/qr"
}
```

---

### `GET /api/events/{slug}`

Get event details and current RSVP count.

**Response:**
```json
{
  "name": "Team Dinner",
  "description": "...",
  "participant_limit": 20,
  "current_rsvp_count": 5
}
```

---

### `POST /api/rsvp`

Submit an RSVP. Returns the LINE group URL only after a successful RSVP.

**Request:**
```json
{
  "event_slug": "abc123",
  "name": "Yohei"
}
```

**Response:**
```json
{
  "success": true,
  "line_group_url": "https://line.me/R/ti/g/..."
}
```

**Error responses:**
- `400` — Missing/invalid input
- `404` — Event not found
- `409` — Event is full

---

### `GET /e/{slug}/qr`

Returns a PNG QR code image for the event URL.
