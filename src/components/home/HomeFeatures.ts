
import { Book, BookOpen, FileText, FlaskConical, Gavel, Video, Bot, BrainCircuit, LucideIcon } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const mainFeatures: Feature[] = [
  {
    id: "1",
    title: "Vídeo-aulas",
    description: "Aprenda com professores especialistas em cada área do Direito.",
    icon: Video,
    href: "/video-aulas"
  },
  {
    id: "2",
    title: "Biblioteca Jurídica",
    description: "Acesse livros, artigos e materiais exclusivos para o seu estudo.",
    icon: Book,
    href: "/biblioteca"
  },
  {
    id: "3",
    title: "Flashcards",
    description: "Memorize conceitos importantes de forma rápida e eficiente.",
    icon: FlaskConical,
    href: "/flashcards"
  },
  {
    id: "4",
    title: "Resumos",
    description: "Conteúdo essencial de cada disciplina com os principais pontos.",
    icon: FileText,
    href: "/resumos"
  }
];

export const practiceFeatures: Feature[] = [
  {
    id: "5",
    title: "Simulados",
    description: "Teste seus conhecimentos com questões de provas anteriores.",
    icon: BrainCircuit,
    href: "/simulados"
  },
  {
    id: "6",
    title: "Vade-Mecum",
    description: "Consulte a legislação atualizada e comentada por especialistas.",
    icon: BookOpen,
    href: "/vade-mecum"
  },
  {
    id: "7",
    title: "Jurisprudência",
    description: "Acesse decisões importantes dos principais tribunais.",
    icon: Gavel,
    href: "/jurisprudencia"
  },
  {
    id: "8",
    title: "Assistente",
    description: "Tire dúvidas e receba auxílio personalizado da nossa IA.",
    icon: Bot,
    href: "/assistente"
  }
];

export type { Feature };
