
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, User, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState<'customer' | 'vendor'>(
    (location.state?.userType as 'customer' | 'vendor') || 'customer'
  );
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set the tab based on the state passed from the login page
    if (location.state?.userType) {
      setUserType(location.state.userType);
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate account creation
    setTimeout(() => {
      const message = userType === 'vendor' 
        ? 'Your vendor application has been submitted for review' 
        : 'Your account has been created successfully';
      
      toast.success(message);
      
      if (userType === 'vendor') {
        navigate('/vendor-signup-success');
      } else {
        navigate('/login');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-md mx-auto">
            <Button 
              variant="ghost" 
              className="mb-4 text-zinc-400 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Card className="animate-slide-up bg-zinc-900 border-zinc-800 text-white">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center font-display">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-center text-zinc-400">
                  Enter your details to create your account
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs 
                  defaultValue={userType} 
                  value={userType}
                  onValueChange={(value) => setUserType(value as 'customer' | 'vendor')}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
                    <TabsTrigger value="customer" className="data-[state=active]:bg-blue-600">
                      <User className="h-4 w-4 mr-2" />
                      Customer
                    </TabsTrigger>
                    <TabsTrigger value="vendor" className="data-[state=active]:bg-blue-600">
                      <Users className="h-4 w-4 mr-2" />
                      Vendor
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="customer">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          className={`bg-zinc-800 border-zinc-700 text-white ${errors.name ? 'border-red-500' : ''}`}
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          className={`bg-zinc-800 border-zinc-700 text-white ${errors.email ? 'border-red-500' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`bg-zinc-800 border-zinc-700 text-white ${errors.password ? 'border-red-500' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-xs text-red-500">{errors.password}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`bg-zinc-800 border-zinc-700 text-white ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              agreeTerms: checked === true
                            }));
                            if (errors.agreeTerms) {
                              setErrors({ ...errors, agreeTerms: '' });
                            }
                          }}
                          className={errors.agreeTerms ? 'border-red-500' : ''}
                        />
                        <Label 
                          htmlFor="agreeTerms" 
                          className="text-sm leading-tight text-zinc-400"
                        >
                          I agree to the{' '}
                          <Link to="/terms" className="text-blue-500 hover:underline">
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link to="/privacy" className="text-blue-500 hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      {errors.agreeTerms && (
                        <p className="text-xs text-red-500">{errors.agreeTerms}</p>
                      )}
                      
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="vendor">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your Business Name"
                          className={`bg-zinc-800 border-zinc-700 text-white ${errors.name ? 'border-red-500' : ''}`}
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Business Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="contact@yourbusiness.com"
                          className={`bg-zinc-800 border-zinc-700 text-white ${errors.email ? 'border-red-500' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`bg-zinc-800 border-zinc-700 text-white ${errors.password ? 'border-red-500' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-xs text-red-500">{errors.password}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`bg-zinc-800 border-zinc-700 text-white ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              agreeTerms: checked === true
                            }));
                            if (errors.agreeTerms) {
                              setErrors({ ...errors, agreeTerms: '' });
                            }
                          }}
                          className={errors.agreeTerms ? 'border-red-500' : ''}
                        />
                        <Label 
                          htmlFor="agreeTerms" 
                          className="text-sm leading-tight text-zinc-400"
                        >
                          I agree to the{' '}
                          <Link to="/terms" className="text-blue-500 hover:underline">
                            Terms of Service
                          </Link>
                          {', '}
                          <Link to="/privacy" className="text-blue-500 hover:underline">
                            Privacy Policy
                          </Link>
                          {' '}and{' '}
                          <Link to="/vendor-agreement" className="text-blue-500 hover:underline">
                            Vendor Agreement
                          </Link>
                        </Label>
                      </div>
                      {errors.agreeTerms && (
                        <p className="text-xs text-red-500">{errors.agreeTerms}</p>
                      )}
                      
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Submitting Application..." : "Apply to Become a Vendor"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-zinc-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
