
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Tabela de Funções - PlaylistCard.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | PlaylistCard            | Componente que renderiza um card para uma playlist de vídeo-aulas   |
 * | (Componente)            | com imagem, título e descrição                                      |
 * -------------------------------------------------------------------------------------------------
 */

interface PlaylistCardProps {
  titulo: string;
  descricao?: string | null;
  thumbnail?: string | null;
  className?: string;
  onClick: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  titulo,
  descricao,
  thumbnail,
  className,
  onClick,
}) => {
  return (
    <Card 
      className={cn("hover:bg-secondary/50 cursor-pointer transition-colors", className)} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3 flex items-center justify-center">
          {thumbnail ? (
            <img src={thumbnail} alt={titulo} className="w-full h-full object-cover" />
          ) : (
            <Video className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-base font-semibold mb-2 line-clamp-2">{titulo}</h3>
        {descricao && (
          <p className="text-sm text-muted-foreground line-clamp-2">{descricao}</p>
        )}
      </CardContent>
    </Card>
  );
};
