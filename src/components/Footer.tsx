
import React from 'react';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border py-6 mt-12">
      <div className="container mx-auto space-y-4">
        <div className="flex items-center justify-center h-12">
          <p className="text-sm text-muted-foreground flex items-center justify-center">
            Made with 
            <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" /> 
            by 
            <a 
              href="https://sahilchoudhary.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-primary hover:underline"
            >
              Sahil Choudhary
            </a>
          </p>
        </div>
        <Separator />
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <a 
            href="https://merchant.razorpay.com/policy/QLrLLKO3WzQq4w/terms" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary hover:underline"
          >
            Terms & Conditions
          </a>
          <a 
            href="https://merchant.razorpay.com/policy/QLrLLKO3WzQq4w/privacy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary hover:underline"
          >
            Privacy Policy
          </a>
          <a 
            href="https://merchant.razorpay.com/policy/QLrLLKO3WzQq4w/refund" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary hover:underline"
          >
            Refund Policy
          </a>
          <a 
            href="https://merchant.razorpay.com/policy/QLrLLKO3WzQq4w/shipping" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary hover:underline"
          >
            Shipping Policy
          </a>
          <a 
            href="https://merchant.razorpay.com/policy/QLrLLKO3WzQq4w/contact_us" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary hover:underline"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
