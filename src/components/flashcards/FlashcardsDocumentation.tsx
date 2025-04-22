
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FlashcardsDocumentation: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Documentação dos Componentes de Flashcards</h1>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">1. FlashcardStudyView</h2>
      <Table>
        <TableCaption>Funções do componente FlashcardStudyView</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome da Função</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-[150px]">Parâmetros</TableHead>
            <TableHead className="w-[150px]">Retorno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>handleFlip</TableCell>
            <TableCell>Inverte o estado do cartão entre pergunta e resposta</TableCell>
            <TableCell>Nenhum</TableCell>
            <TableCell>void</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>handleNext</TableCell>
            <TableCell>Avança para o próximo cartão ou finaliza o estudo</TableCell>
            <TableCell>Nenhum</TableCell>
            <TableCell>void</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>handlePrevious</TableCell>
            <TableCell>Volta para o cartão anterior</TableCell>
            <TableCell>Nenhum</TableCell>
            <TableCell>void</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>updateProgress</TableCell>
            <TableCell>Atualiza o progresso do usuário com o flashcard atual</TableCell>
            <TableCell>correct: boolean</TableCell>
            <TableCell>Promise&lt;void&gt;</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-xl font-semibold mt-10 mb-3">2. PlaylistCreator</h2>
      <Table>
        <TableCaption>Funções do componente PlaylistCreator</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome da Função</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-[150px]">Parâmetros</TableHead>
            <TableHead className="w-[150px]">Retorno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>handleSave</TableCell>
            <TableCell>Salva a playlist criada com os flashcards selecionados</TableCell>
            <TableCell>Nenhum</TableCell>
            <TableCell>Promise&lt;void&gt;</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>toggleFlashcard</TableCell>
            <TableCell>Seleciona ou deseleciona um flashcard para a playlist</TableCell>
            <TableCell>id: number</TableCell>
            <TableCell>void</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>getUniqueAreas</TableCell>
            <TableCell>Extrai áreas únicas dos flashcards disponíveis</TableCell>
            <TableCell>Nenhum</TableCell>
            <TableCell>string[]</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default FlashcardsDocumentation;
