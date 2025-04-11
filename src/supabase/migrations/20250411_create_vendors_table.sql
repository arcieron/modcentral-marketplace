
-- Create vendors table to store Stripe Connect information
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  stripe_connect_id TEXT,
  stripe_connect_status TEXT DEFAULT 'pending',
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Vendors can only see their own data
CREATE POLICY "Vendors can view their own data"
  ON public.vendors
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only admin or the vendor themselves can update vendor data  
CREATE POLICY "Vendors can update their own data"
  ON public.vendors
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  payment_intent_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders
CREATE POLICY "Customers can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = customer_id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  product_id TEXT NOT NULL,
  vendor_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own order items
CREATE POLICY "Users can view their own order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_id
      AND public.orders.customer_id = auth.uid()
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE public.vendors.user_id = auth.uid()
      AND public.vendors.user_id = vendor_id
    )
  );

-- Create payouts table
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_payout_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for payouts
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Vendors can only view their own payouts
CREATE POLICY "Vendors can view their own payouts"
  ON public.payouts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE public.vendors.id = vendor_id
      AND public.vendors.user_id = auth.uid()
    )
  );
