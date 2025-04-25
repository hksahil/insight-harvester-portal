
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PricingComparison from '@/components/PricingComparison';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [promoCode, setPromoCode] = React.useState('');
  
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handlePromoCodeValidation = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode)
        .eq('is_active', true)
        .single();
      
      if (error || !data) {
        toast.error('Invalid or expired promo code');
        return;
      }
      
      // Check if promo code is still valid
      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        toast.error('Promo code has expired');
        return;
      }
      
      toast.success(`Promo code applied! Discount: ${data.discount}%`);
    } catch (err) {
      toast.error('Error validating promo code');
    }
  };
  
  const handleFreePlan = () => {
    if (user) {
      // For signed-in users, do nothing (they're already on free plan)
      toast.info('You are currently on the Free Plan');
    } else {
      navigate('/auth');
    }
  };
  
  const handlePaidPlan = () => {
    if (user) {
      // Redirect to Razorpay page for payment
      navigate('/premium');
    } else {
      // Redirect to login if not signed in
      navigate('/auth?redirectTo=/premium');
    }
  };

  const handleContactSales = () => {
    window.location.href = 'mailto:officialhksahil@gmail.com?subject=Enterprise%20Pro%20Inquiry';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-24 space-y-8">
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
            </div>
            
            <Button onClick={handleFreePlan} className="w-full">
              {user ? 'Free Plan' : 'Login to Use Free'}
            </Button>
          </div>
          
          {/* Enterprise Plan */}
          <div className="border rounded-xl p-8 shadow-sm border-primary/20 bg-primary/5">
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-1">PRO</h2>
              <p className="text-sm text-muted-foreground mb-6">Advanced tools for professionals</p>
              
              <div className="flex items-baseline">
                <span className="text-5xl font-bold">$79</span>
                <span className="text-muted-foreground ml-2">/per month</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
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
            </div>
            
            <Button onClick={handlePaidPlan} variant="default" className="w-full">
              {user ? 'Upgrade Now' : 'Login to Upgrade'}
            </Button>
          </div>
          
          {/* Enterprise Pro Section */}
          <div className="border rounded-xl p-8 shadow-sm border-amber-500/20 bg-amber-50">
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-1">ENTERPRISE PRO</h2>
              <p className="text-sm text-muted-foreground mb-6">Tailored solutions for large organizations</p>
              
              <div className="flex items-baseline">
                <span className="text-5xl font-bold">Custom</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Dedicated Support</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Customized Workflows</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Enterprise-grade Security</span>
              </div>
            </div>
            
            <Button onClick={handleContactSales} variant="secondary" className="w-full">
              Contact Sales
            </Button>
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-md">
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter promo code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handlePromoCodeValidation}>
                Apply Code
              </Button>
            </div>
          </div>
        </div>
        
        <PricingComparison />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
