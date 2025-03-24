
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
  }
];

// Define the context type
interface StoreContextType {
  products: Product[];
  categories: string[];
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getProduct: (id: string) => Product | undefined;
  getVendorProducts: (vendorId: string) => Product[];
  searchProducts: (query: string, category?: string) => Product[];
}

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Create a provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(sampleProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
    let filteredProducts = products;
    
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

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getProduct,
      getVendorProducts,
      searchProducts,
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
