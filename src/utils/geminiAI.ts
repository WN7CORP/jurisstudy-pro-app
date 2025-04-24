
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiResponse {
  response: string | any;
  error?: string;
}

interface GeminiRequestOptions {
  module?: string;
  systemPrompt?: string;
  metadata?: Record<string, any>;
  responseFormat?: "text" | "json";
}

/**
 * Sends a message to the Gemini AI assistant
 * @param messages - Array of message objects with role and content
 * @param options - Optional request configuration
 * @returns Promise with the assistant's response
 */
export const sendMessageToGemini = async (
  messages: Message[],
  options?: GeminiRequestOptions
): Promise<string | any> => {
  try {
    const { data, error } = await supabase.functions.invoke<GeminiResponse>('gemini-ai', {
      body: { 
        messages, 
        module: options?.module, 
        systemPrompt: options?.systemPrompt,
        metadata: options?.metadata,
        responseFormat: options?.responseFormat
      }
    });
    
    if (error) {
      console.error("Error calling Gemini AI function:", error);
      throw new Error(`Error: ${error.message}`);
    }
    
    if (data?.error) {
      console.error("Gemini AI returned an error:", data.error);
      throw new Error(`Gemini error: ${data.error}`);
    }
    
    return data?.response || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Exception in sendMessageToGemini:", error);
    throw error;
  }
};

/**
 * Gera um mapa mental em formato JSON estruturado sobre um tema jurídico
 * @param tema - O tema jurídico para o mapa mental
 * @param area - A área do direito relacionada
 * @returns Promise com o mapa mental em formato JSON
 */
export const generateMindMap = async (
  tema: string,
  area: string
): Promise<any> => {
  try {
    const prompt = `Crie um mapa mental detalhado sobre o tema jurídico: "${tema}" na área de ${area}.`;
    
    const response = await sendMessageToGemini(
      [{ role: 'user', content: prompt }],
      { 
        module: 'mapamental',
        responseFormat: 'json',
        metadata: { tema, area }
      }
    );
    
    return response;
  } catch (error) {
    console.error("Error generating mind map:", error);
    throw error;
  }
};

/**
 * Analisa uma jurisprudência e extrai informações relevantes
 * @param texto - O texto da jurisprudência a ser analisado
 * @returns Promise com a análise estruturada
 */
export const analyzeJurisprudence = async (
  texto: string
): Promise<any> => {
  try {
    const prompt = `Analise a seguinte jurisprudência e extraia as informações mais relevantes: ${texto.substring(0, 2000)}${texto.length > 2000 ? '...' : ''}`;
    
    const response = await sendMessageToGemini(
      [{ role: 'user', content: prompt }],
      { 
        module: 'analise_jurisprudencia',
        responseFormat: 'json'
      }
    );
    
    return response;
  } catch (error) {
    console.error("Error analyzing jurisprudence:", error);
    throw error;
  }
};

/**
 * Gera questões de múltipla escolha sobre um tema jurídico
 * @param tema - O tema jurídico para as questões
 * @param area - A área do direito relacionada
 * @param quantidade - Número de questões a serem geradas
 * @returns Promise com as questões geradas
 */
export const generateLegalQuestions = async (
  tema: string,
  area: string,
  quantidade: number = 3
): Promise<string> => {
  try {
    const prompt = `Crie ${quantidade} questões de múltipla escolha sobre ${tema} na área de ${area}.`;
    
    const response = await sendMessageToGemini(
      [{ role: 'user', content: prompt }],
      { 
        module: 'questao',
        metadata: { tema, area, quantidade }
      }
    );
    
    return response;
  } catch (error) {
    console.error("Error generating legal questions:", error);
    throw error;
  }
};

/**
 * Gera recomendações de filmes/séries relacionados a um tema jurídico
 * @param tema - O tema jurídico para recomendações
 * @returns Promise com as recomendações
 */
export const getJurisflixRecommendations = async (
  tema: string
): Promise<string> => {
  try {
    const prompt = `Recomende filmes, séries ou documentários que abordam o tema jurídico: ${tema}`;
    
    const response = await sendMessageToGemini(
      [{ role: 'user', content: prompt }],
      { module: 'jurisflix' }
    );
    
    return response;
  } catch (error) {
    console.error("Error getting Jurisflix recommendations:", error);
    throw error;
  }
};

/**
 * Gera um modelo de petição jurídica
 * @param tipo - O tipo de petição a ser gerada
 * @param fatos - Os fatos relevantes para a petição
 * @param area - A área do direito relacionada
 * @returns Promise com o modelo de petição
 */
export const generateLegalPetition = async (
  tipo: string,
  fatos: string,
  area: string
): Promise<string> => {
  try {
    const prompt = `Elabore uma petição de ${tipo} com base nos seguintes fatos: ${fatos}`;
    
    const response = await sendMessageToGemini(
      [{ role: 'user', content: prompt }],
      { 
        module: 'peticao',
        metadata: { tipo, area }
      }
    );
    
    return response;
  } catch (error) {
    console.error("Error generating legal petition:", error);
    throw error;
  }
};

/**
 * Analisa a transcrição de uma vídeo-aula e gera um resumo
 * @param transcricao - O texto da transcrição
 * @returns Promise com o resumo e palavras-chave
 */
export const analyzeLectureTranscription = async (
  transcricao: string
): Promise<any> => {
  try {
    const prompt = `Analise esta transcrição de uma aula jurídica e gere um resumo conciso com os pontos principais: ${transcricao.substring(0, 3000)}${transcricao.length > 3000 ? '...' : ''}`;
    
    const response = await sendMessageToGemini(
      [{ role: 'user', content: prompt }],
      { 
        module: 'transcricao_video',
        responseFormat: 'json'
      }
    );
    
    return response;
  } catch (error) {
    console.error("Error analyzing lecture transcription:", error);
    throw error;
  }
};

/**
 * Table of Functions & Their Descriptions
 * 
 * | Função                     | Descrição                                             | Parâmetros                       | Retorno           |
 * |----------------------------|-------------------------------------------------------|----------------------------------|--------------------|
 * | sendMessageToGemini        | Envia mensagens ao assistente Gemini AI              | messages, options                | Promise<string|any>|
 * | generateMindMap            | Gera um mapa mental em formato JSON                  | tema, area                       | Promise<any>       |
 * | analyzeJurisprudence       | Analisa uma jurisprudência e extrai informações      | texto                            | Promise<any>       |
 * | generateLegalQuestions     | Gera questões de múltipla escolha                    | tema, area, quantidade           | Promise<string>    |
 * | getJurisflixRecommendations| Gera recomendações de filmes/séries jurídicas        | tema                             | Promise<string>    |
 * | generateLegalPetition      | Gera um modelo de petição jurídica                   | tipo, fatos, area                | Promise<string>    |
 * | analyzeLectureTranscription| Analisa transcrição de vídeo-aula e gera resumo      | transcricao                      | Promise<any>       |
 */
