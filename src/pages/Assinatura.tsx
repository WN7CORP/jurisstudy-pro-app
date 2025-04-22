
import React from 'react';
import Layout from '@/components/layout/Layout';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';

export default function Assinatura() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Escolha seu plano</h1>
            <p className="text-muted-foreground">
              Assine agora e tenha acesso a todo o conteúdo premium
            </p>
          </div>
          
          <div className="flex justify-center">
            <SubscriptionCard />
          </div>
        </div>
      </div>
    </Layout>
  );
}
