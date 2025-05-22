
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Coffee, Brain, CreditCard, Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { createUser, loginUser } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

// Fun quotes for the login page
const funnyQuotes = [
  "Money talks, but all mine ever says is 'Goodbye!'",
  "My wallet is like an onion, opening it makes me cry.",
  "I'm not saying I'm broke, but my wallet just started coughing up dust.",
  "Saving money is like holding your breath. Eventually, you'll give in and buy something.",
  "My financial plan: 1. Win lottery 2. There is no step 2."
];

const getRandomQuote = () => {
  return funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
};

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function LoginForm() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [randomQuote] = useState(getRandomQuote());
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setHasCompletedOnboarding } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const result = await loginUser(values.email, values.password);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back to Trakr! Let's manage those finances.",
        });
        navigate('/');
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Our money-tracking skills are better than our password-remembering ones!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const result = await createUser(values.email, values.password, values.name);
      
      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Welcome to Trakr! Your journey to financial enlightenment begins now.",
        });
        setHasCompletedOnboarding(false);
        navigate('/onboarding');
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "This email may already be registered. Try a different one or login instead.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const features = [
    { icon: <CreditCard className="h-5 w-5 text-green-500" />, text: "Track your expenses" },
    { icon: <Brain className="h-5 w-5 text-purple-500" />, text: "Smart financial insights" },
    { icon: <Heart className="h-5 w-5 text-pink-500" />, text: "Mindful spending" },
    { icon: <Coffee className="h-5 w-5 text-amber-500" />, text: "Track coffee addiction" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full">
      {/* Left side - Features */}
      <div className="md:w-1/2 p-6 bg-gradient-to-br from-primary/90 to-primary/60 rounded-lg text-white hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Why Trakr?</h2>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">{feature.icon}</div>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <p className="italic text-sm">{randomQuote}</p>
        </div>
      </div>
      
      {/* Right side - Login/Register Form */}
      <Card className="md:w-1/2 w-full">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="register">
            <CardHeader>
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Enter your information to create a Trakr account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            Trakr - Your personal finance companion that's actually fun!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
