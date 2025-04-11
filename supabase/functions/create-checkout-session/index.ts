
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

  try {
    // Parse the request body
    const { items, shipping_address, customer_email } = await req.json();
    
    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Group items by vendor for separate payment intents
    const itemsByVendor = {};
    
    for (const item of items) {
      if (!itemsByVendor[item.vendorId]) {
        itemsByVendor[item.vendorId] = [];
      }
      itemsByVendor[item.vendorId].push(item);
    }
    
    // Get or create a customer
    let customerId;
    const { data: customers } = await stripe.customers.list({
      email: customer_email,
      limit: 1,
    });
    
    if (customers && customers.length > 0) {
      customerId = customers[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: customer_email,
        name: shipping_address.fullName,
        address: {
          line1: shipping_address.streetAddress,
          city: shipping_address.city,
          state: shipping_address.state,
          postal_code: shipping_address.zipCode,
          country: shipping_address.country,
        },
      });
      customerId = newCustomer.id;
    }
    
    // Create a checkout session
    const lineItems = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images.length > 0 ? [item.images[0]] : [],
          metadata: {
            vendorId: item.vendorId,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));
    
    // Store vendor IDs for payment disbursement
    const vendorIds = Object.keys(itemsByVendor);
    
    // Get vendor Stripe accounts
    const { data: vendors } = await supabaseClient
      .from("vendors")
      .select("user_id, stripe_connect_id")
      .in("user_id", vendorIds);
      
    // Create a session with payment intent metadata
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/order-confirmation`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"],
      },
      metadata: {
        vendor_ids: JSON.stringify(vendorIds),
        user_id: userData.user.id,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
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
