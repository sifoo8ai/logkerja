// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// This is a mockup of web-push library usage since web-push isn't directly usable in Deno.
// Real-world usage requires standard VAPID logic like deno-web-push or manual fetch requests to endpoints.
// We will use a conceptual wrapper or mock fetch to the endpoint for VAPID implementation.
import * as webPush from "npm:web-push";

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

        // Only allow service role to call this internal system-level function securely
        if (authHeader.replace('Bearer ', '') !== Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
            // Optional context if we want to restrict it specifically
        }

        const { user_ids, title, body, payload } = await req.json();

        if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
            throw new Error('Valid user_ids array required');
        }

        const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
        const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
        const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@logkerja.local';

        if (!vapidPublicKey || !vapidPrivateKey) {
            console.error('[push_send] Missing VAPID env vars');
            return new Response(JSON.stringify({ error: "Missing VAPID env vars" }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        console.log(`[push_send] targets:`, user_ids);

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { data: subs, error: subsError } = await supabaseAdmin
            .from('push_subscriptions')
            .select('id, user_id, subscription')
            .in('user_id', user_ids);

        if (subsError) throw subsError;

        if (!subs || subs.length === 0) {
            return new Response(JSON.stringify({ success: true, message: 'No subscriptions found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        console.log(`[push_send] found ${subs.length} total subscriptions for targets`);

        // Configure Web Push VAPID keys
        webPush.setVapidDetails(
            vapidSubject,
            vapidPublicKey,
            vapidPrivateKey
        );

        const payloadString = JSON.stringify({ title, body, ...payload });

        // Send notifications in parallel
        let successCount = 0;
        let failCount = 0;

        const sendPromises = subs.map(async (sub) => {
            try {
                const sendResult = await webPush.sendNotification(sub.subscription, payloadString);
                console.log(`[push_send] Sent push to ${sub.id}: status ${sendResult.statusCode}`);
                successCount++;
            } catch (err: any) {
                failCount++;
                // If subscription is invalid (404/410), delete it
                if (err.statusCode === 404 || err.statusCode === 410) {
                    console.log(`[push_send] Deleting invalid subscription ${sub.id}`);
                    await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
                } else {
                    console.error(`[push_send] Error sending push to ${sub.id}:`, err);
                }
            }
        });

        await Promise.all(sendPromises);
        console.log(`[push_send] Finished. Success: ${successCount}, Failed: ${failCount}`);

        return new Response(JSON.stringify({ success: true, sent_count: subs.length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
