
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useStore();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.profile?.name || '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to complete your purchase');
      navigate('/login');
      return;
    }
    
    if (!shippingAddress.fullName || !shippingAddress.streetAddress || 
        !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.zipCode) {
      toast.error('Please fill in all required shipping information');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would create a checkout session with Stripe
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: cartItems,
          shipping_address: shippingAddress,
          customer_email: user.email
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        // For demo purposes, simulate a successful order
        setTimeout(() => {
          toast.success('Order placed successfully!');
          clearCart();
          navigate('/order-confirmation');
          setIsProcessing(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was a problem processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 md:px-6 py-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Your cart is empty</h1>
            <p className="mb-6">Add some items to your cart before checking out.</p>
            <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={shippingAddress.fullName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input 
                        id="streetAddress" 
                        name="streetAddress" 
                        value={shippingAddress.streetAddress} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={shippingAddress.city} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input 
                          id="state" 
                          name="state" 
                          value={shippingAddress.state} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode" 
                          value={shippingAddress.zipCode} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country" 
                          name="country" 
                          value={shippingAddress.country} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-3 border p-4 rounded-md">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Credit / Debit Card
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 border p-4 rounded-md">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="mt-6 flex items-center text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    All payments are secure and encrypted
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between py-2">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Complete Order'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
