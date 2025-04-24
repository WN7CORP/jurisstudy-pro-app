
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Folder, FileText, Clock, CalendarDays } from "lucide-react";
import { PeticaoGenerator } from "@/components/peticionario/PeticaoGenerator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Tabela de Funções - Peticionario.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | Peticionario            | Componente principal da página do Peticionário                      |
 * | (Componente)            | gerencia estados e navegação entre abas                             |
 * | fetchPeticionModels     | Busca modelos de petições do banco de dados                         |
 * | (Função)                | recuperando modelos públicos e do usuário atual                      |
 * | savePeticao             | Salva uma petição gerada no armazenamento do usuário                |
 * | (Função)                | e opcionalmente compartilha como modelo público                     |
 * | handleSearch            | Filtra as petições com base na entrada de pesquisa                  |
 * | (Função)                | por título, tipo ou conteúdo                                        |
 * -------------------------------------------------------------------------------------------------
 */

interface PeticaoModel {
  id: string;
  tema: string;
  estrutura: string;
  conteudo_exemplo: string;
  criado_por: string;
  created_at: string;
}

interface UserPeticao {
  id: string;
  tipo: string;
  titulo: string;
  conteudo: string;
  data: string;
  area?: string;
}

const Peticionario: React.FC = () => {
  const [activeTab, setActiveTab] = useState("gerar");
  const [searchQuery, setSearchQuery] = useState("");
  const [peticoes, setPeticoes] = useState<UserPeticao[]>([]);
  const [peticaoModels, setPeticaoModels] = useState<PeticaoModel[]>([]);
  const [filteredPeticoes, setFilteredPeticoes] = useState<UserPeticao[]>([]);
  const [filteredModels, setFilteredModels] = useState<PeticaoModel[]>([]);
  const [selectedPeticao, setSelectedPeticao] = useState<UserPeticao | null>(null);
  const [selectedModel, setSelectedModel] = useState<PeticaoModel | null>(null);
  
  // Carregar petições e modelos salvos
  useEffect(() => {
    // Recuperar petições do localStorage do usuário
    const loadPeticoes = () => {
      const savedPeticoes = localStorage.getItem('user_peticoes');
      if (savedPeticoes) {
        try {
          setPeticoes(JSON.parse(savedPeticoes));
        } catch (error) {
          console.error("Erro ao carregar petições:", error);
        }
      }
    };
    
    loadPeticoes();
    fetchPeticaoModels();
  }, []);
  
  // Filtrar petições quando a busca mudar
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPeticoes(peticoes);
      setFilteredModels(peticaoModels);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    // Filtrar petições do usuário
    const matchingPeticoes = peticoes.filter(peticao => 
      peticao.titulo.toLowerCase().includes(query) || 
      peticao.tipo.toLowerCase().includes(query) || 
      peticao.conteudo.toLowerCase().includes(query)
    );
    
    // Filtrar modelos de petição
    const matchingModels = peticaoModels.filter(model => 
      model.tema.toLowerCase().includes(query) || 
      model.conteudo_exemplo.toLowerCase().includes(query) || 
      model.estrutura.toLowerCase().includes(query)
    );
    
    setFilteredPeticoes(matchingPeticoes);
    setFilteredModels(matchingModels);
  }, [searchQuery, peticoes, peticaoModels]);

  const fetchPeticaoModels = async () => {
    try {
      const { data, error } = await supabase
        .from('peticoes_modelo')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setPeticaoModels(data as PeticaoModel[]);
      setFilteredModels(data as PeticaoModel[]);
    } catch (error) {
      console.error("Erro ao buscar modelos de petições:", error);
      toast.error("Erro ao carregar modelos de petições");
    }
  };
  
  const savePeticao = (peticao: UserPeticao) => {
    // Gerar ID único para a petição
    const newPeticao = {
      ...peticao,
      id: `peticao-${Date.now()}`
    };
    
    // Adicionar à lista e salvar no localStorage
    const updatedPeticoes = [newPeticao, ...peticoes];
    setPeticoes(updatedPeticoes);
    localStorage.setItem('user_peticoes', JSON.stringify(updatedPeticoes));
    
    // Notificar o usuário
    toast.success("Petição salva com sucesso!");
    
    // Redirecionar para a aba 'Minhas Petições'
    setTimeout(() => {
      setActiveTab("minhas");
    }, 500);
  };
  
  const deletePeticao = (id: string) => {
    const updatedPeticoes = peticoes.filter(p => p.id !== id);
    setPeticoes(updatedPeticoes);
    localStorage.setItem('user_peticoes', JSON.stringify(updatedPeticoes));
    
    if (selectedPeticao?.id === id) {
      setSelectedPeticao(null);
    }
    
    toast.success("Petição excluída com sucesso!");
  };
  
  const viewPeticao = (peticao: UserPeticao) => {
    setSelectedPeticao(peticao);
    setSelectedModel(null);
  };
  
  const viewModel = (model: PeticaoModel) => {
    setSelectedModel(model);
    setSelectedPeticao(null);
  };
  
  const closeViewer = () => {
    setSelectedPeticao(null);
    setSelectedModel(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Peticionário</h1>
            <p className="text-muted-foreground">
              Crie e gerencie petições jurídicas com ajuda de IA
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="gerar">Gerar Petição</TabsTrigger>
                <TabsTrigger value="minhas">Minhas Petições</TabsTrigger>
                <TabsTrigger value="modelos">Modelos</TabsTrigger>
              </TabsList>
              
              {activeTab !== "gerar" && (
                <div className="flex items-center gap-2">
                  <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Buscar..." 
                      className="pl-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {activeTab === "minhas" && (
                    <Button onClick={() => setActiveTab("gerar")}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nova Petição
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <TabsContent value="gerar" className="mt-6">
              {selectedPeticao || selectedModel ? (
                <div className="space-y-4">
                  <Button variant="outline" onClick={closeViewer}>
                    Voltar para o gerador
                  </Button>
                  {selectedPeticao && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold">{selectedPeticao.titulo}</h2>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <FileText className="mr-1 h-4 w-4" />
                          {selectedPeticao.tipo}
                        </div>
                        {selectedPeticao.area && (
                          <div className="flex items-center">
                            <Folder className="mr-1 h-4 w-4" />
                            {selectedPeticao.area}
                          </div>
                        )}
                        <div className="flex items-center">
                          <CalendarDays className="mr-1 h-4 w-4" />
                          {new Date(selectedPeticao.data).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="whitespace-pre-line bg-card p-6 border rounded-lg text-sm">
                        {selectedPeticao.conteudo}
                      </div>
                    </div>
                  )}
                  {selectedModel && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold">{selectedModel.tema}</h2>
                      <Card>
                        <CardHeader>
                          <CardTitle>Estrutura do Modelo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="whitespace-pre-line text-sm">
                            {selectedModel.estrutura}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Exemplo de Conteúdo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="whitespace-pre-line text-sm">
                            {selectedModel.conteudo_exemplo}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                <PeticaoGenerator onSave={savePeticao} />
              )}
            </TabsContent>
            
            <TabsContent value="minhas" className="space-y-6 mt-6">
              {filteredPeticoes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPeticoes.map((peticao) => (
                    <Card key={peticao.id} className="hover:bg-secondary/10 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>{peticao.titulo}</CardTitle>
                            <CardDescription>{peticao.tipo}</CardDescription>
                          </div>
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {peticao.conteudo.substring(0, 150)}...
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <time dateTime={peticao.data}>
                            {new Date(peticao.data).toLocaleDateString()}
                          </time>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => viewPeticao(peticao)}>
                            Visualizar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePeticao(peticao.id)}>
                            Excluir
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma petição encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Nenhuma petição corresponde à sua busca." : "Você ainda não criou nenhuma petição."}
                  </p>
                  <Button onClick={() => setActiveTab("gerar")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Petição
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="modelos" className="space-y-6 mt-6">
              {filteredModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredModels.map((model) => (
                    <Card key={model.id} className="hover:bg-secondary/10 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle>{model.tema}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {model.estrutura.substring(0, 150)}...
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <time dateTime={model.created_at}>
                            {new Date(model.created_at).toLocaleDateString()}
                          </time>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => viewModel(model)}>
                          Visualizar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum modelo encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Nenhum modelo corresponde à sua busca." : "Não há modelos de petição disponíveis."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Peticionario;
