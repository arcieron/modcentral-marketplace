
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  stock: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'vendor' | 'admin';
  createdAt: string;
  stripeConnectId?: string; 
  stripeConnectStatus?: 'pending' | 'active' | 'rejected';
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Payout {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  createdAt: string;
  stripeTransferId?: string;
  failureReason?: string;
  periodStart?: string;
  periodEnd?: string;
}

// New interfaces for vendor payout management
export interface VendorEarnings {
  vendorId: string;
  totalEarnings: number;
  availableForPayout: number;
  pendingEarnings: number; // From orders not yet completed
  lastPayoutDate: string | null;
  lastPayoutAmount: number | null;
}

export interface StripeConnectAccount {
  id: string;
  vendorId: string;
  isActive: boolean;
  country: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  defaultCurrency: string;
  createdAt: string;
}

// Vendor interface for Supabase data
export interface Vendor {
  id: string;
  user_id: string;
  stripe_connect_id: string | null;
  stripe_connect_status: 'pending' | 'active' | 'rejected';
  charges_enabled: boolean;
  payouts_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Chat interfaces
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageAt: string;
  lastMessage?: string;
}
