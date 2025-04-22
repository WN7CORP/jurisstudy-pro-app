
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Award, ChevronRight } from "lucide-react";

interface FlashcardSet {
  tema: string;
  area: string;
  cards: number;
  lastReviewed: string;
  progress: number;
}

interface FlashcardSetsListProps {
  sets: FlashcardSet[];
  onStudySet: (area: string, tema: string) => void;
  isLoading?: boolean;
}

export const FlashcardSetsList: React.FC<FlashcardSetsListProps> = ({
  sets,
  onStudySet,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p>Carregando...</p>
      </div>
    );
  }

  if (sets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-2">Nenhum conjunto de flashcards encontrado</p>
        <p className="text-sm">Tente outra busca ou categoria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sets.map((set, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{set.area} - {set.tema}</h3>
                <div className="text-sm text-muted-foreground">
                  {set.area} • {set.cards} cards
                </div>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStudySet(set.area, set.tema)}
                >
                  Estudar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
