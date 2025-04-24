
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Tabela de Funções - gemini-ai/index.ts
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | serve                   | Função principal que processa requisições para o Gemini AI          |
 * | buildPrompt             | Constrói o prompt completo com instruções de sistema e histórico    |
 * | getDefaultSystemPrompt  | Retorna o prompt de sistema padrão ou específico para um módulo     |
 * | generateErrorResponse   | Gera uma resposta padronizada de erro                               |
 * | callGeminiAPI           | Faz a chamada para a API do Gemini Pro                              |
 * | parseGeminiResponse     | Processa a resposta da API conforme o formato desejado              |
 * -------------------------------------------------------------------------------------------------
 */

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyBCPCIV9jUxa4sD6TrlR74q3KTKqDZjoT8';
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para gerar uma resposta de erro padronizada
function generateErrorResponse(message: string, status: number = 500) {
  console.error("Erro na função gemini-ai:", message);
  
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

// Função para chamar a API do Gemini
async function callGeminiAPI(prompt: string, responseFormat?: string) {
  try {
    console.log("Chamando API Gemini com prompt:", prompt.substring(0, 100) + "...");
    
    // Configuração da requisição para a API Gemini
    const geminiMessages = [{
      role: "user",
      parts: [{ text: prompt }]
    }];

    const requestBody: any = {
      contents: geminiMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    };

    // Adicionar formato de resposta se especificado
    if (responseFormat && responseFormat === "json") {
      requestBody.generationConfig.responseFormat = { type: "JSON" };
    }

    // Fazer requisição para a API Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Erro na resposta da API Gemini:", data);
      throw new Error(`Erro na API Gemini: ${data.error?.message || "Erro desconhecido"}`);
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Resposta da API Gemini:", generatedText.substring(0, 100) + "...");
    
    return generatedText;
  } catch (error) {
    console.error("Exceção ao chamar API Gemini:", error);
    throw error;
  }
}

// Função para processar a resposta da API conforme o formato
function parseGeminiResponse(text: string, format?: string) {
  // Por padrão, retorna o texto como está
  if (!format || format !== "json") return text;
  
  try {
    // Verifica se já é um JSON válido
    if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
      return JSON.parse(text);
    }
    
    // Tenta extrair JSON de um texto que pode conter comentários ou explicações
    const jsonPattern = /```json\s*([\s\S]*?)\s*```|{[\s\S]*}/m;
    const match = text.match(jsonPattern);
    
    if (match && match[1]) {
      return JSON.parse(match[1]);
    } else if (match) {
      return JSON.parse(match[0]);
    }
    
    // Se não encontrar um formato JSON válido, retorna o texto original
    return text;
  } catch (error) {
    console.warn("Erro ao analisar resposta JSON:", error);
    return text;
  }
}

// Helper function to build the complete prompt
function buildPrompt(systemPrompt: string, messages: any[], metadata?: any): string {
  // Start with the system prompt
  let fullPrompt = systemPrompt + "\n\n";
  
  // Add metadata context if available
  if (metadata) {
    fullPrompt += "Contexto adicional:\n";
    for (const [key, value] of Object.entries(metadata)) {
      fullPrompt += `${key}: ${value}\n`;
    }
    fullPrompt += "\n";
  }
  
  // Add the conversation history
  messages.forEach((msg) => {
    const role = msg.role === 'user' ? 'Usuário' : 'Assistente';
    fullPrompt += `${role}: ${msg.content}\n`;
  });
  
  return fullPrompt;
}

