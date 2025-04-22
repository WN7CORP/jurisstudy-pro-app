
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { JogoCard } from "@/components/jogos/JogoCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JogoJuridico } from "@/types/jogos";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Função para validar e converter os tipos de jogo
const converterParaJogoJuridico = (jogo: any): JogoJuridico => {
  // Garantir que o tipo do jogo é um dos valores aceitos
  let tipoValidado: 'forca' | 'caca_palavras' | 'memoria';
  
  if (jogo.tipo === 'forca' || jogo.tipo === 'caca_palavras' || jogo.tipo === 'memoria') {
    tipoValidado = jogo.tipo as 'forca' | 'caca_palavras' | 'memoria';
  } else {
    // Valor padrão se o tipo não for válido
    console.warn(`Tipo de jogo inválido: ${jogo.tipo}. Usando 'forca' como padrão.`);
    tipoValidado = 'forca';
  }

  // Validar nivel_dificuldade
  let nivelValidado: 'facil' | 'medio' | 'dificil';
  if (jogo.nivel_dificuldade === 'facil' || jogo.nivel_dificuldade === 'medio' || jogo.nivel_dificuldade === 'dificil') {
    nivelValidado = jogo.nivel_dificuldade as 'facil' | 'medio' | 'dificil';
  } else {
    console.warn(`Nível de dificuldade inválido: ${jogo.nivel_dificuldade}. Usando 'medio' como padrão.`);
    nivelValidado = 'medio';
  }

  return {
    id: jogo.id,
    tipo: tipoValidado,
    nome: jogo.nome,
    materia: jogo.materia,
    tema: jogo.tema,
    nivel_dificuldade: nivelValidado,
    dados: jogo.dados,
    created_at: jogo.created_at,
    updated_at: jogo.updated_at
  };
};

const Jogos: React.FC = () => {
  const [jogos, setJogos] = useState<JogoJuridico[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroMateria, setFiltroMateria] = useState<string>("");
  const [filtroNivel, setFiltroNivel] = useState<string>("");
  const [busca, setBusca] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    carregarJogos();
  }, []);

  const carregarJogos = async () => {
    try {
      const { data, error } = await supabase
        .from('jogos_juridicos')
        .select('*');

      if (error) throw error;

      // Converter dados para o formato JogoJuridico
      const jogosConvertidos = data ? data.map(jogo => converterParaJogoJuridico(jogo)) : [];
      setJogos(jogosConvertidos);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os jogos jurídicos."
      });
    } finally {
      setLoading(false);
    }
  };

  const jogosFiltrados = jogos.filter(jogo => {
    const matchBusca = busca === "" || 
      jogo.nome.toLowerCase().includes(busca.toLowerCase()) ||
      jogo.tema.toLowerCase().includes(busca.toLowerCase());
    
    const matchMateria = filtroMateria === "" || jogo.materia === filtroMateria;
    const matchNivel = filtroNivel === "" || jogo.nivel_dificuldade === filtroNivel;

    return matchBusca && matchMateria && matchNivel;
  });

  const materias = Array.from(new Set(jogos.map(jogo => jogo.materia)));

  const handleJogar = (jogo: JogoJuridico) => {
    toast({
      title: "Em desenvolvimento",
      description: `O jogo "${jogo.nome}" estará disponível em breve!`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Jogos Jurídicos</h1>
            <p className="text-muted-foreground">
              Aprenda direito de forma divertida e interativa
            </p>
          </div>

          <div className="grid gap-4 mb-6 md:grid-cols-3">
            <Input
              placeholder="Buscar jogos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="md:col-span-1"
            />
            <Select value={filtroMateria} onValueChange={setFiltroMateria}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por matéria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as matérias</SelectItem>
                {materias.map((materia) => (
                  <SelectItem key={materia} value={materia}>
                    {materia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroNivel} onValueChange={setFiltroNivel}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os níveis</SelectItem>
                <SelectItem value="facil">Fácil</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="dificil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : jogosFiltrados.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jogosFiltrados.map((jogo) => (
                <JogoCard
                  key={jogo.id}
                  jogo={jogo}
                  onJogar={handleJogar}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Nenhum jogo encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Jogos;
