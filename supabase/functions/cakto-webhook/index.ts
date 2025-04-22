
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CAKTO-WEBHOOK] Webhook recebido");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const payload = await req.json();
    console.log("[CAKTO-WEBHOOK] Payload:", payload);

    const { 
      transaction_id, 
      status, 
      customer_email, 
      amount,
      subscription_plan 
    } = payload;

    if (status === 'approved') {
      // Buscar usuário pelo email
      const { data: userData, error: userError } = await supabaseClient.auth
        .admin.getUserByEmail(customer_email);

      if (userError || !userData) {
        throw new Error('Usuário não encontrado');
      }

      // Registrar pagamento
      await supabaseClient.from('cakto_payments').insert({
        user_id: userData.id,
        transaction_id,
        amount,
        status,
        metadata: payload
      });

      // Atualizar assinatura
      await supabaseClient.from('subscribers').upsert({
        user_id: userData.id,
        email: customer_email,
        subscribed: true,
        subscription_tier: subscription_plan,
        cakto_customer_id: payload.customer_id,
        current_period_end: new Date(payload.subscription_end).toISOString()
      });

      console.log("[CAKTO-WEBHOOK] Assinatura ativada com sucesso");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("[CAKTO-WEBHOOK] Erro:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
