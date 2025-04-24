
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Tabela de Funções - cakto-webhook/index.ts
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | serve                   | Função principal que processa os webhooks recebidos do Cakto        |
 * | validateWebhook         | Valida o webhook usando a chave secreta configurada                 |
 * | processPayment          | Processa o pagamento aprovado, atualizando status do usuário        |
 * | processSubscriptionEvent| Processa eventos de assinatura (criada, renovada, cancelada)        |
 * -------------------------------------------------------------------------------------------------
 */

// Validar webhook usando a chave secreta
function validateWebhook(req: Request, webhookSecret: string | null): boolean {
  if (!webhookSecret) {
    console.log("[CAKTO-WEBHOOK] Webhook secret não configurado, autenticação desabilitada");
    return true;
  }
  
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.replace('Bearer ', '') !== webhookSecret) {
    console.error("[CAKTO-WEBHOOK] Autenticação inválida");
    return false;
  }
  
  return true;
}

// Processar pagamento aprovado
async function processPayment(supabaseClient: any, payload: any) {
  console.log("[CAKTO-WEBHOOK] Processando pagamento aprovado");
  
  const { 
    transaction_id, 
    customer_email, 
    amount,
    subscription_plan,
    customer_id,
    subscription_end
  } = payload;

  try {
    // Buscar usuário pelo email
    const { data: userData, error: userError } = await supabaseClient.auth
      .admin.getUserByEmail(customer_email);

    if (userError || !userData) {
      console.error("[CAKTO-WEBHOOK] Usuário não encontrado:", userError);
      throw new Error('Usuário não encontrado');
    }

    console.log("[CAKTO-WEBHOOK] Usuário encontrado:", userData.id);

    // Registrar pagamento
    const { error: paymentError } = await supabaseClient.from('cakto_payments').insert({
      user_id: userData.id,
      transaction_id,
      amount,
      status: 'approved',
      metadata: payload
    });

    if (paymentError) {
      console.error("[CAKTO-WEBHOOK] Erro ao registrar pagamento:", paymentError);
    }

    // Atualizar assinatura
    const { error: subscriptionError } = await supabaseClient.from('subscribers').upsert({
      user_id: userData.id,
      email: customer_email,
      subscribed: true,
      subscription_tier: subscription_plan,
      cakto_customer_id: customer_id,
      current_period_end: subscription_end ? new Date(subscription_end).toISOString() : null
    });

    if (subscriptionError) {
      console.error("[CAKTO-WEBHOOK] Erro ao atualizar assinatura:", subscriptionError);
      throw subscriptionError;
    }

    console.log("[CAKTO-WEBHOOK] Assinatura ativada com sucesso");
    return true;
  } catch (error) {
    console.error("[CAKTO-WEBHOOK] Erro ao processar pagamento:", error);
    throw error;
  }
}

// Processar eventos de assinatura
async function processSubscriptionEvent(supabaseClient: any, payload: any, eventType: string) {
  console.log(`[CAKTO-WEBHOOK] Processando evento de assinatura: ${eventType}`);
  
  const { customer_email, customer_id, subscription_end } = payload;
  
  try {
    // Buscar usuário pelo email
    const { data: userData, error: userError } = await supabaseClient.auth
      .admin.getUserByEmail(customer_email);

    if (userError || !userData) {
      console.error("[CAKTO-WEBHOOK] Usuário não encontrado:", userError);
      throw new Error('Usuário não encontrado');
    }

    let subscribed = true;
    let subscriptionData: any = {
      user_id: userData.id,
      email: customer_email,
      cakto_customer_id: customer_id,
    };

    switch (eventType) {
      case 'subscription_created':
      case 'subscription_renewed':
        subscriptionData.subscribed = true;
        subscriptionData.current_period_end = subscription_end ? new Date(subscription_end).toISOString() : null;
        break;
      case 'subscription_canceled':
        subscriptionData.subscribed = false;
        subscriptionData.subscription_end = new Date().toISOString();
        break;
    }

    // Atualizar assinatura
    const { error: subscriptionError } = await supabaseClient.from('subscribers').upsert(subscriptionData);

    if (subscriptionError) {
      console.error("[CAKTO-WEBHOOK] Erro ao atualizar assinatura:", subscriptionError);
      throw subscriptionError;
    }

    console.log(`[CAKTO-WEBHOOK] Evento de assinatura ${eventType} processado com sucesso`);
    return true;
  } catch (error) {
    console.error(`[CAKTO-WEBHOOK] Erro ao processar evento ${eventType}:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CAKTO-WEBHOOK] Webhook recebido");
    
    // Extrair a chave secreta do webhook da Cakto
    const webhookSecret = Deno.env.get('CAKTO_WEBHOOK_SECRET');
    
    // Se tiver uma chave secreta configurada, validar a requisição
    if (!validateWebhook(req, webhookSecret)) {
      return new Response(JSON.stringify({ error: 'Autenticação inválida' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const payload = await req.json();
    console.log("[CAKTO-WEBHOOK] Payload:", payload);
    
    const eventType = payload.event_type || '';
    
    // Processar diferentes tipos de eventos
    switch (eventType) {
      case 'payment_approved':
      case 'approved': // Para compatibilidade com versões anteriores
        await processPayment(supabaseClient, payload);
        break;
      case 'subscription_created':
      case 'subscription_renewed':
      case 'subscription_canceled':
        await processSubscriptionEvent(supabaseClient, payload, eventType);
        break;
      default:
        console.log(`[CAKTO-WEBHOOK] Evento não processado: ${eventType}`);
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
