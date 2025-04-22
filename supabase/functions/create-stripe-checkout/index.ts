
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Tabela de Funções - create-stripe-checkout/index.ts
 * --------------------------------------------------------------------------------------------------
 * | Função                 | Descrição                                                             |
 * |------------------------|-----------------------------------------------------------------------|
 * | logStep                | Registra eventos de log com detalhes opcionais para depuração.        |
 * | serve                  | Função principal que processa requisições HTTP e inicia um checkout   |
 * |                        | do Stripe para um usuário autenticado.                                |
 * | testStripeConnection   | Testa a conexão com a API do Stripe antes de iniciar o checkout.      |
 * --------------------------------------------------------------------------------------------------
 */

// Chave Stripe fixa para debug - NOTA: Em produção, é melhor usar variáveis de ambiente
const STRIPE_SECRET_KEY = "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";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STRIPE-CHECKOUT] ${step}${detailsStr}`);
};

// Função para testar a conexão com o Stripe
const testStripeConnection = async (stripe: Stripe) => {
  try {
    await stripe.balance.retrieve();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Função iniciada");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep("Erro: Header de autorização não encontrado");
      throw new Error('Não autorizado');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep("Erro ao autenticar usuário:", userError);
      throw new Error('Usuário não encontrado');
    }
    
    const user = userData.user;
    logStep("Usuário autenticado", { email: user.email });

    const body = await req.json();
    const planId = body.priceId;
    
    if (!planId) {
      logStep("Erro: ID de plano não fornecido");
      throw new Error('ID de plano não fornecido');
    }
    
    logStep("Plano selecionado", { planId });

    // Inicializar Stripe com a chave fornecida
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    logStep("Inicializando Stripe...");
    
    // Testar a conexão com o Stripe
    const connectionTest = await testStripeConnection(stripe);
    if (!connectionTest.success) {
      logStep("Erro na conexão com Stripe:", connectionTest.error);
      throw new Error(`Erro na comunicação com Stripe: ${connectionTest.error.message}`);
    }
    
    logStep("Conexão com Stripe estabelecida com sucesso");

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Cliente existente encontrado", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
      logStep("Novo cliente criado", { customerId });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: planId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/assinatura`,
    });

    logStep("Sessão de checkout criada", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erro no checkout:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Verifique se a chave de API do Stripe está configurada corretamente."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
