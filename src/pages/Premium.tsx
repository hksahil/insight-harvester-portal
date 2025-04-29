import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { useUserUsage } from '@/hooks/useUserUsage';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PricingCard from '@/components/PricingCard';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PREMIUM_AMOUNT = 99900; // INR in paise, i.e. ₹499.00

const Premium: React.FC = () => {
  const navigate = useNavigate();
  const { usage, loading, refetchUsage } = useUserUsage();
  const [razorpayKey, setRazorpayKey] = useState<string | null>(null);
  const [keyLoading, setKeyLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(PREMIUM_AMOUNT);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  useEffect(() => {
    // Redirect if user is already premium
    if (usage?.is_premium) {
      navigate('/');
      toast.info('You already have premium access');
    }
  }, [usage, navigate]);

  useEffect(() => {
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
    fetchRazorpayKey();
  }, []);

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
          navigate('/');
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

  const handleContactSales = () => {
    window.location.href = 'mailto:officialhksahil@gmail.com';
  };

  const handleUseFree = () => {
    navigate('/auth');
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

  if (!user || usage?.is_premium) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <NavigationBar />
      <main className="flex-grow container mx-auto pt-4" style={{paddingTop:'8rem'}}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard
            title="Free"
            subtitle="Essential tools for individuals and teams"
            price="₹ 0"
            features={[
              { text: "Snippet Library Access", included: true },
              { text: "Blogs Access", included: true },
              { text: "Unlimited file uploads", included: true },
              { text: "Discord Community Access", included: false },
              { text: "Preview Feature Early Accesss", included: false, premiumOnly: true },
            ]}
            buttonText="Use Free Version"
            onButtonClick={handleUseFree}
          />
          
          <PricingCard
            title="Premium"
            subtitle={`You've used ${usage?.processed_files_count || 0} of 5 free uploads`}
            price="₹ 999"
            features={[
              { text: "Snippet Library Access", included: true },
              { text: "Blogs Access", included: true },
              { text: "Unlimited file uploads", included: true },
              { text: "Discord Community Access", included: true },
              { text: "Preview Feature Early Accesss", included: true},
             ]}
            buttonText={`Upgrade Now - ₹${(finalAmount / 100).toFixed(2)}`}
            onButtonClick={handleUpgrade}
            showPromoCode={true}
            onApplyPromo={handleApplyPromo}
            isLoading={processingPayment || keyLoading}
          />
          
          <PricingCard
            title="Enterprise"
            subtitle="Enterprise solution with custom deployment"
            price="Custom"
            features={[
              { text: "Snippet Library Access", included: true },
              { text: "Blogs Access", included: true },
              { text: "Unlimited file uploads", included: true },
              { text: "Discord Community Access", included: true },
              { text: "Preview Feature Early Accesss", included: true},
            ]}
            buttonText="Contact Sales"
            onButtonClick={handleContactSales}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
