"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useLocale } from "@/lib/LocaleContext";

interface EventData {
  name: string;
  description: string | null;
  participant_limit: number | null;
  start_datetime: string | null;
}

export default function FlyerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { locale, t } = useLocale();
  const tf = t.event.flyer;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch(`/api/events/${slug}`)
      .then(async (res) => {
        const data = await res.json() as EventData & { error?: string };
        if (!res.ok) setLoadError(data.error ?? "Failed to load event");
        else setEvent(data);
      })
      .catch(() => setLoadError("Network error. Please try again."));
  }, [slug]);

  const rsvpUrl = `${origin}/e/${slug}`;
  const qrUrl = `/e/${slug}/qr`;

  const formattedDate = event?.start_datetime
    ? new Date(event.start_datetime).toLocaleString(
        locale === "ja" ? "ja-JP" : "en-US",
        { dateStyle: "long", timeStyle: "short" }
      )
    : null;

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-red-600 mb-4">{loadError}</p>
        <Link href={`/e/${slug}`} className="text-blue-600 hover:underline">
          {tf.backToEvent}
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{tf.loading}</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Screen-only toolbar ──────────────────────────────────────────── */}
      <div className="print:hidden flex items-center justify-between w-full max-w-[640px] mb-6 px-4">
        <Link href={`/e/${slug}`} className="text-sm text-blue-600 hover:underline">
          {tf.backToEvent}
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer border-0"
        >
          🖨 {tf.printButton}
        </button>
      </div>

      {/* ── Flyer card ───────────────────────────────────────────────────── */}
      {/* Screen: centered card with shadow | Print: fills page, no shadow  */}
      <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-lg print:shadow-none print:rounded-none print:max-w-none print:w-full border border-gray-200 print:border-0 p-10 print:p-12 flex flex-col items-center gap-6 print:gap-8">

        {/* Event name */}
        <h1 className="text-4xl print:text-5xl font-bold text-center leading-tight text-gray-900">
          {event.name}
        </h1>

        {/* Date / time */}
        {formattedDate && (
          <p className="text-xl print:text-2xl text-gray-600 font-medium text-center">
            🗓️ {formattedDate}
          </p>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-base print:text-lg text-gray-600 text-center max-w-md">
            {event.description}
          </p>
        )}

        {/* Divider */}
        <div className="w-16 border-t-2 border-gray-200" />

        {/* QR code */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt="Event QR code"
          width={240}
          height={240}
          className="w-[200px] print:w-[260px] h-auto border border-gray-200 rounded-xl p-2"
        />

        {/* CTA */}
        <p className="text-lg print:text-xl font-semibold text-gray-700 text-center">
          {tf.scanToRsvp}
        </p>
      </div>
    </>
  );
}
