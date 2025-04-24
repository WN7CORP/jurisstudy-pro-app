
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Loader2, Download, Copy } from "lucide-react";
import { sendMessageToGemini } from "@/utils/geminiAI";
import { toast } from "sonner";

/**
 * Tabela de Funções - Peticionario.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | Peticionario            | Componente principal da página de geração de petições jurídicas     |
 * | (Componente)            | que permite criar modelos de petições usando IA                     |
 * | PeticaoForm             | Formulário para inserção de detalhes da petição a ser gerada        |
 * | (Componente)            |                                                                     |
 * | PeticaoPreview          | Componente que exibe a visualização da petição gerada com opções    |
 * | (Componente)            | para download e cópia do conteúdo                                   |
 * | generatePeticao         | Função que gera uma petição jurídica usando IA com base nos dados   |
 * | (Função)                | fornecidos pelo usuário                                             |
 * -------------------------------------------------------------------------------------------------
 */

// Componente para exibir a visualização da petição gerada
const PeticaoPreview: React.FC<{ content: string; onReset: () => void }> = ({ content, onReset }) => {
  // Função para copiar o conteúdo da petição para a área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast.success("Petição copiada para a área de transferência");
      })
      .catch((err) => {
        console.error("Erro ao copiar petição:", err);
        toast.error("Erro ao copiar. Tente selecionar o texto manualmente.");
      });
  };

  // Função para "baixar" o texto como um arquivo .txt
  const downloadAsFile = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "peticao.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Petição baixada como arquivo de texto");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Petição Gerada</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAsFile}>
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-muted/50 rounded-md max-h-[500px] overflow-y-auto">
            {content}
          </pre>
        </CardContent>
      </Card>
      
      <Button onClick={onReset} className="w-full">
        Criar Nova Petição
      </Button>
    </div>
  );
};

// Formulário para inserção de detalhes da petição
const PeticaoForm: React.FC<{ onSubmit: (data: any) => Promise<void> }> = ({ onSubmit }) => {
  const [tipo, setTipo] = useState("");
  const [tema, setTema] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [loading, setLoading] = useState(false);

  // Tipos de petições disponíveis
  const tiposPeticao = [
    { value: "inicial", label: "Petição Inicial" },
    { value: "recurso", label: "Recurso" },
    { value: "contestacao", label: "Contestação" },
    { value: "habeas-corpus", label: "Habeas Corpus" },
    { value: "mandado-seguranca", label: "Mandado de Segurança" },
    { value: "embargo", label: "Embargos" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipo || !tema) {
      toast.error("Preencha pelo menos o tipo e o tema da petição");
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit({ tipo, tema, detalhes });
    } catch (error) {
      console.error("Erro ao gerar petição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Petição</Label>
        <Select value={tipo} onValueChange={setTipo} disabled={loading}>
          <SelectTrigger id="tipo">
            <SelectValue placeholder="Selecione o tipo de petição" />
          </SelectTrigger>
          <SelectContent>
            {tiposPeticao.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tema">Tema/Assunto</Label>
        <Input
          id="tema"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: Indenização por danos morais"
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="detalhes">Detalhes Adicionais (opcional)</Label>
        <Textarea
          id="detalhes"
          value={detalhes}
          onChange={(e) => setDetalhes(e.target.value)}
          placeholder="Forneça detalhes específicos para personalizar a petição"
          disabled={loading}
          rows={5}
        />
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
  );
};

const Peticionario: React.FC = () => {
  const [geracoes, setGeracoes] = useState<{id: string; data: any; content: string}[]>([]);
  const [peticaoGerada, setPeticaoGerada] = useState<string | null>(null);

  // Função para gerar a petição com IA
  const generatePeticao = async (data: any) => {
    const { tipo, tema, detalhes } = data;
    
    try {
      toast.loading("Gerando modelo de petição...");
      
      const tipoLabel = tiposPeticao.find(t => t.value === tipo)?.label || tipo;
      
      const prompt = `
        Preciso que você crie um modelo de ${tipoLabel} sobre "${tema}".
        
        ${detalhes ? `Detalhes adicionais: ${detalhes}` : ''}
        
        A petição deve incluir:
        1. Cabeçalho com espaço para inserção de informações do juízo
        2. Qualificação das partes
        3. Nome da ação
        4. Fatos relevantes
        5. Fundamentação jurídica apropriada com citações de leis e jurisprudência
        6. Pedidos claros e diretos
        7. Fechamento formal
        
        Mantenha um formato profissional e use linguagem jurídica apropriada.
      `;
      
      const content = await sendMessageToGemini(
        [{ role: 'user', content: prompt }],
        'peticao'
      );
      
      toast.dismiss();
      toast.success("Petição gerada com sucesso");
      
      setPeticaoGerada(content);
      
      // Adicionar à lista de gerações
      const newGeracao = {
        id: Date.now().toString(),
        data,
        content
      };
      
      setGeracoes([newGeracao, ...geracoes]);
      
    } catch (error) {
      toast.dismiss();
      toast.error("Erro ao gerar petição", {
        description: "Tente novamente mais tarde."
      });
      console.error("Erro ao gerar petição:", error);
    }
  };

  const resetForm = () => {
    setPeticaoGerada(null);
  };

  // Lista de tipos de petições para o rótulo correto
  const tiposPeticao = [
    { value: "inicial", label: "Petição Inicial" },
    { value: "recurso", label: "Recurso" },
    { value: "contestacao", label: "Contestação" },
    { value: "habeas-corpus", label: "Habeas Corpus" },
    { value: "mandado-seguranca", label: "Mandado de Segurança" },
    { value: "embargo", label: "Embargos" }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Peticionário</h1>
            <p className="text-muted-foreground">
              Modelos e assistente para criação de petições
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Gerador de Petições</CardTitle>
                  <CardDescription>
                    Crie modelos de petições jurídicas usando nosso assistente de IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!peticaoGerada ? (
                    <PeticaoForm onSubmit={generatePeticao} />
                  ) : (
                    <PeticaoPreview content={peticaoGerada} onReset={resetForm} />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Biblioteca de Modelos</CardTitle>
                  <CardDescription>
                    A biblioteca de petições estará disponível em breve. Por enquanto, 
                    você pode gerar novos modelos usando nosso assistente de IA.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Biblioteca de Modelos</h3>
                    <p className="text-muted-foreground mb-4">
                      Essa funcionalidade estará disponível em breve. 
                      Enquanto isso, use o gerador de petições para criar modelos personalizados.
                    </p>
                    <Button variant="outline" disabled>
                      Ver Biblioteca (Em breve)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Peticionario;
