
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, ChevronRight, Clock, Award } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

// Dados de exemplo para demonstração
const flashcardSets = [
  {
    id: 1,
    title: "Direito Constitucional - Princípios Fundamentais",
    cards: 25,
    lastReviewed: "2 dias atrás",
    progress: 80,
    category: "Constitucional"
  },
  {
    id: 2,
    title: "Direito Civil - Contratos",
    cards: 32,
    lastReviewed: "5 dias atrás",
    progress: 65,
    category: "Civil"
  },
  {
    id: 3,
    title: "Direito Penal - Crimes contra a pessoa",
    cards: 28,
    lastReviewed: "1 semana atrás",
    progress: 40,
    category: "Penal"
  },
  {
    id: 4,
    title: "Direito Administrativo - Licitações",
    cards: 30,
    lastReviewed: "2 dias atrás",
    progress: 75,
    category: "Administrativo"
  },
  {
    id: 5,
    title: "Direito Tributário - Impostos",
    cards: 22,
    lastReviewed: "3 dias atrás",
    progress: 50,
    category: "Tributário"
  }
];

// Categorias de flashcards para o carrossel
const categories = [
  { id: 1, name: "Constitucional", count: 120 },
  { id: 2, name: "Civil", count: 85 },
  { id: 3, name: "Penal", count: 64 },
  { id: 4, name: "Administrativo", count: 78 },
  { id: 5, name: "Tributário", count: 52 },
  { id: 6, name: "Empresarial", count: 43 },
  { id: 7, name: "Trabalho", count: 70 },
  { id: 8, name: "Processo Civil", count: 95 },
  { id: 9, name: "Processo Penal", count: 58 }
];

const Flashcards: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
              <p className="text-muted-foreground">
                Revise seu conhecimento de forma interativa
              </p>
            </div>
            <Button className="bg-netflix-red hover:bg-netflix-red/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Conjunto
            </Button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Categorias</h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {categories.map((category) => (
                  <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <Card className="h-24 cursor-pointer hover:border-netflix-red transition-colors">
                      <CardContent className="flex flex-col justify-center items-center h-full p-4">
                        <h3 className="font-medium text-center">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.count} cards</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1" />
              <CarouselNext className="right-1" />
            </Carousel>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Buscar flashcards..." 
              className="pl-10"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Recentemente revisados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcardSets.slice(0, 3).map((set) => (
                <Card key={set.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium line-clamp-2 mb-2">{set.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{set.lastReviewed}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold">{set.cards}</div>
                    </div>
                    <div className="w-full bg-secondary/30 h-2 rounded-full">
                      <div 
                        className="bg-netflix-red h-2 rounded-full" 
                        style={{ width: `${set.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-netflix-red" />
                        <span className="text-xs">{set.progress}% dominado</span>
                      </div>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Todos os conjuntos</h2>
            <div className="space-y-4">
              {flashcardSets.map((set) => (
                <Card key={set.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{set.title}</h3>
                        <div className="text-sm text-muted-foreground">{set.category} • {set.cards} cards</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 hidden md:block">
                          <div className="text-xs text-muted-foreground mb-1">Progresso</div>
                          <div className="w-32 bg-secondary/30 h-2 rounded-full">
                            <div 
                              className="bg-netflix-red h-2 rounded-full" 
                              style={{ width: `${set.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Estudar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Flashcards; 
