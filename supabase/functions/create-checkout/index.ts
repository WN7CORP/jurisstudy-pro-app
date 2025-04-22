
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeamento dos IDs de preço do Stripe
const PRICE_IDS = {
  estudante: "prod_SAxMvIaGX6rdjv",
  platina: "prod_SAxNWVgnpM84jW",
  magistral: "prod_SAxO5nw5rdgEaq"
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Função create-checkout iniciada");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
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
    logStep("Usuário autenticado:", { email: user.email });

    const body = await req.json();
    const planId = body.priceId;
    
    if (!planId || !PRICE_IDs[planId as keyof typeof PRICE_IDs]) {
      logStep("Erro: ID de plano inválido:", { planId });
      throw new Error('Plano inválido');
    }
    
    const stripeProductId = PRICE_IDs[planId as keyof typeof PRICE_IDs];
    logStep("Plano selecionado:", { planId, stripeProductId });

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      logStep("Erro: Chave do Stripe não configurada");
      throw new Error('Chave do Stripe não configurada');
    }
    
    logStep("Inicializando Stripe...");
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    logStep("Buscando cliente no Stripe...");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined = customers.data[0]?.id;
    logStep("Cliente existente:", { exists: !!customerId });

    if (!customerId) {
      logStep("Criando novo cliente...");
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      });
      customerId = customer.id;
      logStep("Novo cliente criado:", { customerId });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    logStep("Criando sessão de checkout...", { 
      customer: customerId,
      priceId: stripeProductId 
    });
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: stripeProductId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/assinatura`,
    });

    logStep("Sessão criada com sucesso:", { 
      id: session.id,
      url: session.url 
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Erro na função create-checkout:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
