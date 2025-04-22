
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  Book,
  LayersIcon,
  Compass,
  Award
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Book, label: "Biblioteca", href: "/biblioteca" },
  { icon: LayersIcon, label: "Flashcards", href: "/flashcards" },
  { icon: Compass, label: "Explorar", href: "/explorar" },
  { icon: Award, label: "Ranking", href: "/ranking" },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-netflix-black border-t border-netflix-darkGray z-50">
      <div className="flex justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link 
              key={item.label} 
              to={item.href}
              className={`flex flex-col items-center justify-center px-1 py-1 rounded-md ${
                isActive 
                  ? "text-netflix-red" 
                  : "text-muted-foreground hover:text-netflix-offWhite"
              } transition-colors`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${isActive ? "text-netflix-red" : ""}`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
