
import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
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
          <Link to="/privacy-policy" className="hover:text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-primary hover:underline">
            Terms & Conditions
          </Link>
          <Link to="/refund" className="hover:text-primary hover:underline">
            Return & Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
