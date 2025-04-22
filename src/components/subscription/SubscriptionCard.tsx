
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import type { SubscriptionPlan } from './PlanFeatures';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Tabela de Funções - SubscriptionCard.tsx
 * --------------------------------------------------------------------------------------------------
 * | Função                 | Descrição                                                             |
 * |------------------------|-----------------------------------------------------------------------|
 * | SubscriptionCard       | Componente que renderiza um cartão de plano de assinatura com seus    |
 * |                        | detalhes e um botão para iniciar o processo de checkout.              |
 * | handleSubscribe        | Gerencia o processo de checkout com Cakto, tratando erros e sucesso.  |
 * | handleSubscribeError   | Processa erros durante o checkout e exibe mensagens apropriadas.      |
 * --------------------------------------------------------------------------------------------------
 */

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
}

export function SubscriptionCard({ plan, isPopular }: SubscriptionCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Função para processar erros de checkout
  const handleSubscribeError = (error: any) => {
    console.error('Detalhes do erro ao iniciar checkout:', error);
    
    let message = "Não foi possível iniciar o checkout. Tente novamente mais tarde.";
    
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.details) {
      message = error.details;
    }
    
    setErrorMessage(message);
    
    toast({
      variant: "destructive",
      title: "Erro ao processar pagamento",
      description: message
    });
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      toast({
        title: "Processando",
        description: "Inicializando o checkout do Cakto...",
      });
      
      console.log(`Iniciando checkout para o plano: ${plan.name} (ID: ${plan.id})`);
      
      const { data, error } = await supabase.functions.invoke('create-cakto-checkout', {
        body: { planId: plan.id },
      });

      console.log('Resposta da função create-cakto-checkout:', { data, error });

      if (error) {
        console.error('Erro na função create-cakto-checkout:', error);
        throw new Error(`Erro na função create-cakto-checkout: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Resposta vazia da API');
      }

      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.url) {
        throw new Error('URL de checkout não encontrada na resposta');
      }

      console.log('Redirecionando para URL do Cakto:', data.url);
      
      // Adicionar um pequeno delay antes do redirecionamento
      setTimeout(() => {
        window.location.href = data.url;
      }, 500);
      
    } catch (error) {
      handleSubscribeError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full h-full ${isPopular ? 'border-primary shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
          Mais Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl text-center">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-bold text-center">
          R$ {plan.price.toFixed(2)}<span className="text-sm font-normal">/mês</span>
        </p>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {feature.included ? (
                <Check className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <X className="h-4 w-4 text-red-500 shrink-0" />
              )}
              <span>{feature.name}</span>
            </li>
          ))}
        </ul>
        
        {errorMessage && (
          <div className="text-sm text-red-500 mt-2">
            Erro: {errorMessage}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleSubscribe} 
          className="w-full" 
          variant={isPopular ? "default" : "outline"}
          disabled={isLoading}
        >
          {isLoading ? "Processando..." : "Assinar agora"}
        </Button>
        
        {/* Adiciona um link alternativo para o Kiwify como fallback */}
        <a 
          href={plan.kiwifyUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-center text-muted-foreground hover:underline w-full"
        >
          Problemas? Assine via Kiwify
        </a>
      </CardFooter>
    </Card>
  );
}
