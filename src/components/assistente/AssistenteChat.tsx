
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Sparkles, BookText, Map, Brain, Newspaper, FileText, Video, Gamepad } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sendMessageToGemini } from "@/utils/geminiAI";
import { GeminiRequestOptions } from "@/types/supabase";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CommandOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  module: string;
}

/**
 * Tabela de Funções - AssistenteChat.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | AssistenteChat          | Componente para chat interativo com IA assistente                   |
 * | (Componente)            | gerencia mensagens, comandos e resposta da API Gemini               |
 * | scrollToBottom          | Rola o chat para a parte inferior                                   |
 * | (Função)                | para manter visível a mensagem mais recente                         |
 * | handleSubmit            | Processa envio de mensagem e chama a API                            |
 * | (Função)                | formata dados, gerencia estados e lida com respostas                |
 * | saveInteraction         | Salva interações do chat no banco de dados                          |
 * | (Função)                | para manter histórico e análises futuras                            |
 * | handleCommandClick      | Processa cliques em comandos predefinidos                           |
 * | (Função)                | insere texto de comando e configura módulo ativo                    |
 * | renderMessageContent    | Renderiza conteúdo da mensagem com formatação                       |
 * | (Função)                | suporta diferentes tipos de conteúdo e formatação                   |
 * -------------------------------------------------------------------------------------------------
 */

