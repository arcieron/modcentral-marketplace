
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square bg-card rounded-lg border border-border"></div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Product ID: {id}</h1>
              <p className="text-foreground/70 mb-4">Product details will be loaded here.</p>
              
              <div className="text-2xl font-semibold mb-6 text-foreground">$299.99</div>
              
              <Button className="w-full mb-4 bg-primary text-foreground">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <div className="prose mt-8 text-foreground">
                <h2 className="text-foreground text-xl font-semibold mb-2">Product Description</h2>
                <p className="text-foreground/70">This is a placeholder for the product description.</p>
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
