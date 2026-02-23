// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) throw new Error('Missing Authorization header');

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        const { ref_no, cat_id, desc } = await req.json();

        if (!ref_no || !cat_id || !desc) {
            throw new Error('Missing required arguments untuk create_document');
        }

        const { data: docId, error: dbError } = await supabaseClient.rpc('create_document', {
            p_ref_no: ref_no,
            p_cat_id: cat_id,
            p_desc: desc
        });

        if (dbError) throw dbError;

        // Trigger Notification process directly using function calling
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { data: routeData } = await supabaseAdmin.from('category_routing').select('default_verifier_id').eq('category_id', cat_id).single();

        if (routeData) {
            // Async trigger for push notifications without awaiting
            fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/push_send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
                },
                body: JSON.stringify({
                    user_ids: [routeData.default_verifier_id],
                    title: "Dokumen Baharu LogKerja!",
                    body: `Dokumen rujukan ${ref_no} diserahkan untuk semakan oleh Penyemak.`,
                }),
            }).catch(err => console.error("Error triggering push:", err));
        }

        return new Response(JSON.stringify({ docId }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
