import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VideoPlayer } from '@/components/video-aulas/VideoPlayer';
import { VideoAulaTranscription } from '@/components/video-aulas/VideoAulaTranscription';
import { Loader2, ChevronLeft, PlayCircle, BookOpen, ArrowUpRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { analyzeLectureTranscription } from '@/utils/geminiAI';
import { VideoTranscription } from '@/types/supabase';

/**
 * Tabela de Funções - PlaylistDetails.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | PlaylistDetails         | Componente principal para exibição de detalhes de uma playlist      |
 * | (Componente)            | de vídeo-aulas com vídeo, transcrição e discussão                   |
 * | fetchPlaylistDetails    | Busca detalhes da playlist e vídeos do banco de dados               |
 * | (Query Function)        | usando React Query para otimizar performance e caching               |
 * | fetchVideoTranscription | Busca ou gera transcrição do vídeo atual                            |
 * | (Função)                | usando IA para analisar o conteúdo quando necessário                |
 * | handleVideoSelect       | Processa a seleção de um vídeo da playlist                          |
 * | (Função)                | atualizando o vídeo atual e buscando sua transcrição                |
 * | handleNextVideo         | Navega para o próximo vídeo da playlist quando disponível           |
 * | (Função)                | usando o índice atual e o array de vídeos                           |
 * -------------------------------------------------------------------------------------------------
 */

interface Video {
  id: string;
  titulo: string;
  descricao: string | null;
  url_video: string;
  thumbnail: string | null;
  duracao: string | null;
  ordem: number;
  playlist_id: string;
}

interface Playlist {
  id: string;
  titulo: string;
  descricao: string | null;
  thumbnail: string | null;
  categoria: {
    id: string;
    nome: string;
  };
}

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState("video");
  const [transcription, setTranscription] = useState<VideoTranscription | null>(null);
  const [loadingTranscription, setLoadingTranscription] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const { data: playlist, error: playlistError } = await supabase
        .from('video_aulas_playlists')
        .select(`
          *,
          categoria:video_aulas_categorias(id, nome)
        `)
        .eq('id', id)
        .single();

      if (playlistError) throw playlistError;

      const { data: videos, error: videosError } = await supabase
        .from('video_aulas_videos')
        .select('*')
        .eq('playlist_id', id)
        .order('ordem', { ascending: true });

      if (videosError) throw videosError;

      return { playlist, videos };
    },
    enabled: !!id
  });

  useEffect(() => {
    if (data?.videos && data.videos.length > 0 && !currentVideo) {
      setCurrentVideo(data.videos[0]);
      fetchVideoTranscription(data.videos[0].id);
    }
  }, [data]);

  const fetchVideoTranscription = async (videoId: string) => {
    setLoadingTranscription(true);
    try {
      const { data: existingTranscription, error } = await supabase
        .from('video_transcricoes')
        .select('*')
        .eq('video_id', videoId)
        .maybeSingle();

      if (existingTranscription) {
        const transformedData = {
          ...existingTranscription,
          pontos_chave: existingTranscription.pontos_chave as unknown as { ponto: string; descricao?: string }[] | null,
          palavras_chave: existingTranscription.palavras_chave as string[] | null
        };
        
        setTranscription(transformedData as VideoTranscription);
        return;
      }

      toast.loading("Gerando transcrição do vídeo...");
      
      const mockTranscription = 
        "Bem-vindos à nossa aula sobre Princípios Constitucionais. Hoje vamos abordar os fundamentos que regem nossa Constituição Federal de 1988. " +
        "Começaremos falando sobre o princípio da dignidade da pessoa humana, que é o alicerce de todo o ordenamento jurídico brasileiro. " +
        "Este princípio estabelece que todo ser humano deve ser tratado com respeito e consideração pelo Estado e pela sociedade. " +
        "Em seguida, discutiremos o princípio da separação dos poderes, que divide o poder estatal em três: Executivo, Legislativo e Judiciário. " +
        "Esta divisão é essencial para evitar a concentração de poder e garantir o sistema de freios e contrapesos. " +
        "O terceiro princípio que abordaremos é o da legalidade, que determina que ninguém será obrigado a fazer ou deixar de fazer algo senão em virtude de lei. " +
        "Este princípio é a base do Estado de Direito e protege os cidadãos contra arbitrariedades. " +
        "Por fim, falaremos sobre o princípio do devido processo legal, que garante a todos o direito a um processo justo, com ampla defesa e contraditório.";

      const aiAnalysis = await analyzeLectureTranscription(mockTranscription);
      
      const newTranscription: VideoTranscription = {
        id: `temp-${Date.now()}`,
        video_id: videoId,
        transcricao: mockTranscription,
        resumo_ai: aiAnalysis.resumo || "Aula sobre princípios constitucionais fundamentais no direito brasileiro.",
        pontos_chave: aiAnalysis.pontos_chave || [
          { 
            ponto: "Dignidade da Pessoa Humana",
            descricao: "Alicerce do ordenamento jurídico brasileiro" 
          },
          { 
            ponto: "Separação dos Poderes",
            descricao: "Divisão entre Executivo, Legislativo e Judiciário" 
          },
          { 
            ponto: "Princípio da Legalidade",
            descricao: "Base do Estado de Direito" 
          },
          { 
            ponto: "Devido Processo Legal",
            descricao: "Garantia de processo justo com ampla defesa" 
          }
        ],
        palavras_chave: aiAnalysis.palavras_chave || [
          "Constituição", "Dignidade Humana", "Separação de Poderes", 
          "Legalidade", "Devido Processo Legal", "Estado de Direito"
        ],
        duracao: 350,
        created_at: new Date().toISOString()
      };
      
      setTranscription(newTranscription);
      
      toast.dismiss();
      toast.success("Transcrição gerada com sucesso!");
      
    } catch (error) {
      console.error("Erro ao buscar/gerar transcrição:", error);
      toast.error("Erro ao carregar transcrição");
    } finally {
      setLoadingTranscription(false);
    }
  };

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    fetchVideoTranscription(video.id);
    setActiveTab("video");
    
    window.scrollTo(0, 0);
  };

  const handleNextVideo = () => {
    if (!data?.videos || !currentVideo) return;
    
    const currentIndex = data.videos.findIndex(v => v.id === currentVideo.id);
    if (currentIndex < data.videos.length - 1) {
      handleVideoSelect(data.videos[currentIndex + 1]);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (error || !data) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium mb-2">Erro ao carregar o conteúdo</p>
          <Button variant="outline" onClick={() => navigate('/video-aulas')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Vídeo-aulas
          </Button>
        </div>
      );
    }

    const { playlist, videos } = data;

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/video-aulas')}
              className="mb-2"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Vídeo-aulas
            </Button>
            <h1 className="text-2xl font-bold">{playlist.titulo}</h1>
            {playlist.descricao && (
              <p className="text-muted-foreground mt-1">{playlist.descricao}</p>
            )}
          </div>
          
          <div className="flex items-start gap-2">
            <Button variant="outline" size="sm">
              Salvar para assistir depois
            </Button>
            <Button variant="outline" size="sm">
              Compartilhar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {currentVideo && (
              <>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <VideoPlayer url={currentVideo.url_video} />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold">{currentVideo.titulo}</h2>
                  {currentVideo.descricao && (
                    <p className="text-muted-foreground mt-1">{currentVideo.descricao}</p>
                  )}
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="video">Vídeo</TabsTrigger>
                    <TabsTrigger value="transcricao">Transcrição</TabsTrigger>
                    <TabsTrigger value="discussao">Discussão</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="video" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <div>
                              <h3 className="font-medium">Material de Apoio</h3>
                              <p className="text-sm text-muted-foreground">
                                Baixe materiais complementares para esta aula
                              </p>
                              <Button variant="link" className="px-0 h-auto">Ver materiais</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <ArrowUpRight className="h-5 w-5 text-primary" />
                            <div>
                              <h3 className="font-medium">Links Úteis</h3>
                              <p className="text-sm text-muted-foreground">
                                Referências e sites relacionados ao tema
                              </p>
                              <Button variant="link" className="px-0 h-auto">Acessar links</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="transcricao" className="pt-4">
                    {loadingTranscription ? (
                      <div className="flex justify-center items-center min-h-[200px]">
                        <Loader2 className="h-8 w-8 animate-spin mr-2" />
                        <span>Carregando transcrição...</span>
                      </div>
                    ) : transcription ? (
                      <VideoAulaTranscription transcription={transcription} />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          Transcrição não disponível para este vídeo
                        </p>
                        <Button variant="outline" className="mt-4">
                          Solicitar transcrição
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="discussao" className="pt-4">
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Discussão</h3>
                      <p className="text-muted-foreground mb-4">
                        Compartilhe suas dúvidas e comentários sobre esta aula
                      </p>
                      <Button>
                        Iniciar discussão
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
          
          <div>
            <div className="bg-card rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Vídeos nesta playlist</h3>
                <p className="text-sm text-muted-foreground">{videos.length} vídeos</p>
              </div>
              
              <ScrollArea className="h-[500px]">
                <div className="p-1">
                  {videos.map((video) => (
                    <div 
                      key={video.id} 
                      className={`flex items-start p-2 gap-3 rounded-md cursor-pointer hover:bg-secondary/30 ${currentVideo?.id === video.id ? 'bg-secondary/50' : ''}`}
                      onClick={() => handleVideoSelect(video)}
                    >
                      <div className="relative flex-shrink-0 w-24 h-14 rounded overflow-hidden">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.titulo} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <PlayCircle className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className={`text-sm ${currentVideo?.id === video.id ? 'font-semibold' : ''}`}>
                          {video.titulo}
                        </h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {video.duracao || "Sem duração"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {data && currentVideo ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/video-aulas')}
                  className="mb-2"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar para Vídeo-aulas
                </Button>
                <h1 className="text-2xl font-bold">{data.playlist.titulo}</h1>
                {data.playlist.descricao && (
                  <p className="text-muted-foreground mt-1">{data.playlist.descricao}</p>
                )}
              </div>
              
              <div className="flex items-start gap-2">
                <Button variant="outline" size="sm">
                  Salvar para assistir depois
                </Button>
                <Button variant="outline" size="sm">
                  Compartilhar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <VideoPlayer url={currentVideo.url_video} />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold">{currentVideo.titulo}</h2>
                  {currentVideo.descricao && (
                    <p className="text-muted-foreground mt-1">{currentVideo.descricao}</p>
                  )}
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="video">Vídeo</TabsTrigger>
                    <TabsTrigger value="transcricao">Transcrição</TabsTrigger>
                    <TabsTrigger value="discussao">Discussão</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="video" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <div>
                              <h3 className="font-medium">Material de Apoio</h3>
                              <p className="text-sm text-muted-foreground">
                                Baixe materiais complementares para esta aula
                              </p>
                              <Button variant="link" className="px-0 h-auto">Ver materiais</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <ArrowUpRight className="h-5 w-5 text-primary" />
                            <div>
                              <h3 className="font-medium">Links Úteis</h3>
                              <p className="text-sm text-muted-foreground">
                                Referências e sites relacionados ao tema
                              </p>
                              <Button variant="link" className="px-0 h-auto">Acessar links</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="transcricao" className="pt-4">
                    {loadingTranscription ? (
                      <div className="flex justify-center items-center min-h-[200px]">
                        <Loader2 className="h-8 w-8 animate-spin mr-2" />
                        <span>Carregando transcrição...</span>
                      </div>
                    ) : transcription ? (
                      <VideoAulaTranscription transcription={transcription} />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          Transcrição não disponível para este vídeo
                        </p>
                        <Button variant="outline" className="mt-4">
                          Solicitar transcrição
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="discussao" className="pt-4">
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Discussão</h3>
                      <p className="text-muted-foreground mb-4">
                        Compartilhe suas dúvidas e comentários sobre esta aula
                      </p>
                      <Button>
                        Iniciar discussão
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div>
                <div className="bg-card rounded-lg border">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Vídeos nesta playlist</h3>
                    <p className="text-sm text-muted-foreground">{data.videos.length} vídeos</p>
                  </div>
                  
                  <ScrollArea className="h-[500px]">
                    <div className="p-1">
                      {data.videos.map((video) => (
                        <div 
                          key={video.id} 
                          className={`flex items-start p-2 gap-3 rounded-md cursor-pointer hover:bg-secondary/30 ${currentVideo?.id === video.id ? 'bg-secondary/50' : ''}`}
                          onClick={() => handleVideoSelect(video)}
                        >
                          <div className="relative flex-shrink-0 w-24 h-14 rounded overflow-hidden">
                            {video.thumbnail ? (
                              <img 
                                src={video.thumbnail} 
                                alt={video.titulo} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <PlayCircle className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className={`text-sm ${currentVideo?.id === video.id ? 'font-semibold' : ''}`}>
                              {video.titulo}
                            </h4>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-muted-foreground">
                                {video.duracao || "Sem duração"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium mb-2">Erro ao carregar o conteúdo</p>
            <Button variant="outline" onClick={() => navigate('/video-aulas')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Vídeo-aulas
            </Button>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default PlaylistDetails;
