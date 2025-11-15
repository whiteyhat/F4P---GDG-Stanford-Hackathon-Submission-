
import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface Tab {
  name: string;
  language: string;
  content: string;
}

interface FileTabsProps {
  tabs: Tab[];
}

export const FileTabs: React.FC<FileTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="my-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              className={`${
                activeTab === index
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-2">
        {tabs.map((tab, index) => (
          <div key={tab.name} className={activeTab === index ? 'block' : 'hidden'}>
            <CodeBlock language={tab.language} code={tab.content} />
          </div>
        ))}
      </div>
    </div>
  );
};
