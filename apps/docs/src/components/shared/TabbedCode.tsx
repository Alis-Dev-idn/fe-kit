import React from "react";
import { CodeBlock } from "./CodeBlock";

interface Tab {
  label: string;
  code: string;
  language: string;
}

interface TabbedCodeProps {
  tabs: Tab[];
}

export const TabbedCode: React.FC<TabbedCodeProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="my-8">
      <div className="flex border-b border-border mb-[-1px]">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`
              px-6 py-3 text-sm font-medium transition-all duration-150 relative
              ${activeTab === idx ? "text-primary" : "text-text-3 hover:text-text-2"}
            `}
          >
            {tab.label}
            {activeTab === idx && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
            )}
          </button>
        ))}
      </div>
      <CodeBlock 
        code={tabs[activeTab].code} 
        language={tabs[activeTab].language} 
      />
    </div>
  );
};
