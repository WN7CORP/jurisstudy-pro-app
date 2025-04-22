
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileImage, FileAudio } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export const ImportMaterialPanel: React.FC = () => {
  const { toast } = useToast();

  const handleFileUpload = (type: 'pdf' | 'image' | 'audio') => {
    toast({
      title: "Upload de arquivo",
      description: `Carregando arquivo ${type}. Esta funcionalidade estará disponível em breve.`,
    });
  };

  const renderFlashcardFunctionsTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionalidade</TableHead>
            <TableHead>Descrição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Revisão de flashcards</TableCell>
            <TableCell>Revise os flashcards criados pelo sistema ou por você</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Upload de material (PDF, imagem, áudio)</TableCell>
            <TableCell>Carregue seus materiais para criar flashcards automáticos usando IA</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Playlists de estudo</TableCell>
            <TableCell>Monte listas personalizadas com flashcards de diferentes áreas</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Acompanhamento de progresso</TableCell>
            <TableCell>Visualize seu progresso por tema e área com estatísticas detalhadas</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <Button 
        variant="outline" 
        className="w-full flex justify-between" 
        onClick={() => handleFileUpload('pdf')}
      >
        <span>PDF</span>
        <FileText className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        className="w-full flex justify-between"
        onClick={() => handleFileUpload('image')}
      >
        <span>Imagem</span>
        <FileImage className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        className="w-full flex justify-between"
        onClick={() => handleFileUpload('audio')}
      >
        <span>Áudio</span>
        <FileAudio className="h-4 w-4" />
      </Button>
      <div className="mt-4">
        {renderFlashcardFunctionsTable()}
      </div>
    </div>
  );
};
