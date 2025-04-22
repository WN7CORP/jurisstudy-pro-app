
import React, { useState } from "react";
import { Bell, Search, User, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="w-full px-4 py-3 bg-netflix-black flex items-center justify-between gap-4">
      {/* Logo em dispositivos móveis */}
      <div className="md:hidden">
        <h1 className="text-xl font-bold text-netflix-red">
          JurisStudy<span className="text-white">Pro</span>
        </h1>
      </div>
      
      {/* Barra de pesquisa */}
      <div className="hidden md:flex relative max-w-md w-full">
        <div className="relative w-full">
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
      
      {/* Ícones de ação e botão de planos - Desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/assinatura">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Crown className="h-4 w-4 mr-2" />
            Ver Planos
          </Button>
        </Link>
        <button className="text-foreground hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/profile">Meu Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/assinatura">Minha Assinatura</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Menu do perfil - Mobile */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/profile">Meu Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/assinatura">Ver Planos</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
