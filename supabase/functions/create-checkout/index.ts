
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICE_IDS = {
  estudante: {
    amount: 1199,
    name: "Plano Estudante"
  },
  platina: {
    amount: 1999,
    name: "Plano Platina"
  },
  magistral: {
    amount: 2999,
    name: "Plano Magistral"
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Função create-checkout iniciada");
    
    // Create Supabase client with anon key for authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verificar autenticação do usuário
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log("Erro: Header de autorização não encontrado");
      throw new Error('Não autorizado');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.log("Erro ao autenticar usuário:", userError);
      throw new Error('Usuário não encontrado');
    }
    
    const user = userData.user;
    console.log("Usuário autenticado:", user.email);

    // Obter o ID do plano do body da requisição
    const body = await req.json();
    const priceId = body.priceId;
    
    if (!priceId || !PRICE_IDS[priceId as keyof typeof PRICE_IDS]) {
      console.log("Erro: ID de plano inválido:", priceId);
      throw new Error('Plano inválido');
    }
    
    const planDetails = PRICE_IDS[priceId as keyof typeof PRICE_IDS];
    console.log("Plano selecionado:", priceId, planDetails);

    // Inicializar o Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.log("Erro: Chave do Stripe não configurada");
      throw new Error('Chave do Stripe não configurada');
    }
    
    console.log("Inicializando Stripe...");
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Verificar se o cliente já existe no Stripe
    console.log("Buscando cliente no Stripe...");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined = customers.data[0]?.id;
    console.log("Cliente existente:", customerId ? "Sim" : "Não");

    // Se o cliente não existir, criar um novo
    if (!customerId) {
      console.log("Criando novo cliente...");
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      });
      customerId = customer.id;
      console.log("Novo cliente criado:", customerId);
    }

    // Criar a sessão de checkout
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    console.log("Criando sessão de checkout...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: planDetails.name,
              description: `Acesso completo ao ${planDetails.name}`,
            },
            unit_amount: planDetails.amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/assinatura`,
    });

    console.log("Sessão criada com sucesso:", session.id);
    console.log("URL de checkout:", session.url);

    // Retornar a URL da sessão de checkout
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
