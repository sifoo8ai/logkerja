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

        const body = await req.json();
        const { attachment_id } = body;
        if (!attachment_id) throw new Error('Missing attachment_id');

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Check user role
        const { data: roleData } = await supabaseAdmin.from('user_roles').select('role').eq('user_id', user.id);
        const isAdmin = roleData?.some(r => r.role === 'ADMIN');

        // Get attachment and document
        const { data: attachment, error: attError } = await supabaseAdmin
            .from('document_attachments')
            .select('file_path, document_id')
            .eq('id', attachment_id)
            .single();

        if (attError || !attachment) throw new Error('Attachment not found');

        const { data: doc, error: docError } = await supabaseAdmin
            .from('documents')
            .select('creator_id, verifier_id, approver_id')
            .eq('id', attachment.document_id)
            .single();

        if (!doc) throw new Error('Document not found');

        const canAccess = isAdmin ||
            doc.creator_id === user.id ||
            doc.verifier_id === user.id ||
            doc.approver_id === user.id;

        if (!canAccess) throw new Error('Forbidden: You do not have access to this document attachment');

        const { data: signedData, error: signError } = await supabaseAdmin.storage
            .from('document-attachments')
            .createSignedUrl(attachment.file_path, 300); // 5 min expiry

        if (signError || !signedData?.signedUrl) throw signError || new Error('Failed to generate URL');

        return new Response(JSON.stringify({ signedUrl: signedData.signedUrl }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
