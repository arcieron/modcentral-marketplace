
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
  // Generate a random order number
  const orderNumber = `ORDER-${Math.floor(Math.random() * 100000)}`;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12 text-center max-w-3xl">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full dark:bg-green-900/20">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmed!</h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <div className="bg-muted/50 rounded-lg p-6 mb-8 inline-block mx-auto">
            <p className="text-lg font-medium mb-2">Order Number:</p>
            <p className="text-2xl font-bold tracking-wide">{orderNumber}</p>
          </div>
          
          <p className="text-muted-foreground mb-12">
            We'll send a confirmation email with your order details and tracking information once your order ships.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
