"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // On mount: read from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("ctz-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  // Sync data-theme attribute on the cotizador scope
  useEffect(() => {
    if (!mounted) return;
    const scope = document.querySelector(".cotizador-scope");
    if (scope) {
      scope.setAttribute("data-theme", theme);
    }
    localStorage.setItem("ctz-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Prevent FOUC: don't render children until theme is determined
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "light", toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
