
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, User, Users, ShieldCheck } from 'lucide-react';
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
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { getUserByEmail } = useStore();
  const [userType, setUserType] = useState<'customer' | 'vendor' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      const user = getUserByEmail(email);
      
      if (user) {
        if (user.role !== userType) {
          toast.error(`This email is registered as a ${user.role}, not a ${userType}`);
          setIsLoading(false);
          return;
        }
        
        // Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on user role
        if (user.role === 'vendor') {
          navigate('/vendor-dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
        
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        toast.error('Invalid email or password');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateAccount = () => {
    navigate('/signup', { state: { userType } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-md mx-auto">
            <Card className="animate-slide-up bg-zinc-900 border-zinc-800 text-white">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center font-display">
                  Sign in to ModCentral
                </CardTitle>
                <CardDescription className="text-center text-zinc-400">
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="customer" className="w-full" onValueChange={(value) => setUserType(value as 'customer' | 'vendor' | 'admin')}>
                  <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
                    <TabsTrigger value="customer" className="data-[state=active]:bg-blue-600">
                      <User className="h-4 w-4 mr-2" />
                      Customer
                    </TabsTrigger>
                    <TabsTrigger value="vendor" className="data-[state=active]:bg-blue-600">
                      <Users className="h-4 w-4 mr-2" />
                      Vendor
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="data-[state=active]:bg-blue-600">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Admin
                    </TabsTrigger>
                  </TabsList>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className={`pl-10 bg-zinc-800 border-zinc-700 text-white ${errors.email ? 'border-red-500' : ''}`}
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
                        <p className="text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-10 bg-zinc-800 border-zinc-700 text-white ${errors.password ? 'border-red-500' : ''}`}
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
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-me" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label htmlFor="remember-me" className="text-sm leading-none text-zinc-400">
                        Remember me for 30 days
                      </Label>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-zinc-400">
                  {userType === 'customer' ? (
                    <>
                      Don't have an account?{' '}
                      <button onClick={handleCreateAccount} className="text-blue-500 hover:underline">
                        Create a customer account
                      </button>
                    </>
                  ) : userType === 'vendor' ? (
                    <>
                      Not a vendor yet?{' '}
                      <button onClick={handleCreateAccount} className="text-blue-500 hover:underline">
                        Apply to become a vendor
                      </button>
                    </>
                  ) : (
                    <>
                      Admin accounts can only be created by system administrators.
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
