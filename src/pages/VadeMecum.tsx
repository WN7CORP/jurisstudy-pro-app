
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, BookmarkIcon, Star, StarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LawArticleProps {
  code: string;
  title: string;
  number: string;
  content: string;
  isFavorite?: boolean;
}

const LawArticle: React.FC<LawArticleProps> = ({
  code,
  title,
  number,
  content,
  isFavorite = false
}) => {
  const [favorite, setFavorite] = useState(isFavorite);

  return (
    <div className="border-b border-netflix-darkGray pb-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-medium text-netflix-offWhite">
            Art. {number}
          </h3>
          <p className="text-xs text-muted-foreground">{code} - {title}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setFavorite(!favorite)}
        >
          {favorite ? (
            <StarIcon className="h-5 w-5 text-netflix-red" />
          ) : (
            <Star className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="text-sm">{content}</p>
      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Copiar
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

const codigos = [
  { id: "cf", label: "Constituição Federal" },
  { id: "cc", label: "Código Civil" },
  { id: "cp", label: "Código Penal" },
  { id: "cpc", label: "Código de Processo Civil" },
  { id: "cpp", label: "Código de Processo Penal" },
  { id: "clt", label: "CLT" },
  { id: "cdc", label: "Código de Defesa do Consumidor" },
];

const artigos = [
  {
    code: "Constituição Federal",
    title: "Dos Direitos e Garantias Fundamentais",
    number: "5º",
    content: "Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade, nos termos seguintes:",
    isFavorite: true
  },
  {
    code: "Código Civil",
    title: "Da Personalidade e da Capacidade",
    number: "2º",
    content: "A personalidade civil da pessoa começa do nascimento com vida; mas a lei põe a salvo, desde a concepção, os direitos do nascituro.",
    isFavorite: false
  },
  {
    code: "Código Penal",
    title: "Da Aplicação da Lei Penal",
    number: "1º",
    content: "Não há crime sem lei anterior que o defina. Não há pena sem prévia cominação legal.",
    isFavorite: true
  },
  {
    code: "Código de Processo Civil",
    title: "Das Normas Fundamentais e da Aplicação das Normas Processuais",
    number: "1º",
    content: "O processo civil será ordenado, disciplinado e interpretado conforme os valores e as normas fundamentais estabelecidos na Constituição da República Federativa do Brasil, observando-se as disposições deste Código.",
    isFavorite: false
  }
];

const VadeMecum = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-netflix-offWhite">Vade-Mecum Digital</h1>
          <Button variant="outline" size="sm" className="h-8">
            <BookmarkIcon className="h-4 w-4 mr-1" />
            Meus Favoritos
          </Button>
        </div>

        <div className="bg-netflix-darkGray/50 rounded-lg p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-3">Buscar na Legislação</h2>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Pesquisar por artigo, palavra-chave ou número..."
                  className="pl-8 bg-secondary/40 border-secondary/60"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-3">Filtrar por Código</h2>
              <div className="flex flex-wrap gap-2">
                {codigos.map((codigo) => (
                  <Button
                    key={codigo.id}
                    variant="outline"
                    size="sm"
                    className="h-8 bg-secondary/20"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    {codigo.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="populares">
          <TabsList className="mb-4 bg-secondary/20">
            <TabsTrigger 
              value="populares" 
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Artigos Populares
            </TabsTrigger>
            <TabsTrigger 
              value="favoritos" 
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Meus Favoritos
            </TabsTrigger>
            <TabsTrigger 
              value="recentes" 
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Recentes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="populares" className="mt-0">
            <div className="divide-y divide-netflix-darkGray">
              {artigos.map((artigo) => (
                <LawArticle
                  key={`${artigo.code}-${artigo.number}`}
                  code={artigo.code}
                  title={artigo.title}
                  number={artigo.number}
                  content={artigo.content}
                  isFavorite={artigo.isFavorite}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favoritos" className="mt-0">
            <div className="divide-y divide-netflix-darkGray">
              {artigos
                .filter((artigo) => artigo.isFavorite)
                .map((artigo) => (
                  <LawArticle
                    key={`${artigo.code}-${artigo.number}`}
                    code={artigo.code}
                    title={artigo.title}
                    number={artigo.number}
                    content={artigo.content}
                    isFavorite={artigo.isFavorite}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recentes" className="mt-0">
            <div className="divide-y divide-netflix-darkGray">
              {artigos.slice(2).map((artigo) => (
                <LawArticle
                  key={`${artigo.code}-${artigo.number}`}
                  code={artigo.code}
                  title={artigo.title}
                  number={artigo.number}
                  content={artigo.content}
                  isFavorite={artigo.isFavorite}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VadeMecum;
