
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, BookOpen, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { FlashCard, UserProgress, StudyPreferences } from "@/types/flashcards";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface FlashcardStudyViewProps {
  cards: FlashCard[];
  onComplete: () => void;
}

/**
 * Componente para estudo de flashcards
 * 
 * | Função | Descrição |
 * |--------|-----------|
 * | handleFlip | Controla a virada do flashcard |
 * | handleNext | Avança para o próximo flashcard |
 * | handlePrevious | Retorna para o flashcard anterior |
 * | updateProgress | Atualiza o progresso do usuário em um flashcard |
 * | saveStudyPreferences | Salva as preferências de estudo do usuário |
 * | getStudyPreferences | Obtém as preferências de estudo do usuário |
 * | toggleDisplayMode | Alterna entre os modos de exibição combinado e flip |
 * | handleThemeSelection | Controla a seleção de temas para estudo |
 */
const FlashcardStudyView: React.FC<FlashcardStudyViewProps> = ({ cards, onComplete }) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [displayMode, setDisplayMode] = useState<'combined' | 'flip'>('combined');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [uniqueThemes, setUniqueThemes] = useState<string[]>([]);
  const [filteredCards, setFilteredCards] = useState<FlashCard[]>(cards);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const currentCard = filteredCards[currentIndex];

  // Extrair temas únicos dos cards
  useEffect(() => {
    const themes = Array.from(new Set(cards.map(card => card.tema).filter(Boolean) as string[]));
    setUniqueThemes(themes);
    
    // Por padrão, selecionar todos os temas
    if (selectedThemes.length === 0) {
      setSelectedThemes(themes);
    }
  }, [cards]);

  // Filtrar cards com base nos temas selecionados
  useEffect(() => {
    if (selectedThemes.length === 0) {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(card => card.tema && selectedThemes.includes(card.tema));
      setFilteredCards(filtered.length > 0 ? filtered : cards);
    }
  }, [cards, selectedThemes]);

  // Carregar preferências de estudo
  useEffect(() => {
    getStudyPreferences();
  }, []);

  const getStudyPreferences = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user?.id) {
        // Tentar obter do banco de dados se o usuário estiver logado
        const { data, error } = await supabase
          .from('user_flashcard_progress' as any)
          .select('display_mode, selected_themes')
          .eq('user_id', sessionData.session.user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!error && data) {
          // Usar type assertion para acessar as propriedades com segurança
          const userPrefs = data as { display_mode?: string; selected_themes?: string[] };
          
          // Configurar o modo de exibição
          if (userPrefs.display_mode) {
            setDisplayMode((userPrefs.display_mode as 'combined' | 'flip') || 'combined');
          }
          
          // Configurar os temas selecionados
          if (userPrefs.selected_themes && Array.isArray(userPrefs.selected_themes)) {
            setSelectedThemes(userPrefs.selected_themes);
          }
        }
      } else {
        // Caso contrário, usar localStorage
        const savedPrefs = localStorage.getItem('flashcard_preferences');
        if (savedPrefs) {
          const prefs: StudyPreferences = JSON.parse(savedPrefs);
          setDisplayMode(prefs.displayMode || 'combined');
          setSelectedThemes(prefs.selectedThemes || uniqueThemes);
          
          // Restaurar posição
          if (prefs.lastPosition !== undefined && prefs.lastPosition < cards.length) {
            setCurrentIndex(prefs.lastPosition);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao obter preferências de estudo:", error);
    }
  };

  const saveStudyPreferences = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user?.id) {
        // Salvar no banco se o usuário estiver logado
        await supabase
          .from('user_flashcard_progress' as any)
          .upsert({
            user_id: sessionData.session.user.id,
            flashcard_id: currentCard?.id || 0,
            display_mode: displayMode,
            selected_themes: selectedThemes,
            last_reviewed: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      } else {
        // Caso contrário, usar localStorage
        const prefs: StudyPreferences = {
          displayMode,
          selectedThemes,
          lastPosition: currentIndex
        };
        localStorage.setItem('flashcard_preferences', JSON.stringify(prefs));
      }
    } catch (error) {
      console.error("Erro ao salvar preferências de estudo:", error);
    }
  };

  const handleFlip = () => {
    if (displayMode === 'flip') {
      setIsFlipped(!isFlipped);
      setShowExplanation(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowExplanation(false);
      saveStudyPreferences();
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowExplanation(false);
      saveStudyPreferences();
    }
  };

  const toggleDisplayMode = () => {
    const newMode = displayMode === 'combined' ? 'flip' : 'combined';
    setDisplayMode(newMode);
    setIsFlipped(false);
    saveStudyPreferences();
  };

  const handleThemeSelection = (theme: string) => {
    setSelectedThemes(prev => {
      if (prev.includes(theme)) {
        return prev.filter(t => t !== theme);
      } else {
        return [...prev, theme];
      }
    });
    saveStudyPreferences();
  };

  const updateProgress = async (correct: boolean) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user?.id || !currentCard?.id) return;
      
      const userId = sessionData.session.user.id;
      
      // Verificar progresso existente usando API genérica com casting explícito
      const { data: existingProgressData, error: fetchError } = await supabase
        .from('user_flashcard_progress' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('flashcard_id', currentCard.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Erro ao buscar progresso:", fetchError);
        throw fetchError;
      }
      
      if (existingProgressData) {
        // Cast para o tipo esperado
        const existingProgress = existingProgressData as unknown as UserProgress;
        
        // Atualizar progresso existente
        const { error } = await supabase
          .from('user_flashcard_progress' as any)
          .update({
            correct_count: correct ? existingProgress.correct_count + 1 : existingProgress.correct_count,
            incorrect_count: !correct ? existingProgress.incorrect_count + 1 : existingProgress.incorrect_count,
            confidence_level: correct 
              ? Math.min(5, existingProgress.confidence_level + 1)
              : Math.max(0, existingProgress.confidence_level - 1),
            last_reviewed: new Date().toISOString(),
            display_mode: displayMode,
            selected_themes: selectedThemes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
        
        if (error) throw error;
      } else {
        // Criar nova entrada de progresso
        const newProgress: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'> = {
          user_id: userId,
          flashcard_id: currentCard.id,
          correct_count: correct ? 1 : 0,
          incorrect_count: !correct ? 1 : 0,
          confidence_level: correct ? 1 : 0,
          last_reviewed: new Date().toISOString(),
          display_mode: displayMode,
          selected_themes: selectedThemes
        };
        
        const { error } = await supabase
          .from('user_flashcard_progress' as any)
          .insert(newProgress as any);
        
        if (error) throw error;
      }
      
      // Atualizar estado local
      setProgress(prev => ({
        ...prev,
        [currentCard.id]: correct 
          ? Math.min(5, (prev[currentCard.id] || 0) + 1)
          : Math.max(0, (prev[currentCard.id] || 0) - 1)
      }));
      
      // Ir para o próximo cartão
      handleNext();
      
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu progresso.",
        variant: "destructive",
      });
    }
  };

  if (!filteredCards.length || !currentCard) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">Nenhum flashcard disponível para os temas selecionados</p>
        <Button onClick={onComplete}>Voltar para Flashcards</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        <div className="flex gap-4 items-center">
          <span>{currentIndex + 1} de {filteredCards.length}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{displayMode === 'flip' ? 'Flip' : 'Pergunta e Resposta'}</span>
            <Switch
              checked={displayMode === 'combined'}
              onCheckedChange={toggleDisplayMode}
            />
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowThemeSelector(!showThemeSelector)}
            >
              Temas ({selectedThemes.length})
            </Button>
            {showThemeSelector && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md border p-2 z-50">
                <div className="max-h-64 overflow-y-auto">
                  {uniqueThemes.map((theme) => (
                    <div key={theme} className="flex items-center space-x-2 py-2">
                      <Checkbox 
                        id={`theme-${theme}`} 
                        checked={selectedThemes.includes(theme)}
                        onCheckedChange={() => handleThemeSelection(theme)}
                      />
                      <label 
                        htmlFor={`theme-${theme}`}
                        className="text-sm cursor-pointer"
                      >
                        {theme}
                      </label>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-2"
                  size="sm"
                  onClick={() => setShowThemeSelector(false)}
                >
                  Fechar
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={handleNext}>
          {currentIndex < filteredCards.length - 1 ? 'Próximo' : 'Finalizar'} <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <Card 
        className={`w-full min-h-[300px] transition-all duration-500 relative ${displayMode === 'flip' ? 'cursor-pointer' : ''}`}
        onClick={displayMode === 'flip' ? handleFlip : undefined}
        style={displayMode === 'flip' ? { transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' } : {}}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center h-full animate-fade-in">
          {displayMode === 'combined' ? (
            <div className="text-center w-full">
              <h3 className="text-xl font-medium mb-4">Pergunta</h3>
              <p className="text-lg mb-6">{currentCard.pergunta}</p>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-xl font-medium mb-4">Resposta</h3>
                <p className="text-lg">{currentCard.resposta}</p>
              </div>
              
              {currentCard.explicacao && (
                <div className="mt-4">
                  {showExplanation ? (
                    <div className="bg-muted p-4 rounded-md mt-4 animate-fade-in">
                      <h4 className="font-medium mb-2">Explicação:</h4>
                      <p>{currentCard.explicacao}</p>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowExplanation(true);
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2" /> Ver explicação
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                  onClick={() => updateProgress(false)}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" /> Errei
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
                  onClick={() => updateProgress(true)}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" /> Acertei
                </Button>
              </div>
            </div>
          ) : !isFlipped ? (
            <div className="text-center w-full">
              <h3 className="text-xl font-medium mb-4">Pergunta</h3>
              <p className="text-lg">{currentCard.pergunta}</p>
              <div className="mt-8 text-sm text-muted-foreground">Clique para ver a resposta</div>
            </div>
          ) : (
            <div className="text-center w-full" style={{ transform: 'rotateY(180deg)' }}>
              <h3 className="text-xl font-medium mb-4">Resposta</h3>
              <p className="text-lg mb-4">{currentCard.resposta}</p>
              
              {currentCard.explicacao && (
                <div className="mt-4">
                  {showExplanation ? (
                    <div className="bg-muted p-4 rounded-md mt-4 animate-fade-in">
                      <h4 className="font-medium mb-2">Explicação:</h4>
                      <p>{currentCard.explicacao}</p>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowExplanation(true);
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2" /> Ver explicação
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProgress(false);
                  }}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" /> Errei
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProgress(true);
                  }}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" /> Acertei
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-4">
        <div className="h-1 w-full bg-secondary/30 rounded-full">
          <div 
            className="h-1 bg-netflix-red rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStudyView;
