import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getEventBySlug } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Verify event exists
  const event = await getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Build the full URL for the event page
  const origin = new URL(request.url).origin;
  const eventUrl = `${origin}/e/${slug}`;

  // Generate QR code as PNG buffer, slice into a clean ArrayBuffer for Workers BodyInit compatibility
  const nodeBuffer = await QRCode.toBuffer(eventUrl, {
    type: "png",
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
  // .slice() returns a proper ArrayBuffer (not ArrayBufferLike) which satisfies Workers BodyInit
  const body = nodeBuffer.buffer.slice(
    nodeBuffer.byteOffset,
    nodeBuffer.byteOffset + nodeBuffer.byteLength
  ) as ArrayBuffer;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
