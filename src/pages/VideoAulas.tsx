
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { SearchBar } from '@/components/video-aulas/SearchBar';
import { CategoryList } from '@/components/video-aulas/CategoryList';
import { PlaylistCard } from '@/components/video-aulas/PlaylistCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Tabela de Funções - VideoAulas.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | VideoAulas              | Componente principal que renderiza a página de vídeo-aulas          |
 * | (Componente)            | com categorias, pesquisa e lista de playlists                       |
 * | useFetchCategories      | Hook personalizado para buscar categorias de vídeo-aulas do banco   |
 * | (Hook)                  | de dados usando React Query                                         |
 * | useFetchPlaylists       | Hook personalizado para buscar playlists de vídeo-aulas filtradas   |
 * | (Hook)                  | por categoria selecionada usando React Query                        |
 * | renderContent           | Função que renderiza o conteúdo apropriado com base no estado       |
 * | (Função)                | de carregamento, erro ou dados disponíveis                          |
 * -------------------------------------------------------------------------------------------------
 */

// Hook personalizado para buscar categorias
const useFetchCategories = () => {
  return useQuery({
    queryKey: ['video-aulas-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_aulas_categorias')
        .select('*')
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar categorias:", error);
        toast.error("Erro ao carregar categorias");
        throw error;
      }
      return data || [];
    }
  });
};

// Hook personalizado para buscar playlists
const useFetchPlaylists = (selectedCategory: string | null) => {
  return useQuery({
    queryKey: ['video-aulas-playlists', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('video_aulas_playlists')
        .select(`
          *,
          categoria:video_aulas_categorias(nome)
        `)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('categoria_id', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Erro ao buscar playlists:", error);
        toast.error("Erro ao carregar playlists");
        throw error;
      }
      return data || [];
    }
  });
};

const VideoAulas: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { 
    data: categories, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useFetchCategories();

  const { 
    data: playlists, 
    isLoading: playlistsLoading, 
    error: playlistsError 
  } = useFetchPlaylists(selectedCategory);

  const filteredPlaylists = playlists?.filter(playlist =>
    playlist.titulo.toLowerCase().includes(search.toLowerCase()) ||
    playlist.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlaylistClick = (playlistId: string) => {
    // Navegação para a página de detalhes da playlist
    console.log('Navegando para playlist:', playlistId);
    // TODO: Implementar navegação para detalhes da playlist
    toast.info(`Visualizando playlist: ${playlistId}`, {
      description: "Detalhes da playlist serão implementados em breve."
    });
  };

  const renderContent = () => {
    if (categoriesLoading || playlistsLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Carregando conteúdo...</span>
        </div>
      );
    }

    if (categoriesError || playlistsError) {
      return (
        <div className="text-center py-12">
          <p className="text-destructive font-medium mb-2">
            Ocorreu um erro ao carregar o conteúdo.
          </p>
          <p className="text-muted-foreground">
            Por favor, tente novamente mais tarde.
          </p>
        </div>
      );
    }

    if (filteredPlaylists && filteredPlaylists.length > 0) {
      return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              titulo={playlist.titulo}
              descricao={playlist.descricao}
              thumbnail={playlist.thumbnail}
              onClick={() => handlePlaylistClick(playlist.id)}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {search
            ? "Nenhuma playlist encontrada para sua pesquisa."
            : "Nenhuma playlist disponível no momento."}
        </p>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col space-y-6">
          <div className="mb-2">
            <h1 className="text-3xl font-bold mb-2">Vídeo-aulas</h1>
            <p className="text-muted-foreground">
              Aprenda com nossas videoaulas exclusivas
            </p>
          </div>

          <SearchBar onSearch={setSearch} />

          {categories && (
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default VideoAulas;
