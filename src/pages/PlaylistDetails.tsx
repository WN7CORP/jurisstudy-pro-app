
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { VideoPlayer } from '@/components/video-aulas/VideoPlayer';
import { VideoList } from '@/components/video-aulas/VideoList';
import { toast } from 'sonner';

/**
 * Tabela de Funções - PlaylistDetails.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | PlaylistDetails         | Componente principal que mostra detalhes de uma playlist específica |
 * | (Componente)            | incluindo o player de vídeo e lista de vídeos relacionados          |
 * | useFetchPlaylistDetails | Hook para buscar detalhes da playlist e vídeos relacionados         |
 * | (Hook)                  | usando o ID da playlist da URL                                      |
 * | handleSelectVideo       | Gerencia a seleção de um vídeo da lista para reprodução             |
 * | (Função)                |                                                                     |
 * -------------------------------------------------------------------------------------------------
 */

// Hook personalizado para buscar detalhes da playlist e seus vídeos
const useFetchPlaylistDetails = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist-details', playlistId],
    queryFn: async () => {
      // Buscar detalhes da playlist
      const { data: playlistData, error: playlistError } = await supabase
        .from('video_aulas_playlists')
        .select('*, categoria:video_aulas_categorias(nome)')
        .eq('id', playlistId)
        .single();
      
      if (playlistError) {
        console.error("Erro ao buscar detalhes da playlist:", playlistError);
        throw playlistError;
      }

      // Buscar vídeos associados à playlist
      const { data: videosData, error: videosError } = await supabase
        .from('video_aulas_videos')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('ordem', { ascending: true });
      
      if (videosError) {
        console.error("Erro ao buscar vídeos da playlist:", videosError);
        throw videosError;
      }

      return {
        playlist: playlistData,
        videos: videosData || []
      };
    }
  });
};

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  
  const { 
    data, 
    isLoading, 
    error 
  } = useFetchPlaylistDetails(id || '');

  // Seleciona o primeiro vídeo automaticamente quando os dados carregam
  React.useEffect(() => {
    if (data?.videos && data.videos.length > 0 && !currentVideo) {
      setCurrentVideo(data.videos[0]);
    }
  }, [data, currentVideo]);

  const handleSelectVideo = (video: any) => {
    setCurrentVideo(video);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando playlist...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/video-aulas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Vídeo-aulas
            </Link>
          </Button>
          <div className="text-center py-12">
            <p className="text-destructive font-medium mb-2">
              Erro ao carregar detalhes da playlist.
            </p>
            <p className="text-muted-foreground">
              Playlist não encontrada ou ocorreu um erro ao carregar os dados.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const { playlist, videos } = data;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/video-aulas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Vídeo-aulas
          </Link>
        </Button>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">{playlist?.titulo}</h1>
          <p className="text-muted-foreground">{playlist?.descricao}</p>
          <div className="flex items-center mt-2">
            <span className="text-sm bg-secondary px-2 py-1 rounded-md">
              {playlist?.categoria?.nome}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentVideo ? (
              <VideoPlayer video={currentVideo} />
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center rounded-md">
                <p className="text-muted-foreground">Nenhum vídeo selecionado</p>
              </div>
            )}
            
            {currentVideo && (
              <div className="mt-4">
                <h2 className="text-xl font-bold">{currentVideo.titulo}</h2>
                <p className="text-muted-foreground mt-2">{currentVideo.descricao}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Vídeos nesta playlist</h3>
            <VideoList 
              videos={videos}
              currentVideoId={currentVideo?.id}
              onSelectVideo={handleSelectVideo}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlaylistDetails;
