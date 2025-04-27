import Logo from '@/assets/images/logo.png';  
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src={Logo} 
                alt="ModCentral Logo" 
                className="h-10 md:h-12" 
              />
            </Link>
            <p className="text-foreground/70 mb-4">
              The premier marketplace for automotive enthusiasts to find the perfect modifications for their vehicles.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-foreground/70 hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-foreground/70 hover:text-foreground transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Sell</h3>
            <ul className="space-y-2">
              <li><Link to="/vendor-signup" className="text-foreground/70 hover:text-foreground transition-colors">Become a Vendor</Link></li>
              <li><Link to="/vendor-dashboard" className="text-foreground/70 hover:text-foreground transition-colors">Vendor Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-foreground/70 hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link to="/cart" className="text-foreground/70 hover:text-foreground transition-colors">Your Cart</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="text-sm text-foreground/50 text-center">
            © {new Date().getFullYear()} ModCentral. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
