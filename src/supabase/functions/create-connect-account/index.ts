
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  try {
    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Unauthorized");
    }
    
    const userId = userData.user.id;
    
    // Retrieve profile data to get user details
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (profileError || !profileData) {
      throw new Error("User profile not found");
    }
    
    // Check if user is a vendor
    if (profileData.role !== "vendor") {
      throw new Error("Only vendors can create Stripe Connect accounts");
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if user already has a Stripe account
    const { data: vendorData } = await supabaseClient
      .from("vendors")
      .select("stripe_connect_id, stripe_connect_status")
      .eq("user_id", userId)
      .single();
      
    if (vendorData?.stripe_connect_id && vendorData.stripe_connect_status === "active") {
      return new Response(
        JSON.stringify({ 
          message: "Stripe account already connected", 
          accountId: vendorData.stripe_connect_id 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create or retrieve the account
    let accountId = vendorData?.stripe_connect_id;
    
    if (!accountId) {
      // Create a new account
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: userData.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        business_profile: {
          name: profileData.name || "Vendor Shop",
          url: req.headers.get("origin") || "https://example.com",
        },
      });
      
      accountId = account.id;
      
      // Store the account ID in the database
      await supabaseClient
        .from("vendors")
        .upsert({
          user_id: userId,
          stripe_connect_id: accountId,
          stripe_connect_status: "pending",
        });
    }
    
    // Create an account link
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/vendor-dashboard?refresh=true`,
      return_url: `${origin}/vendor-dashboard?success=true`,
      type: "account_onboarding",
    });

    // Return the onboarding URL to the client
    return new Response(
      JSON.stringify({ url: accountLink.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
