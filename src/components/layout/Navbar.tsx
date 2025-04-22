
import React, { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className={`w-full px-4 py-3 bg-netflix-black flex items-center justify-between ${className}`}>
      {/* Logo em dispositivos móveis */}
      <div className="md:hidden">
        <h1 className="text-xl font-bold text-netflix-red">
          JurisStudy<span className="text-white">Pro</span>
        </h1>
      </div>
      
      {/* Barra de pesquisa */}
      <div className="relative max-w-md w-full mx-auto px-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-8 h-9 bg-secondary/80 border-secondary focus-visible:ring-primary"
          />
        </div>
      </div>
      
      {/* Ícones de ação */}
      <div className="flex items-center space-x-4">
        <button className="text-foreground hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-foreground hover:text-primary transition-colors">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