export const AssistenteChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou a Gemini, sua assistente jurídica virtual. Como posso ajudar você hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [activeModule, setActiveModule] = useState<string | undefined>(undefined);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkForSlash = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowCommands(true);
      }
      if (e.key === 'Escape') {
        setShowCommands(false);
      }
    };

    window.addEventListener('keydown', checkForSlash);
    return () => window.removeEventListener('keydown', checkForSlash);
  }, []);

  const commandOptions: CommandOption[] = [
    { 
      id: 'mapa', 
      name: 'Mapa Mental', 
      description: 'Gerar um mapa mental sobre um tema jurídico', 
      icon: <Map className="h-5 w-5" />, 
      action: '/mapa', 
      module: 'mapa'
    },
    { 
      id: 'resumo', 
      name: 'Resumo', 
      description: 'Criar um resumo sobre um tema jurídico', 
      icon: <BookText className="h-5 w-5" />, 
      action: '/resumo', 
      module: 'resumo'
    },
    { 
      id: 'questao', 
      name: 'Questões', 
      description: 'Gerar questões sobre um tema jurídico', 
      icon: <Brain className="h-5 w-5" />, 
      action: '/questao', 
      module: 'questao'
    },
    { 
      id: 'artigo', 
      name: 'Artigo Jurídico', 
      description: 'Escrever um artigo jurídico para o blog', 
      icon: <FileText className="h-5 w-5" />, 
      action: '/artigo', 
      module: 'artigo'
    },
    { 
      id: 'noticias', 
      name: 'Notícias', 
      description: 'Buscar notícias jurídicas recentes', 
      icon: <Newspaper className="h-5 w-5" />, 
      action: '/noticias', 
      module: 'noticias'
    },
    { 
      id: 'jurisflix', 
      name: 'JurisFlix', 
      description: 'Recomendar conteúdo audiovisual jurídico', 
      icon: <Video className="h-5 w-5" />, 
      action: '/jurisflix', 
      module: 'jurisflix'
    },
    { 
      id: 'jogos', 
      name: 'Jogos Jurídicos', 
      description: 'Sugerir jogos jurídicos interativos', 
      icon: <Gamepad className="h-5 w-5" />, 
      action: '/jogos', 
      module: 'jogos'
    },
    { 
      id: 'peticao', 
      name: 'Peticionário', 
      description: 'Criar uma petição jurídica', 
      icon: <FileText className="h-5 w-5" />, 
      action: '/peticao', 
      module: 'peticao'
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Detect command and set active module
    const commandMatch = input.match(/^\/(\w+)/);
    let currentModule = activeModule;
    
    if (commandMatch) {
      const command = commandMatch[1];
      const matchingCommand = commandOptions.find(
        opt => opt.action === `/${command}` || opt.module === command
      );
      
      if (matchingCommand) {
        currentModule = matchingCommand.module;
        setActiveModule(currentModule);
      }
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowCommands(false);
    
    try {
      // Format messages for the API
      const apiMessages = messages
        .concat(userMessage)
        .map(msg => ({ role: msg.role, content: msg.content }));
      
      // Create options for the Gemini API
      const options: GeminiRequestOptions = currentModule 
        ? { module: currentModule }
        : {};
        
      // Call Gemini API
      const response = await sendMessageToGemini(apiMessages, options);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save conversation to Supabase
      await saveInteraction(userMessage.content, assistantMessage.content, currentModule);
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem.",
        variant: "destructive",
      });
      
      // Add error message for user visibility
      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInteraction = async (prompt: string, response: string, module?: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user?.id) {
        await supabase
          .from('interacoes_ia')
          .insert({
            usuario_id: sessionData.session.user.id,
            tipo_interacao: module || 'assistente',
            conteudo: prompt,
            resposta: response
          });
      }
    } catch (error) {
      console.error("Error saving interaction:", error);
    }
  };

  const handleCommandClick = (command: CommandOption) => {
    setInput(command.action + ' ');
    setActiveModule(command.module);
    setShowCommands(false);
    inputRef.current?.focus();
  };

  const renderMessageContent = (content: string) => {
    // For simple text messages, just return the content
    return <p className="whitespace-pre-wrap">{content}</p>;
    
    // TODO: Implement rich rendering for different message types
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <Tabs
        defaultValue="chat"
        className="w-full"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="h-[calc(100vh-280px)]">
          <Card className="border-0 shadow-none h-full flex flex-col">
            <CardContent className="p-4 h-full flex flex-col">
              <ScrollArea className="flex-grow pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {renderMessageContent(message.content)}
                        <div className="text-xs opacity-70 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-4 bg-muted flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (e.target.value.startsWith('/')) {
                      setShowCommands(true);
                    } else {
                      setShowCommands(false);
                    }
                  }}
                  placeholder="Digite uma mensagem ou / para comandos..."
                  disabled={isLoading}
                  className="pr-12"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading || input.trim() === ''}
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Enviar</span>
                </Button>
              </form>
              
              {showCommands && (
                <div className="absolute bottom-14 left-0 right-0 bg-background border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-sm text-muted-foreground px-2 py-1">Comandos disponíveis:</p>
                    <div className="space-y-1">
                      {commandOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded cursor-pointer"
                          onClick={() => handleCommandClick(option)}
                        >
                          {option.icon}
                          <div>
                            <p className="font-medium">{option.name}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="h-[calc(100vh-280px)]">
          <Card className="border-0 shadow-none h-full flex flex-col">
            <CardContent className="p-4 h-full">
              <p className="text-center text-muted-foreground">
                Histórico de conversas será implementado em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {activeModule && (
        <div className="py-2 px-4 bg-muted/50 rounded-md mt-2 text-sm text-muted-foreground flex items-center">
          <span>Modo ativo: {commandOptions.find(cmd => cmd.module === activeModule)?.name || activeModule}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto h-6 text-xs"
            onClick={() => setActiveModule(undefined)}
          >
            Resetar
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Table of Functions & Their Descriptions
 * 
 * | Function               | Description                                        | Parameters                    | Return Value    |
 * |------------------------|----------------------------------------------------|-------------------------------|----------------|
 * | scrollToBottom         | Scrolls chat to the bottom                         | None                          | void           |
 * | handleSubmit           | Processes form submission and sends message to API | FormEvent                     | Promise<void>  |
 * | saveInteraction        | Saves chat interaction to Supabase                 | prompt, response, module      | Promise<void>  |
 * | handleCommandClick     | Handles clicking on a command from the menu        | CommandOption                 | void           |
 * | renderMessageContent   | Renders the content of a message                   | content (string)              | ReactNode      |
 */
