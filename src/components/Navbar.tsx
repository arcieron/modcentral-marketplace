
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogIn, Package, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/context/StoreContext';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const Navbar = () => {
  const { cartItems } = useStore();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };
  
  return (
    <header className={`fixed w-full top-0 left-0 z-50 bg-black ${isScrolled ? 'shadow-md shadow-blue-900/20' : ''} transition-all duration-300 py-4`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center text-2xl font-bold tracking-tighter font-display"
          >
            <span className="text-blue-600">Mod</span>
            <span className="text-white">Central</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-base font-medium text-white hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-base font-medium text-white hover:text-blue-600 transition-colors">
              Shop
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-white">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-zinc-800 border border-zinc-700">
                    <User className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 bg-zinc-900 border-zinc-800 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                      <p className="text-xs leading-none text-zinc-400">{currentUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                      asChild
                    >
                      <Link to="/admin-dashboard" className="flex items-center">
                        <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {currentUser.role === 'vendor' && (
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                      asChild
                    >
                      <Link to="/vendor-dashboard" className="flex items-center">
                        <Package className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Vendor Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                    asChild
                  >
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 hover:bg-red-900/20 focus:bg-red-900/20"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm" className="ml-4">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
