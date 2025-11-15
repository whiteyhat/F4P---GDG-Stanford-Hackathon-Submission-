
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './icons/HeroIcons';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden bg-code-bg shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-code-header">
        <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center text-xs text-gray-400 hover:text-white transition-colors focus:outline-none"
        >
          {isCopied ? (
            <>
              <CheckIcon />
              <span className="ml-1">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon />
              <span className="ml-1">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className={`language-${language} text-gray-100`}>{code.trim()}</code>
      </pre>
    </div>
  );
};
