import { env } from "cloudflare:workers";

export interface Event {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  participant_limit: number | null;
  line_group_url: string | null;
  start_datetime: string | null;
  created_at: string;
}

export interface Rsvp {
  id: string;
  event_id: string;
  name: string;
  created_at: string;
}

/** Generate a random base36 slug of 6–8 characters */
export function generateSlug(): string {
  const length = 6 + Math.floor(Math.random() * 3); // 6, 7, or 8
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => (b % 36).toString(36))
    .join("");
}

/** Generate a UUID v4 using the Web Crypto API */
export function generateId(): string {
  return crypto.randomUUID();
}

/** Fetch a single event by slug */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const result = await env.DB.prepare(
    "SELECT * FROM events WHERE slug = ?"
  )
    .bind(slug)
    .first<Event>();
  return result ?? null;
}

/** Count RSVPs for a given event */
export async function countRsvps(eventId: string): Promise<number> {
  const result = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM rsvps WHERE event_id = ?"
  )
    .bind(eventId)
    .first<{ count: number }>();
  return result?.count ?? 0;
}

/** Fetch all RSVPs for a given event, ordered by sign-up time */
export async function getRsvps(eventId: string): Promise<Pick<Rsvp, "name" | "created_at">[]> {
  const result = await env.DB.prepare(
    "SELECT name, created_at FROM rsvps WHERE event_id = ? ORDER BY created_at ASC"
  )
    .bind(eventId)
    .all<Pick<Rsvp, "name" | "created_at">>();
  return result.results ?? [];
}

/** Insert a new event */
export async function insertEvent(event: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  participant_limit: number | null;
  line_group_url: string | null;
  start_datetime: string | null;
}): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO events (id, slug, name, description, participant_limit, line_group_url, start_datetime)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      event.id,
      event.slug,
      event.name,
      event.description,
      event.participant_limit,
      event.line_group_url,
      event.start_datetime
    )
    .run();
}

/** Insert a new RSVP */
export async function insertRsvp(rsvp: {
  id: string;
  event_id: string;
  name: string;
}): Promise<void> {
  await env.DB.prepare(
    "INSERT INTO rsvps (id, event_id, name) VALUES (?, ?, ?)"
  )
    .bind(rsvp.id, rsvp.event_id, rsvp.name)
    .run();
}
