import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

type AuthFormData = {
  email: string;
  password: string;
};

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const form = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleAuth = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        });

        if (error) throw error;
        
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password
        });

        if (error) throw error;
        
        toast.success('Account created successfully. Please check your email to confirm.');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <NavigationBar />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Card className="border border-border/50 shadow-lg backdrop-blur-sm bg-card/90">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Create an account to start analyzing your Power BI models'}
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Invalid email address'
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="bg-background/50 backdrop-blur-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            className="bg-background/50 backdrop-blur-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      type="button" 
                      variant="link" 
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {isLogin 
                        ? 'Don\'t have an account? Sign Up' 
                        : 'Already have an account? Sign In'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
