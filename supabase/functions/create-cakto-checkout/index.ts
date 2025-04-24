
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeamento dos IDs dos planos da Cakto
const CAKTO_PLAN_IDs = {
  estudante: "36vq3qk_355330",
  platina: "xu4vwp6_355334",
  magistral: "3dnhw9q_355336"
};

/**
 * Tabela de Funções - create-cakto-checkout/index.ts
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | serve                   | Função principal que processa as requisições para criar uma         |
 * |                         | sessão de checkout do Cakto                                         |
 * | createCaktoCheckout     | Função que faz a requisição para a API do Cakto para criar um       |
 * |                         | checkout baseado no plano selecionado                               |
 * | handleRequest           | Função que processa a requisição HTTP, extrai dados do usuário      |
 * |                         | e do plano selecionado                                              |
 * -------------------------------------------------------------------------------------------------
 */

async function createCaktoCheckout(planId: string, userEmail: string, origin: string) {
  console.log("Criando checkout para plano:", planId, "email:", userEmail);

  const caktoApiKey = Deno.env.get('CAKTO_API_KEY');
  if (!caktoApiKey) {
    throw new Error('Chave da API Cakto não configurada');
  }

  // URL correta da API do Cakto
  const apiUrl = 'https://pay.cakto.com.br/api/v2/checkout/create';
  
  // Payload da requisição
  const payload = {
    plan_id: planId,
    customer_email: userEmail,
    success_url: `${origin}/success`,
    cancel_url: `${origin}/assinatura`,
  };

  console.log("Enviando requisição para Cakto:", {
    url: apiUrl,
    payload: JSON.stringify(payload)
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${caktoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("Resposta da API Cakto:", responseData);

    if (!response.ok) {
      const errorMessage = responseData.message || responseData.error || 'Erro ao criar checkout';
      console.error("Erro da API Cakto:", errorMessage);
      throw new Error(`Erro da API Cakto: ${errorMessage}`);
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao fazer requisição para Cakto:", error);
    throw error;
  }
}

async function handleRequest(req: Request) {
  try {
    console.log("[CREATE-CAKTO-CHECKOUT] Iniciando checkout");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autorizado');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error("[CREATE-CAKTO-CHECKOUT] Erro de autenticação:", userError);
      throw new Error('Usuário não encontrado');
    }

    const { planId } = await req.json();
    console.log("[CREATE-CAKTO-CHECKOUT] PlanId recebido:", planId);
    
    if (!planId || !CAKTO_PLAN_IDs[planId as keyof typeof CAKTO_PLAN_IDs]) {
      throw new Error('Plano inválido');
    }

    const caktoPlanId = CAKTO_PLAN_IDs[planId as keyof typeof CAKTO_PLAN_IDs];
    console.log("[CREATE-CAKTO-CHECKOUT] ID do plano Cakto:", caktoPlanId);
    
    const origin = req.headers.get('origin') || 'https://seu-site.com';
    const checkoutData = await createCaktoCheckout(caktoPlanId, user.email || '', origin);

    return new Response(JSON.stringify({ url: checkoutData.checkout_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("[CREATE-CAKTO-CHECKOUT] Erro:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  return await handleRequest(req);
});
