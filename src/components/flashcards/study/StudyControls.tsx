
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StudyControlsProps {
  currentIndex: number;
  totalCards: number;
  displayMode: 'combined' | 'flip';
  onPrevious: () => void;
  onNext: () => void;
  toggleDisplayMode: () => void;
  children?: React.ReactNode;
}

export const StudyControls: React.FC<StudyControlsProps> = ({
  currentIndex,
  totalCards,
  displayMode,
  onPrevious,
  onNext,
  toggleDisplayMode,
  children,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="outline" onClick={onPrevious} disabled={currentIndex === 0}>
        <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
      </Button>
      <div className="flex gap-4 items-center">
        <span>{currentIndex + 1} de {totalCards}</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{displayMode === 'flip' ? 'Flip' : 'Pergunta e Resposta'}</span>
          <Switch
            checked={displayMode === 'combined'}
            onCheckedChange={toggleDisplayMode}
          />
        </div>
        {children}
      </div>
      <Button variant="outline" onClick={onNext}>
        {currentIndex < totalCards - 1 ? 'Próximo' : 'Finalizar'} <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
