
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold tracking-tighter">
                <span className="text-blue-600">Mod</span>
                <span>Central</span>
              </h2>
            </Link>
            <p className="text-gray-600 mb-4">
              The premier marketplace for automotive enthusiasts to find the perfect modifications for their vehicles.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-600 hover:text-gray-900 transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-gray-900 transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Sell</h3>
            <ul className="space-y-2">
              <li><Link to="/vendor-signup" className="text-gray-600 hover:text-gray-900 transition-colors">Become a Vendor</Link></li>
              <li><Link to="/vendor-dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">Vendor Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link></li>
              <li><Link to="/cart" className="text-gray-600 hover:text-gray-900 transition-colors">Your Cart</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} ModCentral. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
