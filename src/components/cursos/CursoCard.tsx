
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useCursoProgresso } from "@/hooks/use-curso-progresso";

interface CursoCardProps {
  id: number;
  materia: string;
  sobre: string | null;
  capa: string | null;
  download: string | null;
  onClick: () => void;
}

export const CursoCard: React.FC<CursoCardProps> = ({
  id,
  materia,
  sobre,
  capa,
  download,
  onClick,
}) => {
  const { progresso } = useCursoProgresso(id);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {capa && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={capa} 
            alt={materia} 
            className="object-cover w-full h-full"
          />
          {progresso?.iniciado && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${(progresso.progresso || 0) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl line-clamp-2">{materia}</CardTitle>
        {sobre && <CardDescription className="line-clamp-3">{sobre}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between items-center p-4">
        <Button onClick={onClick} variant="default" className="w-full sm:w-auto">
          {progresso?.iniciado ? 'Continuar Curso' : 'Acessar Curso'}
        </Button>
        {download && (
          <Button 
            variant="outline" 
            onClick={() => window.open(download, '_blank')}
            className="w-full sm:w-auto"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Material
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
