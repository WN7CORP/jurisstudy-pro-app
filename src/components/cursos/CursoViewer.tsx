
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCursoProgresso } from "@/hooks/use-curso-progresso";

interface CursoViewerProps {
  link: string;
  onBack: () => void;
  cursoId: number;
}

export const CursoViewer: React.FC<CursoViewerProps> = ({ link, onBack, cursoId }) => {
  const isMobile = useIsMobile();
  const { atualizarProgresso } = useCursoProgresso(cursoId);

  React.useEffect(() => {
    atualizarProgresso({ iniciado: true, progresso: 0 });
  }, []);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)]">
      {isMobile ? (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-4 left-4 z-10"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      )}
      <iframe
        src={link}
        className={`w-full h-full ${isMobile ? 'mt-12' : ''} min-h-[calc(100vh-4rem)]`}
        style={{ border: 'none' }}
        title="Conteúdo do Curso"
      />
    </div>
  );
};
