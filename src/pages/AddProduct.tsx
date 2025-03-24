
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ImagePlus, Package, Plus } from 'lucide-react';
import { toast } from 'sonner';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would make an API call to save the product
      toast.success('Product created successfully!');
      navigate('/vendor-dashboard');
    }
  };

  const categories = [
    { value: 'performance', label: 'Performance' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'interior', label: 'Interior' },
    { value: 'wheels_tires', label: 'Wheels & Tires' },
    { value: 'suspension', label: 'Suspension' },
    { value: 'brakes', label: 'Brakes' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Link to="/vendor-dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Link>
                
                <Separator orientation="vertical" className="h-5 mx-2" />
                
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Package className="mr-2 h-6 w-6" />
                  Add New Product
                </h1>
              </div>
            </div>
            
            <Card className="border-border bg-card">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'border-destructive' : ''}
                      placeholder="e.g. Performance Exhaust System"
                    />
                    {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-destructive' : ''}`}
                      placeholder="Provide a detailed description of your product..."
                    />
                    {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className={errors.price ? 'border-destructive' : ''}
                        placeholder="e.g. 299.99"
                      />
                      {errors.price && <p className="text-destructive text-sm">{errors.price}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className={errors.stock ? 'border-destructive' : ''}
                        placeholder="e.g. 10"
                      />
                      {errors.stock && <p className="text-destructive text-sm">{errors.stock}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.category ? 'border-destructive' : ''}`}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-destructive text-sm">{errors.category}</p>}
                  </div>
                </div>
                
                <div className="border border-dashed border-border rounded-lg p-6">
                  <div className="text-center">
                    <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Product Images</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your product images here, or click to browse
                    </p>
                    
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Label htmlFor="images" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Images
                      </Button>
                    </Label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <Link to="/vendor-dashboard">
                    <Button type="button" variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Create Product</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddProduct;
