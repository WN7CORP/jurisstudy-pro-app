
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FlashcardStudyView from "@/components/flashcards/FlashcardStudyView";
import { FlashCard } from "@/types/flashcards";

interface StudyPageState {
  cards: FlashCard[];
  setInfo: {
    area: string;
    tema: string;
  };
}

const EstudoFlashcards: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [setInfo, setSetInfo] = useState<{ area: string; tema: string } | null>(null);

  useEffect(() => {
    // Verificar se recebemos os flashcards na navegação
    const state = location.state as StudyPageState | null;
    
    if (!state || !state.cards || state.cards.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum flashcard selecionado para estudo.",
        variant: "destructive",
      });
      navigate('/flashcards');
      return;
    }
    
    setCards(state.cards);
    setSetInfo(state.setInfo);
  }, [location, navigate, toast]);

  const handleComplete = () => {
    toast({
      title: "Parabéns!",
      description: "Você completou a sessão de estudo.",
    });
    navigate('/flashcards');
  };

  const handleBack = () => {
    navigate('/flashcards');
  };

  if (!setInfo || cards.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 flex justify-center items-center h-[60vh]">
          <p>Carregando flashcards...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Estudo: {setInfo.area} - {setInfo.tema}</h1>
            <p className="text-muted-foreground">{cards.length} flashcards disponíveis</p>
          </div>
        </div>

        <div className="my-8">
          <FlashcardStudyView cards={cards} onComplete={handleComplete} />
        </div>
      </div>
    </Layout>
  );
};

export default EstudoFlashcards;
