
import React, { useEffect, useState } from 'react';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserUsage } from '@/hooks/useUserUsage';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const PREMIUM_AMOUNT = 49900; // INR in paise, i.e. ₹499.00

const Premium: React.FC = () => {
  const { usage, loading } = useUserUsage();
  const [razorpayKey, setRazorpayKey] = useState<string | null>(null);
  const [keyLoading, setKeyLoading] = useState(false);
  
  // Fetch Razorpay key from Supabase edge function
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

  // Dynamically load Razorpay script
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

    console.log("Initializing payment with key available:", !!razorpayKey);

    const options = {
      key: razorpayKey,
      amount: PREMIUM_AMOUNT,
      currency: "INR",
      name: "Power BI Assistant",
      description: "Upgrade to Premium",
      image: "/favicon.ico",
      handler: function (response: any) {
        console.log("Payment success:", response);
        toast.success("Payment successful! Thank you for upgrading to Premium.");
        // Optionally: Trigger API/backend logic to upgrade the user
        setTimeout(() => window.location.reload(), 2000); // Give time for toast to be seen
      },
      prefill: {},
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
        <main className="flex-grow flex items-center justify-center px-4 py-16">
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
        <main className="flex-grow flex items-center justify-center px-4 py-16">
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
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md border border-border/50 shadow-lg">
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
              <Button 
                onClick={handleUpgrade} 
                className="w-full"
                size="lg"
                disabled={keyLoading}
              >
                {keyLoading ? "Loading..." : "Upgrade Now - ₹499"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
