import React from "react";
import Layout from "@/components/layout/Layout";
import { Book, BookOpen, FileText, FlaskConical, Gavel, Video, Bot, BrainCircuit, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturesCarousel from "@/components/home/FeaturesCarousel";

const RecentActivity = () => {
  return (
    <div className="bg-secondary/40 rounded-lg p-4 mb-4">
      <h2 className="text-lg font-medium mb-3 flex items-center">
        <Scale className="mr-2 h-5 w-5 text-netflix-red" />
        Atividade Recente
      </h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm">Resumo: Direito Constitucional</span>
          </div>
          <span className="text-xs text-muted-foreground">hoje</span>
        </div>
        <div className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
          <div className="flex items-center">
            <BrainCircuit className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm">Simulado: OAB 2ª fase</span>
          </div>
          <span className="text-xs text-muted-foreground">ontem</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="text-xs mt-2 w-full text-muted-foreground hover:text-foreground">
        Ver tudo
      </Button>
    </div>
  );
};

const StudyProgress = () => {
  return (
    <div className="bg-secondary/40 rounded-lg p-4">
      <h2 className="text-lg font-medium mb-3 flex items-center">
        <BrainCircuit className="mr-2 h-5 w-5 text-netflix-red" />
        Progresso de Estudo
      </h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Direito Civil</span>
            <span>65%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-netflix-red w-[65%]"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Direito Penal</span>
            <span>40%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-netflix-red w-[40%]"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Direito Constitucional</span>
            <span>80%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-netflix-red w-[80%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const mainFeatures = [
    {
      id: "1",
      title: "Vídeo-aulas",
      description: "Aprenda com professores especialistas em cada área do Direito.",
      icon: <Video className="h-6 w-6 text-netflix-red" />,
      href: "/video-aulas"
    },
    {
      id: "2",
      title: "Biblioteca Jurídica",
      description: "Acesse livros, artigos e materiais exclusivos para o seu estudo.",
      icon: <Book className="h-6 w-6 text-netflix-red" />,
      href: "/biblioteca"
    },
    {
      id: "3",
      title: "Flashcards",
      description: "Memorize conceitos importantes de forma rápida e eficiente.",
      icon: <FlaskConical className="h-6 w-6 text-netflix-red" />,
      href: "/flashcards"
    },
    {
      id: "4",
      title: "Resumos",
      description: "Conteúdo essencial de cada disciplina com os principais pontos.",
      icon: <FileText className="h-6 w-6 text-netflix-red" />,
      href: "/resumos"
    }
  ];

  const practiceFeatures = [
    {
      id: "5",
      title: "Simulados",
      description: "Teste seus conhecimentos com questões de provas anteriores.",
      icon: <BrainCircuit className="h-6 w-6 text-netflix-red" />,
      href: "/simulados"
    },
    {
      id: "6",
      title: "Vade-Mecum",
      description: "Consulte a legislação atualizada e comentada por especialistas.",
      icon: <BookOpen className="h-6 w-6 text-netflix-red" />,
      href: "/vade-mecum"
    },
    {
      id: "7",
      title: "Jurisprudência",
      description: "Acesse decisões importantes dos principais tribunais.",
      icon: <Gavel className="h-6 w-6 text-netflix-red" />,
      href: "/jurisprudencia"
    },
    {
      id: "8",
      title: "Assistente",
      description: "Tire dúvidas e receba auxílio personalizado da nossa IA.",
      icon: <Bot className="h-6 w-6 text-netflix-red" />,
      href: "/assistente"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-netflix-offWhite">Dashboard</h1>
          <Button variant="outline" className="text-xs h-8">
            Personalizar
          </Button>
        </div>

        <div className="grid md:grid-cols-4 grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-4 col-span-full grid md:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Banner */}
            <div className="md:col-span-4 col-span-full bg-gradient-to-r from-netflix-black to-netflix-red/50 rounded-lg relative overflow-hidden h-48">
              <div className="absolute inset-0 bg-[url('/law-pattern.png')] opacity-10"></div>
              <div className="p-6 flex flex-col h-full justify-center relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo ao JurisStudy Pro</h2>
                <p className="text-netflix-offWhite max-w-lg mb-4">
                  O app jurídico que vai te levar da dúvida à aprovação. Domine a lei. Vença o edital.
                </p>
                <Button className="bg-netflix-red hover:bg-netflix-red/90 text-white w-fit">
                  Comece agora
                </Button>
              </div>
            </div>
            
            {/* Section: Estudo */}
            <div className="md:col-span-4 col-span-full">
              <h2 className="text-xl font-semibold text-netflix-offWhite mb-4">Estudo</h2>
              <FeaturesCarousel features={mainFeatures} />
            </div>
            
            {/* Section: Prática e Treinamento */}
            <div className="md:col-span-4 col-span-full">
              <h2 className="text-xl font-semibold text-netflix-offWhite mb-4">Prática e Treinamento</h2>
              <FeaturesCarousel features={practiceFeatures} />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="xl:col-span-1 col-span-full">
            <RecentActivity />
            <StudyProgress />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
