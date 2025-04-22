
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-netflix-black text-foreground flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0 px-4 py-4">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Layout;
