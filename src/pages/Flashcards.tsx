import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, ChevronRight, Clock, Award } from "lucide-react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Inicialização do Supabase (certifique‑se de definir as variáveis de ambiente)
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface FlashCard {
  id: number;
  created_at: string;
  area: string;
  tema: string;
  pergunta: string;
  resposta: string;
  explicacao: string;
}

const Flashcards: React.FC = () => {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFlashcards();
  }, []);

  async function fetchFlashcards() {
    const { data, error } = await supabase
      .from<FlashCard>("flash_cards")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Erro ao buscar flashcards:", error.message);
    } else {
      setCards(data ?? []);
    }
  }

  // Filtra por área, tema ou pergunta
  const filtered = cards.filter((c) =>
    [c.area, c.tema, c.pergunta]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
            <p className="text-muted-foreground">
              Revise seu conhecimento de forma interativa
            </p>
          </div>
          <Button
            className="bg-netflix-red hover:bg-netflix-red/90"
            onClick={() => {/* lógica para criar novo conjunto */}}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Conjunto
          </Button>
        </div>

        {/* Campo de busca */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar flashcards..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Listagem de cartões */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Todos os flashcards</h2>
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum flashcard encontrado.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((card) => (
                <Card
                  key={card.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">{card.pergunta}</h3>
                      <p className="text-sm text-muted-foreground">{card.resposta}</p>
                    </div>
                    {card.explicacao && (
                      <details className="text-xs text-muted-foreground">
                        <summary>Mostrar explicação</summary>
                        <p className="mt-2">{card.explicacao}</p>
                      </details>
                    )}
                    <div className="text-right mt-4 text-xs text-muted-foreground">
                      <span>{new Date(card.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Flashcards;
