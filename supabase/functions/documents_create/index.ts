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
        } = await supabaseUser.auth.getUser(token);

        if (error || !user) {
            return new Response(JSON.stringify({ code: 401, message: "Invalid JWT", details: error }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { ref_no, cat_id, desc } = await req.json();

        if (!ref_no || !cat_id || !desc) {
            throw new Error('Missing required arguments untuk create_document');
        }

        const { data: docId, error: dbError } = await supabaseAdmin.rpc('create_document', {
            p_ref_no: ref_no,
            p_cat_id: cat_id,
            p_desc: desc
        });

        if (dbError) throw dbError;

        const { data: routeData } = await supabaseAdmin.from('category_routing').select('default_verifier_id').eq('category_id', cat_id).single();

        let pushDebug = null;

        // Fetch document details for logging
        const { data: docData } = await supabaseAdmin.from('documents').select('verifier_id, approver_id').eq('id', docId).single();
        console.log(`[documents_create] docId: ${docId}, verifier_id: ${docData?.verifier_id}, approver_id: ${docData?.approver_id}`);

        if (routeData) {
            const targets = [routeData.default_verifier_id];
            console.log(`[documents_create] targets:`, targets);
            try {
                const pushResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/push_send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
                    },
                    body: JSON.stringify({
                        user_ids: targets,
                        title: "Dokumen Baharu LogKerja!",
                        body: `Dokumen rujukan ${ref_no} diserahkan untuk semakan.`,
                        payload: { url: '/app/documents', docId }
                    }),
                });
                pushDebug = await pushResponse.json();
                console.log("[documents_create] push_send response:", pushDebug);
                if (!pushResponse.ok) {
                    console.error("[documents_create] push_send returned error status:", pushResponse.status, pushDebug);
                }
            } catch (err: any) {
                console.error("[documents_create] Error triggering push:", err);
                pushDebug = { error: err.message };
            }
        }

        return new Response(JSON.stringify({ docId, pushDebug }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
