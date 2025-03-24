
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Package,
  PackagePlus,
  ShoppingBag,
  Users,
  Trash2,
  Edit,
  BarChart4,
  DollarSign
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const VendorDashboard = () => {
  // In a real app, this would only fetch products for the current vendor
  const { products } = useStore();
  const vendorId = "v1"; // Mock vendor ID for demo purposes
  const vendorProducts = products.filter(product => product.vendorId === vendorId);
  
  // Mock statistics
  const stats = {
    totalSales: 4299.97,
    orders: 12,
    products: vendorProducts.length,
    views: 245
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Vendor Dashboard</h1>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/80 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                      Total Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">${stats.totalSales.toFixed(2)}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/80 flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-1 text-primary" />
                      Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.orders}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/80 flex items-center">
                      <Package className="h-4 w-4 mr-1 text-amber-500" />
                      Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.products}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/80 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-indigo-500" />
                      Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.views}</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart4 className="h-5 w-5 mr-2" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center border border-dashed border-border rounded-md">
                    <p className="text-muted-foreground">Sales chart will be displayed here</p>
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
              
              {vendorProducts.length > 0 ? (
                <div className="space-y-4">
                  {vendorProducts.map((product) => (
                    <Card key={product.id} className="bg-card border-border overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32 bg-secondary flex-shrink-0">
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
                              <div className="text-foreground font-medium">${product.price.toFixed(2)}</div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs bg-secondary px-2 py-1 rounded">
                                {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('_', ' ')}
                              </span>
                              <span className="text-xs text-muted-foreground ml-3">
                                Stock: {product.stock}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end mt-4 space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
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
                <div className="text-center py-12 border border-border rounded-lg bg-card">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-foreground">No products found</h3>
                  <p className="text-foreground/70 mb-6">
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
              <div className="text-center py-12 border border-border rounded-lg bg-card">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2 text-foreground">No orders yet</h3>
                <p className="text-foreground/70 mb-6">
                  Orders will appear here once customers make purchases
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" defaultValue="TurboTech Performance" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="contact@turbotech.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input id="website" defaultValue="https://turbotech.com" />
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
