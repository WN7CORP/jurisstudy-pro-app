import React from 'react';

/**
 * Tabela de Funções - VideoPlayer.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | VideoPlayer             | Componente para reprodução de vídeos com suporte a várias fontes    |
 * | (Componente)            | incluindo YouTube, Vimeo e URLs diretas de vídeo                    |
 * -------------------------------------------------------------------------------------------------
 */

export interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');
  
  // Função para extrair o ID do vídeo do YouTube
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Função para extrair o ID do vídeo do Vimeo
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };
  
  if (isYouTube) {
    const videoId = getYouTubeId(url);
    if (!videoId) return <div>ID de vídeo inválido</div>;
    
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }
  
  if (isVimeo) {
    const videoId = getVimeoId(url);
    if (!videoId) return <div>ID de vídeo inválido</div>;
    
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://player.vimeo.com/video/${videoId}`}
        title="Vimeo video player"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }
  
  // Reprodutor de vídeo nativo para URLs diretas
  return (
    <video
      width="100%"
      height="100%"
      controls
      className="w-full h-full"
    >
      <source src={url} />
      Seu navegador não suporta o elemento de vídeo.
    </video>
  );
};
