
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeamento dos IDs dos planos da Cakto
const CAKTO_PLAN_IDs = {
  estudante: "estudante_mensal",
  platina: "platina_mensal",
  magistral: "magistral_mensal"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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
      throw new Error('Usuário não encontrado');
    }

    const { planId } = await req.json();
    if (!planId || !CAKTO_PLAN_IDs[planId as keyof typeof CAKTO_PLAN_IDs]) {
      throw new Error('Plano inválido');
    }

    const caktoPlanId = CAKTO_PLAN_IDs[planId as keyof typeof CAKTO_PLAN_IDs];
    
    // Criar checkout na Cakto
    const caktoApiKey = Deno.env.get('CAKTO_API_KEY');
    const response = await fetch('https://api.cakto.com.br/v1/checkout/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${caktoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: caktoPlanId,
        customer_email: user.email,
        success_url: `${req.headers.get('origin')}/success`,
        cancel_url: `${req.headers.get('origin')}/assinatura`,
      }),
    });

    const checkoutData = await response.json();
    
    if (!response.ok) {
      throw new Error(checkoutData.message || 'Erro ao criar checkout');
    }

    return new Response(JSON.stringify({ url: checkoutData.checkout_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("[CREATE-CAKTO-CHECKOUT] Erro:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
