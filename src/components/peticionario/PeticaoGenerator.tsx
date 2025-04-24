
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Download, Save } from "lucide-react";
import { toast } from "sonner";
import { generateLegalPetition } from "@/utils/geminiAI";

/**
 * Tabela de Funções - PeticaoGenerator.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | PeticaoGenerator        | Componente para gerar petições jurídicas utilizando IA             |
 * | (Componente)            | com formulário para tipo, área e fatos                              |
 * | handleSubmit            | Processa o formulário e gera a petição usando IA                    |
 * | (Função)                | validando campos obrigatórios e chamando a API                      |
 * | downloadPeticao         | Exporta a petição gerada como documento de texto                    |
 * | (Função)                | permitindo ao usuário salvar localmente                             |
 * | renderPeticao           | Renderiza a petição formatada para visualização                     |
 * | (Função)                | com estilização e divisão por seções                                |
 * -------------------------------------------------------------------------------------------------
 */

interface PeticaoGeneratorProps {
  onSave?: (peticao: any) => void;
}

export const PeticaoGenerator: React.FC<PeticaoGeneratorProps> = ({ onSave }) => {
  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState("");
  const [titulo, setTitulo] = useState("");
  const [fatos, setFatos] = useState("");
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipo || !area || !fatos) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setLoading(true);
    try {
      toast.loading("Gerando petição...");
      
      const peticao = await generateLegalPetition(tipo, fatos, area);
      
      setPeticaoGerada(peticao);
      toast.dismiss();
      toast.success("Petição gerada com sucesso!");
      
      // Scroll para a petição gerada
      setTimeout(() => {
        const peticaoElement = document.getElementById('peticao-gerada');
        if (peticaoElement) {
          peticaoElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error("Erro ao gerar petição:", error);
      toast.error("Erro ao gerar petição", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const downloadPeticao = () => {
    if (!peticaoGerada) return;
    
    const blob = new Blob([peticaoGerada], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tipo.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Petição baixada com sucesso!");
  };
  
  const savePeticao = () => {
    if (!peticaoGerada || !onSave) return;
    
    onSave({
      tipo,
      area,
      titulo: titulo || `${tipo} - ${new Date().toLocaleDateString()}`,
      conteudo: peticaoGerada,
      data: new Date().toISOString()
    });
    
    toast.success("Petição salva com sucesso!");
  };
  
  const renderPeticao = () => {
    if (!peticaoGerada) return null;
    
    // Dividir a petição em seções para melhor formatação
    const sections = peticaoGerada.split(/\n\n|\r\n\r\n/);
    
    return (
      <div className="whitespace-pre-line bg-card p-6 border rounded-lg text-sm">
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            {section}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Assistente de Petições</CardTitle>
          <CardDescription>
            Gere petições jurídicas personalizadas usando nossa IA especializada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Petição *</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petição Inicial">Petição Inicial</SelectItem>
                    <SelectItem value="Contestação">Contestação</SelectItem>
                    <SelectItem value="Recurso de Apelação">Recurso de Apelação</SelectItem>
                    <SelectItem value="Agravo de Instrumento">Agravo de Instrumento</SelectItem>
                    <SelectItem value="Habeas Corpus">Habeas Corpus</SelectItem>
                    <SelectItem value="Mandado de Segurança">Mandado de Segurança</SelectItem>
                    <SelectItem value="Embargos de Declaração">Embargos de Declaração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="area">Área do Direito *</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direito Civil">Direito Civil</SelectItem>
                    <SelectItem value="Direito Penal">Direito Penal</SelectItem>
                    <SelectItem value="Direito do Trabalho">Direito do Trabalho</SelectItem>
                    <SelectItem value="Direito Administrativo">Direito Administrativo</SelectItem>
                    <SelectItem value="Direito Tributário">Direito Tributário</SelectItem>
                    <SelectItem value="Direito do Consumidor">Direito do Consumidor</SelectItem>
                    <SelectItem value="Direito Constitucional">Direito Constitucional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da Petição</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Petição de Indenização por Danos Morais"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fatos">Fatos e Circunstâncias *</Label>
              <Textarea
                id="fatos"
                value={fatos}
                onChange={(e) => setFatos(e.target.value)}
                placeholder="Descreva os fatos relevantes para a petição, incluindo datas, locais, pessoas envolvidas e o objeto da ação..."
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                * Quanto mais detalhes você fornecer, melhor será a qualidade da petição gerada.
              </p>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Petição...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Petição
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {peticaoGerada && (
        <div id="peticao-gerada" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Petição Gerada</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadPeticao}>
                <Download className="mr-2 h-4 w-4" />
                Baixar
              </Button>
              {onSave && (
                <Button onClick={savePeticao}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              )}
            </div>
          </div>
          
          {renderPeticao()}
        </div>
      )}
    </div>
  );
};
