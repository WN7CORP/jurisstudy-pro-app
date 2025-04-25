
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { Loader2, Brain, Save, Download } from "lucide-react";
import { toast } from "sonner";
import { generateMindMap } from "@/utils/geminiAI";
import { supabase } from "@/integrations/supabase/client";
import { MapNode } from "@/types/supabase";

/**
 * Tabela de Funções - MapaMentalCreator.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | MapaMentalCreator       | Componente para criação de novos mapas mentais com suporte          |
 * | (Componente)            | a geração por IA e salvamento no banco de dados                     |
 * | handleSubmit            | Processa o formulário e gera o mapa mental usando IA               |
 * | (Função)                | Salva o resultado no banco de dados se o usuário estiver autenticado|
 * | saveMapToDatabase       | Salva o mapa mental gerado no banco de dados                        |
 * | (Função)                | com os metadados do usuário e configurações                         |
 * | downloadMapAsJson       | Baixa o mapa mental como arquivo JSON                               |
 * | (Função)                | para uso offline ou backup                                          |
 * -------------------------------------------------------------------------------------------------
 */

interface MapaMentalCreatorProps {
  onCreateMap?: (data: any) => void;
}

interface MindMapData {
  central: string;
  filhos: MapNode[];
}

export const MapaMentalCreator: React.FC<MapaMentalCreatorProps> = ({ onCreateMap }) => {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedMap, setGeneratedMap] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !area || !topic) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      // Gerar conteúdo usando IA
      toast.loading("Gerando mapa mental com IA...");
      
      const mindMapData = await generateMindMap(topic, area);
      
      setGeneratedMap({
        title,
        area,
        content: mindMapData,
        createdBy: 'ai'
      });
      
      toast.dismiss();
      toast.success("Mapa mental gerado com sucesso!");
      
      // Notificar o componente pai se existir
      if (onCreateMap) {
        onCreateMap({
          title,
          area,
          content: mindMapData,
          createdBy: 'ai'
        });
      }
      
    } catch (error) {
      console.error("Erro ao gerar mapa mental:", error);
      toast.error("Erro ao gerar mapa mental", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMapToDatabase = async () => {
    if (!generatedMap) return;
    
    setSaving(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session || !session.session) {
        toast.error("Você precisa estar logado para salvar mapas mentais");
        return;
      }
      
      const userId = session.session.user.id;
      
      // Usar o método customInsert para inserir na tabela mapas_mentais
      const { error } = await supabase
        .from('mapas_mentais')
        .insert({
          titulo: title,
          area_direito: area,
          estrutura: generatedMap.content,
          criado_por: userId,
          criado_por_ia: true,
          publico: false
        });
      
      if (error) {
        throw error;
      }
      
      toast.success("Mapa mental salvo com sucesso!");
      
      // Limpar formulário após salvar
      setTitle("");
      setArea("");
      setTopic("");
      setGeneratedMap(null);
      
    } catch (error: any) {
      console.error("Erro ao salvar mapa mental:", error);
      toast.error("Erro ao salvar mapa mental", {
        description: error.message || "Tente novamente mais tarde."
      });
    } finally {
      setSaving(false);
    }
  };
  
  const downloadMapAsJson = () => {
    if (!generatedMap) return;
    
    const jsonString = JSON.stringify(generatedMap.content, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_mapa_mental.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Arquivo JSON baixado com sucesso!");
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
        {!generatedMap ? (
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
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Mapa Mental Gerado:</h3>
              <div className="bg-secondary/30 p-4 rounded-md text-sm overflow-auto max-h-60">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(generatedMap.content, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {generatedMap && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={downloadMapAsJson}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar JSON
          </Button>
          <Button 
            onClick={saveMapToDatabase}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Mapa Mental
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
