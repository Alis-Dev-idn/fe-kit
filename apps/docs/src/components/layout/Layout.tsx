import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-bg overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-0" : "md:ml-[240px]"}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 md:px-8 py-10 max-w-[900px] mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
