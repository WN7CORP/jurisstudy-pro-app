
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ImportMaterialPanel } from "./ImportMaterialPanel";
import { useToast } from "@/hooks/use-toast";

interface FlashcardsHeaderProps {
  onCreateNewSet: () => void;
}

export const FlashcardsHeader: React.FC<FlashcardsHeaderProps> = ({ onCreateNewSet }) => {
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
        <p className="text-muted-foreground">
          Revise seu conhecimento de forma interativa
        </p>
      </div>
      <div className="flex gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Importar Material</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Importar Material</SheetTitle>
              <SheetDescription>
                Carregue seus materiais para criar flashcards automáticos com IA
              </SheetDescription>
            </SheetHeader>
            <ImportMaterialPanel />
          </SheetContent>
        </Sheet>
        
        <Button className="bg-netflix-red hover:bg-netflix-red/90" onClick={onCreateNewSet}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Conjunto
        </Button>
      </div>
    </div>
  );
};
