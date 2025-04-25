
import React from 'react';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border py-6 mt-12">
      <div className="container mx-auto space-y-4">
        {/* <Separator /> */}
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground" style={{ display: 'flex' }}>
           <>
            <Link
              to="/terms-conditions"
              className="hover:text-primary hover:underline"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/refund-policy"
              className="hover:text-primary hover:underline"
            >
              Refund Policy
            </Link>
            <Link
              to="/contact-us"
              className="hover:text-primary hover:underline"
            >
              Contact Us
            </Link>
          </>
          <div className="flex items-center justify-center h-12" style={{marginLeft:'auto'}}>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
