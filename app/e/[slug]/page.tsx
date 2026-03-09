"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useLocale } from "@/lib/LocaleContext";

interface EventData {
  name: string;
  description: string | null;
  participant_limit: number | null;
  current_rsvp_count: number;
}

interface RsvpResult {
  success: boolean;
  line_group_url: string | null;
}

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
      const refresh = await fetch(`/api/events/${slug}`);
      if (refresh.ok) setEvent(await refresh.json() as EventData);
    } catch {
      setSubmitError(te.errors.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!event && !loadError) {
    return (
      <>
        <nav className="nav">
          <Link href="/" className="nav-brand">{t.nav.brand}</Link>
          <button className="lang-toggle" onClick={toggleLocale}>{t.langToggle}</button>
        </nav>
        <div className="container">
          <div className="loading">{te.loading}</div>
        </div>
      </>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <>
        <nav className="nav">
          <Link href="/" className="nav-brand">{t.nav.brand}</Link>
          <button className="lang-toggle" onClick={toggleLocale}>{t.langToggle}</button>
        </nav>
        <div className="container">
          <div className="alert alert-error">{loadError}</div>
          <Link href="/">{te.backHome}</Link>
        </div>
      </>
    );
  }

  const isFull =
    event!.participant_limit !== null &&
    event!.current_rsvp_count >= event!.participant_limit;

  // ── RSVP success state ─────────────────────────────────────────────────────
  if (rsvpResult) {
    return (
      <>
        <nav className="nav">
          <Link href="/" className="nav-brand">{t.nav.brand}</Link>
          <button className="lang-toggle" onClick={toggleLocale}>{t.langToggle}</button>
        </nav>
        <div className="container">
          <div className="card">
            <div className="success-state">
              <div className="success-icon">🎉</div>
              <h1 style={{ marginBottom: "0.5rem" }}>{te.success.title}</h1>
              <p>
                {locale === "ja" ? (
                  <><strong>{event!.name}</strong>{te.success.successFor}</>
                ) : (
                  <>{te.success.successFor} <strong>{event!.name}</strong>.</>
                )}
              </p>

              {rsvpResult.line_group_url && (
                <a
                  href={rsvpResult.line_group_url}
                  className="btn-line"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {te.success.joinLine}
                </a>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Event page ─────────────────────────────────────────────────────────────
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-brand">{t.nav.brand}</Link>
        <button className="lang-toggle" onClick={toggleLocale}>{t.langToggle}</button>
      </nav>
      <div className="container">
        <div className="card">
          <h1 style={{ marginBottom: "0.5rem" }}>{event!.name}</h1>

          {event!.description && (
            <p style={{ marginBottom: "1rem" }}>{event!.description}</p>
          )}

          <div className={`capacity${isFull ? " full" : ""}`}>
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

          {isFull ? (
            <div className="alert alert-error">
              <strong>{te.eventFullAlert}</strong> {te.noMoreSpots}
            </div>
          ) : (
            <>
              <h2 style={{ marginBottom: "1rem" }}>{te.rsvpTitle}</h2>

              {submitError && (
                <div className="alert alert-error">{submitError}</div>
              )}

              <form onSubmit={handleRsvp}>
                <div className="form-group">
                  <label htmlFor="guest-name">{te.yourName} *</label>
                  <input
                    id="guest-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={te.namePlaceholder}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting || guestName.trim() === ""}
                >
                  {submitting ? te.submittingButton : te.submitButton}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
