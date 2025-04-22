
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronRight, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Playlist, PlaylistItem } from "@/types/flashcards";

interface FlashcardOption {
  id: number;
  pergunta: string | null;
  area: string | null;
  tema: string | null;
  selected: boolean;
}

interface PlaylistCreatorProps {
  onClose: () => void;
}

const PlaylistCreator: React.FC<PlaylistCreatorProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [flashcardOptions, setFlashcardOptions] = useState<FlashcardOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('flash_cards')
          .select('id, pergunta, area, tema');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setFlashcardOptions(data.map(card => ({
            ...card,
            selected: false
          })));
        }
      } catch (error) {
        console.error("Erro ao buscar flashcards:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os flashcards.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlashcards();
  }, [toast]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da playlist é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedCards = flashcardOptions.filter(card => card.selected);
    if (selectedCards.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um flashcard para a playlist.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user?.id) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar uma playlist.",
          variant: "destructive",
        });
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Criar playlist
      const newPlaylist: Omit<Playlist, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        name,
        description: description || null
      };
      
      const { data: playlistData, error: playlistError } = await supabase
        .from('flashcard_playlists' as any)
        .insert(newPlaylist as any)
        .select()
        .single();
        
      if (playlistError || !playlistData) {
        throw playlistError || new Error("Não foi possível criar a playlist");
      }
      
      // Adicionar flashcards à playlist
      const playlistItems: PlaylistItem[] = selectedCards.map((card, index) => ({
        playlist_id: playlistData.id as string,
        flashcard_id: card.id,
        position: index
      }));
      
      const { error: itemsError } = await supabase
        .from('playlist_flashcards' as any)
        .insert(playlistItems as any);
        
      if (itemsError) {
        throw itemsError;
      }
      
      toast({
        title: "Sucesso",
        description: `Playlist "${name}" criada com ${selectedCards.length} flashcards.`
      });
      
      onClose();
      
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a playlist.",
        variant: "destructive",
      });
    }
  };

  const toggleFlashcard = (id: number) => {
    setFlashcardOptions(prev => 
      prev.map(card => 
        card.id === id ? { ...card, selected: !card.selected } : card
      )
    );
  };

  const getUniqueAreas = () => {
    const areas = new Set<string>();
    flashcardOptions.forEach(card => {
      if (card.area) areas.add(card.area);
    });
    return Array.from(areas);
  };

  const areas = getUniqueAreas();

  const filteredFlashcards = flashcardOptions.filter(card => {
    const matchesSearch = !searchQuery || (
      (card.pergunta && card.pergunta.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (card.area && card.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (card.tema && card.tema.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const matchesFilter = !filter || card.area === filter;
    
    return matchesSearch && matchesFilter;
  });

  const selectedCount = flashcardOptions.filter(card => card.selected).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl font-semibold mb-4">Criar Nova Playlist</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="playlist-name">Nome da Playlist</Label>
            <Input 
              id="playlist-name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Minha Playlist de Estudo"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="playlist-description">Descrição (opcional)</Label>
            <Textarea 
              id="playlist-description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uma descrição para ajudar a identificar o conteúdo desta playlist"
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Label>Filtrar por área</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant={filter === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter(null)}
              className="text-xs h-8"
            >
              Todos
            </Button>
            {areas.map(area => (
              <Button 
                key={area} 
                variant={filter === area ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter(area)}
                className="text-xs h-8"
              >
                {area}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 mb-2">
          <Input 
            placeholder="Pesquisar flashcards..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium">Selecione os flashcards ({selectedCount} selecionados)</span>
          {selectedCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setFlashcardOptions(prev => prev.map(card => ({ ...card, selected: false })))}
            >
              Limpar seleção
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-3">
          {loading ? (
            <p className="text-center py-4">Carregando flashcards...</p>
          ) : filteredFlashcards.length > 0 ? (
            filteredFlashcards.map(card => (
              <Card 
                key={card.id} 
                className={`cursor-pointer ${card.selected ? 'border-netflix-red' : ''}`}
                onClick={() => toggleFlashcard(card.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start">
                    <Checkbox 
                      checked={card.selected}
                      onCheckedChange={() => toggleFlashcard(card.id)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <p className="font-medium line-clamp-2">{card.pergunta}</p>
                      <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                        {card.area && <span>{card.area}</span>}
                        {card.tema && (
                          <>
                            <span>•</span>
                            <span>{card.tema}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              Nenhum flashcard encontrado para essa busca.
            </p>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 border-t pt-4 mt-4 flex justify-between">
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          <Check className="h-4 w-4 mr-2" />
          Criar Playlist
        </Button>
      </div>
    </div>
  );
};

export default PlaylistCreator;
