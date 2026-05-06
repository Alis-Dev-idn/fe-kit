import React from "react";
import { useLocation, Link } from "react-router-dom";

export const Header: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const kitName = pathParts.length > 0 
    ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) 
    : "";

  return (
    <header className="h-[56px] sticky top-0 bg-bg/80 backdrop-blur-md border-bottom border-border px-8 flex items-center justify-between z-10">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-text-3 hover:text-text transition-colors">Home</Link>
        {kitName && (
          <>
            <span className="text-text-3">/</span>
            <span className="text-text font-medium">{kitName} Kit</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <a 
          href="https://www.npmjs.com/package/@alisdev/fe-kit" 
          target="_blank" 
          rel="noreferrer"
          className="bg-[#CC3534]/10 text-[#CC3534] border border-[#CC3534]/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
        >
          NPM
        </a>
        <a 
          href="https://github.com/Alis-Dev-idn/fe-kit" 
          target="_blank" 
          rel="noreferrer"
          className="btn-ghost py-1 text-xs"
        >
          View on GitHub
        </a>
      </div>
    </header>
  );
};
