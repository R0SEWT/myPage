import { useState, useEffect, useRef } from 'react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        className="md:hidden p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-700 transition-colors"
        onClick={toggleMenu}
        aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-haspopup="true"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 md:hidden shadow-lg"
          role="region"
          aria-label="Menú de navegación móvil"
        >
          <nav 
            id="mobile-navigation"
            className="flex flex-col p-4 gap-3" 
            role="navigation"
            aria-label="Navegación móvil"
          >
            <a 
              href="#projects" 
              className="hover:text-teal focus:text-teal transition-colors py-2 px-2 rounded focus:bg-slate-100 dark:focus:bg-slate-800 focus:outline-none"
              onClick={closeMenu}
            >
              Proyectos
            </a>
            <a 
              href="#experience" 
              className="hover:text-teal focus:text-teal transition-colors py-2 px-2 rounded focus:bg-slate-100 dark:focus:bg-slate-800 focus:outline-none"
              onClick={closeMenu}
            >
              Experiencia
            </a>
            <a 
              href="#publications" 
              className="hover:text-teal focus:text-teal transition-colors py-2 px-2 rounded focus:bg-slate-100 dark:focus:bg-slate-800 focus:outline-none"
              onClick={closeMenu}
            >
              Publicaciones
            </a>
            <a 
              href="#contact" 
              className="hover:text-teal focus:text-teal transition-colors py-2 px-2 rounded focus:bg-slate-100 dark:focus:bg-slate-800 focus:outline-none"
              onClick={closeMenu}
            >
              Contacto
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
