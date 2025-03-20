
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
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

const Login = () => {
  const [userType, setUserType] = useState<'customer' | 'vendor'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login submitted:', { userType, email, password, rememberMe });
      
      // In a real app, you would authenticate with a backend here
      
      // For demo purposes, redirect to home page or vendor dashboard
      if (userType === 'vendor') {
        window.location.href = '/vendor-dashboard';
      } else {
        window.location.href = '/';
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-md mx-auto">
            <Card className="animate-slide-up">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  Sign in to ModCentral
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="customer" className="w-full" onValueChange={(value) => setUserType(value as 'customer' | 'vendor')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customer">Customer</TabsTrigger>
                    <TabsTrigger value="vendor">Vendor</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="customer">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) {
                                setErrors({ ...errors, email: '' });
                              }
                            }}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errors.password) {
                                setErrors({ ...errors, password: '' });
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                          <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember-me" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                        />
                        <Label htmlFor="remember-me" className="text-sm leading-none">
                          Remember me for 30 days
                        </Label>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="vendor">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendor-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="vendor-email"
                            type="email"
                            placeholder="name@example.com"
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) {
                                setErrors({ ...errors, email: '' });
                              }
                            }}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vendor-password">Password</Label>
                          <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="vendor-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errors.password) {
                                setErrors({ ...errors, password: '' });
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                          <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="vendor-remember-me" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                        />
                        <Label htmlFor="vendor-remember-me" className="text-sm leading-none">
                          Remember me for 30 days
                        </Label>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In to Vendor Dashboard"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                  {userType === 'customer' ? (
                    <>
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-brand-blue hover:underline">
                        Create an account
                      </Link>
                    </>
                  ) : (
                    <>
                      Not a vendor yet?{' '}
                      <Link to="/vendor-signup" className="text-brand-blue hover:underline">
                        Apply to become a vendor
                      </Link>
                    </>
                  )}
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

export default Login;
