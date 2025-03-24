
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Star, Truck, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, addToCart } = useStore();
  
  const product = getProduct(id || '');
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Product not found</h2>
              <p className="text-foreground/70 mb-8">
                The product you're looking for doesn't exist or has been removed.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <Card className="overflow-hidden border-border bg-card">
              <div className="aspect-square relative bg-secondary">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </Card>
            
            {/* Product Info */}
            <div>
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">
                  {formatCategory(product.category)}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {Array(5).fill(0).map((_, index) => (
                    <Star 
                      key={index} 
                      className={`h-4 w-4 ${
                        index < Math.floor(product.rating) 
                          ? 'text-primary fill-primary' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({Math.floor(product.rating * 10)} reviews)
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                Sold by <Link to={`/shop?vendor=${product.vendorId}`} className="text-primary hover:underline">{product.vendorName}</Link>
              </div>
              
              <div className="text-2xl font-semibold mb-6 text-foreground">${product.price.toFixed(2)}</div>
              
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm">
                    {product.stock > 0 
                      ? `In Stock (${product.stock} available)` 
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full mb-4 bg-primary text-foreground"
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <div className="space-y-4 border-t border-border pt-6 mt-6">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-sm">Free Shipping</h3>
                    <p className="text-sm text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-sm">30-Day Returns</h3>
                    <p className="text-sm text-muted-foreground">Satisfaction guaranteed</p>
                  </div>
                </div>
              </div>
              
              <div className="prose mt-8 text-foreground">
                <h2 className="text-foreground text-xl font-semibold mb-4">Product Description</h2>
                <p className="text-foreground/70">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
