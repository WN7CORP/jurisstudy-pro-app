
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface CursoCardProps {
  materia: string;
  sobre: string | null;
  capa: string | null;
  download: string | null;
  onClick: () => void;
}

export const CursoCard: React.FC<CursoCardProps> = ({
  materia,
  sobre,
  capa,
  download,
  onClick,
}) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {capa && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={capa} 
            alt={materia} 
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{materia}</CardTitle>
        {sobre && <CardDescription>{sobre}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter className="flex justify-between items-center">
        <Button onClick={onClick} variant="default">
          Acessar Curso
        </Button>
        {download && (
          <Button variant="outline" onClick={() => window.open(download, '_blank')}>
            <FileDown className="w-4 h-4 mr-2" />
            Material
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
