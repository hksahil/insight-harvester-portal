
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
    // Create a Supabase client with the service role key
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    // Verify that the admin is making this request (would need additional checks in production)
    const { data: userData, error: userError } = await adminSupabase.auth.getUser(token);
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    // Get all users who don't have profiles yet
    const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers();
    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }
    
    const { data: profiles, error: profilesError } = await adminSupabase
      .from('profiles')
      .select('id');
    
    if (profilesError) {
      throw new Error(`Error fetching profiles: ${profilesError.message}`);
    }
    
    // Find users who don't have profiles
    const profileIds = new Set(profiles.map((p: any) => p.id));
    const usersWithoutProfiles = users.users.filter(user => !profileIds.has(user.id));
    
    console.log(`Found ${usersWithoutProfiles.length} users without profiles`);
    
    // Create missing profiles
    const createdProfiles = [];
    for (const user of usersWithoutProfiles) {
      const { data, error } = await adminSupabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
        })
        .select();
      
      if (error) {
        console.error(`Error creating profile for user ${user.id}: ${error.message}`);
      } else {
        createdProfiles.push(data[0]);
      }
    }
    
    console.log(`Created ${createdProfiles.length} new profiles`);
    
    // Create or fix user_usage records
    const { data: usageData, error: usageError } = await adminSupabase
      .from('user_usage')
      .select('id');
    
    if (usageError) {
      throw new Error(`Error fetching user_usage: ${usageError.message}`);
    }
    
    const usageIds = new Set(usageData.map((u: any) => u.id));
    const usersWithoutUsage = users.users.filter(user => !usageIds.has(user.id));
    
    console.log(`Found ${usersWithoutUsage.length} users without usage records`);
    
    // Create missing usage records
    const createdUsage = [];
    for (const user of usersWithoutUsage) {
      const { data, error } = await adminSupabase
        .from('user_usage')
        .insert({
          id: user.id,
          processed_files_count: 0,
          is_premium: false,
        })
        .select();
      
      if (error) {
        console.error(`Error creating usage record for user ${user.id}: ${error.message}`);
      } else {
        createdUsage.push(data[0]);
      }
    }
    
    console.log(`Created ${createdUsage.length} new usage records`);
    
    return new Response(JSON.stringify({
      success: true,
      profiles_created: createdProfiles.length,
      usage_records_created: createdUsage.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fixing profile issues:", errorMessage);
    
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
