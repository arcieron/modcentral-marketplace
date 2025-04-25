import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, Payout } from '@/types';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

// Define the context type
interface StoreContextType {
  products: Product[];
  categories: string[];
  cartItems: CartItem[];
  users: User[];
  orders: Order[];
  payouts: Payout[];
  loading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getProduct: (id: string) => Promise<Product | undefined>;
  getVendorProducts: (vendorId: string) => Promise<Product[]>;
  searchProducts: (query: string, category?: string) => Promise<Product[]>;
  submitProduct: (product: Omit<Product, 'id' | 'createdAt' | 'status'>) => Promise<Product | null>;
  approveProduct: (productId: string) => Promise<void>;
  rejectProduct: (productId: string) => Promise<void>;
  getUser: (id: string) => Promise<User | undefined>;
  getUserByEmail: (email: string) => Promise<User | undefined>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  createPayout: (payout: Omit<Payout, 'id' | 'createdAt'>) => Promise<Payout | null>;
  updatePayoutStatus: (payoutId: string, status: Payout['status']) => Promise<void>;
  getPendingProducts: () => Promise<Product[]>;
  getPendingPayouts: () => Promise<Payout[]>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

// Helper functions to transform data from Supabase to match our interfaces
const mapProduct = (product: any): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  images: product.images,
  category: product.category,
  vendorId: product.vendor_id,
  vendorName: product.vendor_name || 'Unknown Vendor',
  rating: product.rating || 0,
  stock: product.stock,
  createdAt: product.created_at,
  status: product.status as 'pending' | 'approved' | 'rejected',
});

const mapUser = (user: any): User => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role as 'customer' | 'vendor' | 'admin',
  createdAt: user.created_at,
  stripeConnectId: user.stripe_connect_id,
  stripeConnectStatus: user.stripe_connect_status,
});

const mapOrder = (order: any, orderItems: any[] = []): Order => ({
  id: order.id,
  customerId: order.customer_id,
  customerName: order.customer_name || 'Unknown Customer',
  items: orderItems.map(item => ({
    ...mapProduct({
      id: item.product_id,
      name: item.name || 'Unknown Product',
      description: item.description || '',
      price: item.price,
      images: item.images || [],
      category: item.category || 'Other',
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name || 'Unknown Vendor',
      rating: item.rating || 0,
      stock: item.stock || 0,
      created_at: item.created_at,
      status: item.status || 'approved',
    }),
    quantity: item.quantity,
  })),
  total: order.total,
  status: order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: order.created_at,
  shippingAddress: order.shipping_address || {},
  paymentMethod: order.payment_method,
});

