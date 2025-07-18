import React from 'react';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {

  const footerData = [
    {
      id: 1,
      title: 'Terms & Conditions',
      link: '/terms-conditions'
    },
    {
      id: 2,
      title: 'Privacy Policy',
      link: '/privacy-policy'
    },
    {
      id: 3,
      title: 'Refund Policy',
      link: '/refund-policy'
    },
    {
      id: 4,
      title: 'Contact Us',
      link: '/contact-us'
    }
  ]

  const renderFooterLinks = () => {
    return footerData.map((item) => (
      <div className="w-[48%] md:w-auto flex items-center justify-center">
        <Link
          key={item.id}
          to={item.link}
          className="hover:text-primary hover:underline text-nowrap text-center"
        >
          {item.title}
        </Link>
      </div>
    ));
  }


  return (
    <footer className="border-t border-border py-6 mt-12">
      <div className="container mx-auto px-4 space-y-4">
        <div className="flex flex-col space-y-4 items-center">
          {/* Navigation Links */}

          <div className="flex flex-row gap-2 md:gap-10 text-sm text-muted-foreground flex-wrap">
            {renderFooterLinks()}
          </div>
          {/* Made with Love */}
          <div className="flex items-center justify-center md:justify-end">
            <p className="text-sm text-muted-foreground flex items-center">
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