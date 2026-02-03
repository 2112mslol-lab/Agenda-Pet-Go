# Integração Mercado Pago + Supabase

Para que a assinatura funcione, siga estes passos para configurar sua Edge Function.

## 1. Variáveis de Ambiente
No seu painel do Supabase, vá em **Settings > Edge Functions** e adicione:
- `MERCADOPAGO_ACCESS_TOKEN`: Seu Token de Acesso (Production ou Test).

## 2. Código da Edge Function
Crie um arquivo em `supabase/functions/create-mercadopago-checkout/index.ts` com o seguinte conteúdo:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { method, userId, shopName, email } = await req.json()

    // Configuração da Preferência de Pagamento
    const preference = {
      items: [
        {
          title: `Assinatura AgendaPetGo - ${shopName}`,
          unit_price: 29.90,
          quantity: 1,
          currency_id: 'BRL'
        }
      ],
      payer: {
        email: email
      },
      external_reference: userId,
      back_urls: {
        success: `${req.headers.get('origin')}/dashboard?payment=success`,
        failure: `${req.headers.get('origin')}/dashboard?payment=failure`,
        pending: `${req.headers.get('origin')}/dashboard?payment=pending`,
      },
      auto_return: 'approved',
    }

    // Se for Cartão, podemos criar um Plano de Assinatura (Pre-Approval)
    // Para simplificar neste exemplo, usaremos a Preference API que aceita Pix e Cartão
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    })

    const data = await response.json()

    return new Response(
      JSON.stringify({ init_point: data.init_point }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

## 3. Webhook (IPN)
Você precisará de outra função para receber o aviso do Mercado Pago quando o pagamento for aprovado e atualizar o status no banco de dados.

```typescript
// Exemplo de lógica para o Webhook:
// 1. Recebe o notification_id
// 2. Consulta o pagamento na API do MP
// 3. Se status === 'approved', dá update no profiles set subscription_status = 'active' where id = external_reference
```
