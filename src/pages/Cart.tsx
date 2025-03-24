
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useStore();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3 text-foreground">
            <ShoppingCart className="h-8 w-8" />
            Your Cart {totalItems > 0 && `(${totalItems} ${totalItems === 1 ? 'item' : 'items'})`}
          </h1>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-border bg-card">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-40 h-40 bg-secondary flex-shrink-0">
                          <img
                            src={item.images[0] || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <CardContent className="flex-1 p-5">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <Link to={`/product/${item.id}`} className="hover:text-primary transition-colors">
                                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                              </Link>
                              <p className="text-sm text-muted-foreground mb-2">Sold by {item.vendorName}</p>
                              <div className="text-lg font-semibold">${item.price.toFixed(2)}</div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                
                                <span className="w-10 text-center">{item.quantity}</span>
                                
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4" /> Clear Cart
                  </Button>
                  
                  <Link to="/shop">
                    <Button variant="link" className="text-primary">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div>
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      
                      {subtotal < 100 && (
                        <div className="bg-muted p-3 rounded-lg mt-4 text-xs">
                          Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button className="w-full">
                      Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
