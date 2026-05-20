"use client";

import * as React from "react";

type FontSizeMode = "sm" | "md" | "lg" | "xl";

type FontSizeOption = {
  value: FontSizeMode;
  label: string;
  description: string;
};

const STORAGE_KEY = "nexora-font-size";

const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { value: "sm", label: "Compacta", description: "15px" },
  { value: "md", label: "Padrão", description: "16px" },
  { value: "lg", label: "Confortável", description: "17px" },
  { value: "xl", label: "Ampliada", description: "18px" },
];

const FONT_SIZE_VALUE: Record<FontSizeMode, string> = {
  sm: "15px",
  md: "16px",
  lg: "17px",
  xl: "18px",
};

function isFontSizeMode(value: string | null): value is FontSizeMode {
  return value === "sm" || value === "md" || value === "lg" || value === "xl";
}

function applyFontSize(value: FontSizeMode) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.style.fontSize = FONT_SIZE_VALUE[value];
  document.documentElement.dataset.fontSize = value;
}

function useChangeFont() {
  const [fontSize, setFontSizeState] = React.useState<FontSizeMode>("md");

  React.useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const initialValue = isFontSizeMode(storedValue) ? storedValue : "md";

    setFontSizeState(initialValue);
    applyFontSize(initialValue);
  }, []);

  const setFontSize = React.useCallback((nextFontSize: FontSizeMode) => {
    setFontSizeState(nextFontSize);
    window.localStorage.setItem(STORAGE_KEY, nextFontSize);
    applyFontSize(nextFontSize);
  }, []);

  return {
    fontSize,
    options: FONT_SIZE_OPTIONS,
    setFontSize,
  };
}

export type { FontSizeMode, FontSizeOption };
export { useChangeFont };
