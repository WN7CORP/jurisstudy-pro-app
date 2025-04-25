
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Star, Video } from "lucide-react";
import { JurisflixContent } from '@/types/supabase';

export interface JurisflixContentProps extends JurisflixContent {}

interface JurisflixCardProps {
  content: JurisflixContentProps;
  onSelect: (content: JurisflixContentProps) => void;
}

/**
 * Tabela de Funções - JurisflixCard.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | JurisflixCard           | Componente de card para conteúdo do Jurisflix                      |
 * | (Componente)            | exibe informações e interações para filmes/séries jurídicas         |
 * -------------------------------------------------------------------------------------------------
 */

export const JurisflixCard: React.FC<JurisflixCardProps> = ({ content, onSelect }) => {
  const renderIcon = () => {
    switch (content.tipo) {
      case 'filme':
        return <Film className="h-12 w-12 text-muted-foreground" />;
      case 'série':
      case 'documentário':
        return <Video className="h-12 w-12 text-muted-foreground" />;
      default:
        return <Film className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <Card 
      className="h-full overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(content)}
    >
      <div className="relative h-48">
        {content.poster_url ? (
          <img 
            src={content.poster_url} 
            alt={content.titulo} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/30">
            {renderIcon()}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="text-white font-bold truncate">{content.titulo}</h3>
          <div className="flex items-center justify-between text-white/80 text-xs">
            <span>{content.ano}</span>
            {content.rating && (
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                <span>{content.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="line-clamp-2 text-xs text-muted-foreground h-8">
          {content.sinopse}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {content.temas_juridicos?.slice(0, 2).map((tema, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tema}
            </Badge>
          ))}
          {(content.temas_juridicos?.length || 0) > 2 && (
            <Badge variant="outline" className="text-xs">
              +{(content.temas_juridicos?.length || 0) - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
