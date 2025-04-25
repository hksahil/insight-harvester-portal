
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, Loader2 } from 'lucide-react';

const PremiumPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        // If not logged in, redirect to auth page
        navigate('/auth?redirectTo=/premium');
      }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/auth?redirectTo=/premium');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePayment = async () => {
    if (!user) {
      navigate('/auth?redirectTo=/premium');
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Set up Razorpay payment flow
      // In a real implementation, we would fetch the key from backend and redirect to Razorpay
      
      // Create a dummy payment session (will be replaced with actual Razorpay integration)
      const paymentUrl = `https://checkout.razorpay.com/v1/checkout.js?key=${encodeURIComponent('rzp_test_dummy_key')}&amount=7900&currency=INR&name=PowerBI+Assistant+Premium`;

      // Redirect to payment page
      window.location.href = paymentUrl;
      
      // Note: The actual user premium status update should happen after successful payment callback
      // not here - we're simply redirecting to payment now
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
      setProcessingPayment(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Upgrade to Premium</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get unlimited access to all features and support the development of more tools.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Unlimited Campaigns</h3>
                  <p className="text-muted-foreground">Run as many campaigns as you need with no restrictions</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Unlimited Influencers</h3>
                  <p className="text-muted-foreground">Add unlimited influencers to your campaigns</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Fraud Prevention</h3>
                  <p className="text-muted-foreground">Advanced fraud detection and prevention systems</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-muted-foreground ml-2">/per month</span>
              </div>
            </div>
            
            <Button 
              onClick={handlePayment} 
              disabled={processingPayment} 
              className="w-full md:w-auto px-8 py-6 text-lg"
            >
              {processingPayment ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Complete Payment'
              )}
            </Button>
          </div>
          
          <div className="md:order-2">
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <img 
                src="https://gsuoseezgicejjayrtce.supabase.co/storage/v1/object/sign/pbi-assistant-images/Sharable%20Snippets.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzkxNzNhMjBmLTAzN2QtNDJiYS1iNWJhLTcwMjYwNWEzY2JiMCJ9.eyJ1cmwiOiJwYmktYXNzaXN0YW50LWltYWdlcy9TaGFyYWJsZSBTbmlwcGV0cy5wbmciLCJpYXQiOjE3NDU2MTI1NzYsImV4cCI6MTkwMzI5MjU3Nn0.JtHUqNJs6svUjK1CotbsoxMxp9x4swndSue2wL9UFAY" 
                alt="Premium Features" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PremiumPage;
