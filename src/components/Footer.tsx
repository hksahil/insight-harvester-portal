
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border py-8 mt-12">
      <div className="container mx-auto flex items-center justify-center h-16">
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
    </footer>
  );
};

export default Footer;
