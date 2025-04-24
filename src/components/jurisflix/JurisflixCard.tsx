
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Film, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Tabela de Funções - JurisflixCard.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | JurisflixCard           | Componente para exibir cards de conteúdo no estilo Netflix           |
 * | (Componente)            | com informações sobre filmes/séries jurídicas e modal de detalhes    |
 * | DetailDialog            | Componente para exibir detalhes completos do conteúdo                |
 * | (Componente)            | em um modal com sinopse e informações adicionais                     |
 * -------------------------------------------------------------------------------------------------
 */

export interface JurisflixContentProps {
  id: string;
  titulo: string;
  tipo: 'filme' | 'série' | 'documentário';
  ano: number;
  sinopse: string;
  temas_juridicos: string[];
  onde_assistir?: string[];
  poster_url?: string;
  rating?: number;
}

interface JurisflixCardProps {
  content: JurisflixContentProps;
  onSelect: (content: JurisflixContentProps) => void;
}

export const JurisflixCard: React.FC<JurisflixCardProps> = ({ content, onSelect }) => {
  return (
    <Card className="h-full flex flex-col cursor-pointer hover:scale-105 transition-transform duration-200">
      <CardHeader className="flex-grow-0 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{content.titulo}</CardTitle>
          <Badge variant={content.tipo === 'filme' ? 'default' : content.tipo === 'série' ? 'secondary' : 'outline'}>
            {content.tipo}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <div className="aspect-[2/3] bg-muted rounded-md overflow-hidden">
          {content.poster_url ? (
            <img 
              src={content.poster_url} 
              alt={content.titulo} 
              className="w-full h-full object-cover hover:opacity-75 transition-opacity"
              onClick={() => onSelect(content)}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center bg-primary/10"
              onClick={() => onSelect(content)}
            >
              <Film className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto justify-between items-center pt-2">
        <div className="flex items-center text-sm">
          <span>{content.ano}</span>
          {content.rating && (
            <div className="ml-2 flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{content.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>{content.titulo}</DialogTitle>
                <Badge variant={content.tipo === 'filme' ? 'default' : content.tipo === 'série' ? 'secondary' : 'outline'}>
                  {content.tipo}
                </Badge>
              </div>
              <DialogDescription>
                {content.ano} • {content.rating && `★ ${content.rating.toFixed(1)}`}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-[2/3] bg-muted rounded-md overflow-hidden">
                      {content.poster_url ? (
                        <img src={content.poster_url} alt={content.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Film className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 space-y-3">
                    <div>
                      <h4 className="font-semibold">Sinopse</h4>
                      <p className="text-sm text-muted-foreground">{content.sinopse}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">Temas Jurídicos</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {content.temas_juridicos.map((tema, i) => (
                          <Badge key={i} variant="outline">
                            {tema}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {content.onde_assistir && content.onde_assistir.length > 0 && (
                      <div>
                        <h4 className="font-semibold">Onde Assistir</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {content.onde_assistir.map((plataforma, i) => (
                            <Badge key={i} variant="secondary">
                              {plataforma}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="flex justify-end">
              <Button onClick={() => onSelect(content)}>
                Assistir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
