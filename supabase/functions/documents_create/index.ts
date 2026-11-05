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
            console.error("[documents_create] Invalid JWT:", error?.message);
            return new Response(JSON.stringify({ error: "Sesi tamat atau tidak sah. Sila log masuk semula.", code: "INVALID_JWT" }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const body = await req.json();
        const ref_no = typeof body?.ref_no === 'string' ? body.ref_no.trim() : '';
        const cat_id = body?.cat_id;
        const desc = body?.desc;

        if (!ref_no || !cat_id) {
            return new Response(JSON.stringify({ error: 'Sila isikan No Rujukan dan pilih Kategori.', code: 'MISSING_FIELDS' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const { data: docId, error: dbError } = await supabaseUser.rpc('create_document', {
            p_ref_no: ref_no,
            p_cat_id: cat_id,
            p_desc: desc || ''
        });

        if (dbError) {
            // 23505 = unique_violation pada documents.reference_no
            if (dbError.code === '23505') {
                return new Response(JSON.stringify({ error: `Nombor rujukan ${ref_no} sudah wujud dalam LogKerja.`, code: 'DUPLICATE_REF' }), {
                    status: 409,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify({ error: dbError.message || 'Gagal mendaftar dokumen.', code: 'RPC_ERROR' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

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
        console.error("[documents_create] Unexpected error:", err);
        return new Response(JSON.stringify({ error: err.message || 'Ralat tidak dijangka.', code: 'UNEXPECTED' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
