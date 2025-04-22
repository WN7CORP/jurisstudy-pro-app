
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

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Book, label: "Biblioteca", href: "/biblioteca" },
  { icon: BookOpen, label: "Vade-Mecum", href: "/vade-mecum" },
  { icon: FileText, label: "Resumos", href: "/resumos" },
  { icon: FileText, label: "Simulados", href: "/simulados" },
  { icon: FlaskConical, label: "Flashcards", href: "/flashcards" },
  { icon: Gavel, label: "Jurisprudência", href: "/jurisprudencia" },
  { icon: Bot, label: "Assistente", href: "/assistente" },
];

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  return (
    <div className={`hidden md:flex flex-col w-64 bg-netflix-black border-r border-netflix-darkGray py-4 ${className}`}>
      {/* Logo */}
      <div className="px-6 py-4 flex items-center">
        <h1 className="text-2xl font-bold text-netflix-red">
          JurisStudy<span className="text-white">Pro</span>
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 flex-grow">
        <ul className="space-y-2 px-3">
          {sidebarItems.map((item) => (
            <li key={item.label}>
              <Link 
                to={item.href}
                className="flex items-center px-4 py-2 text-foreground hover:bg-secondary rounded-md transition-colors group"
              >
                <item.icon className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="mt-auto px-6 py-4 border-t border-netflix-darkGray">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="text-sm font-medium">U</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Usuário</p>
            <p className="text-xs text-muted-foreground">Estudante</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
