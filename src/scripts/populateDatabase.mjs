// ESM-compatible version of populateDatabase
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample product data
const sampleProducts = [
  {
    name: "Performance Exhaust System",
    description: "High-flow performance exhaust system that increases horsepower and torque while providing an aggressive sound.",
    price: 549.99,
    images: ["/placeholder.svg"],
    category: "performance",
    vendor_id: "v1", // We'll replace this with actual vendor ids after creating vendors
    vendor_name: "TurboTech Performance",
    rating: 4.8,
    stock: 15,
    status: "approved"
  },
  {
    name: "Carbon Fiber Hood",
    description: "Lightweight carbon fiber hood that reduces weight and improves aerodynamics.",
    price: 899.99,
    images: ["/placeholder.svg"],
    category: "exterior",
    vendor_id: "v2",
    vendor_name: "Carbon Creations",
    rating: 4.7,
    stock: 8,
    status: "approved"
  },
  {
    name: "LED Headlight Kit",
    description: "Ultra-bright LED headlight kit with improved visibility and modern styling.",
    price: 289.99,
    images: ["/placeholder.svg"],
    category: "lighting",
    vendor_id: "v3",
    vendor_name: "Bright Mods",
    rating: 4.9,
    stock: 22,
    status: "approved"
  },
  {
    name: "Sport Suspension Kit",
    description: "Complete sport suspension kit that lowers ride height and improves handling.",
    price: 749.99,
    images: ["/placeholder.svg"],
    category: "suspension",
    vendor_id: "v1",
    vendor_name: "TurboTech Performance",
    rating: 4.6,
    stock: 10,
    status: "approved"
  },
  {
    name: "Racing Seats",
    description: "High-quality racing seats with bolstered sides for better support during aggressive driving.",
    price: 429.99,
    images: ["/placeholder.svg"],
    category: "interior",
    vendor_id: "v4",
    vendor_name: "Interior Innovations",
    rating: 4.5,
    stock: 12,
    status: "approved"
  },
  {
    name: "Performance Chip Tuner",
    description: "Plug-and-play performance chip that optimizes engine parameters for increased power.",
    price: 199.99,
    images: ["/placeholder.svg"],
    category: "performance",
    vendor_id: "v1",
    vendor_name: "TurboTech Performance",
    rating: 4.4,
    stock: 30,
    status: "approved"
  },
  {
    name: "Cold Air Intake System",
    description: "High-flow cold air intake system that improves throttle response and engine sound.",
    price: 249.99,
    images: ["/placeholder.svg"],
    category: "performance",
    vendor_id: "v5",
    vendor_name: "Air Force Mods",
    rating: 4.7,
    stock: 18,
    status: "approved"
  },
  {
    name: "20-inch Alloy Wheels (Set of 4)",
    description: "Lightweight 20-inch alloy wheels with premium finish and improved performance.",
    price: 1299.99,
    images: ["/placeholder.svg"],
    category: "wheels_tires",
    vendor_id: "v6",
    vendor_name: "Wheel Masters",
    rating: 4.9,
    stock: 6,
    status: "approved"
  }
];

// Sample users data
const sampleUsers = [
  {
    email: "admin@modcentral.com",
    password: "admin123",
    name: "John Admin",
    role: "admin"
  },
  {
    email: "vendor@example.com",
    password: "vendor123",
    name: "Jane Vendor",
    role: "vendor"
  },
  {
    email: "customer@example.com",
    password: "customer123",
    name: "Bob Customer",
    role: "customer"
  }
];

// Sample vendors data (will be filled with user IDs)
const sampleVendors = [
  {
    name: "TurboTech Performance",
    user_email: "vendor@example.com"
  },
  {
    name: "Carbon Creations",
    user_email: "vendor2@example.com",
    password: "vendor123"
  },
  {
    name: "Bright Mods",
    user_email: "vendor3@example.com",
    password: "vendor123"
  },
  {
    name: "Interior Innovations",
    user_email: "vendor4@example.com",
    password: "vendor123"
  },
  {
    name: "Air Force Mods",
    user_email: "vendor5@example.com",
    password: "vendor123"
  },
  {
    name: "Wheel Masters",
    user_email: "vendor6@example.com",
    password: "vendor123"
  }
];

const createUsersAndVendors = async () => {
  console.log('Creating users and vendors...');
  
  // Create users and map their IDs
  const userMap = new Map();
  
  for (const user of sampleUsers) {
    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password || 'password123',
      options: {
        data: {
          name: user.name,
        }
      }
    });
    
    if (authError) {
      console.error(`Error creating user ${user.email}:`, authError);
      continue;
    }
    
    const userId = authData.user?.id;
    if (!userId) continue;
    
    // Create user in users table
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role
      }]);
    
    if (userError) {
      console.error(`Error creating user ${user.email} in users table:`, userError);
      continue;
    }
    
    userMap.set(user.email, userId);
    console.log(`Created user: ${user.name} (${user.email})`);
  }
  
  // Create additional vendor users
  for (const vendor of sampleVendors) {
    if (userMap.has(vendor.user_email)) continue; // Skip if already created
    
    // Create vendor user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: vendor.user_email,
      password: vendor.password || 'vendor123',
      options: {
        data: {
          name: vendor.name,
        }
      }
    });
    
    if (authError) {
      console.error(`Error creating vendor user ${vendor.user_email}:`, authError);
      continue;
    }
    
    const userId = authData.user?.id;
    if (!userId) continue;
    
    // Create user in users table
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: userId,
        name: vendor.name,
        email: vendor.user_email,
        role: 'vendor'
      }]);
    
    if (userError) {
      console.error(`Error creating vendor ${vendor.name} in users table:`, userError);
      continue;
    }
    
    userMap.set(vendor.user_email, userId);
    console.log(`Created vendor user: ${vendor.name} (${vendor.user_email})`);
  }
  
  // Create vendors
  const vendorMap = new Map();
  let vendorIndex = 0;
  
  for (const vendor of sampleVendors) {
    const userId = userMap.get(vendor.user_email);
    if (!userId) continue;
    
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .insert([{
        user_id: userId,
        stripe_connect_status: 'active',
        charges_enabled: true,
        payouts_enabled: true
      }])
      .select();
    
    if (vendorError) {
      console.error(`Error creating vendor ${vendor.name}:`, vendorError);
      continue;
    }
    
    const vendorId = vendorData?.[0]?.id;
    if (!vendorId) continue;
    
    vendorMap.set(`v${vendorIndex + 1}`, vendorId);
    console.log(`Created vendor: ${vendor.name} with ID ${vendorId}`);
    vendorIndex++;
  }
  
  return vendorMap;
};

const createProducts = async (vendorMap) => {
  console.log('Creating products...');
  
  for (const product of sampleProducts) {
    const vendorId = vendorMap.get(product.vendor_id);
    if (!vendorId) {
      console.error(`Vendor ID ${product.vendor_id} not found`);
      continue;
    }
    
    const { error } = await supabase
      .from('products')
      .insert([{
        ...product,
        vendor_id: vendorId
      }]);
    
    if (error) {
      console.error(`Error creating product ${product.name}:`, error);
      continue;
    }
    
    console.log(`Created product: ${product.name}`);
  }
};

// Main function to populate the database
const populateDatabase = async () => {
  try {
    console.log('Starting database population...');
    
    // Create users, vendors, and get vendor mapping
    const vendorMap = await createUsersAndVendors();
    
    // Create products using vendor mapping
    await createProducts(vendorMap);
    
    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

// Run the script
populateDatabase(); 