const mapPayout = (payout: any): Payout => ({
  id: payout.id,
  vendorId: payout.vendor_id,
  vendorName: payout.vendor_name || 'Unknown Vendor',
  amount: payout.amount,
  status: payout.status as 'pending' | 'processed' | 'failed',
  createdAt: payout.created_at,
  stripeTransferId: payout.stripe_transfer_id,
  failureReason: payout.failure_reason,
  periodStart: payout.period_start,
  periodEnd: payout.period_end,
});

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Create a provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
        
        if (productsError) {
          if (productsError.code === '42P01') {
            console.warn("Products table doesn't exist yet");
          } else {
            throw productsError;
          }
        } else {
          setProducts(productsData ? productsData.map(mapProduct) : []);
        }
        
        // Try to fetch users from users table
        try {
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('*');
          
          if (usersError) {
            if (usersError.code === '42P01') {
              console.warn("users table doesn't exist yet");
            } else {
              throw usersError;
            }
          } else {
            setUsers(usersData ? usersData.map(mapUser) : []);
          }
        } catch (userError) {
          console.error('Error fetching users:', userError);
          // Continue with other data fetching even if users fetch fails
        }
        
        // Try to fetch orders with their items
        try {
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*, order_items(*)');
          
          if (ordersError) {
            if (ordersError.code === '42P01') {
              console.warn("Orders table doesn't exist yet");
            } else {
              throw ordersError;
            }
          } else {
            // Transform orders data to match expected format
            const formattedOrders = ordersData ? ordersData.map(order => 
              mapOrder(order, order.order_items)
            ) : [];
            
            setOrders(formattedOrders);
          }
        } catch (orderError) {
          console.error('Error fetching orders:', orderError);
          // Continue with other data fetching even if orders fetch fails
        }
        
        // Try to fetch payouts
        try {
          const { data: payoutsData, error: payoutsError } = await supabase
            .from('payouts')
            .select('*');
          
          if (payoutsError) {
            if (payoutsError.code === '42P01') {
              console.warn("Payouts table doesn't exist yet");
            } else {
              throw payoutsError;
            }
          } else {
            setPayouts(payoutsData ? payoutsData.map(mapPayout) : []);
          }
        } catch (payoutError) {
          console.error('Error fetching payouts:', payoutError);
          // Continue even if payouts fetch fails
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Add to cart
  const addToCart = (product: Product) => {
    if (product.status !== 'approved') {
      toast.error("This product is not available for purchase");
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        toast.success(`Updated quantity for ${product.name}`);
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  // Get a single product by ID
  const getProduct = async (id: string) => {
    // First check if it's in local state
    const cachedProduct = products.find(product => product.id === id);
    if (cachedProduct) return cachedProduct;
    
    // If not in local state, fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data ? mapProduct(data) : undefined;
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  };

  // Get products by vendor ID
  const getVendorProducts = async (vendorId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendorId);
        
      if (error) throw error;
      return data ? data.map(mapProduct) : [];
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      return [];
    }
  };

  // Search products
  const searchProducts = async (query: string, category?: string) => {
    try {
      let queryBuilder = supabase
        .from('products')
        .select('*')
        .eq('status', 'approved');
      
      // Filter by category if specified
      if (category && category !== 'all') {
        queryBuilder = queryBuilder.eq('category', category);
      }
      
      // Filter by search query
      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      return data ? data.map(mapProduct) : [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };

  // Submit a new product (for vendors)
  const submitProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'status'>) => {
    try {
      const newProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category,
        vendor_id: product.vendorId,
        vendor_name: product.vendorName,
        stock: product.stock,
        rating: product.rating,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();
        
      if (error) throw error;
      
      const mappedProduct = data && data[0] ? mapProduct(data[0]) : null;
      if (mappedProduct) {
        setProducts(prevProducts => [...prevProducts, mappedProduct]);
      }
      
      toast.success("Product submitted for review");
      return mappedProduct;
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error("Failed to submit product");
      return null;
    }
  };

  // Approve a product (for admins)
  const approveProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'approved' })
        .eq('id', productId);
        
      if (error) throw error;
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, status: 'approved' } 
            : product
        )
      );
      
      toast.success("Product approved");
    } catch (error) {
      console.error('Error approving product:', error);
      toast.error("Failed to approve product");
    }
  };

  // Reject a product (for admins)
  const rejectProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'rejected' })
        .eq('id', productId);
        
      if (error) throw error;
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, status: 'rejected' } 
            : product
        )
      );
      
      toast.success("Product rejected");
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast.error("Failed to reject product");
    }
  };

  // Get a single user by ID
  const getUser = async (id: string) => {
    // First check if it's in local state
    const cachedUser = users.find(user => user.id === id);
    if (cachedUser) return cachedUser;
    
    // If not in local state, fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data ? mapUser(data) : undefined;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  };

  // Get a single user by email
  const getUserByEmail = async (email: string) => {
    // First check if it's in local state
    const cachedUser = users.find(user => user.email === email);
    if (cachedUser) return cachedUser;
    
    // If not in local state, fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
        
      if (error) throw error;
      return data ? mapUser(data) : undefined;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return undefined;
    }
  };

  // Create a new order
  const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      // First create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: order.customerId,
          customer_name: order.customerName,
          total: order.total,
          status: order.status,
          shipping_address: order.shippingAddress,
          payment_method: order.paymentMethod,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
        
      if (orderError) throw orderError;
      
      const newOrderId = orderData[0].id;
      
      // Then create order items
      const orderItems = order.items.map(item => ({
        order_id: newOrderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        vendor_id: item.vendorId
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Fetch the complete order with items
      const { data: completeOrder, error: fetchError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', newOrderId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const mappedOrder = mapOrder(completeOrder, completeOrder.order_items);
      
      // Update local state
      setOrders(prevOrders => [...prevOrders, mappedOrder]);
      
      toast.success("Order created successfully");
      return mappedOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order");
      return null;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status } 
            : order
        )
      );
      
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error("Failed to update order status");
    }
  };

  // Create a new payout
  const createPayout = async (payout: Omit<Payout, 'id' | 'createdAt'>) => {
    try {
      const newPayout = {
        vendor_id: payout.vendorId,
        vendor_name: payout.vendorName,
        amount: payout.amount,
        status: payout.status,
        stripe_transfer_id: payout.stripeTransferId,
        failure_reason: payout.failureReason,
        period_start: payout.periodStart,
        period_end: payout.periodEnd,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('payouts')
        .insert([newPayout])
        .select();
        
      if (error) throw error;
      
      const mappedPayout = data && data[0] ? mapPayout(data[0]) : null;
      if (mappedPayout) {
        setPayouts(prevPayouts => [...prevPayouts, mappedPayout]);
      }
      
      toast.success("Payout created successfully");
      return mappedPayout;
    } catch (error) {
      console.error('Error creating payout:', error);
      toast.error("Failed to create payout");
      return null;
    }
  };

  // Update payout status
  const updatePayoutStatus = async (payoutId: string, status: Payout['status']) => {
    try {
      const { error } = await supabase
        .from('payouts')
        .update({ status })
        .eq('id', payoutId);
        
      if (error) throw error;
      
      // Update local state
      setPayouts(prevPayouts => 
        prevPayouts.map(payout => 
          payout.id === payoutId 
            ? { ...payout, status } 
            : payout
        )
      );
      
      toast.success(`Payout status updated to ${status}`);
    } catch (error) {
      console.error('Error updating payout status:', error);
      toast.error("Failed to update payout status");
    }
  };

  // Get all pending products
  const getPendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'pending');
        
      if (error) throw error;
      return data ? data.map(mapProduct) : [];
    } catch (error) {
      console.error('Error fetching pending products:', error);
      return [];
    }
  };

  // Get all pending payouts
  const getPendingPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('status', 'pending');
        
      if (error) throw error;
      return data ? data.map(mapPayout) : [];
    } catch (error) {
      console.error('Error fetching pending payouts:', error);
      return [];
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      cartItems,
      users,
      orders,
      payouts,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getProduct,
      getVendorProducts,
      searchProducts,
      submitProduct,
      approveProduct,
      rejectProduct,
      getUser,
      getUserByEmail,
      createOrder,
      updateOrderStatus,
      createPayout,
      updatePayoutStatus,
      getPendingProducts,
      getPendingPayouts,
      selectedCategory,
      setSelectedCategory
    }}>
      {children}
    </StoreContext.Provider>
  );
};

// Create a hook to use the context
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
