
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogIn, Package, ShieldCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/context/StoreContext';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/assets/images/logo.png';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { cartItems } = useStore();
  const { user, profile, signOut } = useAuth();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  useEffect(() => {
    // In a real app, we would fetch unread messages from the API
    // This is mock data for demonstration
    if (user && profile?.role === 'customer') {
      setUnreadMessages(2);
    } else if (user && profile?.role === 'vendor') {
      setUnreadMessages(5);
    }
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, profile]);
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <header className={`fixed w-full top-0 left-0 z-50 bg-black ${isScrolled ? 'shadow-md shadow-yellow-900/20' : ''} transition-all duration-300 py-4`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
          >
            <img 
              src={Logo} 
              alt="ModCentral Logo" 
              className="h-10 md:h-12" 
            />
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-white">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {user && (
              <Link to="/messages" className="relative">
                <Button variant="ghost" size="icon" className="text-white">
                  <MessageSquare className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-zinc-800 border border-zinc-700">
                    <User className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 bg-zinc-900 border-zinc-800 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.name || user.email}</p>
                      <p className="text-xs leading-none text-zinc-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  
                  {profile?.role === 'admin' && (
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
                  
                  {profile?.role === 'vendor' && (
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                      asChild
                    >
                      <Link to="/vendor-dashboard" className="flex items-center">
                        <Package className="mr-2 h-4 w-4 text-yellow-400" />
                        <span>Vendor Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                    asChild
                  >
                    <Link to="/messages" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                      {unreadMessages > 0 && (
                        <Badge variant="default" className="ml-auto">
                          {unreadMessages}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  
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
