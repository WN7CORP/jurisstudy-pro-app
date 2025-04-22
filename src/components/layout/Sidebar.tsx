
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  Book,
  BookOpen,
  FileText,
  Layers,
  HelpCircle,
  Award,
  Graduation,
  Map,
  Search,
  Video,
  Film,
  Gamepad,
  Newspaper,
  PenTool,
  FileText as FileIcon,
  Desktop,
  Bot
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  comingSoon?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Book, label: "Biblioteca", href: "/biblioteca" },
  { icon: BookOpen, label: "Vade-Mecum", href: "/vade-mecum" },
  { icon: FileText, label: "Resumos", href: "/resumos" },
  { icon: Layers, label: "Flashcards", href: "/flashcards" },
  { icon: HelpCircle, label: "Questões", href: "/questoes" },
  { icon: FileText, label: "Simulados", href: "/simulados" },
  { icon: Award, label: "Ranking de Estudos", href: "/ranking" },
  { icon: Graduation, label: "Cursos", href: "/cursos" },
  { icon: Map, label: "Mapas Mentais", href: "/mapas-mentais" },
  { icon: Search, label: "Dicionário Jurídico", href: "/dicionario" },
  { icon: Video, label: "Vídeo-aulas", href: "/video-aulas" },
  { icon: Film, label: "Jurisflix", href: "/jurisflix" },
  { icon: Gamepad, label: "Jogos Jurídicos", href: "/jogos" },
  { icon: Newspaper, label: "Notícias Jurídicas", href: "/noticias" },
  { icon: PenTool, label: "Bloger", href: "/bloger" },
  { icon: FileIcon, label: "Peticionário", href: "/peticionario" },
  { icon: Desktop, label: "Desktop", href: "/desktop", comingSoon: true },
  { icon: Bot, label: "Assistente", href: "/assistente" },
];

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const location = useLocation();
  
  return (
    <div className={`hidden md:flex flex-col w-64 bg-netflix-black border-r border-netflix-darkGray py-4 ${className}`}>
      {/* Logo */}
      <div className="px-6 py-4 flex items-center">
        <h1 className="text-2xl font-bold">
          <span className="text-netflix-red">Juris</span>
          <span className="text-white">Study</span>
          <span className="text-netflix-red">Pro</span>
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-netflix-darkGray">
        <ul className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.label}>
                <Link 
                  to={item.comingSoon ? "#" : item.href}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors group relative
                    ${isActive 
                      ? "bg-netflix-red text-white" 
                      : "text-foreground hover:bg-secondary hover:text-netflix-red"}`}
                  onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-netflix-red"}`} />
                  <span className="text-sm">{item.label}</span>
                  
                  {item.comingSoon && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-netflix-red text-xs px-1.5 py-0.5 rounded-md text-white font-medium">
                      Em breve
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="mt-auto px-6 py-4 border-t border-netflix-darkGray">
        <Link to="/profile" className="flex items-center space-x-3 hover:bg-secondary/20 p-2 rounded-md transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="text-sm font-medium">U</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Meu Perfil</p>
            <p className="text-xs text-muted-foreground">Ver perfil e configurações</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
