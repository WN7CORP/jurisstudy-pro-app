
import React from "react";
import { Link } from "react-router-dom";
import { 
  Home,
  Book,
  BookOpen,
  FileText,
  FlaskConical,
  Gavel,
  Bot 
} from "lucide-react";

interface MobileNavProps {
  className?: string;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Book, label: "Biblioteca", href: "/biblioteca" },
  { icon: BookOpen, label: "Vade-Mecum", href: "/vade-mecum" },
  { icon: FileText, label: "Resumos", href: "/resumos" },
  { icon: FlaskConical, label: "Flashcards", href: "/flashcards" },
  { icon: Gavel, label: "Jurisprudência", href: "/jurisprudencia" },
  { icon: Bot, label: "Assistente", href: "/assistente" },
];

const MobileNav: React.FC<MobileNavProps> = ({ className = "" }) => {
  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-netflix-black border-t border-netflix-darkGray z-50 ${className}`}>
      <div className="flex justify-around px-2 py-2">
        {navItems.slice(0, 5).map((item) => (
          <Link 
            key={item.label} 
            to={item.href}
            className="flex flex-col items-center justify-center px-1 py-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
