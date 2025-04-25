
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleFreePlan = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  };
  
  const handlePaidPlan = () => {
    if (user) {
      navigate('/premium');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Friendly Pricing</h1>
            <p className="text-lg text-muted-foreground">A new and better way to acquire, engage and support customers</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
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
              
              <Button onClick={handleFreePlan} className="w-full">
                {user ? 'Use Free Version' : 'Login to Use Free'}
              </Button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="border rounded-xl p-8 shadow-sm border-primary/20 bg-primary/5">
              <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-1">ENTERPRISE</h2>
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
              
              <Button onClick={handlePaidPlan} variant="default" className="w-full">
                Choose
              </Button>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            <span className="inline-block bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 mr-1">PRO</span>
            20% commission for influencers and $50 USD monthly for brands
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
