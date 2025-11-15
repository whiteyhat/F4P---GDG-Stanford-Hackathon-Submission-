
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from './icons/HeroIcons';

interface Section {
  id: string;
  title: string;
}

interface LayoutProps {
  children: React.ReactNode;
  sections: Section[];
  theme: string;
  setTheme: (theme: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, sections, theme, setTheme }) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [sections]);
  
  const NavLinks = () => (
    <nav>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-0 h-screen py-8">
             <div className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Table of Contents</div>
            <NavLinks />
          </aside>

          <main className="flex-1 min-w-0 lg:pl-12 py-8 lg:py-12">
            {children}
          </main>
        </div>
      </div>
       {/* Mobile Header and Menu */}
      <header className="lg:hidden sticky top-0 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm z-20 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          <span className="font-bold text-lg">Deployment Guide</span>
          <div>
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <NavLinks />
          </div>
        )}
      </header>
    </div>
  );
};
