import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug, countRsvps, getRsvps } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const [current_rsvp_count, participants] = await Promise.all([
    countRsvps(event.id),
    getRsvps(event.id),
  ]);

  return NextResponse.json({
    name: event.name,
    description: event.description,
    participant_limit: event.participant_limit,
    current_rsvp_count,
    participants,
  });
}
