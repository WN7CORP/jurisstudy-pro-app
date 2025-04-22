
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlashcardRequest {
  fileType: 'pdf' | 'image' | 'audio';
  fileContent: string;
  area: string;
  userId: string;
}

interface FlashcardData {
  area: string;
  tema: string;
  pergunta: string;
  resposta: string;
  explicacao: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestData: FlashcardRequest = await req.json();
    const { fileType, fileContent, area, userId } = requestData;

    if (!fileType || !fileContent || !area || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare prompt based on file type
    let prompt = '';
    if (fileType === 'pdf' || fileType === 'image') {
      prompt = `Analise este conteúdo de ${fileType === 'pdf' ? 'PDF' : 'imagem'} sobre ${area} do Direito e gere 5 flashcards no formato JSON. Para cada flashcard, inclua: area (a área do Direito), tema (o tema específico), pergunta (uma pergunta sobre o conteúdo), resposta (a resposta correta e concisa), e explicacao (uma explicação mais detalhada do conceito). O conteúdo é: ${fileContent.substring(0, 5000)}`;
    } else if (fileType === 'audio') {
      prompt = `Analise esta transcrição de áudio sobre ${area} do Direito e gere 5 flashcards no formato JSON. Para cada flashcard, inclua: area (a área do Direito), tema (o tema específico), pergunta (uma pergunta sobre o conteúdo), resposta (a resposta correta e concisa), e explicacao (uma explicação mais detalhada do conceito). A transcrição é: ${fileContent.substring(0, 5000)}`;
    }

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    let flashcards: FlashcardData[] = [];
    
    // Extract flashcards from Gemini response
    try {
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response text which may be surrounded by markdown code blocks
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || generatedText.match(/\[([\s\S]*?)\]/);
      
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0] || jsonMatch[1]);
      } else {
        // If no JSON format is detected, try to parse the whole text
        flashcards = JSON.parse(generatedText);
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI-generated flashcards', aiResponse: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save flashcards to Supabase
    const savedFlashcards = [];
    for (const card of flashcards) {
      const { data, error } = await supabase
        .from('user_flashcards')
        .insert({
          user_id: userId,
          area: card.area || area,
          tema: card.tema,
          pergunta: card.pergunta,
          resposta: card.resposta,
          explicacao: card.explicacao,
          source_type: fileType
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving flashcard:", error);
      } else {
        savedFlashcards.push(data);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        flashcards: savedFlashcards,
        message: `Created ${savedFlashcards.length} flashcards from your ${fileType}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
