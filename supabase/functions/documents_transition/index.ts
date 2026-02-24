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

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        // Minimal Rate Protection: limit per user (1 request every 2s per user-action to block rapid double-clicks)
        const RATE_LIMIT_CACHE_KEY = `rl_${user.id}_action`;
        const lastAction = await caches.open('logkerja-rl').then(c => c.match(RATE_LIMIT_CACHE_KEY));
        const now = Date.now();
        if (lastAction) {
            const timestamp = parseInt(await lastAction.text(), 10);
            if (now - timestamp < 2000) { // 2 seconds delay
                throw new Error('Too many requests. Please wait a moment.');
            }
        }
        await caches.open('logkerja-rl').then(c => c.put(RATE_LIMIT_CACHE_KEY, new Response(now.toString())));

        const { doc_id, action, note } = await req.json();

        if (!doc_id || !action) {
            throw new Error('Missing required arguments untuk transition_document');
        }

        // Call RPC transition_document
        const { error: dbError } = await supabaseClient.rpc('transition_document', {
            p_doc_id: doc_id,
            p_action: action,
            p_note: note || null
        });

        if (dbError) throw dbError;

        // Fetch affected user notification ids using service role
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { data: doc, error: docDataError } = await supabaseAdmin
            .from('documents')
            .select('creator_id, verifier_id, approver_id, reference_no')
            .eq('id', doc_id)
            .single();

        if (!docDataError && doc) {
            let notifyId = null;
            let title = "Status Dokumen Dikemas kini";
            let bodyMsg = `Dokumen ${doc.reference_no} telah diberikan tindakan ${action}`;

            if (action === 'REJECT') {
                notifyId = doc.creator_id; // Notify whom created
                bodyMsg = `Dokumen rujukan ${doc.reference_no} anda telah DITOLAK.`;
            } else if (action === 'APPROVE') {
                // This assumes verifier approves and sends to approver_id
                notifyId = doc.approver_id;
                bodyMsg = `Dokumen rujukan ${doc.reference_no} menanti kelulusan anda.`;
            } else if (action === 'SET_ON_HOLD') {
                notifyId = doc.creator_id;
                bodyMsg = `Dokumen rujukan ${doc.reference_no} ditahan atas urusan.`;
            }

            if (notifyId) {
                fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/push_send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
                    },
                    body: JSON.stringify({
                        user_ids: [notifyId],
                        title: title,
                        body: bodyMsg,
                    }),
                }).catch(err => console.error("Error triggering push for transition:", err));
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
