
import React from 'react';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserUsage } from '@/hooks/useUserUsage';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const PREMIUM_AMOUNT = 49900; // INR in paise, i.e. ₹499.00

const Premium: React.FC = () => {
  const { usage, loading } = useUserUsage();

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
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    const options = {
      key: import.meta.env.RAZORPAY_KEY_ID || window.RAZORPAY_KEY_ID || '', // fallback if set as global
      amount: PREMIUM_AMOUNT,
      currency: "INR",
      name: "Power BI Assistant",
      description: "Upgrade to Premium",
      image: "/favicon.ico",
      handler: function (response: any) {
        toast.success("Payment successful! Thank you for upgrading to Premium.");
        // Optionally: Trigger API/backend logic to upgrade the user
        window.location.reload(); // Simple way to reload premium status for demo
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
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
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
              >
                Upgrade Now - ₹499
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

