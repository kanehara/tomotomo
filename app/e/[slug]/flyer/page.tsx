"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
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

  // Client-side background image — lives only in this browser tab, never uploaded
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then(async (res) => {
        const data = (await res.json()) as EventData & { error?: string };
        if (!res.ok) setLoadError(data.error ?? "Failed to load event");
        else setEvent(data);
      })
      .catch(() => setLoadError("Network error. Please try again."));
  }, [slug]);

  // Revoke the blob URL when the component unmounts to free memory
  useEffect(() => {
    return () => {
      if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
    };
  }, [backgroundUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke any previous blob URL before creating a new one
    if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
    setBackgroundUrl(URL.createObjectURL(file));

    // Reset input so the same file can be re-selected later
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveBackground() {
    if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
    setBackgroundUrl(null);
  }

  const qrUrl = `/e/${slug}/qr`;
  const hasBg = Boolean(backgroundUrl);

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
      <div className="print:hidden flex items-center justify-between w-full max-w-[640px] mb-6 px-4 gap-3 flex-wrap">
        <Link
          href={`/e/${slug}`}
          className="text-sm text-blue-600 hover:underline"
        >
          {tf.backToEvent}
        </Link>

        <div className="flex items-center gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />

          {hasBg && (
            <button
              onClick={handleRemoveBackground}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors cursor-pointer border-0 bg-transparent"
            >
              {tf.removeBackground}
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            🖼 {hasBg ? tf.changeBackground : tf.uploadBackground}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer border-0"
          >
            🖨 {tf.printButton}
          </button>
        </div>
      </div>

      {/* ── Flyer card ───────────────────────────────────────────────────── */}
      {/* Screen: centered card with shadow | Print: fills page, no shadow  */}
      <div
        className={`relative w-full max-w-[640px] rounded-2xl shadow-lg print:shadow-none print:rounded-none print:max-w-none print:w-full border print:border-0 overflow-hidden ${
          hasBg ? "border-gray-800 bg-gray-900" : "bg-white border-gray-200"
        }`}
      >
        {/* Background image — <img> (not CSS background-image) for print compatibility */}
        {backgroundUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/55" />
          </>
        )}

        {/* Content — z-10 to sit above background overlay */}
        <div className="relative z-10 p-10 print:p-12 flex flex-col items-center gap-6 print:gap-8">
          {/* Event name */}
          <h1
            className={`text-4xl print:text-5xl font-bold text-center leading-tight ${
              hasBg ? "text-white" : "text-gray-900"
            }`}
          >
            {event.name}
          </h1>

          {/* Date / time */}
          {formattedDate && (
            <p
              className={`text-xl print:text-2xl font-medium text-center ${
                hasBg ? "text-white/90" : "text-gray-600"
              }`}
            >
              🗓️ {formattedDate}
            </p>
          )}

          {/* Description */}
          {event.description && (
            <p
              className={`text-base print:text-lg text-center max-w-md ${
                hasBg ? "text-white/80" : "text-gray-600"
              }`}
            >
              {event.description}
            </p>
          )}

          {/* Divider */}
          <div
            className={`w-16 border-t-2 ${
              hasBg ? "border-white/40" : "border-gray-200"
            }`}
          />

          {/* QR code — white background so it's scannable against any backdrop */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="Event QR code"
            width={240}
            height={240}
            className="w-[200px] print:w-[260px] h-auto rounded-xl p-2 bg-white border border-white/20"
          />

          {/* CTA */}
          <p
            className={`text-lg print:text-xl font-semibold text-center ${
              hasBg ? "text-white" : "text-gray-700"
            }`}
          >
            {tf.scanToRsvp}
          </p>
        </div>
      </div>
    </>
  );
}
