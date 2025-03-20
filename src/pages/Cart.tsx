
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3 text-foreground">
            <ShoppingCart className="h-8 w-8" />
            Your Cart
          </h1>
          
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-card rounded-full mb-6 border border-border">
              <ShoppingCart className="h-10 w-10 text-foreground/40" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Your cart is empty</h2>
            <p className="text-foreground/70 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-primary text-foreground">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
