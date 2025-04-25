
import React, { useEffect, useState } from 'react';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserUsage } from '@/hooks/useUserUsage';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const PREMIUM_AMOUNT = 100; // INR in paise, i.e. ₹499.00

const Premium: React.FC = () => {
  const { usage, loading } = useUserUsage();
  const [razorpayKey, setRazorpayKey] = useState<string | null>(null);
  const [keyLoading, setKeyLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [finalAmount, setFinalAmount] = useState(PREMIUM_AMOUNT);
  
  useEffect(() => {
    const fetchRazorpayKey = async () => {
      setKeyLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-razorpay-key');
        
        if (error) {
          console.error('Error fetching Razorpay key:', error);
          setKeyLoading(false);
          return;
        }
        
        if (data?.key) {
          console.log('Razorpay key fetched successfully');
          setRazorpayKey(data.key);
        }
      } catch (err) {
        console.error('Exception fetching Razorpay key:', err);
      } finally {
        setKeyLoading(false);
      }
    };
    
    fetchRazorpayKey();
  }, []);

  // Make sure user profile exists when accessing premium page
  useEffect(() => {
    const ensureUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user profile exists
        const { data, error } = await supabase
          .from('user_usage')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error || !data) {
          // Create user profile if it doesn't exist
          await supabase.from('user_usage').insert({
            id: session.user.id,
            processed_files_count: 0,
            is_premium: false
          });
          console.log('Created new user_usage record');
        }
      }
    };
    
    ensureUserProfile();
  }, []);

  const handleApplyPromo = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-promo-code', {
        body: { code: promoCode }
      });

      if (error) {
        toast.error("Failed to apply promo code");
        return;
      }

      if (data.valid) {
        const discountedAmount = Math.floor(PREMIUM_AMOUNT * (1 - data.discount));
        setFinalAmount(discountedAmount);
        toast.success(`Promo code applied! ${data.discount * 100}% discount`);
      } else {
        toast.error("Invalid promo code");
      }
    } catch (err) {
      console.error('Error applying promo code:', err);
      toast.error("Failed to apply promo code");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    if (!razorpayKey) {
      toast.error("Razorpay API key not available. Please try again later.");
      return;
    }
    
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    // Get current user session to ensure payment is linked to user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("Please log in to complete the payment");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: finalAmount,
      currency: "INR",
      name: "Power BI Assistant",
      description: "Upgrade to Premium",
      image: "/favicon.ico",
      handler: async function (response: any) {
        console.log("Payment success:", response);
        
        // Update user to premium after successful payment
        try {
          const { error } = await supabase
            .from('user_usage')
            .update({ is_premium: true })
            .eq('id', session.user.id);
          
          if (error) {
            console.error("Failed to update premium status:", error);
            toast.error("Payment successful but failed to activate premium. Please contact support.");
            return;
          }
          
          toast.success("Payment successful! Thank you for upgrading to Premium.");
          setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
          console.error("Error updating premium status:", err);
          toast.error("Payment successful but failed to activate premium. Please contact support.");
        }
      },
      prefill: {
        email: session.user.email
      },
      theme: { color: "#6366F1" },
      modal: {
        ondismiss: () => {
          toast.info("Payment cancelled. You have not been charged.");
        }
      }
    };

    try {
      console.log("Initializing Razorpay...");
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <NavigationBar />
        <main className="flex-grow flex items-center justify-center px-4 py-24">
          <Skeleton className="w-full max-w-md h-[400px]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (usage?.is_premium) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <NavigationBar />
        <main className="flex-grow flex items-center justify-center px-4 py-24">
          <Card className="w-full max-w-md border border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Premium Member
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Thank you for being a premium member! You have unlimited access to all features.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <NavigationBar />
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-4xl border border-border/50 shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - Image */}
            <div className="hidden md:block bg-primary/5 relative overflow-hidden">
              <img
                src="https://gsuoseezgicejjayrtce.supabase.co/storage/v1/object/sign/pbi-assistant-images/Sharable%20Snippets.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzkxNzNhMjBmLTAzN2QtNDJiYS1iNWJhLTcwMjYwNWEzY2JiMCJ9.eyJ1cmwiOiJwYmktYXNzaXN0YW50LWltYWdlcy9TaGFyYWJsZSBTbmlwcGV0cy5wbmciLCJpYXQiOjE3NDU2MTI1NzYsImV4cCI6MTkwMzI5MjU3Nn0.JtHUqNJs6svUjK1CotbsoxMxp9x4swndSue2wL9UFAY"
                alt="Premium illustration"
                className="object-contain h-full w-full p-4"
              />
            </div>
            
            {/* Right side - Premium content */}
            <div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Upgrade to Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    You've used {usage?.processed_files_count || 0} of 5 free uploads.<br />
                    Unlock unlimited VPAX file processing for just ₹499
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li>✅ Unlimited VPAX file uploads</li>
                    <li>✅ Advanced analysis features</li>
                    <li>✅ Priority support</li>
                  </ul>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyPromo}
                        disabled={!promoCode}
                      >
                        Apply
                      </Button>
                    </div>
                    <Button 
                      onClick={handleUpgrade} 
                      className="w-full"
                      size="lg"
                      disabled={keyLoading}
                    >
                      {keyLoading ? "Loading..." : `Upgrade Now - ₹${(finalAmount / 100).toFixed(2)}`}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
