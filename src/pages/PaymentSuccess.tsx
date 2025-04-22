
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Tabela de Funções - PaymentSuccess.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | PaymentSuccess          | Renderiza uma página de confirmação após o sucesso do pagamento.    |
 * | (Componente)            | Exibe mensagem de confirmação e botões para continuar navegando.    |
 * -------------------------------------------------------------------------------------------------
 */

export default function PaymentSuccess() {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    console.log('Checkout completado. ID da sessão:', sessionId);
    // Aqui você pode chamar uma função para verificar o status da assinatura se necessário
  }, [sessionId]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Assinatura Confirmada!</h1>
          <p className="text-muted-foreground mb-8">
            Obrigado por se tornar um assinante. Seu acesso aos recursos premium foi ativado.
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/">Ir para Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/profile">Gerenciar Assinatura</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
