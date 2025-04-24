
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Search, Grid, List } from "lucide-react";
import { toast } from "sonner";
import { MapaMentalCreator } from "@/components/mapas-mentais/MapaMentalCreator";
import { MapaMentalViewer } from "@/components/mapas-mentais/MapaMentalViewer";
import { supabase } from "@/integrations/supabase/client";

/**
 * Tabela de Funções - MapasMentais.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | MapasMentais            | Componente principal da página de mapas mentais                     |
 * | (Componente)            | gerencia estados, visualização e criação de mapas mentais           |
 * | fetchMindMaps           | Busca mapas mentais do banco de dados                               |
 * | (Função)                | filtrando por usuário atual e mapas públicos                        |
 * | handleCreateMap         | Trata a criação de um novo mapa mental                              |
 * | (Função)                | adicionando ao estado local e alternando para visualização          |
 * | handleSelectMap         | Seleciona um mapa mental para visualização                          |
 * | (Função)                | definindo-o como o mapa atual e alternando para visualização        |
 * | filterMaps              | Filtra mapas mentais com base na busca                              |
 * | (Função)                | para localizar mapas por título ou área                             |
 * -------------------------------------------------------------------------------------------------
 */

interface MapNode {
  nome: string;
  descricao?: string;
  filhos?: MapNode[];
}

interface MapaMentalData {
  id: string;
  titulo: string;
  area_direito: string;
  estrutura: {
    central: string;
    filhos: MapNode[];
  };
  criado_por: string;
  criado_por_ia: boolean;
  publico: boolean;
  created_at: string;
}

const MapasMentais: React.FC = () => {
  const [mapas, setMapas] = useState<MapaMentalData[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMap, setSelectedMap] = useState<MapaMentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("navegar");

  useEffect(() => {
    fetchMindMaps();
  }, []);

  const fetchMindMaps = async () => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      let query = supabase
        .from('mapas_mentais')
        .select('*');
      
      if (userId) {
        // Buscar mapas do usuário + mapas públicos
        query = query.or(`criado_por.eq.${userId},publico.eq.true`);
      } else {
        // Apenas mapas públicos se não estiver logado
        query = query.eq('publico', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setMapas(data as MapaMentalData[]);
      }
    } catch (error) {
      console.error("Erro ao buscar mapas mentais:", error);
      toast.error("Erro ao carregar mapas mentais");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMap = (mapData: any) => {
    // Quando um novo mapa é criado via IA, adicionamos à lista
    const newMap = {
      id: Date.now().toString(), // Temporário até ser salvo no banco
      titulo: mapData.title,
      area_direito: mapData.area,
      estrutura: mapData.content,
      criado_por: 'local',
      criado_por_ia: true,
      publico: false,
      created_at: new Date().toISOString()
    };
    
    setMapas(prevMapas => [newMap, ...prevMapas]);
    setSelectedMap(newMap);
    setActiveTab("visualizar");
  };

  const handleSelectMap = (map: MapaMentalData) => {
    setSelectedMap(map);
    setActiveTab("visualizar");
  };

  const filteredMaps = mapas.filter(map => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      map.titulo.toLowerCase().includes(query) ||
      map.area_direito.toLowerCase().includes(query)
    );
  });

  const renderMapCard = (map: MapaMentalData) => (
    <Card 
      key={map.id} 
      className="cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={() => handleSelectMap(map)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{map.titulo}</CardTitle>
        <CardDescription>{map.area_direito}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex justify-center">
        <Brain className="h-16 w-16 text-muted-foreground" />
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <span>{new Date(map.created_at).toLocaleDateString()}</span>
        <span>{map.publico ? "Público" : "Privado"}</span>
      </CardFooter>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Mapas Mentais</h1>
            <p className="text-muted-foreground">
              Visualize conceitos jurídicos de forma interativa
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="navegar">Navegar</TabsTrigger>
                <TabsTrigger value="criar">Criar Mapa</TabsTrigger>
                {selectedMap && (
                  <TabsTrigger value="visualizar">Visualizar</TabsTrigger>
                )}
              </TabsList>
              
              {activeTab === "navegar" && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <TabsContent value="navegar" className="space-y-4">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Buscar mapas mentais..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <p>Carregando mapas mentais...</p>
                </div>
              ) : filteredMaps.length > 0 ? (
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "flex flex-col gap-4"
                }>
                  {filteredMaps.map(map => 
                    viewMode === "grid" ? renderMapCard(map) : (
                      <Card 
                        key={map.id} 
                        className="cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => handleSelectMap(map)}
                      >
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{map.titulo}</CardTitle>
                              <CardDescription>{map.area_direito}</CardDescription>
                            </div>
                            <Brain className="h-10 w-10 text-muted-foreground" />
                          </div>
                        </CardHeader>
                      </Card>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery ? "Nenhum mapa mental encontrado para sua busca" : "Não há mapas mentais disponíveis"}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("criar")} 
                    className="mt-4"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Criar seu primeiro mapa mental
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="criar">
              <MapaMentalCreator onCreateMap={handleCreateMap} />
            </TabsContent>
            
            <TabsContent value="visualizar">
              {selectedMap && (
                <MapaMentalViewer 
                  data={selectedMap.estrutura} 
                  title={selectedMap.titulo} 
                  area={selectedMap.area_direito} 
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default MapasMentais;
