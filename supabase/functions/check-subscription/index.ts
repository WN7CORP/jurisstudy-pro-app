
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Tabela de Funções - check-subscription/index.ts
 * --------------------------------------------------------------------------------------------------
 * | Função                 | Descrição                                                             |
 * |------------------------|-----------------------------------------------------------------------|
 * | serve                  | Função principal que verifica o status da assinatura de um usuário    |
 * |                        | autenticado e atualiza essas informações no banco de dados.           |
 * --------------------------------------------------------------------------------------------------
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CHECK-SUBSCRIPTION] Função iniciada");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log("[CHECK-SUBSCRIPTION] Erro: Header de autorização não encontrado");
      throw new Error('Não autorizado');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      console.log("[CHECK-SUBSCRIPTION] Erro ao autenticar usuário:", userError);
      throw new Error('Usuário não encontrado');
    }

    console.log("[CHECK-SUBSCRIPTION] Usuário autenticado:", { email: userData.user.email });
    
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.log("[CHECK-SUBSCRIPTION] Erro: Chave do Stripe não configurada");
      throw new Error('Chave do Stripe não configurada');
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const customers = await stripe.customers.list({
      email: userData.user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      console.log("[CHECK-SUBSCRIPTION] Nenhum cliente encontrado no Stripe");
      await supabaseClient.from('subscribers').upsert({
        email: userData.user.email,
        user_id: userData.user.id,
        subscribed: false,
      });
      
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("[CHECK-SUBSCRIPTION] Cliente encontrado no Stripe:", { customerId: customers.data[0].id });
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
    });

    const isSubscribed = subscriptions.data.length > 0;
    let subscriptionTier = null;
    const subscriptionEnd = isSubscribed 
      ? new Date(subscriptions.data[0].current_period_end * 1000) 
      : null;
    
    if (isSubscribed && subscriptions.data[0].items.data[0].price) {
      const priceId = subscriptions.data[0].items.data[0].price.id;
      
      // Determinar o tier com base no ID do preço
      if (priceId === "price_1RGbRPIIaptXZgSJLTf0L24w") {
        subscriptionTier = "estudante";
      } else if (priceId === "price_1RGbSVIIaptXZgSJctc9sYiR") {
        subscriptionTier = "platina";
      } else if (priceId === "price_1RGbTPIIaptXZgSJW8GstpNw") {
        subscriptionTier = "magistral";
      }
      
      console.log("[CHECK-SUBSCRIPTION] Assinatura ativa encontrada:", { 
        tier: subscriptionTier, 
        endDate: subscriptionEnd 
      });
    } else {
      console.log("[CHECK-SUBSCRIPTION] Nenhuma assinatura ativa encontrada");
    }

    await supabaseClient.from('subscribers').upsert({
      email: userData.user.email,
      user_id: userData.user.id,
      stripe_customer_id: customers.data[0].id,
      subscribed: isSubscribed,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd?.toISOString(),
    });

    console.log("[CHECK-SUBSCRIPTION] Informações de assinatura atualizadas no banco de dados");
    
    return new Response(JSON.stringify({
      subscribed: isSubscribed,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("[CHECK-SUBSCRIPTION] Erro:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
