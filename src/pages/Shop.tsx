
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/context/StoreContext';
import { Filter, Search, ShoppingCart } from 'lucide-react';

const Shop = () => {
  const { products, categories, searchProducts, addToCart } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredProducts = searchProducts(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory);
  
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-4xl font-bold text-foreground">Shop All Products</h1>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Filters */}
            <Card className="h-fit sticky top-24 bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Filter className="h-5 w-5 mr-2" />
                  <h2 className="text-xl font-semibold">Filters</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="all"
                          name="category"
                          value="all"
                          checked={selectedCategory === 'all'}
                          onChange={() => setSelectedCategory('all')}
                          className="mr-2"
                        />
                        <label htmlFor="all" className="text-sm cursor-pointer">All Products</label>
                      </div>
                      
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            type="radio"
                            id={category}
                            name="category"
                            value={category}
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="mr-2"
                          />
                          <label htmlFor={category} className="text-sm cursor-pointer">
                            {formatCategory(category)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Products Grid */}
            <div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden border border-border h-full flex flex-col bg-card">
                      <Link to={`/product/${product.id}`} className="block aspect-square bg-secondary relative overflow-hidden">
                        <img 
                          src={product.images[0] || "/placeholder.svg"} 
                          alt={product.name}
                          className="object-cover w-full h-full hover:scale-105 transition-transform"
                        />
                      </Link>
                      <CardContent className="p-5 flex flex-col flex-grow">
                        <div className="mb-2">
                          <span className="text-xs text-muted-foreground">
                            {formatCategory(product.category)}
                          </span>
                        </div>
                        <Link to={`/product/${product.id}`} className="block">
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="text-muted-foreground text-sm mb-2">
                          {product.vendorName}
                        </div>
                        <div className="text-xl font-semibold mt-auto mb-4">
                          ${product.price.toFixed(2)}
                        </div>
                        <Button 
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-border rounded-lg">
                  <h2 className="text-xl font-semibold mb-2 text-foreground">No products found</h2>
                  <p className="text-foreground/70 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
