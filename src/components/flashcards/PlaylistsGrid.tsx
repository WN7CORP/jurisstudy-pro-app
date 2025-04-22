
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  flashcard_count: number;
}

interface PlaylistsGridProps {
  playlists: Playlist[];
}

export const PlaylistsGrid: React.FC<PlaylistsGridProps> = ({ playlists }) => {
  const { toast } = useToast();

  if (playlists.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma playlist de estudo</p>
        <Button 
          variant="outline" 
          onClick={() => toast({ 
            title: "Em breve", 
            description: "Esta funcionalidade estará disponível em breve" 
          })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Playlist
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map((playlist) => (
        <Card key={playlist.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <h3 className="font-medium">{playlist.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {playlist.description || "Sem descrição"}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">{playlist.flashcard_count} flashcards</span>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
