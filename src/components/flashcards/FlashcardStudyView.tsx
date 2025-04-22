
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FlashCard, UserProgress, StudyPreferences } from "@/types/flashcards";
import { FlashcardContent } from "./study/FlashcardContent";
import { ThemeSelector } from "./study/ThemeSelector";
import { StudyControls } from "./study/StudyControls";

interface FlashcardStudyViewProps {
  cards: FlashCard[];
  onComplete: () => void;
}

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

  useEffect(() => {
    const themes = Array.from(new Set(cards.map(card => card.tema).filter(Boolean) as string[]));
    setUniqueThemes(themes);
    
    if (selectedThemes.length === 0) {
      setSelectedThemes(themes);
    }
  }, [cards]);

  useEffect(() => {
    if (selectedThemes.length === 0) {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(card => card.tema && selectedThemes.includes(card.tema));
      setFilteredCards(filtered.length > 0 ? filtered : cards);
    }
  }, [cards, selectedThemes]);

  useEffect(() => {
    getStudyPreferences();
  }, []);

  const getStudyPreferences = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user?.id) {
        const { data, error } = await supabase
          .from('user_flashcard_progress' as any)
          .select('display_mode, selected_themes')
          .eq('user_id', sessionData.session.user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!error && data) {
          const userPrefs = data as { display_mode?: string; selected_themes?: string[] };
          
          if (userPrefs.display_mode) {
            setDisplayMode((userPrefs.display_mode as 'combined' | 'flip') || 'combined');
          }
          
          if (userPrefs.selected_themes && Array.isArray(userPrefs.selected_themes)) {
            setSelectedThemes(userPrefs.selected_themes);
          }
        }
      } else {
        const savedPrefs = localStorage.getItem('flashcard_preferences');
        if (savedPrefs) {
          const prefs: StudyPreferences = JSON.parse(savedPrefs);
          setDisplayMode(prefs.displayMode || 'combined');
          setSelectedThemes(prefs.selectedThemes || uniqueThemes);
          
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
        const existingProgress = existingProgressData as unknown as UserProgress;
        
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
      
      setProgress(prev => ({
        ...prev,
        [currentCard.id]: correct 
          ? Math.min(5, (prev[currentCard.id] || 0) + 1)
          : Math.max(0, (prev[currentCard.id] || 0) - 1)
      }));
      
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
      <StudyControls
        currentIndex={currentIndex}
        totalCards={filteredCards.length}
        displayMode={displayMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        toggleDisplayMode={toggleDisplayMode}
      >
        <ThemeSelector
          showThemeSelector={showThemeSelector}
          setShowThemeSelector={setShowThemeSelector}
          uniqueThemes={uniqueThemes}
          selectedThemes={selectedThemes}
          handleThemeSelection={handleThemeSelection}
        />
      </StudyControls>
      
      <Card 
        className={`w-full min-h-[300px] transition-all duration-500 relative ${displayMode === 'flip' ? 'cursor-pointer' : ''}`}
        onClick={displayMode === 'flip' ? handleFlip : undefined}
        style={displayMode === 'flip' ? { transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' } : {}}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center h-full animate-fade-in">
          <FlashcardContent
            currentCard={currentCard}
            displayMode={displayMode}
            isFlipped={isFlipped}
            showExplanation={showExplanation}
            setShowExplanation={setShowExplanation}
            updateProgress={updateProgress}
          />
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
