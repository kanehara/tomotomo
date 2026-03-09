"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useLocale } from "@/lib/LocaleContext";

interface Participant {
  name: string;
  created_at: string;
}

interface EventData {
  name: string;
  description: string | null;
  participant_limit: number | null;
  line_group_url: string | null;
  current_rsvp_count: number;
  participants: Participant[];
}

interface RsvpResult {
  success: boolean;
  line_group_url: string | null;
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 transition-colors";
const labelCls = "block text-sm font-medium mb-1.5 text-gray-700";
const navToggleCls =
  "border border-gray-300 rounded-md px-2.5 py-1 text-xs text-gray-700 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors";

export default function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { locale, t, toggleLocale } = useLocale();
  const te = t.event;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rsvpResult, setRsvpResult] = useState<RsvpResult | null>(null);

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then(async (res) => {
        const data = await res.json() as EventData & { error?: string };
        if (!res.ok) {
          setLoadError(data.error ?? te.errors.failedLoad);
        } else {
          setEvent(data);
        }
      })
      .catch(() => setLoadError(te.errors.networkError));
  }, [slug, te.errors.failedLoad, te.errors.networkError]);

  async function handleRsvp(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_slug: slug, name: guestName.trim() }),
      });

      const data = await res.json() as RsvpResult & { error?: string };

      if (!res.ok) {
        if (res.status === 409) {
          setSubmitError(te.errors.eventFull);
          const refresh = await fetch(`/api/events/${slug}`);
          if (refresh.ok) setEvent(await refresh.json() as EventData);
        } else {
          setSubmitError(data.error ?? te.errors.failedRsvp);
        }
        return;
      }

      setRsvpResult(data);
      // Refresh event data so the participant list includes the new guest
      const refresh = await fetch(`/api/events/${slug}`);
      if (refresh.ok) setEvent(await refresh.json() as EventData);
    } catch {
      setSubmitError(te.errors.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  const Nav = () => (
    <nav className="flex items-center justify-between w-full max-w-[540px] mb-8">
      <Link href="/" className="text-xl font-bold text-gray-900">{t.nav.brand}</Link>
      <button className={navToggleCls} onClick={toggleLocale}>{t.langToggle}</button>
    </nav>
  );

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!event && !loadError) {
    return (
      <>
        <Nav />
        <div className="w-full max-w-[540px]">
          <p className="text-center text-gray-500 py-8">{te.loading}</p>
        </div>
      </>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <>
        <Nav />
        <div className="w-full max-w-[540px]">
          <div className="p-3 px-4 rounded-lg mb-4 text-sm bg-red-50 border border-red-200 text-red-700">
            {loadError}
          </div>
          <Link href="/" className="text-blue-600 hover:underline">{te.backHome}</Link>
        </div>
      </>
    );
  }

  const isFull =
    event!.participant_limit !== null &&
    event!.current_rsvp_count >= event!.participant_limit;

  return (
    <>
      <Nav />
      <div className="w-full max-w-[540px]">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">

          {/* Event header */}
          <h1 className="text-2xl font-bold mb-1">{event!.name}</h1>

          {event!.description && (
            <p className="text-gray-600 mb-4">{event!.description}</p>
          )}

          {/* Capacity badge */}
          <div className={`inline-flex items-center gap-1.5 text-sm mb-4 ${isFull ? "text-red-600 font-semibold" : "text-gray-500"}`}>
            👥{" "}
            {event!.participant_limit !== null ? (
              <>
                {event!.current_rsvp_count} / {event!.participant_limit}{" "}
                {isFull ? te.eventFull : te.spotsFilled}
              </>
            ) : (
              <>{event!.current_rsvp_count} {te.attending}</>
            )}
          </div>

          {/* ── RSVP area: success | full | form ──────────────────────────── */}
          {rsvpResult ? (
            /* Success — stays on page, form replaced by confirmation + LINE link */
            <div className="pt-6 border-t border-gray-200">
              <p className="text-base text-green-700 font-medium">
                {locale === "ja" ? (
                  <><strong>{event!.name}</strong>{te.success.successFor}</>
                ) : (
                  <>{te.success.successFor} <strong>{event!.name}</strong>.</>
                )}
              </p>
            </div>
          ) : isFull ? (
            <div className="p-3 px-4 rounded-lg mb-2 text-sm bg-red-50 border border-red-200 text-red-700">
              <strong>{te.eventFullAlert}</strong> {te.noMoreSpots}
            </div>
          ) : (
            <div className="border-t border-gray-200 pt-4 mt-1">
              <h2 className="text-lg font-semibold mb-4">{te.rsvpTitle}</h2>

              {submitError && (
                <div className="p-3 px-4 rounded-lg mb-4 text-sm bg-red-50 border border-red-200 text-red-700">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleRsvp}>
                <div className="mb-3">
                  <label htmlFor="guest-name" className={labelCls}>{te.yourName} *</label>
                  <input
                    id="guest-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={te.namePlaceholder}
                    required
                    autoFocus
                    className={inputCls}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 rounded-lg text-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-0 mt-1"
                  disabled={submitting || guestName.trim() === ""}
                >
                  {submitting ? te.submittingButton : te.submitButton}
                </button>
              </form>
            </div>
          )}

          {/* ── Participants list ──────────────────────────────────────────── */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-3">{te.participants.title}</h2>
            {event!.participants.length === 0 ? (
              <p className="text-xs text-gray-400 mt-2">{te.participants.empty}</p>
            ) : (
              <ol className="space-y-0">
                {event!.participants.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0 text-sm text-gray-700"
                  >
                    <span className="text-xs text-gray-400 min-w-[1.25rem]">{i + 1}.</span>
                    <span>{p.name}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* ── LINE group link (always visible) ──────────────────────────── */}
          {event!.line_group_url && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={event!.line_group_url}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg text-lg font-semibold bg-[#06C755] text-white hover:bg-[#05a048] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {te.success.joinLine}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
