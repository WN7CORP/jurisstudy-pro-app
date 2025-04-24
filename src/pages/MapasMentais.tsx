
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { Loader2, Brain, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { sendMessageToGemini } from "@/utils/geminiAI";

/**
 * Tabela de Funções - MapasMentais.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | MapasMentais            | Componente principal da página de mapas mentais que permite         |
 * | (Componente)            | criar e visualizar mapas mentais jurídicos                          |
 * | generateMindMap         | Função que gera um mapa mental usando IA com base no tema           |
 * | (Função)                | jurídico fornecido                                                  |
 * | MindMapCreator          | Componente para criação de novos mapas mentais com suporte          |
 * | (Componente)            | a geração por IA                                                    |
 * | MindMapCard             | Componente que exibe um card para um mapa mental existente          |
 * | (Componente)            |                                                                     |
 * -------------------------------------------------------------------------------------------------
 */

// Componente de card para exibir mapas mentais
const MindMapCard: React.FC<{ 
  title: string; 
  area: string; 
  onClick: () => void 
}> = ({ title, area, onClick }) => {
  return (
    <Card className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{area}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex justify-center">
        <Brain className="h-20 w-20 text-muted-foreground" />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}>
          Visualizar
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente para criar novos mapas mentais
const MindMapCreator: React.FC<{ onCreateMap: (data: any) => void }> = ({ onCreateMap }) => {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !area || !topic) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      // Gerar conteúdo usando IA
      const prompt = `Crie um mapa mental detalhado sobre o tema jurídico: "${topic}" na área de ${area}.`;
      
      toast.loading("Gerando mapa mental com IA...");
      
      const content = await sendMessageToGemini(
        [{ role: 'user', content: prompt }],
        'mapamental'
      );
      
      toast.dismiss();
      toast.success("Mapa mental gerado com sucesso!");
      
      onCreateMap({
        title,
        area,
        content,
        createdBy: 'ai'
      });
      
      // Limpar formulário
      setTitle("");
      setArea("");
      setTopic("");
    } catch (error) {
      console.error("Erro ao gerar mapa mental:", error);
      toast.error("Erro ao gerar mapa mental", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Mapa Mental</CardTitle>
        <CardDescription>
          Gere mapas mentais para temas jurídicos usando nossa IA especializada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Mapa Mental</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Princípios do Direito Constitucional"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area">Área do Direito</Label>
            <Input
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ex: Direito Constitucional"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Tema Específico</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Descreva o tema específico que deseja mapear"
              disabled={loading}
              rows={3}
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando Mapa Mental...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Gerar com IA
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const MapasMentais: React.FC = () => {
  // Mapas mentais de exemplo (até implementar banco de dados)
  const [maps, setMaps] = useState([
    {
      id: '1',
      title: 'Princípios Constitucionais',
      area: 'Direito Constitucional',
      content: 'Conteúdo do mapa mental sobre Princípios Constitucionais'
    },
    {
      id: '2',
      title: 'Tipos de Contratos',
      area: 'Direito Civil',
      content: 'Conteúdo do mapa mental sobre Tipos de Contratos'
    }
  ]);

  const handleCreateMap = (mapData: any) => {
    const newMap = {
      id: Date.now().toString(),
      ...mapData
    };
    
    setMaps([newMap, ...maps]);
    toast.success("Mapa mental criado com sucesso");
  };

  const handleOpenMap = (id: string) => {
    const map = maps.find(m => m.id === id);
    if (map) {
      // Apenas exibir uma mensagem por enquanto
      // Futuramente implementar visualizador de mapa mental
      toast.info(`Visualizando mapa: ${map.title}`, {
        description: "Visualizador de mapas mentais será implementado em breve."
      });
    }
  };

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Criador de mapas mentais */}
            <MindMapCreator onCreateMap={handleCreateMap} />
            
            {/* Mapas existentes */}
            {maps.map((map) => (
              <MindMapCard
                key={map.id}
                title={map.title}
                area={map.area}
                onClick={() => handleOpenMap(map.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapasMentais;
