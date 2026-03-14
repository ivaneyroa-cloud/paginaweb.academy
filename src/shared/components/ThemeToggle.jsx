"use client";

import { useTheme } from "@/shared/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="ctz-btn-ghost"
      style={{
        width: 36,
        height: 36,
        padding: 0,
        borderRadius: '50%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sun icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: theme === 'light'
            ? 'translate(-50%, -50%) rotate(0deg) scale(1)'
            : 'translate(-50%, -50%) rotate(90deg) scale(0)',
          opacity: theme === 'light' ? 1 : 0,
          transition: 'all 300ms ease-out',
        }}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Moon icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: theme === 'dark'
            ? 'translate(-50%, -50%) rotate(0deg) scale(1)'
            : 'translate(-50%, -50%) rotate(-90deg) scale(0)',
          opacity: theme === 'dark' ? 1 : 0,
          transition: 'all 300ms ease-out',
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
