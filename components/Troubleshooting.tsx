
import React, { useState } from 'react';
import { troubleshootingItems } from '../constants';
import { ChevronDownIcon, ChevronUpIcon } from './icons/HeroIcons';

const AccordionItem: React.FC<{ issue: string; solution: string; isOpen: boolean; onClick: () => void }> = ({
  issue,
  solution,
  isOpen,
  onClick,
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <h3>
        <button
          type="button"
          className="flex w-full items-center justify-between py-5 text-left font-medium text-gray-800 dark:text-gray-200"
          onClick={onClick}
          aria-expanded={isOpen}
        >
          <span className="text-lg">{issue}</span>
          <span className="ml-6 flex-shrink-0">
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </button>
      </h3>
      {isOpen && (
        <div className="pb-5 pr-12">
          <p className="text-base text-gray-600 dark:text-gray-400">{solution}</p>
        </div>
      )}
    </div>
  );
};

export const Troubleshooting: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="my-6">
      {troubleshootingItems.map((item, index) => (
        <AccordionItem
          key={index}
          issue={item.issue}
          solution={item.solution}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};
