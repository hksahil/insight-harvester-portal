
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

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
    // Create a database connection using the service role key
    const dbUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!dbUrl) {
      throw new Error("Database connection URL is not set");
    }

    const pool = new Pool(dbUrl, 3, true);
    const connection = await pool.connect();

    try {
      // Check if the trigger for creating user_usage on signup exists
      const checkUserUsageTriggerResult = await connection.queryObject(`
        SELECT * FROM pg_trigger WHERE tgname = 'create_user_usage_on_signup_trigger';
      `);

      if (checkUserUsageTriggerResult.rows.length === 0) {
        console.log("Creating user_usage trigger...");
        // Create the trigger
        await connection.queryObject(`
          CREATE TRIGGER create_user_usage_on_signup_trigger
          AFTER INSERT ON auth.users
          FOR EACH ROW
          EXECUTE FUNCTION public.create_user_usage_on_signup();
        `);
      } else {
        console.log("User usage trigger already exists");
      }

      // Check if the trigger for creating profiles on signup exists
      const checkProfilesTriggerResult = await connection.queryObject(`
        SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
      `);

      if (checkProfilesTriggerResult.rows.length === 0) {
        console.log("Creating profiles trigger...");
        // Create the trigger
        await connection.queryObject(`
          CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_new_user();
        `);
      } else {
        console.log("Profiles trigger already exists");
      }

      return new Response(JSON.stringify({ success: true, message: "Database triggers verified/created successfully" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } finally {
      connection.release();
      await pool.end();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error ensuring database triggers:", errorMessage);
    
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
