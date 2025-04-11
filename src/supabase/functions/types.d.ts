
// Deno and Edge Function type definitions
declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module "https://esm.sh/stripe@14.21.0" {
  const Stripe: any;
  export default Stripe;
}

declare module "https://esm.sh/@supabase/supabase-js@2.45.0" {
  export function createClient(supabaseUrl: string, supabaseKey: string): any;
}

declare namespace Deno {
  export function env: {
    get(key: string): string | undefined;
  };
}
