
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Film, Award, PlayCircle } from "lucide-react";
import { JurisflixCard, JurisflixContentProps } from "@/components/jurisflix/JurisflixCard";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getJurisflixRecommendations } from "@/utils/geminiAI";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { JurisflixContent } from "@/types/supabase";

/**
 * Tabela de Funções - Jurisflix.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | Jurisflix               | Componente principal para página de recomendações de filmes/séries  |
 * | (Componente)            | jurídicas com navegação, pesquisa e filtros                         |
 * | fetchJurisflixContent   | Busca conteúdos do banco de dados usando React Query                |
 * | (Query Function)        | com suporte a atualização e filtragem                               |
 * | handleAiRecommendations | Solicita recomendações personalizadas da IA baseadas em um tema     |
 * | (Função)                | e exibe para o usuário em uma seção especial                        |
 * | filterContent           | Filtra o conteúdo com base nos critérios de busca e filtros         |
 * | (Função)                | aplicando filtragem por texto, tipos e temas                        |
 * | handleSelectContent     | Manipula a seleção de um conteúdo pelo usuário                      |
 * | (Função)                | simulando redirecionamento para plataforma de streaming             |
 * -------------------------------------------------------------------------------------------------
 */

const Jurisflix: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [filteredContent, setFilteredContent] = useState<JurisflixContentProps[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null);
  const [aiRecommendationTheme, setAiRecommendationTheme] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [typeFilters, setTypeFilters] = useState({
    filme: true,
    série: true,
    documentário: true
  });
  const [themeFilters, setThemeFilters] = useState<string[]>([]);
  const [allThemes, setAllThemes] = useState<string[]>([]);
  
  // Fetch Jurisflix content from database
  const { data: jurisflixContent, isLoading, error } = useQuery({
    queryKey: ['jurisflix-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jurisflix_conteudos')
        .select('*')
        .order('titulo');
      
      if (error) {
        throw error;
      }
      
      // Extract all unique themes
      if (data) {
        // Tratar os dados como JurisflixContent
        const typedData = data as unknown as JurisflixContent[];
        const themes = typedData.flatMap(item => item.temas_juridicos || []);
        const uniqueThemes = [...new Set(themes)].sort();
        setAllThemes(uniqueThemes);
        
        return typedData;
      }
      
      return [] as JurisflixContent[];
    }
  });

  // Filter content based on search, tab, and filters
  useEffect(() => {
    if (!jurisflixContent) return;
    
    let filtered = jurisflixContent;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.titulo.toLowerCase().includes(query) || 
        item.sinopse.toLowerCase().includes(query) ||
        (item.temas_juridicos?.some(tema => tema.toLowerCase().includes(query)) ?? false)
      );
    }
    
    // Apply tab filter
    if (selectedTab !== "all") {
      filtered = filtered.filter(item => item.tipo === selectedTab);
    }
    
    // Apply type filters
    filtered = filtered.filter(item => typeFilters[item.tipo as keyof typeof typeFilters]);
    
    // Apply theme filters
    if (themeFilters.length > 0) {
      filtered = filtered.filter(item => 
        item.temas_juridicos?.some(tema => themeFilters.includes(tema)) ?? false
      );
    }
    
    setFilteredContent(filtered);
  }, [jurisflixContent, searchQuery, selectedTab, typeFilters, themeFilters]);

  // Reset filters
  const resetFilters = () => {
    setTypeFilters({
      filme: true,
      série: true,
      documentário: true
    });
    setThemeFilters([]);
  };
  
  // Request AI recommendations
  const handleAiRecommendations = async () => {
    if (!aiRecommendationTheme.trim()) {
      toast.error("Por favor, insira um tema para obter recomendações");
      return;
    }
    
    setLoadingAi(true);
    try {
      const recommendations = await getJurisflixRecommendations(aiRecommendationTheme);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("Erro ao obter recomendações:", error);
      toast.error("Não foi possível obter recomendações. Tente novamente mais tarde.");
    } finally {
      setLoadingAi(false);
    }
  };
  
  // Handle content selection
  const handleSelectContent = (content: JurisflixContentProps) => {
    if (content.onde_assistir && content.onde_assistir.length > 0) {
      toast.info(`Redirecionando para ${content.onde_assistir[0]}...`, {
        description: "Esta funcionalidade simularia o redirecionamento para a plataforma de streaming."
      });
    } else {
      toast.info("Assistir", {
        description: "Este conteúdo não está disponível em plataformas de streaming conhecidas."
      });
    }
  };

  // Toggle theme filter
  const toggleThemeFilter = (theme: string) => {
    setThemeFilters(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme) 
        : [...prev, theme]
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin mr-2">
            <Film className="h-6 w-6" />
          </div>
          <span>Carregando conteúdo...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar conteúdo</p>
          <p className="text-muted-foreground">Tente novamente mais tarde</p>
        </div>
      );
    }

    if (filteredContent.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg font-semibold">Nenhum conteúdo encontrado</p>
          <p className="text-muted-foreground">
            Tente ajustar sua busca ou filtros
          </p>
          {filterActive && (
            <Button variant="ghost" onClick={resetFilters} className="mt-4">
              Limpar filtros
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredContent.map((item) => (
          <JurisflixCard 
            key={item.id} 
            content={item} 
            onSelect={handleSelectContent}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Jurisflix</h1>
          <p className="text-muted-foreground">
            Descubra filmes, séries e documentários relacionados ao direito
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Buscar por título, tema ou descrição..." 
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Filtre o conteúdo por tipo e temas jurídicos
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Tipo de conteúdo</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filme" 
                        checked={typeFilters.filme} 
                        onCheckedChange={(checked) => {
                          setTypeFilters(prev => ({...prev, filme: checked === true}));
                          setFilterActive(true);
                        }} 
                      />
                      <Label htmlFor="filme">Filmes</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="série" 
                        checked={typeFilters.série} 
                        onCheckedChange={(checked) => {
                          setTypeFilters(prev => ({...prev, série: checked === true}));
                          setFilterActive(true);
                        }} 
                      />
                      <Label htmlFor="série">Séries</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="documentário" 
                        checked={typeFilters.documentário} 
                        onCheckedChange={(checked) => {
                          setTypeFilters(prev => ({...prev, documentário: checked === true}));
                          setFilterActive(true);
                        }} 
                      />
                      <Label htmlFor="documentário">Documentários</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Temas Jurídicos</h3>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {allThemes.map(theme => (
                      <div key={theme} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`theme-${theme}`} 
                          checked={themeFilters.includes(theme)}
                          onCheckedChange={() => {
                            toggleThemeFilter(theme);
                            setFilterActive(true);
                          }}
                        />
                        <Label htmlFor={`theme-${theme}`}>{theme}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={resetFilters}>
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">Tudo</TabsTrigger>
            <TabsTrigger value="filme">Filmes</TabsTrigger>
            <TabsTrigger value="série">Séries</TabsTrigger>
            <TabsTrigger value="documentário">Documentários</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Destaque carrossel */}
        {!searchQuery && !filterActive && filteredContent.length > 0 && (
          <div className="py-4">
            <h2 className="text-2xl font-semibold mb-4">Em Destaque</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {filteredContent.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-1 basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="relative h-[300px] rounded-lg overflow-hidden">
                      {item.poster_url ? (
                        <img 
                          src={item.poster_url} 
                          alt={item.titulo} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Film className="h-24 w-24 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-xl font-bold">{item.titulo}</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <span>{item.ano}</span>
                          {item.rating && (
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1">{item.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <span className="capitalize">{item.tipo}</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleSelectContent(item)}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Assistir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        )}

        {/* IA Recommendations */}
        <div className="py-4 bg-primary/5 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="flex items-center">
              <Award className="h-6 w-6 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Recomendações Personalizadas</h2>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2 sm:mt-0"
            >
              Ver histórico
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <Input 
                placeholder="Digite um tema jurídico de interesse..." 
                value={aiRecommendationTheme}
                onChange={(e) => setAiRecommendationTheme(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAiRecommendations}
              disabled={loadingAi || !aiRecommendationTheme.trim()}
            >
              {loadingAi ? 'Gerando...' : 'Recomendar'}
            </Button>
          </div>
          
          {aiRecommendations && (
            <div className="mt-4 p-4 bg-card border rounded-lg">
              <h3 className="font-semibold mb-2">Recomendações para: {aiRecommendationTheme}</h3>
              <div className="prose max-w-none text-sm">
                <div dangerouslySetInnerHTML={{ __html: aiRecommendations.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          )}
        </div>

        {/* Main content grid */}
        <div className="py-4">
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery 
              ? `Resultados para "${searchQuery}"` 
              : selectedTab === "all" 
                ? "Todo o Conteúdo" 
                : `${selectedTab === "filme" ? "Filmes" : selectedTab === "série" ? "Séries" : "Documentários"}`}
          </h2>
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default Jurisflix;
