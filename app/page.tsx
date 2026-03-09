"use client";

import Link from "next/link";
import { useLocale } from "@/lib/LocaleContext";

export default function HomePage() {
  const { t, toggleLocale } = useLocale();

  return (
    <>
      <nav className="flex items-center justify-between w-full max-w-[540px] mb-8">
        <span className="text-xl font-bold">tomotomo</span>
        <button
          className="border border-gray-300 rounded-md px-2.5 py-1 text-xs text-gray-700 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors"
          onClick={toggleLocale}
        >
          {t.langToggle}
        </button>
      </nav>

      <div className="w-full max-w-[540px]">
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 text-center">
          <h1 className="text-3xl font-bold mb-3">tomotomo</h1>
          <p className="text-lg text-gray-600 mb-8">{t.home.tagline}</p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.home.createButton}
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">{t.home.howItWorks}</h2>
          <ol className="list-decimal pl-5 text-gray-600 space-y-2">
            {t.home.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
