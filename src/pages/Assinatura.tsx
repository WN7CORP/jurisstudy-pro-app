
import React from 'react';
import Layout from '@/components/layout/Layout';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { subscriptionPlans } from '@/components/subscription/PlanFeatures';

export default function Assinatura() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Escolha seu plano</h1>
            <p className="text-muted-foreground">
              Assine agora e tenha acesso ao conteúdo que melhor se adapta às suas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {subscriptionPlans.map((plan, index) => (
              <div key={plan.id} className="relative">
                <SubscriptionCard 
                  plan={plan}
                  isPopular={index === 2} // Magistral é o plano mais popular
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
