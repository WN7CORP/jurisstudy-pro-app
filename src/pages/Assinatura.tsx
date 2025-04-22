
import React from 'react';
import Layout from '@/components/layout/Layout';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { subscriptionPlans } from '@/components/subscription/PlanFeatures';
import { Card } from '@/components/ui/card';

/**
 * Tabela de Funções - Assinatura.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | Assinatura (Componente) | Renderiza a página de planos de assinatura com cards informativos   |
 * |                         | para cada plano disponível. Apresenta detalhes como preço e         |
 * |                         | recursos incluídos. Aciona o Stripe quando o usuário clica para     |
 * |                         | assinar um plano.                                                   |
 * -------------------------------------------------------------------------------------------------
 */

export default function Assinatura() {
  if (!subscriptionPlans || subscriptionPlans.length === 0) {
    // Renderizar um estado de carregamento ou erro caso os planos não estejam disponíveis
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="p-8 max-w-md w-full">
            <h1 className="text-xl font-bold mb-4 text-center">Carregando planos de assinatura...</h1>
            <p className="text-muted-foreground text-center">
              Por favor, aguarde enquanto carregamos as opções de planos disponíveis.
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
              <div key={plan.id} 
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
