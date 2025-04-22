
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiResponse {
  response: string;
  error?: string;
}

/**
 * Sends a message to the Gemini AI assistant
 * @param messages - Array of message objects with role and content
 * @param module - Optional module specifier for specialized prompts
 * @param systemPrompt - Optional custom system prompt
 * @returns Promise with the assistant's response
 */
export const sendMessageToGemini = async (
  messages: Message[],
  module?: string,
  systemPrompt?: string
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke<GeminiResponse>('gemini-ai', {
      body: { messages, module, systemPrompt }
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
 * Table of Functions & Their Descriptions
 * 
 * | Function               | Description                                            | Parameters                       | Return Value    |
 * |------------------------|--------------------------------------------------------|----------------------------------|----------------|
 * | sendMessageToGemini    | Sends messages to the Gemini AI assistant              | messages, module, systemPrompt   | Promise<string>|
 */
