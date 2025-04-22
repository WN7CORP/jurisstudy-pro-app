
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { FlashCard } from "@/types/flashcards";

interface FlashcardContentProps {
  currentCard: FlashCard;
  displayMode: 'combined' | 'flip';
  isFlipped: boolean;
  showExplanation: boolean;
  setShowExplanation: (show: boolean) => void;
  updateProgress: (correct: boolean) => void;
}

export const FlashcardContent: React.FC<FlashcardContentProps> = ({
  currentCard,
  displayMode,
  isFlipped,
  showExplanation,
  setShowExplanation,
  updateProgress,
}) => {
  if (displayMode === 'combined') {
    return (
      <div className="text-center w-full">
        <h3 className="text-xl font-medium mb-4">Pergunta</h3>
        <p className="text-lg mb-6">{currentCard.pergunta}</p>
        
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-xl font-medium mb-4">Resposta</h3>
          <p className="text-lg">{currentCard.resposta}</p>
        </div>
        
        <ExplanationSection 
          explanation={currentCard.explicacao}
          showExplanation={showExplanation}
          setShowExplanation={setShowExplanation}
        />
        
        <ProgressButtons updateProgress={updateProgress} />
      </div>
    );
  }

  return (
    <div className="text-center w-full" style={isFlipped ? { transform: 'rotateY(180deg)' } : undefined}>
      {!isFlipped ? (
        <div className="text-center w-full">
          <h3 className="text-xl font-medium mb-4">Pergunta</h3>
          <p className="text-lg">{currentCard.pergunta}</p>
          <div className="mt-8 text-sm text-muted-foreground">Clique para ver a resposta</div>
        </div>
      ) : (
        <div className="text-center w-full">
          <h3 className="text-xl font-medium mb-4">Resposta</h3>
          <p className="text-lg mb-4">{currentCard.resposta}</p>
          
          <ExplanationSection 
            explanation={currentCard.explicacao}
            showExplanation={showExplanation}
            setShowExplanation={setShowExplanation}
          />
          
          <ProgressButtons updateProgress={updateProgress} />
        </div>
      )}
    </div>
  );
};

interface ExplanationSectionProps {
  explanation: string | null;
  showExplanation: boolean;
  setShowExplanation: (show: boolean) => void;
}

const ExplanationSection: React.FC<ExplanationSectionProps> = ({
  explanation,
  showExplanation,
  setShowExplanation
}) => {
  if (!explanation) return null;

  return (
    <div className="mt-4">
      {showExplanation ? (
        <div className="bg-muted p-4 rounded-md mt-4 animate-fade-in">
          <h4 className="font-medium mb-2">Explicação:</h4>
          <p>{explanation}</p>
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
  );
};

interface ProgressButtonsProps {
  updateProgress: (correct: boolean) => void;
}

const ProgressButtons: React.FC<ProgressButtonsProps> = ({ updateProgress }) => (
  <div className="flex justify-center gap-4 mt-8">
    <Button 
      variant="outline" 
      className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
      onClick={(e) => {
        e.stopPropagation();
        updateProgress(false);
      }}
    >
      Errei
    </Button>
    <Button 
      variant="outline" 
      className="bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
      onClick={(e) => {
        e.stopPropagation();
        updateProgress(true);
      }}
    >
      Acertei
    </Button>
  </div>
);
