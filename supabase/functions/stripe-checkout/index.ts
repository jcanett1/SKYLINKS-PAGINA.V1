import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  exterior: string;
  interior?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
}

interface CartItemInput {
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: number;
  product_sku: string;
  quantity: number;
  category: string;
}

interface CheckoutBody {
  items: CartItemInput[];
  shipping: ShippingAddress;
  user_session: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe no está configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: CheckoutBody = await req.json();
    const { items, shipping, user_session } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "El carrito está vacío" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!shipping || !shipping.fullName || !shipping.email || !shipping.street || !shipping.city || !shipping.state || !shipping.postalCode) {
      return new Response(
        JSON.stringify({ error: "Falta información de envío requerida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:5173";

    const lineItems = items.map((item) => {
      const unitAmount = Math.round(Number(item.product_price) * 100);
      return {
        quantity: item.quantity,
        price_data: {
          currency: "mxn",
          unit_amount: unitAmount,
          product_data: {
            name: item.product_name,
            ...(item.product_image ? { images: [item.product_image] } : {}),
            metadata: { sku: item.product_sku, product_id: item.product_id },
          },
        },
      };
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.product_price) * item.quantity,
      0
    );

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "payment",
        "success_url": `${origin}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": `${origin}/pago-cancelado`,
        "customer_email": shipping.email,
        "shipping_address_collection[allowed_countries[0]]": "MX",
        "billing_address_collection": "auto",
        ...Object.fromEntries(
          lineItems.flatMap((item, index) => [
            [`line_items[${index}][quantity]`, String(item.quantity)],
            [`line_items[${index}][price_data][currency]`, item.price_data.currency],
            [`line_items[${index}][price_data][unit_amount]`, String(item.price_data.unit_amount)],
            [`line_items[${index}][price_data][product_data][name]`, item.price_data.product_data.name],
          ])
        ),
        "metadata[user_session]": user_session,
        "metadata[customer_name]": shipping.fullName,
        "metadata[customer_phone]": shipping.phone,
        "metadata[shipping_street]": shipping.street,
        "metadata[shipping_exterior]": shipping.exterior,
        "metadata[shipping_neighborhood]": shipping.neighborhood,
        "metadata[shipping_city]": shipping.city,
        "metadata[shipping_state]": shipping.state,
        "metadata[shipping_postal_code]": shipping.postalCode,
        "metadata[shipping_country]": shipping.country,
        ...(shipping.interior ? { "metadata[shipping_interior]": shipping.interior } : {}),
        ...(shipping.notes ? { "metadata[shipping_notes]": shipping.notes } : {}),
      }),
    });

    if (!stripeResponse.ok) {
      const errText = await stripeResponse.text();
      console.error("Stripe error:", errText);
      return new Response(
        JSON.stringify({ error: "Error al crear la sesión de pago" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const session = await stripeResponse.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      await supabase.from("orders").insert({
        stripe_session_id: session.id,
        user_session: user_session,
        customer_email: shipping.email,
        customer_name: shipping.fullName,
        customer_phone: shipping.phone,
        shipping_address: {
          street: shipping.street,
          exterior: shipping.exterior,
          interior: shipping.interior || null,
          neighborhood: shipping.neighborhood,
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.postalCode,
          country: shipping.country,
          notes: shipping.notes || null,
        },
        items: items,
        amount_total: totalAmount,
        status: "pending",
      });
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Checkout error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
