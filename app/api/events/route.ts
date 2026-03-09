import { NextRequest, NextResponse } from "next/server";
import {
  generateId,
  generateSlug,
  getEventBySlug,
  insertEvent,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, description, participant_limit, line_group_url } = body as {
    name?: unknown;
    description?: unknown;
    participant_limit?: unknown;
    line_group_url?: unknown;
  };

  // Validate name
  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );
  }

  // Validate participant_limit
  if (participant_limit !== null && participant_limit !== undefined) {
    if (
      typeof participant_limit !== "number" ||
      !Number.isInteger(participant_limit) ||
      participant_limit < 1
    ) {
      return NextResponse.json(
        { error: "participant_limit must be a positive integer" },
        { status: 400 }
      );
    }
  }

  // Validate line_group_url
  if (line_group_url !== null && line_group_url !== undefined) {
    if (typeof line_group_url !== "string") {
      return NextResponse.json(
        { error: "line_group_url must be a string" },
        { status: 400 }
      );
    }
    try {
      new URL(line_group_url);
    } catch {
      return NextResponse.json(
        { error: "line_group_url must be a valid URL" },
        { status: 400 }
      );
    }
  }

  // Generate unique slug (retry on collision)
  let slug: string;
  let attempts = 0;
  do {
    slug = generateSlug();
    const existing = await getEventBySlug(slug);
    if (!existing) break;
    attempts++;
  } while (attempts < 5);

  const id = generateId();

  try {
    await insertEvent({
      id,
      slug,
      name: name.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      participant_limit:
        typeof participant_limit === "number" ? participant_limit : null,
      line_group_url:
        typeof line_group_url === "string" && line_group_url.trim()
          ? line_group_url.trim()
          : null,
    });
  } catch (err) {
    console.error("Failed to insert event:", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      event_url: `/e/${slug}`,
      qr_url: `/e/${slug}/qr`,
    },
    { status: 201 }
  );
}
