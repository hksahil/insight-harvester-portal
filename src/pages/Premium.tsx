
import React from 'react';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Premium: React.FC = () => {
  const handleUpgrade = () => {
    // TODO: Implement Stripe checkout or payment logic
    // For now, just a placeholder toast
    alert('Premium upgrade coming soon! Price: ₹499');
  };

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
