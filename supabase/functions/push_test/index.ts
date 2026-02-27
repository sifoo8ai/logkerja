import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import * as webPush from "npm:web-push";

Deno.serve(async (req) => {
  try {
    console.log("imported web push");
    webPush.setVapidDetails(
      "mailto:admin@test.com",
      Deno.env.get('VAPID_PUBLIC_KEY') || 'BNV...',
      Deno.env.get('VAPID_PRIVATE_KEY') || '123...'
    );
    console.log("vapid details set");
    const res = await webPush.sendNotification({
      endpoint: "https://fcm.googleapis.com/fcm/send/fake",
      keys: { p256dh: "fake", auth: "fake" }
    }, "hello world").catch(err => {
      return { error: err.message, stack: err.stack };
    });

    return new Response(JSON.stringify({ res }), { headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error_top: e.message, stack: e.stack }), { headers: { "Content-Type": "application/json" } });
  }
});
