import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState, FormEvent } from "react";
import { signIn, signUp } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

// Validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
  return password.length >= 8; // Minimum 8 characters
}

function validateSignUpForm(name: string, email: string, password: string, confirmPassword: string, signupCode: string): string | null {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  if (!isValidPassword(password)) {
    return 'Password must be at least 8 characters long';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  if (signupCode !== 'BroccoliCheddar') {
    return 'Invalid signup code';
  }
  return null;
}

export function SignInCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate email
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const signupCode = formData.get('signupCode') as string;

    // Validate all fields
    const validationError = validateSignUpForm(name, email, password, confirmPassword, signupCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="px-4 w-full"
    >
      <Card className="bg-white/50 backdrop-blur border-[#E5E8EB]">
        <CardHeader>
          <CardTitle>Join the Pool</CardTitle>
          <CardDescription>Sign in or create an account to access the 2024 NHL playoff pool</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                {error && (
                  <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isLoading}
                    className="focus:border-[#2C3E50]"
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    className="focus:border-[#2C3E50]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#2C3E50] hover:bg-[#34495E]"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                {error && (
                  <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    required
                    disabled={isLoading}
                    className="focus:border-[#2C3E50]"
                    minLength={2}
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isLoading}
                    className="focus:border-[#2C3E50]"
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password (min. 8 characters)"
                    required
                    disabled={isLoading}
                    className="focus:border-[#2C3E50]"
                    minLength={8}
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    disabled={isLoading}
                    className="focus:border-[#2C3E50]"
                    minLength={8}
                  />
                  <Input
                    name="signupCode"
                    type="text"
                    placeholder="Signup Code"
                    required
                    disabled={isLoading}
                    className="focus:border-[#2C3E50]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#2C3E50] hover:bg-[#34495E]"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <ul className="space-y-2 text-sm text-[#34495E]">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Live standings and stats
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Real-time scoring updates
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Interactive playoff bracket
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
} 