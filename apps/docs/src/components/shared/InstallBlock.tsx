import React from "react";

interface InstallBlockProps {
  packageName: string;
}

export const InstallBlock: React.FC<InstallBlockProps> = ({ packageName }) => {
  const [copied, setCopied] = React.useState(false);
  const code = `pnpm add ${packageName}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 inline-flex items-center gap-4 bg-code-bg border border-border rounded-lg pl-4 pr-2 py-1.5 max-w-full">
      <code className="text-xs text-primary font-mono whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="text-text-3 mr-2">$</span>
        {code}
      </code>
      <button 
        onClick={copyToClipboard}
        className="p-1.5 hover:bg-surface-up rounded transition-colors text-text-3 hover:text-text shrink-0"
        title="Copy install command"
      >
        {copied ? (
          <svg className="w-3.5 h-3.5 text-success" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
        )}
      </button>
    </div>
  );
};
