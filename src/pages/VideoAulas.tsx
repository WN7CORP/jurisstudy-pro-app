
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { SearchBar } from '@/components/video-aulas/SearchBar';
import { CategoryList } from '@/components/video-aulas/CategoryList';
import { PlaylistCard } from '@/components/video-aulas/PlaylistCard';
import { supabase } from '@/integrations/supabase/client';

const VideoAulas: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['video-aulas-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_aulas_categorias')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: playlists } = useQuery({
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
      if (error) throw error;
      return data;
    }
  });

  const filteredPlaylists = playlists?.filter(playlist =>
    playlist.titulo.toLowerCase().includes(search.toLowerCase()) ||
    playlist.descricao?.toLowerCase().includes(search.toLowerCase())
  );

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

          {filteredPlaylists && filteredPlaylists.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  titulo={playlist.titulo}
                  descricao={playlist.descricao}
                  thumbnail={playlist.thumbnail}
                  onClick={() => console.log('Playlist clicked:', playlist.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {search
                  ? "Nenhuma playlist encontrada para sua pesquisa."
                  : "Nenhuma playlist disponível no momento."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VideoAulas;
