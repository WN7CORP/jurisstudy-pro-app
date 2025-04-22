
import { 
  Book, BookOpen, FileText, FlaskConical, Gavel, Video, Bot, BrainCircuit, 
  LucideIcon, Map, TrendingUp, CheckCircle2, HelpCircle, FilePen, BookText,
  Newspaper, Gamepad, Languages
} from "lucide-react";

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  isFavorite?: boolean;
}

// 1. Estudo Rápido
export const quickStudyFeatures: Feature[] = [
  {
    id: "1",
    title: "Flashcards",
    description: "Revise em minutos",
    icon: FlaskConical,
    href: "/flashcards"
  },
  {
    id: "2",
    title: "Resumos",
    description: "Conteúdo direto ao ponto",
    icon: FileText,
    href: "/resumos"
  },
  {
    id: "3",
    title: "Mapas Mentais",
    description: "Visualize e conecte ideias",
    icon: Map,
    href: "/mapas-mentais"
  },
  {
    id: "4",
    title: "Biblioteca",
    description: "Doutrinas, manuais e eBooks",
    icon: Book,
    href: "/biblioteca"
  },
  {
    id: "5",
    title: "Vídeo-aulas",
    description: "Aulas objetivas por tema",
    icon: Video,
    href: "/video-aulas"
  }
];

// 2. Prática e Treinamento
export const practiceFeatures: Feature[] = [
  {
    id: "6",
    title: "Simulados",
    description: "Treine como na OAB",
    icon: BrainCircuit,
    href: "/simulados"
  },
  {
    id: "7",
    title: "Ranking de Estudos",
    description: "Acompanhe seu desempenho",
    icon: TrendingUp,
    href: "/ranking"
  },
  {
    id: "8",
    title: "Jurisflix",
    description: "Casos reais explicados",
    icon: Video,
    href: "/jurisflix"
  },
  {
    id: "9",
    title: "Questões",
    description: "Teste seus conhecimentos",
    icon: HelpCircle,
    href: "/questoes"
  }
];

// 3. Ferramentas Jurídicas
export const legalToolsFeatures: Feature[] = [
  {
    id: "10",
    title: "Vade-Mecum",
    description: "Leis organizadas e atualizadas",
    icon: BookOpen,
    href: "/vade-mecum"
  },
  {
    id: "11",
    title: "Peticionário",
    description: "Modelos prontos para prática",
    icon: FilePen,
    href: "/peticionario"
  },
  {
    id: "12",
    title: "Dicionário Jurídico",
    description: "Termos explicados com clareza",
    icon: BookText,
    href: "/dicionario"
  }
];

// 4. Extra e Inteligência
export const extraFeatures: Feature[] = [
  {
    id: "13",
    title: "Assistente Evelyn",
    description: "Tire dúvidas por voz ou texto",
    icon: Bot,
    href: "/assistente"
  },
  {
    id: "14",
    title: "Notícias Jurídicas",
    description: "Fique por dentro das novidades",
    icon: Newspaper,
    href: "/noticias"
  },
  {
    id: "15",
    title: "Bloger",
    description: "Conteúdo leve sobre Direito",
    icon: FileText,
    href: "/bloger"
  },
  {
    id: "16",
    title: "Jogos Jurídicos",
    description: "Aprenda de forma divertida",
    icon: Gamepad,
    href: "/jogos"
  }
];
