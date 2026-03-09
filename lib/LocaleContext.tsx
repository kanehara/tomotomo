"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Locale } from "./i18n";

type LocaleContextValue = {
  locale: Locale;
  t: (typeof translations)[Locale];
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  t: translations["en"],
  toggleLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    // 1. Respect an explicit saved preference
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "ja") {
      setLocale(saved);
      return;
    }
    // 2. Fall back to the browser's primary language
    const browserLang = navigator.language ?? "";
    if (browserLang.startsWith("ja")) setLocale("ja");
  }, []);

  function toggleLocale() {
    const next: Locale = locale === "en" ? "ja" : "en";
    setLocale(next);
    localStorage.setItem("locale", next);
  }

  return (
    <LocaleContext.Provider value={{ locale, t: translations[locale], toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
