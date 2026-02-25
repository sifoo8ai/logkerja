// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) throw new Error('Missing Authorization header');

        const token = authHeader.replace('Bearer ', '');

        // 1. Use service role client in Edge function
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // 2. Extract user from JWT using service role
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
        if (userError || !user) throw new Error('Unauthorized');

        const body = await req.json();
        const { subscription } = body;

        if (!subscription || !subscription.endpoint) {
            throw new Error('Invalid subscription object');
        }

        // 3. Upsert correctly using jsonb
        const { error: upsertError } = await supabaseAdmin
            .from('push_subscriptions')
            .upsert({
                user_id: user.id,
                subscription: subscription
            }, { onConflict: 'user_id' });

        if (upsertError) throw upsertError;

        // 4. Return proper JSON response
        return new Response(JSON.stringify({
            success: true,
            user_id: user.id
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        console.error("push_register Error:", err);
        return new Response(JSON.stringify({ error: err.message, details: err }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
