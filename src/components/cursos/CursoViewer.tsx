
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface CursoViewerProps {
  link: string;
  onBack: () => void;
}

export const CursoViewer: React.FC<CursoViewerProps> = ({ link, onBack }) => {
  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)]">
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-4 left-4 z-10"
        onClick={onBack}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>
      <iframe
        src={link}
        className="w-full h-full min-h-[calc(100vh-4rem)]"
        style={{ border: 'none' }}
        title="Conteúdo do Curso"
      />
    </div>
  );
};
