"use client";

import { useEffect, useState } from "react";

type Language = "en" | "es" | "fr" | "it";
export type LexiconTerm = "home" | "convergence" | "matter" | "visions" | "genesis";

const dictionary: Record<Language, Record<LexiconTerm, string>> = {
  en: { home: "Threshold", convergence: "Convergence", matter: "Matter in Motion", visions: "Visions", genesis: "Genesis" },
  es: { home: "Umbral", convergence: "Convergencia", matter: "Materia en Movimiento", visions: "Visiones", genesis: "Génesis" },
  fr: { home: "Seuil", convergence: "Convergence", matter: "Matière en Mouvement", visions: "Visions", genesis: "Genèse" },
  it: { home: "Soglia", convergence: "Convergenza", matter: "Materia in Movimento", visions: "Visioni", genesis: "Genesi" },
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
