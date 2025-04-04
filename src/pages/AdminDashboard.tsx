
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Package, Users, CreditCard, AlertTriangle, CheckCircle, XCircle, ChevronRight, EyeIcon, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import { Product, User, Order, Payout } from '@/types';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    products, 
    users, 
    orders, 
    payouts, 
    approveProduct, 
    rejectProduct, 
    updateOrderStatus, 
    updatePayoutStatus,
    getPendingProducts,
    getPendingPayouts
  } = useStore();
  
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  
  useEffect(() => {
    // Check if admin is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.role !== 'admin') {
        toast.error('You do not have access to this page');
        navigate('/login');
      }
    } else {
      toast.error('Please login to continue');
      navigate('/login');
    }
    
    // Load pending products and payouts
    setPendingProducts(getPendingProducts());
    setPendingPayouts(getPendingPayouts());
  }, [navigate, getPendingProducts, getPendingPayouts]);
  
  const handleApproveProduct = (product: Product) => {
    approveProduct(product.id);
    setPendingProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
    setIsProductDialogOpen(false);
    toast.success(`${product.name} has been approved`);
  };
  
  const handleRejectProduct = (product: Product) => {
    rejectProduct(product.id);
    setPendingProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
    setIsProductDialogOpen(false);
    toast.success(`${product.name} has been rejected`);
  };
  
  const handleProcessPayout = (payout: Payout) => {
    updatePayoutStatus(payout.id, 'processed');
    setPendingPayouts(prevPayouts => prevPayouts.filter(p => p.id !== payout.id));
    toast.success(`Payout of $${payout.amount.toFixed(2)} to ${payout.vendorName} has been processed`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-900/20 text-yellow-500 border-yellow-500">Pending</Badge>;
      case 'approved':
      case 'processed':
      case 'delivered':
      case 'shipped':
        return <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-500">Approved</Badge>;
      case 'rejected':
      case 'failed':
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-900/20 text-gray-500 border-gray-500">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-3xl font-bold font-display tracking-tight">Admin Dashboard</h1>
              <p className="text-zinc-400 mt-2">Manage all aspects of your marketplace</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{users.length}</div>
                    <Users className="h-8 w-8 text-zinc-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{products.length}</div>
                    <Package className="h-8 w-8 text-zinc-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{orders.length}</div>
                    <CreditCard className="h-8 w-8 text-zinc-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{pendingProducts.length}</div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="pending-products" className="w-full">
              <TabsList className="bg-zinc-800 border-zinc-700">
                <TabsTrigger value="pending-products" className="data-[state=active]:bg-blue-600">
                  Pending Products
                </TabsTrigger>
                <TabsTrigger value="all-products" className="data-[state=active]:bg-blue-600">
                  All Products
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
                  Users
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="payouts" className="data-[state=active]:bg-blue-600">
                  Payouts
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending-products">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle>Pending Product Approvals</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Review and approve or reject products submitted by vendors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingProducts.length === 0 ? (
                      <div className="text-center py-6 text-zinc-400">
                        No pending products to review
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableHead>Product Name</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Date Submitted</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingProducts.map(product => (
                            <TableRow key={product.id} className="border-zinc-800 hover:bg-zinc-800/50">
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.vendorName}</TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
                              <TableCell>{formatDate(product.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsProductDialogOpen(true);
                                  }}
                                >
                                  <EyeIcon className="h-4 w-4 mr-2" />
                                  Review
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="all-products">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Manage all products in the marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableHead>Product Name</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Added</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map(product => (
                          <TableRow key={product.id} className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.vendorName}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(product.status)}</TableCell>
                            <TableCell>{formatDate(product.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Manage users and their roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Date Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map(user => (
                          <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                user.role === 'admin' 
                                  ? 'bg-purple-900/20 text-purple-500 border-purple-500'
                                  : user.role === 'vendor'
                                    ? 'bg-blue-900/20 text-blue-500 border-blue-500'
                                    : 'bg-green-900/20 text-green-500 border-green-500'
                              }>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Manage customer orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map(order => (
                          <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payouts">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                  <CardHeader>
                    <CardTitle>Vendor Payouts</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Manage payouts to vendors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableHead>Payout ID</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payouts.map(payout => (
                          <TableRow key={payout.id} className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableCell className="font-medium">{payout.id}</TableCell>
                            <TableCell>{payout.vendorName}</TableCell>
                            <TableCell>${payout.amount.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(payout.status)}</TableCell>
                            <TableCell>{formatDate(payout.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              {payout.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleProcessPayout(payout)}
                                >
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Process
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Product Review Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Review Product</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Review the product details before approving or rejecting
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div className="aspect-video bg-zinc-800 rounded-md overflow-hidden">
                <img 
                  src={selectedProduct.images[0] || "/placeholder.svg"} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display">{selectedProduct.name}</h3>
                <p className="text-zinc-400">{selectedProduct.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Price</p>
                  <p className="font-bold">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Vendor</p>
                  <p className="font-bold">{selectedProduct.vendorName}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Category</p>
                  <p className="font-bold">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Stock</p>
                  <p className="font-bold">{selectedProduct.stock}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2 justify-between">
            <Button
              variant="destructive"
              onClick={() => selectedProduct && handleRejectProduct(selectedProduct)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              variant="default"
              onClick={() => selectedProduct && handleApproveProduct(selectedProduct)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
