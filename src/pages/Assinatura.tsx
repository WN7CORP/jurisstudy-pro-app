
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { subscriptionPlans } from '@/components/subscription/PlanFeatures';
import { Card } from '@/components/ui/card';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export default function Assinatura() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verificar se o usuário está autenticado
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar autenticação:', error);
          setAuthError(error.message);
          toast.error("Erro ao verificar autenticação", {
            description: "Por favor, faça login novamente."
          });
        } else {
          setIsAuthenticated(!!data?.session);
        }
      } catch (err) {
        console.error('Erro inesperado ao verificar autenticação:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, []);

  // Verificar conexão com o Supabase
  useEffect(() => {
    async function pingSupabase() {
      try {
        const start = Date.now();
        const { data, error } = await supabase.auth.getSession();
        const latency = Date.now() - start;
        
        console.log(`Ping ao Supabase: ${latency}ms`, { data, error });
      } catch (err) {
        console.error('Erro ao pingar Supabase:', err);
      }
    }

    pingSupabase();
  }, []);

  // Exibir mensagem de carregamento enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="p-8 max-w-md w-full">
            <h1 className="text-xl font-bold mb-4 text-center">Verificando...</h1>
            <p className="text-muted-foreground text-center">
              Aguarde enquanto verificamos seu acesso.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  // Verificar se o usuário está autenticado
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="p-8 max-w-md w-full">
            <h1 className="text-xl font-bold mb-4 text-center">Login Necessário</h1>
            <p className="text-muted-foreground text-center mb-4">
              Você precisa estar logado para assinar um plano.
              {authError && <span className="block text-red-500 mt-2">Erro: {authError}</span>}
            </p>
            <div className="flex justify-center">
              <a 
                href="/auth" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Fazer Login
              </a>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // Add a more robust check for subscription plans
  if (!subscriptionPlans || subscriptionPlans.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="p-8 max-w-md w-full">
            <h1 className="text-xl font-bold mb-4 text-center">Planos de Assinatura Indisponíveis</h1>
            <p className="text-muted-foreground text-center">
              Desculpe, não há planos de assinatura disponíveis no momento. Por favor, tente novamente mais tarde.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Escolha o plano ideal para você</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Invista em seu futuro jurídico com nossos planos personalizados. 
              Cada plano foi cuidadosamente elaborado para atender às suas necessidades específicas, 
              desde estudantes até profissionais estabelecidos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {subscriptionPlans.map((plan, index) => (
              <div 
                key={plan.id} 
                className={`relative ${
                  index === 2 ? 'md:transform md:-translate-y-4' : ''
                }`}
              >
                <SubscriptionCard 
                  plan={plan}
                  isPopular={index === 2}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Todos os planos incluem 7 dias de garantia. Cancele a qualquer momento.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Pagamento processado com segurança pelo Stripe.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
