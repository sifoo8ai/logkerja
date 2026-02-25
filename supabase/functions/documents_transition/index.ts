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
        const authHeader = req.headers.get("Authorization") ?? "";
        const token = authHeader.replace("Bearer ", "").trim();

        if (!token) {
            return new Response(JSON.stringify({ error: "Missing token" }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const supabaseUser = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${token}` },
                },
            }
        );

        const {
            data: { user },
            error,
        } = await supabaseUser.auth.getUser();

        if (error || !user) {
            return new Response(JSON.stringify({ error: "Invalid JWT" }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Rate limiting removed to support frontend bulk actions (Promise.all)
        // DB constraints (current_status check) already prevent double-transitions.

        const { doc_id, action, note } = await req.json();

        if (!doc_id || !action) {
            throw new Error('Missing required arguments untuk transition_document');
        }

        // Call RPC transition_document
        const { error: dbError } = await supabaseAdmin.rpc('transition_document', {
            p_doc_id: doc_id,
            p_action: action,
            p_note: note || null
        });

        if (dbError) throw dbError;

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
                const targets = [notifyId];
                console.log(`[documents_transition] docId: ${doc_id}, action: ${action}, targets:`, targets);
                try {
                    const pushResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/push_send`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
                        },
                        body: JSON.stringify({
                            user_ids: targets,
                            title: title,
                            body: bodyMsg,
                            payload: { url: '/app/documents', docId: doc_id }
                        }),
                    });
                    const pushDebug = await pushResponse.json();
                    console.log("[documents_transition] push_send response:", pushDebug);
                    if (!pushResponse.ok) {
                        console.error("[documents_transition] push_send returned error status:", pushResponse.status, pushDebug);
                    }
                } catch (err: any) {
                    console.error("[documents_transition] Error triggering push for transition:", err);
                }
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error("Transition Error:", err);
        return new Response(JSON.stringify({ error: err.message || 'Transition failed', details: err }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
