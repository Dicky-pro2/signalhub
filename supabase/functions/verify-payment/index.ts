import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference, userId, amount, devMode } = await req.json()

    if (!devMode) {
      const paystackRes = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
          },
        }
      )
      const paystackData = await paystackRes.json()
      if (!paystackData.status || paystackData.data.status !== 'success') {
        return new Response(
          JSON.stringify({ error: 'Payment verification failed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!
    )

    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()

    const newBalance = (wallet?.balance || 0) + amount

    await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'deposit',
      amount,
      status: 'success',
      reference,
      description: devMode ? 'Wallet deposit (dev mode)' : 'Wallet deposit via Paystack',
    })

    await supabase.from('notifications').insert({
      user_id: userId,
      title: 'Deposit Successful',
      message: `$${amount.toFixed(2)} has been added to your wallet.`,
      type: 'success',
    })

    return new Response(
      JSON.stringify({ success: true, newBalance }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})