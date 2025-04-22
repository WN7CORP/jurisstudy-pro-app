
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Tabela de Funções - customer-portal/index.ts
 * --------------------------------------------------------------------------------------------------------
 * | Função                 | Descrição                                                                   |
 * |------------------------|-----------------------------------------------------------------------------|
 * | logStep                | Registra eventos de log com detalhes opcionais para depuração.              |
 * | serve                  | Função principal que cria uma sessão do portal do cliente do Stripe.        |
 * --------------------------------------------------------------------------------------------------------
 */

// Chave Stripe fixa para debug - NOTA: Em produção, é melhor usar variáveis de ambiente
const STRIPE_SECRET_KEY = "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";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
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
      throw new Error('Nenhum cliente Stripe encontrado para este usuário');
    }

    const customerId = customers.data[0].id;
    logStep("Cliente encontrado", { customerId });

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/profile`,
    });

    logStep("Sessão do portal criada", { sessionUrl: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erro ao criar sessão do portal:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
