"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/LocaleContext";

interface CreateResult {
  event_url: string;
  qr_url: string;
}

export default function CreatePage() {
  const { t, toggleLocale } = useLocale();
  const tc = t.create;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [participantLimit, setParticipantLimit] = useState("");
  const [lineGroupUrl, setLineGroupUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim() || null,
        participant_limit: participantLimit ? parseInt(participantLimit, 10) : null,
        line_group_url: lineGroupUrl.trim() || null,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json() as { error?: string } & CreateResult;

      if (!res.ok) {
        setError(data.error ?? tc.networkError);
        return;
      }

      setResult(data);
    } catch {
      setError(tc.networkError);
    } finally {
      setLoading(false);
    }
  }

  const fullEventUrl =
    result
      ? `${typeof window !== "undefined" ? window.location.origin : ""}${result.event_url}`
      : "";

  if (result) {
    return (
      <>
        <nav className="nav">
          <Link href="/" className="nav-brand">{t.nav.brand}</Link>
          <button className="lang-toggle" onClick={toggleLocale}>
            {t.langToggle}
          </button>
        </nav>
        <div className="container">
          <div className="card">
            <div className="success-state">
              <div className="success-icon">✅</div>
              <h1 style={{ marginBottom: "0.5rem" }}>{tc.success.title}</h1>
              <p>{tc.success.subtitle}</p>
            </div>

            <div className="form-group">
              <label>{tc.success.eventUrlLabel}</label>
              <div className="event-url-box">
                <span style={{ flex: 1 }}>{fullEventUrl}</span>
                <button
                  className="btn btn-primary"
                  style={{ padding: "0.25rem 0.75rem", fontSize: "0.8125rem" }}
                  onClick={() => navigator.clipboard?.writeText(fullEventUrl)}
                >
                  {tc.success.copyButton}
                </button>
              </div>
              <a
                href={result.event_url}
                className="btn btn-primary"
                style={{ width: "100%", marginBottom: "0.5rem" }}
              >
                {tc.success.openButton}
              </a>
            </div>

            <div className="qr-section">
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                {tc.success.qrLabel}
              </label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.qr_url}
                alt="Event QR code"
                width={200}
                height={200}
              />
              <p className="hint" style={{ marginTop: "0.5rem" }}>
                {tc.success.qrHint}
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setResult(null);
                setName("");
                setDescription("");
                setParticipantLimit("");
                setLineGroupUrl("");
              }}
            >
              {tc.success.createAnother}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-brand">{t.nav.brand}</Link>
        <button className="lang-toggle" onClick={toggleLocale}>
          {t.langToggle}
        </button>
      </nav>
      <div className="container">
        <div className="card">
          <h1 style={{ marginBottom: "1.5rem" }}>{tc.title}</h1>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{tc.eventName} *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tc.namePlaceholder}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">{tc.description}</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={tc.descriptionPlaceholder}
              />
            </div>

            <div className="form-group">
              <label htmlFor="limit">
                {tc.participantLimit}{" "}
                <span className="hint">({tc.participantLimitHint})</span>
              </label>
              <input
                id="limit"
                type="number"
                min="1"
                value={participantLimit}
                onChange={(e) => setParticipantLimit(e.target.value)}
                placeholder={tc.limitPlaceholder}
              />
            </div>

            <div className="form-group">
              <label htmlFor="line">
                {tc.lineGroupUrl}{" "}
                <span className="hint">({tc.lineGroupUrlHint})</span>
              </label>
              <input
                id="line"
                type="url"
                value={lineGroupUrl}
                onChange={(e) => setLineGroupUrl(e.target.value)}
                placeholder={tc.linePlaceholder}
              />
              <p className="hint" style={{ marginTop: "0.375rem", color: "#b45309" }}>
                {tc.lineGroupUrlDisclaimer}
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
              disabled={loading}
            >
              {loading ? tc.submittingButton : tc.submitButton}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
