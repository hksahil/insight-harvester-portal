
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Predefined promo codes (in a real app, these would be in a database)
const promoCodes = {
  "LAUNCH2024": 0.20, // 20% off
  "EARLYBIRD": 0.15,  // 15% off
  "SPECIAL10": 0.10,  // 10% off
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    const { code } = await req.json();
    const discount = promoCodes[code as keyof typeof promoCodes];
    
    return new Response(
      JSON.stringify({ 
        valid: !!discount,
        discount: discount || 0
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
