
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FlashCard, UserProgress } from "@/types/flashcards";

interface FlashcardStudyViewProps {
  cards: FlashCard[];
  onComplete: () => void;
}

const FlashcardStudyView: React.FC<FlashcardStudyViewProps> = ({ cards, onComplete }) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [progress, setProgress] = useState<Record<number, number>>({});

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowExplanation(false);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowExplanation(false);
    }
  };

  const updateProgress = async (correct: boolean) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user?.id || !currentCard.id) return;
      
      const userId = sessionData.session.user.id;
      
      // Verificar progresso existente usando API genérica com casting explícito
      const { data: existingProgressData, error: fetchError } = await supabase
        .from('user_flashcard_progress' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('flashcard_id', currentCard.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Erro ao buscar progresso:", fetchError);
        throw fetchError;
      }
      
      if (existingProgressData) {
        // Cast para o tipo esperado
        const existingProgress = existingProgressData as unknown as UserProgress;
        
        // Atualizar progresso existente
        const { error } = await supabase
          .from('user_flashcard_progress' as any)
          .update({
            correct_count: correct ? existingProgress.correct_count + 1 : existingProgress.correct_count,
            incorrect_count: !correct ? existingProgress.incorrect_count + 1 : existingProgress.incorrect_count,
            confidence_level: correct 
              ? Math.min(5, existingProgress.confidence_level + 1)
              : Math.max(0, existingProgress.confidence_level - 1),
            last_reviewed: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
        
        if (error) throw error;
      } else {
        // Criar nova entrada de progresso
        const newProgress: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'> = {
          user_id: userId,
          flashcard_id: currentCard.id,
          correct_count: correct ? 1 : 0,
          incorrect_count: !correct ? 1 : 0,
          confidence_level: correct ? 1 : 0,
          last_reviewed: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('user_flashcard_progress' as any)
          .insert(newProgress as any);
        
        if (error) throw error;
      }
      
      // Atualizar estado local
      setProgress(prev => ({
        ...prev,
        [currentCard.id]: correct 
          ? Math.min(5, (prev[currentCard.id] || 0) + 1)
          : Math.max(0, (prev[currentCard.id] || 0) - 1)
      }));
      
      // Ir para o próximo cartão
      handleNext();
      
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu progresso.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        <span>{currentIndex + 1} de {cards.length}</span>
        <Button variant="outline" onClick={handleNext}>
          {currentIndex < cards.length - 1 ? 'Próximo' : 'Finalizar'} <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <Card 
        className="w-full min-h-[300px] cursor-pointer transition-all duration-500 relative"
        onClick={handleFlip}
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          {!isFlipped ? (
            <div className="text-center w-full">
              <h3 className="text-xl font-medium mb-4">Pergunta</h3>
              <p className="text-lg">{currentCard.pergunta}</p>
              <div className="mt-8 text-sm text-muted-foreground">Clique para ver a resposta</div>
            </div>
          ) : (
            <div className="text-center w-full" style={{ transform: 'rotateY(180deg)' }}>
              <h3 className="text-xl font-medium mb-4">Resposta</h3>
              <p className="text-lg mb-4">{currentCard.resposta}</p>
              
              {currentCard.explicacao && (
                <div className="mt-4">
                  {showExplanation ? (
                    <div className="bg-muted p-4 rounded-md mt-4">
                      <h4 className="font-medium mb-2">Explicação:</h4>
                      <p>{currentCard.explicacao}</p>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowExplanation(true);
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2" /> Ver explicação
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProgress(false);
                  }}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" /> Errei
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProgress(true);
                  }}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" /> Acertei
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-4">
        <div className="h-1 w-full bg-secondary/30 rounded-full">
          <div 
            className="h-1 bg-netflix-red rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStudyView;
