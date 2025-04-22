
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { AssistenteChat } from "@/components/assistente/AssistenteChat";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Assistente: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {showIntro ? (
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Gemini - Assistente Jurídica</h1>
              <p className="text-muted-foreground">
                Sua assistente jurídica pessoal com inteligência artificial
              </p>
            </div>
            
            <div className="relative w-full h-64 sm:h-80 mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">O que a Gemini pode fazer por você?</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                <li className="flex items-start space-x-2">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Gerar mapas mentais interativos sobre temas jurídicos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Criar resumos e anotações jurídicas personalizadas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Gerar questões por disciplina e área do direito</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Escrever artigos jurídicos para o seu blog</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Recomendar conteúdo audiovisual jurídico</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="bg-primary/20 p-1 rounded-full mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Criar petições jurídicas personalizadas</span>
                </li>
              </ul>
            </div>
            
            <Button 
              size="lg" 
              onClick={() => setShowIntro(false)}
              className="bg-netflix-red hover:bg-netflix-red/90"
            >
              Começar a usar a Gemini
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Gemini - Assistente Jurídica</h1>
              <p className="text-muted-foreground">
                Interaja com sua assistente jurídica pessoal
              </p>
            </div>
            
            <AssistenteChat />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Assistente;