// Default system prompts for different modules
function getDefaultSystemPrompt(module?: string): string {
  const basePrompt = "Você é Gemini, uma assistente jurídica virtual especializada em direito brasileiro. " + 
    "Você deve sempre fornecer informações precisas e citar suas fontes quando possível. " +
    "Você tem conhecimento sobre legislação, doutrinas e jurisprudências brasileiras até sua data de treinamento. " +
    "Sempre evite dar conselhos jurídicos específicos para casos reais, lembrando que sua função é educativa e informativa, " +
    "não substituindo um advogado real.";
    
  if (!module) {
    return basePrompt;
  }
  
  const modulePrompts: Record<string, string> = {
    'mapa': basePrompt + "\n\nSua tarefa é criar um mapa mental em formato de texto sobre o tema jurídico solicitado. " +
            "Organize o conteúdo em tópicos e subtópicos de forma hierárquica, iniciando pelo conceito central " +
            "e ramificando para conceitos relacionados. Use marcadores e indentação para indicar a estrutura.",
            
    'resumo': basePrompt + "\n\nSua tarefa é criar um resumo conciso sobre o tema jurídico solicitado. " +
              "O resumo deve ser objetivo, focado nos pontos principais e estruturado de forma didática. " +
              "Inclua definições, contexto legal, principais características e aplicações práticas.",
              
    'questao': basePrompt + "\n\nSua tarefa é criar questões de múltipla escolha sobre o tema jurídico solicitado. " +
               "Para cada questão, forneça: um enunciado claro, 5 alternativas (sendo apenas uma correta), " +
               "a indicação da resposta correta e uma explicação detalhada. Assegure-se que as questões sejam " +
               "de diferentes níveis de dificuldade e cubram diversos aspectos do tema.",
               
    'artigo': basePrompt + "\n\nSua tarefa é criar um artigo jurídico completo sobre o tema solicitado. " +
              "O artigo deve incluir: título atrativo, introdução contextualizando o tema, " +
              "desenvolvimento com argumentação e referências doutrinárias/jurisprudenciais, " +
              "e conclusão sintetizando os pontos principais. Mantenha um tom formal e acadêmico.",
              
    'noticias': basePrompt + "\n\nSua tarefa é criar um resumo simulado de notícias jurídicas recentes sobre o tema solicitado. " +
                "Para cada notícia, forneça: um título chamativo, data fictícia recente, um resumo do conteúdo " +
                "e uma análise breve sobre o impacto jurídico. Procure criar notícias que poderiam ser reais e relevantes.",
                
    'jurisflix': basePrompt + "\n\nSua tarefa é recomendar filmes, séries ou documentários que abordam temas jurídicos " +
                 "relacionados ao tópico solicitado. Para cada recomendação, inclua: título, ano, tipo de mídia, " +
                 "sinopse focada nos aspectos jurídicos, e uma justificativa para a recomendação.",
                 
    'jogos': basePrompt + "\n\nSua tarefa é criar conteúdo para jogos educativos jurídicos sobre o tema solicitado. " +
             "Você pode criar: palavras e definições para um jogo da forca, palavras para caça-palavras, " +
             "ou pares de termos e definições para um jogo da memória. Assegure-se que o conteúdo seja " +
             "educativo e adequado para estudantes de direito.",
             
    'peticao': basePrompt + "\n\nSua tarefa é criar um modelo de petição jurídica sobre o tema solicitado. " +
               "A petição deve seguir a estrutura formal do processo civil brasileiro, incluindo: qualificação das partes, " +
               "endereçamento, nome da ação, fatos, fundamentos jurídicos, pedidos e fechamento. " +
               "Use linguagem jurídica formal e mencione legislação aplicável.",
               
    'mapamental': basePrompt + "\n\nSua tarefa é criar uma estrutura hierárquica para um mapa mental jurídico sobre o tema solicitado. " +
                 "Organize os conceitos em formato JSON, com um nó central e nós filhos em hierarquia. Para cada nó, " +
                 "forneça um título conciso e uma breve descrição. A estrutura deve ser:\n" +
                 '{\n  "central": "Tema central",\n  "filhos": [\n    {\n      "nome": "Subtema 1",\n      "descricao": "Descrição breve",\n' +
                 '      "filhos": [...]\n    },\n    ...\n  ]\n}',

    'analise_jurisprudencia': basePrompt + "\n\nSua tarefa é analisar detalhadamente a decisão judicial fornecida. " +
                             "Extraia os principais argumentos jurídicos, identifique os princípios legais aplicados, " +
                             "contextualize a decisão no ordenamento jurídico brasileiro e avalie seu potencial impacto " +
                             "em casos futuros. Organize sua análise em seções claras e bem estruturadas.",

    'transcricao_video': basePrompt + "\n\nSua tarefa é analisar a transcrição do vídeo jurídico fornecida. " +
                        "Crie um resumo conciso dos principais pontos abordados, identifique os conceitos-chave " +
                        "e extraia uma lista de termos técnicos mencionados. Organize o resultado em formato estruturado " +
                        "para facilitar o estudo e revisão do conteúdo."
  };
  
  return modulePrompts[module] || basePrompt;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      return generateErrorResponse("API key para Gemini não está configurada.");
    }

    // Parse the request body
    const { messages, systemPrompt, module, metadata, responseFormat } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return generateErrorResponse("Mensagens vazias ou em formato inválido.", 400);
    }
    
    // Build the complete prompt
    const prompt = buildPrompt(
      systemPrompt || getDefaultSystemPrompt(module), 
      messages,
      metadata
    );
    
    // Make the API call
    const generatedText = await callGeminiAPI(prompt, responseFormat);

    // Process the response if needed
    const processedResponse = responseFormat === "json" 
      ? parseGeminiResponse(generatedText, responseFormat) 
      : generatedText;

    // Return the response
    return new Response(
      JSON.stringify({ response: processedResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return generateErrorResponse(error.message || "Erro desconhecido ocorreu");
  }
});
