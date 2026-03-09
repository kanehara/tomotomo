import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug, countRsvps, insertRsvp, generateId } from "@/lib/db";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_slug, name } = body as {
    event_slug?: unknown;
    name?: unknown;
  };

  // Validate inputs
  if (!event_slug || typeof event_slug !== "string" || event_slug.trim() === "") {
    return NextResponse.json(
      { error: "event_slug is required" },
      { status: 400 }
    );
  }
  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );
  }

  // Look up event
  const event = await getEventBySlug(event_slug.trim());
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Check capacity
  if (event.participant_limit !== null) {
    const count = await countRsvps(event.id);
    if (count >= event.participant_limit) {
      return NextResponse.json(
        { error: "Event is full" },
        { status: 409 }
      );
    }
  }

  // Insert RSVP
  try {
    await insertRsvp({
      id: generateId(),
      event_id: event.id,
      name: name.trim(),
    });
  } catch (err) {
    console.error("Failed to insert RSVP:", err);
    return NextResponse.json(
      { error: "Failed to save RSVP" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    line_group_url: event.line_group_url,
  });
}
