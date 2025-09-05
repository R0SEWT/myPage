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

  return (
    <button
      aria-label="Alternar modo"
      aria-pressed={dark ?? false}
      onClick={() => setDark(!dark)}
      className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
    >🌓</button>
  );
}
