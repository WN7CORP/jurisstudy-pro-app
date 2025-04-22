
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Book, BookOpen, FileText, FlaskConical, Gavel, Video, Bot, BrainCircuit, Scale } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  href,
  color = "bg-netflix-darkGray"
}) => {
  return (
    <Card className={`${color} border-netflix-darkGray hover:shadow-md transition-shadow duration-300 h-full group`}>
      <CardHeader className="pb-2">
        <div className="w-10 h-10 rounded-full bg-netflix-red/10 flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-lg text-netflix-offWhite">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="px-0 text-netflix-red group-hover:text-netflix-red/80" asChild>
          <a href={href}>Acessar</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

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
      title: "Vídeo-aulas",
      description: "Aprenda com professores especialistas em cada área do Direito.",
      icon: <Video className="h-6 w-6 text-netflix-red" />,
      href: "/video-aulas"
    },
    {
      title: "Biblioteca Jurídica",
      description: "Acesse livros, artigos e materiais exclusivos para o seu estudo.",
      icon: <Book className="h-6 w-6 text-netflix-red" />,
      href: "/biblioteca"
    },
    {
      title: "Flashcards",
      description: "Memorize conceitos importantes de forma rápida e eficiente.",
      icon: <FlaskConical className="h-6 w-6 text-netflix-red" />,
      href: "/flashcards"
    },
    {
      title: "Resumos",
      description: "Conteúdo essencial de cada disciplina com os principais pontos.",
      icon: <FileText className="h-6 w-6 text-netflix-red" />,
      href: "/resumos"
    }
  ];

  const practiceFeatures = [
    {
      title: "Simulados",
      description: "Teste seus conhecimentos com questões de provas anteriores.",
      icon: <BrainCircuit className="h-6 w-6 text-netflix-red" />,
      href: "/simulados"
    },
    {
      title: "Vade-Mecum",
      description: "Consulte a legislação atualizada e comentada por especialistas.",
      icon: <BookOpen className="h-6 w-6 text-netflix-red" />,
      href: "/vade-mecum"
    },
    {
      title: "Jurisprudência",
      description: "Acesse decisões importantes dos principais tribunais.",
      icon: <Gavel className="h-6 w-6 text-netflix-red" />,
      href: "/jurisprudencia"
    },
    {
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
              <div className="grid md:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-4">
                {mainFeatures.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    href={feature.href}
                  />
                ))}
              </div>
            </div>
            
            {/* Section: Prática e Treinamento */}
            <div className="md:col-span-4 col-span-full">
              <h2 className="text-xl font-semibold text-netflix-offWhite mb-4">Prática e Treinamento</h2>
              <div className="grid md:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-4">
                {practiceFeatures.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    href={feature.href}
                  />
                ))}
              </div>
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
