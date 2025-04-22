
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

interface PlaylistCardProps {
  titulo: string;
  descricao?: string | null;
  thumbnail?: string | null;
  onClick: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  titulo,
  descricao,
  thumbnail,
  onClick,
}) => {
  return (
    <Card className="hover:bg-secondary/50 cursor-pointer transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3 flex items-center justify-center">
          {thumbnail ? (
            <img src={thumbnail} alt={titulo} className="w-full h-full object-cover" />
          ) : (
            <Video className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <CardTitle className="text-base mb-2 line-clamp-2">{titulo}</CardTitle>
        {descricao && (
          <p className="text-sm text-muted-foreground line-clamp-2">{descricao}</p>
        )}
      </CardContent>
    </Card>
  );
};
