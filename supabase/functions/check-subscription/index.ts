
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Tabela de Funções - check-subscription/index.ts
 * --------------------------------------------------------------------------------------------------------
 * | Função                 | Descrição                                                                   |
 * |------------------------|-----------------------------------------------------------------------------|
 * | logStep                | Registra eventos de log com detalhes opcionais para depuração.              |
 * | serve                  | Função principal que verifica o status da assinatura do usuário no Stripe.  |
 * | getTierFromPriceId     | Determina o tier de assinatura com base no price ID do Stripe.              |
 * --------------------------------------------------------------------------------------------------------
 */

// Chave Stripe fixa para debug - NOTA: Em produção, é melhor usar variáveis de ambiente
const STRIPE_SECRET_KEY = "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";

// Mapeamento entre price IDs e tiers de assinatura
const PRICE_ID_TO_TIER = {
  "price_1RGbRPIIaptXZgSJLTf0L24w": "Estudante",
  "price_1RGbSVIIaptXZgSJctc9sYiR": "Platina",
  "price_1RGbTPIIaptXZgSJW8GstpNw": "Magistral"
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Função para determinar o tier com base no priceId
const getTierFromPriceId = (priceId: string): string => {
  return PRICE_ID_TO_TIER[priceId as keyof typeof PRICE_ID_TO_TIER] || "Premium";
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

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("Nenhum cliente Stripe encontrado");
      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_tier: null,
        subscription_end: null 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const customerId = customers.data[0].id;
    logStep("Cliente encontrado", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      logStep("Nenhuma assinatura ativa encontrada");
      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_tier: null,
        subscription_end: null 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    const subscriptionTier = getTierFromPriceId(priceId);
    const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

    logStep("Assinatura ativa encontrada", { 
      subscriptionId: subscription.id, 
      priceId, 
      tier: subscriptionTier, 
      endDate: subscriptionEnd 
    });

    return new Response(JSON.stringify({
      subscribed: true,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erro ao verificar assinatura:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      subscribed: false,
      subscription_tier: null,
      subscription_end: null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
