
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Tabela de Funções - VideoList.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | VideoList               | Componente que renderiza uma lista de vídeos de uma playlist com    |
 * | (Componente)            | destaque para o vídeo atual e funcionalidade de seleção             |
 * -------------------------------------------------------------------------------------------------
 */

interface Video {
  id: string;
  titulo: string;
  descricao?: string | null;
  thumbnail?: string | null;
  duracao?: string | null;
  ordem: number;
}

interface VideoListProps {
  videos: Video[];
  currentVideoId?: string;
  onSelectVideo: (video: Video) => void;
}

export const VideoList: React.FC<VideoListProps> = ({ 
  videos, 
  currentVideoId,
  onSelectVideo 
}) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-4 bg-muted/50 rounded-md">
        <p className="text-muted-foreground">Nenhum vídeo disponível</p>
      </div>
    );
  }

  // Formata a duração do vídeo (exemplo: "10:30")
  const formatDuration = (duration?: string | null) => {
    if (!duration) return '';
    return duration;
  };

  return (
    <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => onSelectVideo(video)}
          className={cn(
            "flex items-start p-2 rounded-md cursor-pointer hover:bg-secondary/80 transition-colors",
            currentVideoId === video.id ? "bg-secondary" : ""
          )}
        >
          <div className="relative flex-shrink-0 w-20 h-12 overflow-hidden rounded bg-muted mr-2">
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Sem imagem</span>
              </div>
            )}
            {video.duracao && (
              <div className="absolute bottom-0 right-0 text-[10px] bg-black/70 text-white px-1 py-0.5 rounded-sm">
                {formatDuration(video.duracao)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight line-clamp-2">{video.titulo}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Aula {video.ordem + 1}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
