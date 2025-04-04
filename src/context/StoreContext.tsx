import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, Payout } from '@/types';
import { toast } from "sonner";

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Performance Exhaust System",
    description: "High-flow performance exhaust system that increases horsepower and torque while providing an aggressive sound.",
    price: 549.99,
    images: ["/placeholder.svg"],
    category: "performance",
    vendorId: "v1",
    vendorName: "TurboTech Performance",
    rating: 4.8,
    stock: 15,
    createdAt: new Date().toISOString(),
    status: "approved"
  },
  {
    id: "2",
    name: "Carbon Fiber Hood",
    description: "Lightweight carbon fiber hood that reduces weight and improves aerodynamics.",
    price: 899.99,
    images: ["/placeholder.svg"],
    category: "exterior",
    vendorId: "v2",
    vendorName: "Carbon Creations",
    rating: 4.7,
    stock: 8,
    createdAt: new Date().toISOString(),
    status: "approved"
  },
  {
    id: "3",
    name: "LED Headlight Kit",
    description: "Ultra-bright LED headlight kit with improved visibility and modern styling.",
    price: 289.99,
    images: ["/placeholder.svg"],
    category: "lighting",
    vendorId: "v3",
    vendorName: "Bright Mods",
    rating: 4.9,
    stock: 22,
    createdAt: new Date().toISOString(),
    status: "approved"
  },
  {
    id: "4",
    name: "Sport Suspension Kit",
    description: "Complete sport suspension kit that lowers ride height and improves handling.",
    price: 749.99,
    images: ["/placeholder.svg"],
    category: "suspension",
    vendorId: "v1",
    vendorName: "TurboTech Performance",
    rating: 4.6,
    stock: 10,
    createdAt: new Date().toISOString(),
    status: "approved"
  },
  {
    id: "5",
    name: "Racing Seats",
    description: "High-quality racing seats with bolstered sides for better support during aggressive driving.",
    price: 429.99,
    images: ["/placeholder.svg"],
    category: "interior",
    vendorId: "v4",
    vendorName: "Interior Innovations",
    rating: 4.5,
    stock: 12,
    createdAt: new Date().toISOString(),
    status: "approved"
  },
  {
    id: "6",
    name: "Performance Chip Tuner",
    description: "Plug-and-play performance chip that optimizes engine parameters for increased power.",
    price: 199.99,
    images: ["/placeholder.svg"],
    category: "performance",
    vendorId: "v1",
    vendorName: "TurboTech Performance",
    rating: 4.4,
    stock: 30,
    createdAt: new Date().toISOString(),
    status: "approved"
  },
  {
    id: "7",
    name: "Cold Air Intake System",
    description: "High-flow cold air intake system that improves throttle response and engine sound.",
    price: 249.99,
    images: ["/placeholder.svg"],
    category: "performance",
    vendorId: "v5",
    vendorName: "Air Force Mods",
    rating: 4.7,
    stock: 18,
    createdAt: new Date().toISOString(),
    status: "approved"
  },
  {
    id: "8",
    name: "20-inch Alloy Wheels (Set of 4)",
    description: "Lightweight 20-inch alloy wheels with premium finish and improved performance.",
    price: 1299.99,
    images: ["/placeholder.svg"],
    category: "wheels_tires",
    vendorId: "v6",
    vendorName: "Wheel Masters",
    rating: 4.9,
    stock: 6,
    createdAt: new Date().toISOString(),
    status: "approved"
  }
];

// Sample users data
const sampleUsers: User[] = [
  {
    id: "u1",
    name: "John Admin",
    email: "admin@modcentral.com",
    role: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "u2",
    name: "Jane Vendor",
    email: "vendor@example.com",
    role: "vendor",
    createdAt: new Date().toISOString()
  },
  {
    id: "u3",
    name: "Bob Customer",
    email: "customer@example.com",
    role: "customer",
    createdAt: new Date().toISOString()
  }
];

