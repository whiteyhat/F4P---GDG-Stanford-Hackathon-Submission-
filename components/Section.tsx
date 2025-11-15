
import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <section id={id} className="py-8 border-t border-gray-200 dark:border-gray-800 first:border-t-0 first:pt-0">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">{title}</h2>
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
};
