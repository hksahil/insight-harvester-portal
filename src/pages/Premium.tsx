import React, { useEffect, useState } from 'react';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserUsage } from '@/hooks/useUserUsage';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PREMIUM_AMOUNT = 100; // INR in paise, i.e. ₹499.00

const Premium = () => {
  const navigate = useNavigate();
  const { usage, loading, refetchUsage } = useUserUsage();
  const [razorpayKey, setRazorpayKey] = useState<string | null>(null);
  const [keyLoading, setKeyLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(PREMIUM_AMOUNT);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRazorpayKey = async () => {
    setKeyLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-razorpay-key');
      if (error) {
        console.error('Error fetching Razorpay key:', error);
        return;
      }
      if (data?.key) {
        setRazorpayKey(data.key);
      }
    } catch (err) {
      console.error('Exception fetching Razorpay key:', err);
    } finally {
      setKeyLoading(false);
    }
  };

  const handleApplyPromo = async (code: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-promo-code', {
        body: { code }
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

  const updatePremiumStatus = async (paymentId: string) => {
    try {
      setProcessingPayment(true);
      const { data, error } = await supabase.functions.invoke('update-premium-status', {
        body: { payment_id: paymentId }
      });

      if (error) {
        toast.error("Failed to activate premium status. Please contact support.");
        console.error("Error updating premium status:", error);
        return false;
      }

      await refetchUsage();
      return true;
    } catch (err) {
      console.error("Error in premium status update:", err);
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleFreePlan = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const handlePaidPlan = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    await handleUpgrade();
  };

  const handleCustomPlan = () => {
    window.location.href = 'mailto:officialhksahil@gmail.com';
  };

  const handleUpgrade = async () => {
    if (!razorpayKey) {
      toast.error("Payment system not available. Please try again later.");
      return;
    }
    
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment system. Please try again.");
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
        const paymentId = response.razorpay_payment_id;
        
        toast.loading("Activating premium status...");
        const success = await updatePremiumStatus(paymentId);
        
        if (success) {
          toast.success("Payment successful! Your account has been upgraded to Premium.");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error("Payment was received but we couldn't activate your premium status. Please contact support.");
        }
      },
      prefill: {},
      theme: { color: "#6366F1" }
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
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Friendly Pricing</h1>
            <p className="text-lg text-muted-foreground">A new and better way to acquire, engage and support customers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border rounded-xl p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-1">FREE</h2>
                <p className="text-sm text-muted-foreground mb-6">Essential tools for individuals and teams</p>
                
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">$0</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Dashboard Access</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Customer Support</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <span className="text-muted-foreground">Limited Campaigns</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <span className="text-muted-foreground">Limited Influencers</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <span className="text-muted-foreground">Email Promotion</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                  <span className="text-muted-foreground">AI Processing</span>
                </div>
              </div>
              
              <button 
                onClick={handleFreePlan}
                className="w-full py-2 px-4 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Choose
              </button>
            </div>
            
            {/* Premium Plan */}
            <div className="border rounded-xl p-8 shadow-sm border-primary/20 bg-primary/5">
              <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-1">PREMIUM</h2>
                <p className="text-sm text-muted-foreground mb-6">Essential tools for individuals and teams</p>
                
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">$79</span>
                  <span className="text-muted-foreground ml-2">/per month</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Dashboard Access</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Customer Support</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Unlimited Campaigns</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Unlimited Influencers</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Fraud Prevention</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>AI Processing</span>
                </div>
              </div>
              
              <button
                onClick={handlePaidPlan}
                className="w-full py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                disabled={processingPayment || keyLoading}
              >
                {processingPayment || keyLoading ? "Processing..." : "Choose"}
              </button>
            </div>

            {/* Custom Plan */}
            <div className="border rounded-xl p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-1">CUSTOM</h2>
                <p className="text-sm text-muted-foreground mb-6">Enterprise solution with custom features</p>
                
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">Custom</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>All Premium Features</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Custom Integration</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Dedicated Support</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Custom Features</span>
                </div>
              </div>
              
              <button
                onClick={handleCustomPlan}
                className="w-full py-2 px-4 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            <span className="inline-block bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 mr-1">PRO</span>
            30% commission for influencers and $99 USD monthly for brands
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
