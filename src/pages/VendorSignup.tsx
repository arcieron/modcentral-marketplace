
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const VendorSignup = () => {
  const [formStep, setFormStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storeUrl: '',
    phoneNumber: '',
    description: '',
    category: '',
    terms: false,
  });

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate step 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 2
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.storeName) newErrors.storeName = 'Store name is required';
    if (!formData.storeUrl) {
      newErrors.storeUrl = 'Store URL is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.storeUrl)) {
      newErrors.storeUrl = 'URL can only contain lowercase letters, numbers, and hyphens';
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (formStep === 0 && validateStep1()) {
      setFormStep(1);
    } else if (formStep === 1 && validateStep2()) {
      setFormStep(2);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms) {
      setErrors({
        ...errors,
        terms: 'You must agree to the terms and conditions',
      });
      return;
    }
    
    // Submit form data
    console.log('Form submitted:', formData);
    // This would typically send data to an API
    
    // Move to success step
    setFormStep(3);
  };

  // Benefits and features
  const benefits = [
    {
      title: 'Reach Millions of Car Enthusiasts',
      description: 'Connect with a targeted audience of automotive enthusiasts looking for quality modification parts.',
      icon: CheckCircle,
    },
    {
      title: 'Easy Store Management',
      description: 'Our intuitive dashboard makes it simple to list products, manage inventory, and process orders.',
      icon: CheckCircle,
    },
    {
      title: 'Secure Payments',
      description: 'Receive payments securely with multiple options including credit cards, PayPal, and more.',
      icon: CheckCircle,
    },
    {
      title: 'Growth Tools',
      description: 'Access analytics, marketing tools, and insights to help grow your business on our platform.',
      icon: CheckCircle,
    },
  ];

  // Seller plan options
  const sellerPlans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        'List up to 10 products',
        'Standard commission rate (15%)',
        'Basic analytics',
        'Standard support',
        'Manual payouts (weekly)',
      ],
      recommended: false,
      buttonText: 'Start Free',
    },
    {
      name: 'Professional',
      price: '$29.99/month',
      features: [
        'Unlimited product listings',
        'Reduced commission rate (10%)',
        'Advanced analytics',
        'Priority support',
        'Automated payouts (daily)',
        'Featured store placement',
      ],
      recommended: true,
      buttonText: 'Start Pro',
    },
    {
      name: 'Enterprise',
      price: '$99.99/month',
      features: [
        'Unlimited product listings',
        'Lowest commission rate (7%)',
        'Comprehensive analytics',
        'Dedicated account manager',
        'Instant payouts',
        'Premium store placement',
        'API access',
        'Custom integration options',
      ],
      recommended: false,
      buttonText: 'Contact Sales',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Become a ModCentral Vendor</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join our marketplace and start selling your car modification products to enthusiasts around the world.
              </p>
            </div>
            
            {formStep < 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar with benefits */}
                <div className="md:col-span-4 order-2 md:order-1">
                  <div className="sticky top-32">
                    <h2 className="text-xl font-semibold mb-6">Vendor Benefits</h2>
                    <div className="space-y-4">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-3">
                          <benefit.icon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-medium">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-blue hover:underline">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signup form */}
                <div className="md:col-span-8 order-1 md:order-2">
                  <Card className="animate-slide-up">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle>Vendor Signup</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          Step {formStep + 1} of 3
                        </div>
                      </div>
                      <CardDescription>
                        {formStep === 0 && 'Create your account credentials'}
                        {formStep === 1 && 'Tell us about your store'}
                        {formStep === 2 && 'Choose your seller plan'}
                      </CardDescription>
                      
                      {/* Progress bar */}
                      <div className="w-full h-1 bg-secondary mt-6 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-blue transition-all duration-300 ease-in-out"
                          style={{ width: `${((formStep + 1) / 3) * 100}%` }}
                        ></div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {formStep === 0 && (
                        <form className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                className={errors.firstName ? 'border-destructive' : ''}
                              />
                              {errors.firstName && (
                                <p className="text-xs text-destructive">{errors.firstName}</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                className={errors.lastName ? 'border-destructive' : ''}
                              />
                              {errors.lastName && (
                                <p className="text-xs text-destructive">{errors.lastName}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="john.doe@example.com"
                              className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && (
                              <p className="text-xs text-destructive">{errors.email}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="••••••••"
                              className={errors.password ? 'border-destructive' : ''}
                            />
                            {errors.password && (
                              <p className="text-xs text-destructive">{errors.password}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Password must be at least 8 characters long
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="••••••••"
                              className={errors.confirmPassword ? 'border-destructive' : ''}
                            />
                            {errors.confirmPassword && (
                              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                            )}
                          </div>
                        </form>
                      )}
                      
                      {formStep === 1 && (
                        <form className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                              id="storeName"
                              name="storeName"
                              value={formData.storeName}
                              onChange={handleChange}
                              placeholder="Your Store Name"
                              className={errors.storeName ? 'border-destructive' : ''}
                            />
                            {errors.storeName && (
                              <p className="text-xs text-destructive">{errors.storeName}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="storeUrl">Store URL</Label>
                            <div className="flex items-center">
                              <span className="bg-muted px-3 py-2 text-sm text-muted-foreground rounded-l-md border border-r-0 border-input">
                                modcentral.com/vendor/
                              </span>
                              <Input
                                id="storeUrl"
                                name="storeUrl"
                                value={formData.storeUrl}
                                onChange={handleChange}
                                placeholder="your-store"
                                className={cn(
                                  "rounded-l-none",
                                  errors.storeUrl ? 'border-destructive' : ''
                                )}
                              />
                            </div>
                            {errors.storeUrl && (
                              <p className="text-xs text-destructive">{errors.storeUrl}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Only use lowercase letters, numbers, and hyphens
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                              id="phoneNumber"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              placeholder="+1 (123) 456-7890"
                              className={errors.phoneNumber ? 'border-destructive' : ''}
                            />
                            {errors.phoneNumber && (
                              <p className="text-xs text-destructive">{errors.phoneNumber}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="description">Store Description</Label>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={(e) => setFormData({...formData, description: e.target.value})}
                              placeholder="Tell us about your store, products, and what makes you unique..."
                              className={cn(
                                "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                errors.description ? 'border-destructive' : ''
                              )}
                            />
                            {errors.description && (
                              <p className="text-xs text-destructive">{errors.description}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="category">Primary Product Category</Label>
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className={cn(
                                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                errors.category ? 'border-destructive' : ''
                              )}
                            >
                              <option value="">Select a category</option>
                              <option value="performance">Performance</option>
                              <option value="exterior">Exterior</option>
                              <option value="interior">Interior</option>
                              <option value="wheels_tires">Wheels & Tires</option>
                              <option value="suspension">Suspension</option>
                              <option value="brakes">Brakes</option>
                              <option value="electronics">Electronics</option>
                              <option value="lighting">Lighting</option>
                              <option value="other">Other</option>
                            </select>
                            {errors.category && (
                              <p className="text-xs text-destructive">{errors.category}</p>
                            )}
                          </div>
                        </form>
                      )}
                      
                      {formStep === 2 && (
                        <>
                          <div className="space-y-6">
                            <Tabs defaultValue="professional" className="w-full">
                              <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger value="basic">Basic</TabsTrigger>
                                <TabsTrigger value="professional">Professional</TabsTrigger>
                                <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                              </TabsList>
                              
                              {sellerPlans.map((plan, index) => (
                                <TabsContent key={index} value={plan.name.toLowerCase()}>
                                  <Card className={cn(
                                    "border-2",
                                    plan.recommended ? "border-brand-blue" : "border-transparent"
                                  )}>
                                    <CardHeader>
                                      {plan.recommended && (
                                        <div className="text-xs font-semibold text-brand-blue mb-2">
                                          RECOMMENDED
                                        </div>
                                      )}
                                      <CardTitle>{plan.name}</CardTitle>
                                      <div className="mt-2">
                                        <span className="text-3xl font-bold">{plan.price}</span>
                                        {plan.price !== 'Free' && (
                                          <span className="text-muted-foreground ml-1 text-sm">
                                            + transaction fees
                                          </span>
                                        )}
                                      </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <ul className="space-y-2">
                                        {plan.features.map((feature, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </CardContent>
                                    <CardFooter>
                                      <Button 
                                        variant={plan.recommended ? "default" : "outline"}
                                        className="w-full"
                                      >
                                        {plan.buttonText}
                                      </Button>
                                    </CardFooter>
                                  </Card>
                                </TabsContent>
                              ))}
                            </Tabs>
                            
                            <div className="space-y-4">
                              <Separator />
                              
                              <div className="flex items-top gap-2">
                                <Checkbox 
                                  id="terms" 
                                  name="terms"
                                  checked={formData.terms}
                                  onCheckedChange={(checked) => 
                                    setFormData({...formData, terms: checked === true})
                                  }
                                  className={errors.terms ? 'border-destructive' : ''}
                                />
                                <div className="space-y-1">
                                  <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    I agree to the Terms of Service and Seller Agreement
                                  </label>
                                  {errors.terms && (
                                    <p className="text-xs text-destructive">{errors.terms}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    By signing up, you agree to our{' '}
                                    <Link to="/terms" className="text-brand-blue hover:underline">
                                      Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-brand-blue hover:underline">
                                      Privacy Policy
                                    </Link>
                                    .
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
                      {formStep > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setFormStep(formStep - 1)}
                          className="w-full sm:w-auto"
                        >
                          Back
                        </Button>
                      )}
                      
                      {formStep < 2 ? (
                        <Button 
                          onClick={handleNextStep}
                          className="w-full sm:w-auto"
                        >
                          Continue
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleSubmit}
                          className="w-full sm:w-auto"
                        >
                          Complete Signup
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto">
                <Card className="animate-slide-up">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Application Submitted!</CardTitle>
                    <CardDescription>
                      Your vendor application has been received and is being reviewed.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      We typically review applications within 1-2 business days. You'll receive an email notification once your account is approved.
                    </p>
                    
                    <div className="bg-muted p-4 rounded-lg flex gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">What happens next?</p>
                        <p className="text-muted-foreground mt-1">
                          While you wait for approval, you can prepare product images and descriptions for your store. This will help you get up and running quickly once approved.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-4">
                    <Link to="/" className="w-full">
                      <Button className="w-full">
                        Return to Homepage
                      </Button>
                    </Link>
                    
                    <div className="text-sm text-center text-muted-foreground">
                      Have questions? <Link to="/contact" className="text-brand-blue hover:underline">Contact our support team</Link>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VendorSignup;
