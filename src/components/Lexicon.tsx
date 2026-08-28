"use client";

import { useEffect, useState } from "react";

type Language = "en" | "es" | "fr" | "it";
export type LexiconTerm = "home" | "convergence" | "matter" | "visions" | "genesis";

const dictionary: Record<Language, Record<LexiconTerm, string>> = {
  en: { home: "Threshold", convergence: "Atelier", matter: "Cultivated Matter", visions: "Studies in Light", genesis: "Provenance" },
  es: { home: "Umbral", convergence: "Atelier", matter: "Cultivated Matter", visions: "Studies in Light", genesis: "Provenance" },
  fr: { home: "Seuil", convergence: "Atelier", matter: "Cultivated Matter", visions: "Studies in Light", genesis: "Provenance" },
  it: { home: "Soglia", convergence: "Atelier", matter: "Cultivated Matter", visions: "Studies in Light", genesis: "Provenance" },
};

const languages: Language[] = ["en", "es", "fr", "it"];

function chooseLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = sessionStorage.getItem("br-language") as Language | null;
  if (stored && languages.includes(stored)) return stored;
  const picked = languages[Math.floor(Math.random() * languages.length)];
  sessionStorage.setItem("br-language", picked);
  return picked;
}

export function usePortfolioLanguage() {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => setLanguage(chooseLanguage()), []);
  return language;
}

export default function Lexicon({ term }: { term: LexiconTerm }) {
  const language = usePortfolioLanguage();
  return <>{dictionary[language][term]}</>;
}

export function LanguageCode() {
  const language = usePortfolioLanguage();
  return <>{language.toUpperCase()}</>;
}
