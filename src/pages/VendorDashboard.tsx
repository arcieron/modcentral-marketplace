
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Package,
  PackagePlus,
  ShoppingBag,
  Users,
  Trash2,
  Edit,
  BarChart4,
  DollarSign,
  CreditCard,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import { VendorEarnings } from '@/types';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { products, getVendorProducts, users } = useStore();
  const [vendorId, setVendorId] = useState<string>("");
  const [vendorName, setVendorName] = useState<string>("");
  const [stripeConnected, setStripeConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Mock earnings data - would be fetched from backend in real app
  const [earnings, setEarnings] = useState<VendorEarnings>({
    vendorId: "v1",
    totalEarnings: 5249.97,
    availableForPayout: 2598.50,
    pendingEarnings: 1242.99,
    lastPayoutDate: "2025-03-01T00:00:00Z",
    lastPayoutAmount: 1408.48
  });
  
  // Mock payouts history - would be fetched from backend
  const [payoutsHistory, setPayoutsHistory] = useState([
    {
      id: "pout_1",
      amount: 1408.48,
      status: "processed",
      date: "2025-03-01T00:00:00Z",
      period: "Feb 1 - Feb 28"
    },
    {
      id: "pout_2",
      amount: 892.55,
      status: "processed",
      date: "2025-02-01T00:00:00Z",
      period: "Jan 1 - Jan 31"
    }
  ]);
  
  // Get vendor products
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
  
  useEffect(() => {
    // Check if vendor is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.role !== 'vendor') {
        toast.error('You need to be logged in as a vendor to access this page');
        navigate('/login');
        return;
      }
      
      setVendorId(user.id);
      setVendorName(user.name);
      
      // In a real app, this would check if the vendor has a Stripe Connect account
      setStripeConnected(user.stripeConnectId ? true : false);
      
      // Get vendor's products
      const products = getVendorProducts(user.id);
      setVendorProducts(products);
      setIsLoading(false);
    } else {
      toast.error('Please login to continue');
      navigate('/login');
    }
  }, [navigate, getVendorProducts]);
  
  // For demo purposes - would be real stripe connect in production
  const handleConnectStripe = () => {
    // In a real app this would redirect to Stripe Connect OAuth flow
    toast.success("This would redirect to Stripe Connect onboarding in a real application");
    setStripeConnected(true);
  };
  
  // Mock requesting a payout
  const handleRequestPayout = () => {
    if (!stripeConnected) {
      toast.error("You need to connect your Stripe account first");
      return;
    }
    
    toast.success(`Payout of $${earnings.availableForPayout.toFixed(2)} requested successfully`);
    // In a real app, this would trigger a backend process to create a payout
    setEarnings(prev => ({
      ...prev,
      availableForPayout: 0,
      lastPayoutDate: new Date().toISOString(),
      lastPayoutAmount: prev.availableForPayout
    }));
  };

  // Mock statistics
  const stats = {
    totalSales: earnings.totalEarnings,
    orders: 12,
    products: vendorProducts.length,
    views: 245
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8">Vendor Dashboard</h1>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-zinc-900 border-zinc-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-blue-600">Products</TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600">Orders</TabsTrigger>
              <TabsTrigger value="payouts" className="data-[state=active]:bg-blue-600">Payouts</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                      Total Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-1 text-blue-500" />
                      Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.orders}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                      <Package className="h-4 w-4 mr-1 text-amber-500" />
                      Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.products}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-indigo-500" />
                      Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.views}</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart4 className="h-5 w-5 mr-2" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center border border-dashed border-zinc-800 rounded-md">
                    <p className="text-zinc-400">Sales chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Products</h2>
                <Link to="/vendor-dashboard/add-product">
                  <Button>
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <p>Loading your products...</p>
                </div>
              ) : vendorProducts.length > 0 ? (
                <div className="space-y-4">
                  {vendorProducts.map((product) => (
                    <Card key={product.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32 bg-zinc-800 flex-shrink-0">
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-semibold">{product.name}</h3>
                              <div className="font-medium">${product.price.toFixed(2)}</div>
                            </div>
                            <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs bg-zinc-800 px-2 py-1 rounded">
                                {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('_', ' ')}
                              </span>
                              <span className="text-xs text-zinc-400 ml-3">
                                Stock: {product.stock}
                              </span>
                              <span className="text-xs ml-3 px-2 py-1 rounded bg-yellow-900/20 text-yellow-500 border border-yellow-500/30">
                                {product.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end mt-4 space-x-2">
                            <Button variant="outline" size="sm" className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent text-red-500 border-red-500/30 hover:bg-red-950/20">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-zinc-800 rounded-lg bg-zinc-900">
                  <Package className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-zinc-400 mb-6">
                    Add your first product to get started
                  </p>
                  <Link to="/vendor-dashboard/add-product">
                    <Button>
                      <PackagePlus className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="text-center py-12 border border-zinc-800 rounded-lg bg-zinc-900">
                <ShoppingBag className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-zinc-400 mb-6">
                  Orders will appear here once customers make purchases
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="payouts" className="space-y-6">
              {!stripeConnected ? (
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle>Connect With Stripe</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Set up your account to receive payouts from your sales
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-blue-950/20 text-blue-400 border border-blue-500/30">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        To receive payments, you need to connect your Stripe account. This allows us to transfer funds directly to your bank account.
                      </AlertDescription>
                    </Alert>
                    
                    <Button onClick={handleConnectStripe} className="w-full sm:w-auto mt-4">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Connect Stripe Account
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                      <CardTitle>Earnings Overview</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Track your earnings and request payouts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-400">Available for payout</p>
                          <p className="text-3xl font-bold text-green-500">${earnings.availableForPayout.toFixed(2)}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-400">Pending earnings</p>
                          <p className="text-3xl font-bold text-yellow-500">${earnings.pendingEarnings.toFixed(2)}</p>
                          <p className="text-xs text-zinc-500">From processing orders</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-400">Last payout</p>
                          {earnings.lastPayoutDate ? (
                            <>
                              <p className="text-3xl font-bold">${earnings.lastPayoutAmount?.toFixed(2)}</p>
                              <p className="text-xs text-zinc-500">
                                {new Date(earnings.lastPayoutDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg">No previous payouts</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <Button 
                          onClick={handleRequestPayout} 
                          className="bg-green-600 hover:bg-green-700"
                          disabled={earnings.availableForPayout <= 0}
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Request Payout (${earnings.availableForPayout.toFixed(2)})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                      <CardTitle>Payout History</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Review your previous payouts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {payoutsHistory.length > 0 ? (
                        <div className="space-y-4">
                          {payoutsHistory.map((payout) => (
                            <div key={payout.id} className="flex items-center justify-between p-4 border border-zinc-800 rounded-md">
                              <div>
                                <p className="font-medium">${payout.amount.toFixed(2)}</p>
                                <p className="text-sm text-zinc-400">{payout.period}</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs px-2 py-1 rounded bg-green-900/20 text-green-500 border border-green-500/30 mr-4">
                                  {payout.status}
                                </span>
                                <p className="text-sm text-zinc-400">
                                  {new Date(payout.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-md">
                          <p className="text-zinc-400">No payout history yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                      <CardTitle>Stripe Account</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Your payment processing account details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 bg-green-900/20 text-green-500 border border-green-500/30 rounded-md p-3 mb-4">
                        <CheckCircle className="h-5 w-5" />
                        <span>Your Stripe account is connected and active</span>
                      </div>
                      
                      <Button variant="outline" className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Stripe Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" defaultValue="TurboTech Performance" className="bg-zinc-800 border-zinc-700 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="contact@turbotech.com" className="bg-zinc-800 border-zinc-700 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-zinc-800 border-zinc-700 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input id="website" defaultValue="https://turbotech.com" className="bg-zinc-800 border-zinc-700 text-white" />
                      </div>
                    </div>
                    
                    <Button className="mt-4">Save Changes</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VendorDashboard;
