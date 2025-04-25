import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoTranscription } from "@/types/supabase";

/**
 * Tabela de Funções - VideoAulaTranscription.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | VideoAulaTranscription  | Componente que exibe a transcrição de uma vídeo-aula com resumo,    |
 * | (Componente)            | pontos-chave e palavras-chave gerados por IA                        |
 * -------------------------------------------------------------------------------------------------
 */

interface VideoAulaTranscriptionProps {
  transcription: VideoTranscription;
}

export const VideoAulaTranscription: React.FC<VideoAulaTranscriptionProps> = ({ transcription }) => {
  
  const formatTranscription = (text: string) => {
    // Dividir por parágrafos e adicionar espaçamento adequado
    return text.split(/\n\n|\r\n\r\n/).map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
      </p>
    ));
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Transcrição Completa</CardTitle>
            <CardDescription>
              Duração: {transcription.duracao ? formatDuration(transcription.duracao) : "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="text-sm leading-relaxed">
                {formatTranscription(transcription.transcricao)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{transcription.resumo_ai}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pontos-Chave</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {transcription.pontos_chave.map((ponto, index) => (
                  <li key={index} className="list-disc ml-4">
                    <span className="font-medium">{ponto.ponto}</span>
                    {ponto.descricao && <span className="block text-muted-foreground text-xs mt-1">{ponto.descricao}</span>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Palavras-Chave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {transcription.palavras_chave.map((palavra, index) => (
                  <Badge key={index} variant="outline">
                    {palavra}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
