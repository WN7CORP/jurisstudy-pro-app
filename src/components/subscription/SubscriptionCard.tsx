
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function SubscriptionCard() {
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar o processo de assinatura.",
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Plano Premium</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-bold text-center">R$ 29,90<span className="text-sm font-normal">/mês</span></p>
        <ul className="space-y-2">
          <li className="flex items-center">✓ Acesso a todos os cursos</li>
          <li className="flex items-center">✓ Conteúdo exclusivo</li>
          <li className="flex items-center">✓ Materiais complementares</li>
          <li className="flex items-center">✓ Suporte prioritário</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubscribe} className="w-full">
          Assinar agora
        </Button>
      </CardFooter>
    </Card>
  );
}