// Sample orders data
const sampleOrders: Order[] = [
  {
    id: "o1",
    customerId: "u3",
    customerName: "Bob Customer",
    items: [{ ...sampleProducts[0], quantity: 1 }],
    total: 549.99,
    status: "pending",
    createdAt: new Date().toISOString(),
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA"
    },
    paymentMethod: "Credit Card"
  }
];

// Sample payouts data
const samplePayouts: Payout[] = [
  {
    id: "p1",
    vendorId: "v1",
    vendorName: "TurboTech Performance",
    amount: 450.00,
    status: "pending",
    createdAt: new Date().toISOString()
  }
];

// Define the context type
interface StoreContextType {
  products: Product[];
  categories: string[];
  cartItems: CartItem[];
  users: User[];
  orders: Order[];
  payouts: Payout[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getProduct: (id: string) => Product | undefined;
  getVendorProducts: (vendorId: string) => Product[];
  searchProducts: (query: string, category?: string) => Product[];
  submitProduct: (product: Omit<Product, 'id' | 'createdAt' | 'status'>) => void;
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string) => void;
  getUser: (id: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  createPayout: (payout: Omit<Payout, 'id' | 'createdAt'>) => void;
  updatePayoutStatus: (payoutId: string, status: Payout['status']) => void;
  getPendingProducts: () => Product[];
  getPendingPayouts: () => Payout[];
}

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Create a provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [users] = useState<User[]>(sampleUsers);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [payouts, setPayouts] = useState<Payout[]>(samplePayouts);

  // Load cart from localStorage on mount
  useEffect(() => {
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
  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  // Get products by vendor ID
  const getVendorProducts = (vendorId: string) => {
    return products.filter(product => product.vendorId === vendorId);
  };

  // Search products
  const searchProducts = (query: string, category?: string) => {
    let filteredProducts = products.filter(product => product.status === 'approved');
    
    // Filter by category if specified
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) || 
        product.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    return filteredProducts;
  };

  // Submit a new product (for vendors)
  const submitProduct = (product: Omit<Product, 'id' | 'createdAt' | 'status'>) => {
    const newProduct: Product = {
      ...product,
      id: `${products.length + 1}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    toast.success("Product submitted for review");
  };

  // Approve a product (for admins)
  const approveProduct = (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, status: 'approved' } 
          : product
      )
    );
    toast.success("Product approved");
  };

  // Reject a product (for admins)
  const rejectProduct = (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, status: 'rejected' } 
          : product
      )
    );
    toast.success("Product rejected");
  };

  // Get a single user by ID
  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  // Get a single user by email
  const getUserByEmail = (email: string) => {
    return users.find(user => user.email === email);
  };

  // Create a new order
  const createOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `o${orders.length + 1}`,
      createdAt: new Date().toISOString()
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    toast.success("Order created successfully");
  };

  // Update order status
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status } 
          : order
      )
    );
    toast.success(`Order status updated to ${status}`);
  };

  // Create a new payout
  const createPayout = (payout: Omit<Payout, 'id' | 'createdAt'>) => {
    const newPayout: Payout = {
      ...payout,
      id: `p${payouts.length + 1}`,
      createdAt: new Date().toISOString()
    };
    
    setPayouts(prevPayouts => [...prevPayouts, newPayout]);
    toast.success("Payout created successfully");
  };

  // Update payout status
  const updatePayoutStatus = (payoutId: string, status: Payout['status']) => {
    setPayouts(prevPayouts => 
      prevPayouts.map(payout => 
        payout.id === payoutId 
          ? { ...payout, status } 
          : payout
      )
    );
    toast.success(`Payout status updated to ${status}`);
  };

  // Get all pending products
  const getPendingProducts = () => {
    return products.filter(product => product.status === 'pending');
  };

  // Get all pending payouts
  const getPendingPayouts = () => {
    return payouts.filter(payout => payout.status === 'pending');
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      cartItems,
      users,
      orders,
      payouts,
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
      getPendingPayouts
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
