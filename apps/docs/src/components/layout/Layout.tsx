import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col">
        <Header />
        <main className="flex-1 px-8 py-10 max-w-[900px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
