
import React, { useState } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
}

interface ChecklistProps {
  items: ChecklistItem[];
}

export const Checklist: React.FC<ChecklistProps> = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4 my-6 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      {items.map((item) => (
        <div key={item.id} className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id={item.id}
              name={item.id}
              type="checkbox"
              checked={!!checkedItems[item.id]}
              onChange={() => handleCheckboxChange(item.id)}
              className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-600 bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div className="ml-3 text-base leading-6">
            <label
              htmlFor={item.id}
              className={`font-medium text-gray-900 dark:text-gray-100 cursor-pointer ${
                checkedItems[item.id] ? 'line-through text-gray-500 dark:text-gray-400' : ''
              }`}
            >
              {item.label}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};
