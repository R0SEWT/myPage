import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    typeof document !== 'undefined' &&
    (localStorage.getItem('theme') === 'dark' ||
     (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches))
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      aria-label="Alternar modo"
      aria-pressed={dark}
      onClick={() => setDark(!dark)}
      className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
    >🌓</button>
  );
}
