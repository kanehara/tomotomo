"use client";

import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";

export default function HomePage() {
  const { t, toggleLocale } = useLocale();

  return (
    <>
      <nav className="nav">
        <span className="nav-brand">tomotomo</span>
        <button className="lang-toggle" onClick={toggleLocale}>
          {t.langToggle}
        </button>
      </nav>
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <h1 style={{ marginBottom: "0.75rem" }}>tomotomo</h1>
          <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
            {t.home.tagline}
          </p>
          <Link
            href="/create"
            className="btn btn-primary"
            style={{ fontSize: "1.125rem", padding: "0.75rem 2rem" }}
          >
            {t.home.createButton}
          </Link>
        </div>

        <div className="card">
          <h2>{t.home.howItWorks}</h2>
          <ol style={{ paddingLeft: "1.25rem", color: "#444" }}>
            {t.home.steps.map((step, i) => (
              <li key={i} style={{ marginBottom: i < t.home.steps.length - 1 ? "0.5rem" : 0 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
