
import React from 'react';

/**
 * Tabela de Funções - VideoPlayer.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | VideoPlayer             | Componente que renderiza um player de vídeo embutido para a         |
 * | (Componente)            | reprodução de vídeos das playlists                                  |
 * -------------------------------------------------------------------------------------------------
 */

interface VideoPlayerProps {
  video: {
    url_video: string;
    titulo: string;
    thumbnail?: string;
  };
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  // Função para extrair o ID do vídeo do YouTube da URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Verifica se é uma URL do YouTube
  const isYoutubeUrl = video.url_video && video.url_video.includes('youtu');
  const videoId = isYoutubeUrl ? getYouTubeVideoId(video.url_video) : null;
  
  // Gera a URL de incorporação do YouTube
  const youtubeEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="aspect-video bg-black">
        {youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title={video.titulo}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={video.url_video}
            poster={video.thumbnail}
            controls
            className="w-full h-full object-contain"
          >
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        )}
      </div>
    </div>
  );
};
