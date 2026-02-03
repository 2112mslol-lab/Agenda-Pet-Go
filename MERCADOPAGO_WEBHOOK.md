# Webhook Mercado Pago (Sincronização Automática)

Esta função deve ser criada no Supabase como `mercadopago-webhook`. Ela é responsável por ouvir o Mercado Pago e ativar a assinatura do cliente no seu banco de dados assim que o pagamento for aprovado.

## Código da Edge Function (mercadopago-webhook)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  try {
    const body = await req.json()
    console.log("Webhook recebido:", body)

    // O Mercado Pago envia o ID do recurso (pagamento)
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id

      // 1. Consultar o status do pagamento na API do Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
      })

      const paymentData = await response.json()

      // 2. Se o pagamento estiver aprovado
      if (paymentData.status === 'approved') {
        const userId = paymentData.external_reference // Lembra que enviamos o userId aqui?
        
        console.log(`Pagamento aprovado para o usuário: ${userId}`)

        // 3. Atualizar o banco de dados
        const { error } = await supabase
          .from('profiles')
          .update({ 
            subscription_status: 'active',
            subscription_plan: 'pro',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (error) throw error
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error("Erro no Webhook:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
```

## Como configurar no Mercado Pago:
1. Após implantar a função, copie a **URL da função** (ex: `https://xxx.supabase.co/functions/v1/mercadopago-webhook`).
2. Vá no Painel do Mercado Pago > **Suas integrações** > **Notificações IPN/Webhooks**.
3. Cole a URL no campo de Webhooks e selecione o evento **"Pagamentos" (Payments)**.
4. Salve.
```
