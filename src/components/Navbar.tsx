
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center text-2xl font-bold tracking-tighter"
          >
            <span className="text-blue-600">Mod</span>
            <span>Central</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-base font-medium hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-base font-medium hover:text-blue-600 transition-colors">
              Shop
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/vendor-signup">
              <Button variant="outline" size="sm" className="ml-4">
                Sell on ModCentral
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
