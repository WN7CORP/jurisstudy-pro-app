import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FlashCard } from "@/types/flashcards";
import { FlashcardsHeader } from "@/components/flashcards/FlashcardsHeader";
import { CategoriesCarousel } from "@/components/flashcards/CategoriesCarousel";
import { PlaylistsGrid } from "@/components/flashcards/PlaylistsGrid";
import { FlashcardSetsList } from "@/components/flashcards/FlashcardSetsList";

/**
 * Página principal de Flashcards
 * 
 * | Função                | Descrição                                            |
 * |-----------------------|------------------------------------------------------|
 * | fetchFlashcards       | Busca os flashcards disponíveis                      |
 * | fetchUserProgress     | Obtém o progresso do usuário nos flashcards          |
 * | fetchPlaylists        | Obtém as playlists criadas pelo usuário              |
 * | handleCreateNewSet    | Cria um novo conjunto de flashcards                  |
 * | handleStudySet        | Inicia o estudo de um conjunto de flashcards         |
 */
const Flashcards: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [categories, setCategories] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Buscar flashcards do Supabase
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('flash_cards')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setFlashcards(data as FlashCard[]);
          
          // Extrair categorias únicas e contar flashcards por área
          const areas = data.reduce((acc: {[key: string]: number}, card) => {
            if (card.area) {
              acc[card.area] = (acc[card.area] || 0) + 1;
            }
            return acc;
          }, {});
          
          const categoryData = Object.entries(areas).map(([area, count]) => ({
            area,
            count,
          }));
          
          setCategories(categoryData);
          
          // Criar conjuntos de flashcards por tema
          const setsByTema = data.reduce((acc: {[key: string]: any}, card) => {
            if (card.tema && card.area) {
              const key = `${card.area}-${card.tema}`;
              if (!acc[key]) {
                acc[key] = {
                  tema: card.tema,
                  area: card.area,
                  cards: 0,
                  lastReviewed: "Nunca revisado",
                  progress: 0,
                };
              }
              acc[key].cards++;
            }
            return acc;
          }, {});
          
          setFlashcardSets(Object.values(setsByTema));
        }
      } catch (error) {
        console.error("Erro ao buscar flashcards:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os flashcards.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlashcards();
  }, [toast]);

  // Buscar progresso do usuário
  useEffect(() => {
    const fetchUserProgress = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user?.id) {
        const { data, error } = await supabase
          .from('user_flashcard_progress' as any)
          .select('*')
          .eq('user_id', sessionData.session.user.id);
          
        if (error) {
          console.error("Erro ao buscar progresso:", error);
        } else if (data) {
          // Converter dados para o tipo UserProgress
          const typedProgress = data as unknown as UserProgress[];
          setUserProgress(typedProgress);
          
          // Atualizar o progresso nos conjuntos de flashcards
          setFlashcardSets(prevSets => {
            return prevSets.map(set => {
              const setCards = flashcards.filter(
                card => card.area === set.area && card.tema === set.tema
              );
              
              if (setCards.length === 0) return set;
              
              const setCardIds = setCards.map(card => card.id);
              const progressEntries = typedProgress.filter(p => setCardIds.includes(p.flashcard_id));
              
              if (progressEntries.length === 0) return set;
              
              // Calcular média de confiança
              const totalConfidence = progressEntries.reduce(
                (sum, entry) => sum + entry.confidence_level, 0
              );
              const progress = Math.round((totalConfidence / (progressEntries.length * 5)) * 100);
              
              // Encontrar data da revisão mais recente
              const lastReviewed = new Date(
                Math.max(...progressEntries.map(e => new Date(e.last_reviewed).getTime()))
              );
              
              const now = new Date();
              const diffDays = Math.floor((now.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24));
              
              let lastReviewedText = "Nunca revisado";
              if (!isNaN(diffDays)) {
                if (diffDays === 0) {
                  lastReviewedText = "Hoje";
                } else if (diffDays === 1) {
                  lastReviewedText = "Ontem";
                } else if (diffDays < 7) {
                  lastReviewedText = `${diffDays} dias atrás`;
                } else if (diffDays < 30) {
                  const weeks = Math.floor(diffDays / 7);
                  lastReviewedText = `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
                } else {
                  const months = Math.floor(diffDays / 30);
                  lastReviewedText = `${months} mês${months > 1 ? 'es' : ''} atrás`;
                }
              }
              
              return {
                ...set,
                progress,
                lastReviewed: lastReviewedText
              };
            });
          });
        }
      }
    };
    
    if (flashcards.length > 0) {
      fetchUserProgress();
    }
  }, [flashcards]);

  // Buscar playlists do usuário
  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user?.id) {
        const { data, error } = await supabase
          .from('flashcard_playlists' as any)
          .select('*')
          .eq('user_id', sessionData.session.user.id);
          
        if (error) {
          console.error("Erro ao buscar playlists:", error);
        } else if (data) {
          // Para cada playlist, buscar a contagem de flashcards
          const playlistsWithCounts = await Promise.all(
            data.map(async (playlist) => {
              // Verificar se playlist é um objeto válido com id
              if (!playlist || typeof playlist !== 'object') {
                return {
                  id: 'unknown',
                  name: 'Playlist desconhecida',
                  description: null,
                  flashcard_count: 0
                };
              }

              // Usar type assertion para acessar a propriedade id
              const playlistObj = playlist as any;
              const playlistId = playlistObj.id as string;
              
              if (!playlistId) {
                return {
                  id: 'unknown',
                  name: playlistObj.name || 'Playlist desconhecida',
                  description: playlistObj.description || null,
                  flashcard_count: 0
                };
              }

              const { count, error: countError } = await supabase
                .from('playlist_flashcards' as any)
                .select('*', { count: 'exact', head: true })
                .eq('playlist_id', playlistId);
                
              // Criar objeto de playlist com contagem
              const playlistWithCount = {
                id: playlistId,
                name: playlistObj.name as string || 'Sem nome',
                description: playlistObj.description as string | null,
                flashcard_count: countError ? 0 : (count || 0)
              };
              
              return playlistWithCount;
            })
          );
          
          setPlaylists(playlistsWithCounts);
        }
      }
    };
    
    fetchPlaylists();
  }, []);

  // Manipuladores de eventos
  const handleCreateNewSet = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve.",
    });
  };

  const handleStudySet = (area: string, tema: string) => {
    const cardsToStudy = flashcards.filter(
      card => card.area === area && card.tema === tema
    );
    
    if (cardsToStudy.length === 0) {
      toast({
        title: "Sem flashcards",
        description: "Não há flashcards disponíveis para este conjunto.",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/estudo-flashcards', { 
      state: { 
        cards: cardsToStudy,
        setInfo: { area, tema }
      } 
    });
  };

  // Filtrar flashcards baseado na busca
  const filteredSets = flashcardSets.filter(set => {
    const matchesSearch = 
      set.tema.toLowerCase().includes(searchQuery.toLowerCase()) || 
      set.area.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      !selectedCategory || set.area === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <FlashcardsHeader onCreateNewSet={handleCreateNewSet} />

          <Tabs defaultValue="categorias" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="categorias">Categorias</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categorias">
              <div className="mb-4">
                <CategoriesCarousel
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="playlists">
              <PlaylistsGrid playlists={playlists} />
            </TabsContent>
          </Tabs>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Buscar flashcards..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Recentemente revisados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FlashcardSetsList 
                sets={filteredSets.slice(0, 3)} 
                onStudySet={handleStudySet}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Todos os conjuntos</h2>
            <FlashcardSetsList 
              sets={filteredSets}
              onStudySet={handleStudySet}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Flashcards;
