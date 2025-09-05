import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    if (dark === null) return;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => {
    setDark(!dark);
  };

  return (
    <button
      aria-label={`Cambiar a modo ${dark ? 'claro' : 'oscuro'}`}
      aria-pressed={dark ?? false}
      onClick={toggleTheme}
      className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      title={`Cambiar a modo ${dark ? 'claro' : 'oscuro'}`}
    >
      <span role="img" aria-hidden="true">
        {dark ? '�' : '🌙'}
      </span>
      <span className="sr-only">
        {dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      </span>
    </button>
  );
}
