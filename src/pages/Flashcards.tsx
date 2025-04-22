
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, ChevronRight, Clock, Award, Upload, FileText, FileImage, FileAudio } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { FlashCard, UserProgress } from "@/types/flashcards";

/**
 * Interface para a categoria de flashcards
 */
interface Category {
  area: string;
  count: number;
}

/**
 * Interface para conjunto de flashcards
 */
interface FlashcardSet {
  tema: string;
  area: string;
  cards: number;
  lastReviewed: string;
  progress: number;
}

/**
 * Interface para playlists
 */
interface Playlist {
  id: string;
  name: string;
  description: string | null;
  flashcard_count: number;
}

/**
 * Página principal de Flashcards
 * 
 * | Função                | Descrição                                            |
 * |-----------------------|------------------------------------------------------|
 * | fetchFlashcards       | Busca os flashcards disponíveis                      |
 * | fetchUserProgress     | Obtém o progresso do usuário nos flashcards          |
 * | fetchPlaylists        | Obtém as playlists criadas pelo usuário              |
 * | handleCreateNewSet    | Cria um novo conjunto de flashcards                  |
 * | handleFileUpload      | Processa o upload de materiais para criar flashcards |
 * | handleStudySet        | Inicia o estudo de um conjunto de flashcards         |
 */
const Flashcards: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
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
              if (!playlist || typeof playlist !== 'object' || !('id' in playlist)) {
                return {
                  id: 'unknown',
                  name: 'Playlist desconhecida',
                  description: null,
                  flashcard_count: 0
                };
              }

              const playlistId = playlist.id as string;

              const { count, error: countError } = await supabase
                .from('playlist_flashcards' as any)
                .select('*', { count: 'exact', head: true })
                .eq('playlist_id', playlistId);
                
              // Criar objeto de playlist com contagem
              const playlistWithCount: Playlist = {
                id: playlistId,
                name: playlist.name as string,
                description: playlist.description as string | null,
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

  // Filtrar flashcards baseado na busca
  const filteredSets = flashcardSets.filter(set => {
    const matchesSearch = 
      set.tema.toLowerCase().includes(searchQuery.toLowerCase()) || 
      set.area.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      !selectedCategory || set.area === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });

  // Função para criar novo conjunto de flashcards
  const handleCreateNewSet = () => {
    // Implementar lógica para criar novo conjunto
    toast({
      title: "Em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve.",
    });
  };

  // Função para upload de arquivo
  const handleFileUpload = (type: 'pdf' | 'image' | 'audio') => {
    toast({
      title: "Upload de arquivo",
      description: `Carregando arquivo ${type}. Esta funcionalidade estará disponível em breve.`,
    });
  };

  // Função para iniciar estudo de um conjunto de flashcards
  const handleStudySet = (area: string, tema: string) => {
    // Filtrar os flashcards pelo área e tema selecionados
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
    
    // Navegar para a página de estudo com os flashcards selecionados
    navigate('/estudo-flashcards', { 
      state: { 
        cards: cardsToStudy,
        setInfo: { area, tema }
      } 
    });
  };

  // Tabela para comparar o uso das funções dos flashcards
  const renderFlashcardFunctionsTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionalidade</TableHead>
            <TableHead>Descrição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Revisão de flashcards</TableCell>
            <TableCell>Revise os flashcards criados pelo sistema ou por você</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Upload de material (PDF, imagem, áudio)</TableCell>
            <TableCell>Carregue seus materiais para criar flashcards automáticos usando IA</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Playlists de estudo</TableCell>
            <TableCell>Monte listas personalizadas com flashcards de diferentes áreas</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Acompanhamento de progresso</TableCell>
            <TableCell>Visualize seu progresso por tema e área com estatísticas detalhadas</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
              <p className="text-muted-foreground">
                Revise seu conhecimento de forma interativa
              </p>
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Importar Material</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Importar Material</SheetTitle>
                    <SheetDescription>
                      Carregue seus materiais para criar flashcards automáticos com IA
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between" 
                      onClick={() => handleFileUpload('pdf')}
                    >
                      <span>PDF</span>
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between"
                      onClick={() => handleFileUpload('image')}
                    >
                      <span>Imagem</span>
                      <FileImage className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between"
                      onClick={() => handleFileUpload('audio')}
                    >
                      <span>Áudio</span>
                      <FileAudio className="h-4 w-4" />
                    </Button>
                    <div className="mt-4">
                      {renderFlashcardFunctionsTable()}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button className="bg-netflix-red hover:bg-netflix-red/90" onClick={handleCreateNewSet}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Conjunto
              </Button>
            </div>
          </div>

          <Tabs defaultValue="categorias" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="categorias">Categorias</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categorias">
              <div className="mb-4">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {categories.map((category, index) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                        <Card 
                          className={`h-24 cursor-pointer transition-colors ${selectedCategory === category.area ? 'border-netflix-red' : 'hover:border-netflix-red/70'}`}
                          onClick={() => setSelectedCategory(prev => prev === category.area ? null : category.area)}
                        >
                          <CardContent className="flex flex-col justify-center items-center h-full p-4">
                            <h3 className="font-medium text-center">{category.area}</h3>
                            <p className="text-sm text-muted-foreground">{category.count} cards</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-1" />
                  <CarouselNext className="right-1" />
                </Carousel>
              </div>
            </TabsContent>
            
            <TabsContent value="playlists">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <Card key={playlist.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-medium">{playlist.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{playlist.description || "Sem descrição"}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{playlist.flashcard_count} flashcards</span>
                          <Button variant="ghost" size="sm" className="p-0 h-auto">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma playlist de estudo</p>
                    <Button variant="outline" onClick={() => toast({ title: "Em breve", description: "Esta funcionalidade estará disponível em breve" })}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar Playlist
                    </Button>
                  </div>
                )}
              </div>
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
              {filteredSets.slice(0, 3).map((set, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium line-clamp-2 mb-2">{set.area} - {set.tema}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{set.lastReviewed}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold">{set.cards}</div>
                    </div>
                    <div className="w-full bg-secondary/30 h-2 rounded-full">
                      <div 
                        className="bg-netflix-red h-2 rounded-full" 
                        style={{ width: `${set.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-netflix-red" />
                        <span className="text-xs">{set.progress}% dominado</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto"
                        onClick={() => handleStudySet(set.area, set.tema)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Todos os conjuntos</h2>
            <div className="space-y-4">
              {filteredSets.map((set, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{set.area} - {set.tema}</h3>
                        <div className="text-sm text-muted-foreground">{set.area} • {set.cards} cards</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 hidden md:block">
                          <div className="text-xs text-muted-foreground mb-1">Progresso</div>
                          <div className="w-32 bg-secondary/30 h-2 rounded-full">
                            <div 
                              className="bg-netflix-red h-2 rounded-full" 
                              style={{ width: `${set.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStudySet(set.area, set.tema)}
                        >
                          Estudar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredSets.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-2">Nenhum conjunto de flashcards encontrado</p>
                  {searchQuery && <p className="text-sm">Tente outra busca ou categoria</p>}
                </div>
              )}
              
              {loading && (
                <div className="flex justify-center p-8">
                  <p>Carregando...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Flashcards;
