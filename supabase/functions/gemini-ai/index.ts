
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error("API key for Gemini is not set.");
    }

    const { messages, systemPrompt, module } = await req.json();
    
    // Build the request for Gemini API
    const geminiMessages = [
      {
        role: "user",
        parts: [
          {
            text: buildPrompt(systemPrompt || getDefaultSystemPrompt(module), messages)
          }
        ]
      }
    ];

    // Make request to Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(`Gemini API error: ${data.error?.message || "Unknown error"}`);
    }

    // Extract the response text
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(
      JSON.stringify({ 
        response: generatedText 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in gemini-ai function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to build the complete prompt
function buildPrompt(systemPrompt: string, messages: any[]): string {
  // Start with the system prompt
  let fullPrompt = systemPrompt + "\n\n";
  
  // Add the conversation history
  messages.forEach((msg, index) => {
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
               "Use linguagem jurídica formal e mencione legislação aplicável."
  };
  
  return modulePrompts[module] || basePrompt;
}
