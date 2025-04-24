
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Film, Search, Star, Info, Calendar, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { sendMessageToGemini } from "@/utils/geminiAI";

/**
 * Tabela de Funções - Jurisflix.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | Jurisflix               | Componente principal da página Jurisflix que exibe filmes e séries  |
 * | (Componente)            | relacionados a temas jurídicos                                      |
 * | MovieCard               | Componente que renderiza um card para um filme ou série jurídica    |
 * | (Componente)            | com imagem, título e informações básicas                            |
 * | searchJurisflixContent  | Função que busca recomendações de conteúdo jurídico usando IA       |
 * | (Função)                | com base nos termos de pesquisa                                     |
 * | parseRecommendations    | Função que converte a resposta da IA em objetos estruturados        |
 * | (Função)                | para exibição na interface                                          |
 * -------------------------------------------------------------------------------------------------
 */

// Interface para os dados de um filme/série
interface MediaContent {
  id: string;
  title: string;
  type: 'Filme' | 'Série' | 'Documentário';
  year: string;
  poster?: string;
  rating: number;
  synopsis: string;
  legalThemes: string[];
}

// Componente para exibir um card de filme/série
const MovieCard: React.FC<{ content: MediaContent }> = ({ content }) => {
  // URL padrão para quando não houver poster disponível
  const defaultPosterUrl = "https://placehold.co/300x450/222222/cccccc?text=Sem+Imagem";
  
  return (
    <Card className="h-full flex flex-col">
      <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
        <img 
          src={content.poster || defaultPosterUrl} 
          alt={content.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-black/80 px-2 py-1 flex items-center text-yellow-400">
          <Star className="h-3 w-3 mr-1 fill-current" />
          <span className="text-xs">{content.rating.toFixed(1)}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="font-bold text-white truncate">{content.title}</h3>
          <div className="flex items-center text-xs text-white/80 gap-2">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {content.year}
            </div>
            <div className="flex items-center">
              <Film className="h-3 w-3 mr-1" />
              {content.type}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="flex-grow p-4 text-sm">
        <p className="line-clamp-3 text-muted-foreground">{content.synopsis}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {content.legalThemes.slice(0, 3).map((theme, index) => (
            <span 
              key={index} 
              className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-sm"
            >
              {theme}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Info className="h-4 w-4 mr-2" />
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

// Função para analisar as recomendações retornadas pela IA
function parseRecommendations(text: string): MediaContent[] {
  // Implementação simplificada - na vida real seria necessário um parser mais robusto
  try {
    // Vamos tentar identificar blocos de filmes/séries separados por linhas vazias
    // e por indicadores como "1.", "2.", etc.
    const blocks = text.split(/\n\s*\n/);
    
    return blocks
      .map((block, index) => {
        // Tenta extrair título, ano e tipo
        const titleMatch = block.match(/(?:Título:|^|\n)([^:\n]+?)(?:\(|$|:)/);
        const yearMatch = block.match(/\((\d{4})\)/);
        const typeMatch = block.match(/(?:Tipo:|Categoria:)[^\n]*?(Filme|Série|Documentário)/i);
        const synopsisMatch = block.match(/(?:Sinopse:|Resumo:)[^\n]*?\n(.*?)(?:\n|$)/s);
        
        // Se não conseguir extrair o mínimo necessário, pula
        if (!titleMatch) return null;
        
        // Cria o objeto de conteúdo
        const title = titleMatch[1].trim();
        const year = yearMatch ? yearMatch[1] : "N/A";
        const type = (typeMatch ? typeMatch[1] : "Filme") as 'Filme' | 'Série' | 'Documentário';
        
        // Extrai a sinopse ou usa um texto padrão
        let synopsis = "Informações detalhadas não disponíveis.";
        if (synopsisMatch && synopsisMatch[1]) {
          synopsis = synopsisMatch[1].trim();
        } else if (block.includes("Sinopse:")) {
          const parts = block.split("Sinopse:");
          if (parts.length > 1) {
            synopsis = parts[1].split("\n")[0].trim();
          }
        }
        
        // Extrai temas jurídicos
        const legalThemes = [];
        if (block.toLowerCase().includes("jurídic")) {
          const themesMatch = block.match(/(?:Temas jurídicos:|Aspectos jurídicos:|Relacionado a:)[^\n]*?\n(.*?)(?:\n|$)/s);
          if (themesMatch && themesMatch[1]) {
            legalThemes.push(...themesMatch[1].split(/,|;/).map(t => t.trim()));
          } else {
            // Detecção simplificada de temas jurídicos no texto
            const legalTerms = ["direito", "penal", "civil", "constitucional", "processo", "crime", "justiça"];
            legalTerms.forEach(term => {
              if (block.toLowerCase().includes(term)) {
                legalThemes.push(term.charAt(0).toUpperCase() + term.slice(1));
              }
            });
          }
        }
        
        // Se não encontrou temas, adiciona um genérico
        if (legalThemes.length === 0) {
          legalThemes.push("Direito");
        }
        
        return {
          id: `movie-${index}`,
          title,
          year,
          type,
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Rating aleatório entre 3.0 e 5.0
          synopsis,
          legalThemes: Array.from(new Set(legalThemes)) // Remove duplicatas
        };
      })
      .filter((item): item is MediaContent => item !== null);
  } catch (error) {
    console.error("Erro ao analisar recomendações:", error);
    return [];
  }
}

// Dados de exemplo para exibir inicialmente
const exampleContents: MediaContent[] = [
  {
    id: '1',
    title: 'A Few Good Men',
    type: 'Filme',
    year: '1992',
    poster: 'https://m.media-amazon.com/images/M/MV5BNmRjMDI5MjEtMWU0ZC00MzJhLTk0YzQtNzc3MzRlOGMwMzE2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    rating: 4.7,
    synopsis: 'Um advogado militar defende dois fuzileiros navais acusados ​​de assassinato que argumentam que estavam seguindo ordens.',
    legalThemes: ['Direito Militar', 'Tribunal', 'Ética']
  },
  {
    id: '2',
    title: 'Suits',
    type: 'Série',
    year: '2011',
    poster: 'https://m.media-amazon.com/images/M/MV5BNmVmMmM5ZmItZDg0OC00NTFiLWIxNzctZjNmYTY5OTU3ZWU3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    rating: 4.5,
    synopsis: 'Um advogado corporativo contrata um gênio sem diploma de direito como seu associado.',
    legalThemes: ['Direito Corporativo', 'Ética Profissional']
  },
  {
    id: '3',
    title: 'The Firm',
    type: 'Filme',
    year: '1993',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTYwNjk2MjUzNF5BMl5BanBnXkFtZTgwMzU0MDIwMjE@._V1_.jpg',
    rating: 4.2,
    synopsis: 'Um jovem advogado descobre que sua empresa está envolvida em atividades criminosas.',
    legalThemes: ['Crime Organizado', 'Ética Legal']
  }
];

const Jurisflix: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contents, setContents] = useState<MediaContent[]>(exampleContents);
  const [loading, setLoading] = useState(false);

  // Função para buscar recomendações usando IA
  const searchJurisflixContent = async () => {
    if (!searchTerm.trim()) {
      toast.error("Digite um tema jurídico para buscar");
      return;
    }
    
    setLoading(true);
    toast.loading("Buscando recomendações...");
    
    try {
      const prompt = `
        Recomende 5 filmes, séries ou documentários relacionados ao tema jurídico: "${searchTerm}".
        
        Para cada recomendação, inclua:
        - Título e ano de lançamento
        - Tipo (Filme, Série ou Documentário)
        - Sinopse focada nos aspectos jurídicos
        - Principais temas jurídicos abordados
        
        Formate cada recomendação de forma clara e separada.
      `;
      
      const aiResponse = await sendMessageToGemini(
        [{ role: 'user', content: prompt }],
        'jurisflix'
      );
      
      // Analisar a resposta da IA para extrair as recomendações
      const recommendations = parseRecommendations(aiResponse);
      
      if (recommendations.length > 0) {
        setContents(recommendations);
        toast.dismiss();
        toast.success(`${recommendations.length} recomendações encontradas`);
      } else {
        toast.dismiss();
        toast.error("Não foi possível processar as recomendações", {
          description: "Tente um tema jurídico diferente."
        });
      }
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
      toast.dismiss();
      toast.error("Erro ao buscar recomendações", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  // Lidar com a pesquisa ao pressionar Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchJurisflixContent();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Jurisflix</h1>
              <p className="text-muted-foreground">
                Filmes, séries e documentários sobre temas jurídicos
              </p>
            </div>
            
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  className="pl-10"
                  placeholder="Buscar tema jurídico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>
              <Button onClick={searchJurisflixContent} disabled={loading}>
                Buscar
              </Button>
            </div>
          </div>
          
          {/* Banners destacados */}
          <div className="mb-8">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 py-4">
                <Card className="w-[300px] flex-shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
                  <img 
                    src="https://m.media-amazon.com/images/M/MV5BMTYwNjk2MjUzNF5BMl5BanBnXkFtZTgwMzU0MDIwMjE@._V1_.jpg" 
                    alt="The Firm" 
                    className="w-full h-40 object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 p-4 z-20">
                    <h3 className="text-white font-bold">Clássicos Jurídicos</h3>
                    <p className="text-white/80 text-sm">Filmes que marcaram época</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-white/10 text-white border-white/20">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Explorar
                    </Button>
                  </div>
                </Card>
                
                <Card className="w-[300px] flex-shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
                  <img 
                    src="https://m.media-amazon.com/images/M/MV5BNmVmMmM5ZmItZDg0OC00NTFiLWIxNzctZjNmYTY5OTU3ZWU3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg" 
                    alt="Suits" 
                    className="w-full h-40 object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 p-4 z-20">
                    <h3 className="text-white font-bold">Séries de Advogados</h3>
                    <p className="text-white/80 text-sm">Drama nos tribunais</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-white/10 text-white border-white/20">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Explorar
                    </Button>
                  </div>
                </Card>
                
                <Card className="w-[300px] flex-shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
                  <img 
                    src="https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg" 
                    alt="The Shawshank Redemption" 
                    className="w-full h-40 object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 p-4 z-20">
                    <h3 className="text-white font-bold">Direito Penal</h3>
                    <p className="text-white/80 text-sm">Sistema prisional e justiça</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-white/10 text-white border-white/20">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Explorar
                    </Button>
                  </div>
                </Card>
              </div>
            </ScrollArea>
          </div>
          
          {/* Grade de conteúdo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {contents.map((content) => (
              <MovieCard key={content.id} content={content} />
            ))}
            
            {contents.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum conteúdo encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente buscar por outro tema jurídico
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jurisflix;
