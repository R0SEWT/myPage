import { useState } from 'react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú de navegación"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 md:hidden">
          <nav className="flex flex-col p-4 gap-3">
            <a 
              href="#projects" 
              className="hover:text-teal transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Proyectos
            </a>
            <a 
              href="#experience" 
              className="hover:text-teal transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Experiencia
            </a>
            <a 
              href="#publications" 
              className="hover:text-teal transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Publicaciones
            </a>
            <a 
              href="#contact" 
              className="hover:text-teal transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
