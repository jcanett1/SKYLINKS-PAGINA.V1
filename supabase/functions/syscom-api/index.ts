import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SYSCOM_TOKEN_URL = "https://developers.syscom.mx/oauth/token";
const SYSCOM_API_BASE = "https://developers.syscom.mx/api/v1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedExchangeRate: { rate: number; expiresAt: number } | null = null;

async function getExchangeRate(): Promise<number> {
  // Return cached rate if still valid (cache for 1 hour)
  if (cachedExchangeRate && cachedExchangeRate.expiresAt > Date.now()) {
    return cachedExchangeRate.rate;
  }

  try {
    // Try using Open Exchange Rates free API (1 USD = X MXN)
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      const rate = data.rates?.MXN || 17.5; // Fallback to 17.5 if API fails
      cachedExchangeRate = {
        rate,
        expiresAt: Date.now() + 3600000, // Cache for 1 hour
      };
      return rate;
    }
  } catch (_err) {
    // Silently fail and use default rate
  }

  // Default fallback rate if API fails
  return 17.5;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const clientId = Deno.env.get("SYSCOM_CLIENT_ID");
  const clientSecret = Deno.env.get("SYSCOM_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("SYSCOM_CLIENT_ID and SYSCOM_CLIENT_SECRET must be configured as secrets");
  }

  const response = await fetch(SYSCOM_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token request failed: ${response.status} - ${text}`);
  }

  const data = await response.json();
  const expiresIn: number = data.expires_in || 31536000;

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (expiresIn - 86400) * 1000,
  };

  return cachedToken.token;
}

async function convertPricesToMXN(data: unknown): Promise<unknown> {
  // Only convert prices for productos endpoint
  if (typeof data !== 'object' || data === null) return data;

  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.productos)) return data;

  const rate = await getExchangeRate();

  // Convert each product's prices
  obj.productos = (obj.productos as Record<string, unknown>[]).map((prod) => {
    if (typeof prod !== 'object' || !prod) return prod;

    const product = prod as Record<string, unknown>;
    if (typeof product.precios === 'object' && product.precios) {
      const precios = product.precios as Record<string, unknown>;
      const converted: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(precios)) {
        if (key === 'volumen' && typeof value === 'object' && value) {
          // Convert volumen sub-prices
          const volumen = value as Record<string, unknown>;
          converted.volumen = {};
          for (const [k, v] of Object.entries(volumen)) {
            const numVal = parseFloat(String(v));
            if (!isNaN(numVal)) {
              (converted.volumen as Record<string, number>)[k] = parseFloat((numVal * rate).toFixed(2));
            }
          }
        } else {
          // Convert regular prices
          const numVal = parseFloat(String(value));
          if (!isNaN(numVal)) {
            converted[key] = parseFloat((numVal * rate).toFixed(2));
          } else {
            converted[key] = value;
          }
        }
      }
      product.precios = converted;
    }
    return product;
  });

  return obj;
}

async function syscomGet(path: string, params?: Record<string, string>): Promise<unknown> {
  const token = await getAccessToken();
  const url = new URL(`${SYSCOM_API_BASE}${path}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    });
  }

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Syscom API error: ${response.status} - ${text}`);
  }

  let data = await response.json();

  // Convert prices to MXN if this is a productos response
  if (path === '/productos') {
    data = await convertPricesToMXN(data);
  }

  return data;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let path = url.pathname;

    // Normalize: strip any edge function prefix, then ensure leading slash
    for (const prefix of ["/functions/v1/syscom-api", "/syscom-api"]) {
      if (path.startsWith(prefix)) {
        path = path.slice(prefix.length);
      }
    }
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    const params: Record<string, string> = {};
    url.searchParams.forEach((v, k) => {
      params[k] = v;
    });

    // Normalize route aliases: /search and /busqueda now map to /productos with busqueda param
    if (path === "/search" || path === "/busqueda") {
      path = "/productos";
      const q = params.q || params.busqueda;
      if (q) {
        delete params.q;
        params.busqueda = q;
      }
    }

    const validRoutes = ["/categorias", "/productos", "/marcas", "/listas"];

    const matchedRoute = validRoutes.find(
      (r) => path === r || path.startsWith(r + "/")
    );

    if (!matchedRoute && path !== "/tipocambio") {
      return new Response(
        JSON.stringify({ error: "Invalid route", path, validRoutes }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (path === "/tipocambio") {
      const rate = await getExchangeRate();
      return new Response(
        JSON.stringify({ normal: rate.toFixed(2) }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await syscomGet(path, params);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
