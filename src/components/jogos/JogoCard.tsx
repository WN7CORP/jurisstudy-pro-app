
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JogoJuridico } from "@/types/jogos";
import { Brain, Trophy, Timer } from "lucide-react";

interface JogoCardProps {
  jogo: JogoJuridico;
  onJogar: (jogo: JogoJuridico) => void;
}

export const JogoCard: React.FC<JogoCardProps> = ({ jogo, onJogar }) => {
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'facil':
        return 'bg-green-500';
      case 'medio':
        return 'bg-yellow-500';
      case 'dificil':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTipoJogoLabel = (tipo: string) => {
    switch (tipo) {
      case 'forca':
        return 'Jogo da Forca';
      case 'caca_palavras':
        return 'Caça-Palavras';
      case 'memoria':
        return 'Jogo da Memória';
      default:
        return tipo;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{jogo.nome}</CardTitle>
          <Badge className={`${getNivelColor(jogo.nivel_dificuldade)}`}>
            {jogo.nivel_dificuldade}
          </Badge>
        </div>
        <CardDescription>{jogo.materia} - {jogo.tema}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span>Tipo: {getTipoJogoLabel(jogo.tipo)}</span>
          </div>
          <Button 
            className="w-full bg-netflix-red hover:bg-netflix-red/90"
            onClick={() => onJogar(jogo)}
          >
            Jogar Agora
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
