
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    // Create a supabase client with the user's token
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    // Verify user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    // Use service role key for admin operations (bypassing RLS)
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get payment data from request
    const { payment_id } = await req.json();
    
    if (!payment_id) {
      throw new Error("Payment ID is required");
    }
    
    console.log(`Updating premium status for user ${user.id} with payment ID ${payment_id}`);
    
    // Update user_usage to mark user as premium
    const { error: updateError } = await adminSupabase
      .from('user_usage')
      .update({ is_premium: true })
      .eq('id', user.id);
    
    if (updateError) {
      throw new Error(`Error updating premium status: ${updateError.message}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Premium status updated successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating premium status:", errorMessage);
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
