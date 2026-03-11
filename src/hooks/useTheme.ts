import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const LS_THEME_KEY = "pkb_theme";

function getInitialTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(LS_THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const mode = getInitialTheme();
    setTheme(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setTheme(mode);
    try {
      localStorage.setItem(LS_THEME_KEY, mode);
    } catch {}
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(theme === "dark" ? "light" : "dark");
  }, [setThemeMode, theme]);

  return { theme, setThemeMode, toggleTheme };
}

