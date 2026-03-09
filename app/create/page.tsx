"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/LocaleContext";

interface CreateResult {
  event_url: string;
  qr_url: string;
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 transition-colors";
const labelCls = "block text-sm font-medium mb-1.5 text-gray-700";
const btnPrimary =
  "inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-0";
const navToggleCls =
  "border border-gray-300 rounded-md px-2.5 py-1 text-xs text-gray-700 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors";

export default function CreatePage() {
  const { t, toggleLocale } = useLocale();
  const tc = t.create;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [participantLimit, setParticipantLimit] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
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
        start_datetime: startDatetime || null,
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
        <nav className="flex items-center justify-between w-full max-w-[540px] mb-8">
          <Link href="/" className="text-xl font-bold text-gray-900">{t.nav.brand}</Link>
          <button className={navToggleCls} onClick={toggleLocale}>{t.langToggle}</button>
        </nav>

        <div className="w-full max-w-[540px]">
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            {/* Success header */}
            <div className="text-center py-4 mb-4">
              <div className="text-5xl mb-2">✅</div>
              <h1 className="text-2xl font-bold mb-1">{tc.success.title}</h1>
              <p className="text-gray-600">{tc.success.subtitle}</p>
            </div>

            {/* Event URL */}
            <div className="mb-4">
              <label className={labelCls}>{tc.success.eventUrlLabel}</label>
              <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm break-all mb-3">
                <span className="flex-1">{fullEventUrl}</span>
                <button
                  className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer border-0 shrink-0"
                  onClick={() => navigator.clipboard?.writeText(fullEventUrl)}
                >
                  {tc.success.copyButton}
                </button>
              </div>
              <a
                href={result.event_url}
                className="flex items-center justify-center px-5 py-2.5 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors mb-2"
              >
                {tc.success.openButton}
              </a>
              <a
                href={`${result.event_url}/flyer`}
                className="flex items-center justify-center px-5 py-2.5 rounded-lg text-base font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.event.flyer.link}
              </a>
            </div>

            {/* QR code */}
            <div className="text-center mt-4">
              <label className={labelCls + " mb-2"}>{tc.success.qrLabel}</label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.qr_url}
                alt="Event QR code"
                width={200}
                height={200}
                className="max-w-[200px] border border-gray-200 rounded-lg p-2 bg-white mx-auto"
              />
              <p className="text-xs text-gray-400 mt-2">{tc.success.qrHint}</p>
            </div>
          </div>

          <div className="text-center">
            <button
              className={btnPrimary}
              onClick={() => {
                setResult(null);
                setName("");
                setDescription("");
                setParticipantLimit("");
                setStartDatetime("");
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
      <nav className="flex items-center justify-between w-full max-w-[540px] mb-8">
        <Link href="/" className="text-xl font-bold text-gray-900">{t.nav.brand}</Link>
        <button className={navToggleCls} onClick={toggleLocale}>{t.langToggle}</button>
      </nav>

      <div className="w-full max-w-[540px]">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">{tc.title}</h1>

          {error && (
            <div className="p-3 px-4 rounded-lg mb-4 text-sm bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className={labelCls}>{tc.eventName} *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tc.namePlaceholder}
                required
                className={inputCls}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className={labelCls}>{tc.description}</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={tc.descriptionPlaceholder}
                className={inputCls + " resize-y min-h-[80px]"}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="start-datetime" className={labelCls}>
                {tc.startDatetime}{" "}
                <span className="text-xs text-gray-400">({tc.startDatetimeHint})</span>
              </label>
              <input
                id="start-datetime"
                type="datetime-local"
                value={startDatetime}
                onChange={(e) => setStartDatetime(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="limit" className={labelCls}>
                {tc.participantLimit}{" "}
                <span className="text-xs text-gray-400">({tc.participantLimitHint})</span>
              </label>
              <input
                id="limit"
                type="number"
                min="1"
                value={participantLimit}
                onChange={(e) => setParticipantLimit(e.target.value)}
                placeholder={tc.limitPlaceholder}
                className={inputCls}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="line" className={labelCls}>
                {tc.lineGroupUrl}{" "}
                <span className="text-xs text-gray-400">({tc.lineGroupUrlHint})</span>
              </label>
              <input
                id="line"
                type="url"
                value={lineGroupUrl}
                onChange={(e) => setLineGroupUrl(e.target.value)}
                placeholder={tc.linePlaceholder}
                className={inputCls}
              />
              <p className="text-xs mt-1.5 text-amber-700">{tc.lineGroupUrlDisclaimer}</p>
            </div>

            <button
              type="submit"
              className={btnPrimary + " w-full mt-2"}
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
