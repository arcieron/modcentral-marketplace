
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, MessageSquare, Store, Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';

const VendorProfile = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { products, addToCart } = useStore();
  const [activeTab, setActiveTab] = useState('products');
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [vendorInfo, setVendorInfo] = useState<{
    id: string;
    name: string;
    description: string;
    joinedDate: string;
    totalProducts: number;
    averageRating: number;
  } | null>(null);

  useEffect(() => {
    // Filter products by vendorId
    const filteredProducts = products.filter(
      (product) => product.vendorId === vendorId && product.status === 'approved'
    );
    setVendorProducts(filteredProducts);
    
    // In a real app, we would fetch vendor info from the API
    // This is mock data for demonstration
    if (filteredProducts.length > 0) {
      const firstProduct = filteredProducts[0];
      setVendorInfo({
        id: vendorId || '',
        name: firstProduct.vendorName,
        description: 'Welcome to our store! We specialize in high-quality electronic mods and accessories.',
        joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalProducts: filteredProducts.length,
        averageRating: filteredProducts.reduce((sum, product) => sum + product.rating, 0) / filteredProducts.length
      });
    }
  }, [vendorId, products]);

  if (!vendorInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">Vendor not found</h2>
              <p className="text-muted-foreground mb-6">
                The vendor you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Vendor Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {vendorInfo.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{vendorInfo.name}</h1>
                
                <div className="flex items-center mb-3 text-sm">
                  <Store className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="mr-4">Joined {vendorInfo.joinedDate}</span>
                  
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{vendorInfo.averageRating.toFixed(1)} Rating</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{vendorInfo.description}</p>
                
                <div className="flex gap-3">
                  <Link to={`/chat/${vendorId}`}>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Vendor
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="products">Products ({vendorProducts.length})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              {vendorProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendorProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden border h-full flex flex-col">
                      <Link to={`/product/${product.id}`} className="block aspect-square bg-secondary relative overflow-hidden">
                        <img 
                          src={product.images[0] || "/placeholder.svg"} 
                          alt={product.name}
                          className="object-cover w-full h-full hover:scale-105 transition-transform"
                        />
                      </Link>
                      <CardContent className="p-5 flex flex-col flex-grow">
                        <div className="mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {formatCategory(product.category)}
                          </Badge>
                        </div>
                        <Link to={`/product/${product.id}`} className="block">
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center mb-2">
                          {Array(5).fill(0).map((_, index) => (
                            <Star 
                              key={index} 
                              className={`h-3 w-3 ${
                                index < Math.floor(product.rating) 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          ))}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                        
                        <div className="text-xl font-semibold mt-auto mb-4">
                          ${product.price.toFixed(2)}
                        </div>
                        <Button 
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">No products found</h2>
                  <p className="text-muted-foreground mb-6">
                    This vendor doesn't have any products listed yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About {vendorInfo.name}</h2>
                  <p className="mb-4">{vendorInfo.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-1">Total Products</h3>
                      <p className="text-2xl font-semibold">{vendorInfo.totalProducts}</p>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-1">Average Rating</h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-semibold mr-2">{vendorInfo.averageRating.toFixed(1)}</span>
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-1">Joined</h3>
                      <p className="text-2xl font-semibold">{vendorInfo.joinedDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VendorProfile;
