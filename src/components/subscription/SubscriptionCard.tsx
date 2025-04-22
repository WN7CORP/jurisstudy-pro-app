
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Check, X, Loader2 } from 'lucide-react';
import type { SubscriptionPlan } from './PlanFeatures';

/**
 * Tabela de Funções - SubscriptionCard.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                   | Descrição                                                          |
 * |--------------------------|-------------------------------------------------------------------|
 * | SubscriptionCard         | Renderiza um card de plano de assinatura com informações sobre     |
 * | (Componente)             | preço, recursos incluídos e botão para assinar.                    |
 * |--------------------------|-------------------------------------------------------------------|
 * | handleSubscribe          | Processa a solicitação de assinatura, chamando a função do Stripe  |
 * | (Função)                 | para criar um checkout e redirecionando o usuário.                 |
 * -------------------------------------------------------------------------------------------------
 */

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
}

export function SubscriptionCard({ plan, isPopular }: SubscriptionCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Autenticação necessária",
          description: "Você precisa estar logado para assinar um plano.",
        });
        setLoading(false);
        return;
      }
      
      console.log("Iniciando checkout para o plano:", plan.id);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: plan.id }
      });
      
      if (error) {
        console.error('Erro ao iniciar checkout:', error);
        throw error;
      }
      
      if (data?.url) {
        console.log("URL de checkout recebida, redirecionando para:", data.url);
        window.location.href = data.url;
      } else {
        console.error('URL de checkout não recebida:', data);
        throw new Error('URL de checkout não recebida');
      }
    } catch (error) {
      console.error('Erro completo ao assinar:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar o processo de assinatura.",
      });
      setLoading(false);
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
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubscribe} 
          className="w-full" 
          variant={isPopular ? "default" : "outline"}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Assinar agora"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
