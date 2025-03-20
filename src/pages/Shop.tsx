
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Shop = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Shop All Products</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product placeholders */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="border border-border rounded-lg p-4 bg-card">
                <div className="aspect-square bg-secondary rounded-md mb-4"></div>
                <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
