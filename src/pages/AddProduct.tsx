
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Upload, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

const AddProduct = () => {
  const navigate = useNavigate();
  const { categories, submitProduct } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '1',
    images: [] as string[],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if vendor is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.role !== 'vendor') {
        toast.error('You do not have access to this page');
        navigate('/login');
      }
    } else {
      toast.error('Please login to continue');
      navigate('/login');
    }
  }, [navigate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 1) {
      newErrors.stock = 'Stock must be at least 1';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
    
    // Clear error for category
    if (errors.category) {
      setErrors({ ...errors, category: '' });
    }
  };
  
  const handleImageUpload = () => {
    // For demo purposes, we're just adding a placeholder image
    // In a real implementation, this would handle actual file uploads
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, "/placeholder.svg"]
    }));
    
    // Clear error for images
    if (errors.images) {
      setErrors({ ...errors, images: '' });
    }
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Get current user for vendor details
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(currentUser);
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      images: formData.images,
      vendorId: user.id,
      vendorName: user.name,
      rating: 0
    };
    
    submitProduct(productData);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/vendor-dashboard');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold font-display tracking-tight">Add New Product</h1>
              <Button variant="ghost" onClick={() => navigate('/vendor-dashboard')}>
                Back to Dashboard
              </Button>
            </div>
            
            <Alert className="mb-6 bg-yellow-900/20 text-yellow-500 border-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                All new product listings will be reviewed by our admin team before being published to the marketplace.
              </AlertDescription>
            </Alert>
            
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription className="text-zinc-400">
                  Enter the details of your new product listing
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Performance Exhaust System"
                        className={`bg-zinc-800 border-zinc-700 text-white mt-1 ${errors.name ? 'border-red-500' : ''}`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your product in detail..."
                        className={`bg-zinc-800 border-zinc-700 text-white h-32 mt-1 ${errors.description ? 'border-red-500' : ''}`}
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="199.99"
                          className={`bg-zinc-800 border-zinc-700 text-white mt-1 ${errors.price ? 'border-red-500' : ''}`}
                          value={formData.price}
                          onChange={handleChange}
                        />
                        {errors.price && (
                          <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="stock">Quantity in Stock</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          min="1"
                          placeholder="10"
                          className={`bg-zinc-800 border-zinc-700 text-white mt-1 ${errors.stock ? 'border-red-500' : ''}`}
                          value={formData.stock}
                          onChange={handleChange}
                        />
                        {errors.stock && (
                          <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        onValueChange={handleCategoryChange}
                        value={formData.category}
                      >
                        <SelectTrigger className={`bg-zinc-800 border-zinc-700 text-white mt-1 ${errors.category ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          {categories.map(category => (
                            <SelectItem 
                              key={category} 
                              value={category}
                              className="hover:bg-zinc-700"
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Product Images</Label>
                      <div className="mt-1">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative aspect-square bg-zinc-800 rounded-md overflow-hidden">
                              <img 
                                src={image} 
                                alt={`Product ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 p-1 bg-zinc-900/80 rounded-full text-white"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            className={`aspect-square flex flex-col items-center justify-center space-y-2 border-2 border-dashed rounded-md transition-colors
                              ${errors.images ? 'border-red-500 text-red-500' : 'border-zinc-700 text-zinc-400'} 
                              hover:border-zinc-500 hover:text-zinc-300`}
                          >
                            <Upload className="h-6 w-6" />
                            <span className="text-xs">Upload Image</span>
                          </button>
                        </div>
                        {errors.images && (
                          <p className="text-xs text-red-500 mt-1">{errors.images}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <CardFooter className="px-0 pb-0">
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">⭘</span>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          Submit Product for Review
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddProduct;
