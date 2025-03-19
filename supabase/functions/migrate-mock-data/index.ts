
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Get the supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the mock data from the request body
    const { mockData } = await req.json();
    
    if (!mockData || !Array.isArray(mockData)) {
      return new Response(
        JSON.stringify({ error: "Invalid mock data provided" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    console.log(`Received ${mockData.length} records to migrate`);
    
    // Migrate the mock user data
    const results = [];
    
    for (const user of mockData) {
      // Check if the user already exists in auth.users
      const { data: existingAuthUsers, error: checkError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", user.email);
      
      if (checkError) {
        console.error(`Error checking user ${user.email}:`, checkError);
        results.push({ email: user.email, status: "error", message: checkError.message });
        continue;
      }
      
      if (existingAuthUsers && existingAuthUsers.length > 0) {
        console.log(`User ${user.email} already exists, skipping`);
        results.push({ email: user.email, status: "skipped", message: "User already exists" });
        continue;
      }
      
      // Create the auth user if they don't exist
      const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password || "password123", // Default password if not provided
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role,
          phone: user.phone,
          gender: user.gender,
          profileImage: user.profileImage,
          vehicleNumber: user.vehicleNumber,
          available: user.available,
          location: user.location,
          onSchedule: user.onSchedule
        }
      });
      
      if (createError) {
        console.error(`Error creating user ${user.email}:`, createError);
        results.push({ email: user.email, status: "error", message: createError.message });
        continue;
      }
      
      // The profile should be created automatically through the trigger
      // Update additional fields that might not be in the metadata
      if (authUser && authUser.user) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            vehicle_number: user.vehicleNumber,
            available: user.available,
            location: user.location,
            on_schedule: user.onSchedule
          })
          .eq("id", authUser.user.id);
        
        if (updateError) {
          console.error(`Error updating profile for ${user.email}:`, updateError);
          results.push({ email: user.email, status: "partial", message: "Auth user created but profile update failed" });
          continue;
        }
        
        results.push({ email: user.email, status: "success", id: authUser.user.id });
      }
    }
    
    return new Response(
      JSON.stringify({ results, migrated: results.filter(r => r.status === "success").length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
