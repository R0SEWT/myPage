import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    if (dark === null) return;
    
    setIsTransitioning(true);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  }, [dark]);

  const toggleTheme = () => {
    setDark(!dark);
  };

  return (
    <button
      aria-label={`Cambiar a modo ${dark ? 'claro' : 'oscuro'}`}
      aria-pressed={dark ?? false}
      onClick={toggleTheme}
      className={`theme-toggle effect-button inline-flex items-center rounded-xl px-3 py-1.5 text-sm focus-ring ${isTransitioning ? 'transitioning' : ''}`}
      title={`Cambiar a modo ${dark ? 'claro' : 'oscuro'}`}
    >
      <div className="relative">
        {dark ? (
          // Sol - Modo claro
          <svg 
            className={`w-4 h-4 transition-all duration-300 ${dark ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          // Luna - Modo oscuro
          <svg 
            className={`w-4 h-4 transition-all duration-300 ${!dark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </div>
      <span className="sr-only">
        {dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      </span>
    </button>
  );
}
