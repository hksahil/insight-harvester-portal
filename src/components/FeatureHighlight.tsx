
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { LogIn } from 'lucide-react';


// Use the 4 images you provided via URL
const CAROUSEL_IMAGES = [
"https://gsuoseezgicejjayrtce.supabase.co/storage/v1/object/sign/pbi-assistant-images/Best%20practices.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzkxNzNhMjBmLTAzN2QtNDJiYS1iNWJhLTcwMjYwNWEzY2JiMCJ9.eyJ1cmwiOiJwYmktYXNzaXN0YW50LWltYWdlcy9CZXN0IHByYWN0aWNlcy5wbmciLCJpYXQiOjE3NDUyNTY0MTMsImV4cCI6MTkwMjkzNjQxM30.F1O3ndo3T-HDprBmAK3rL7fB_LCiJi8_SGETnoyw9N8",
"https://gsuoseezgicejjayrtce.supabase.co/storage/v1/object/sign/pbi-assistant-images/Measure%20dependencies.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzkxNzNhMjBmLTAzN2QtNDJiYS1iNWJhLTcwMjYwNWEzY2JiMCJ9.eyJ1cmwiOiJwYmktYXNzaXN0YW50LWltYWdlcy9NZWFzdXJlIGRlcGVuZGVuY2llcy5wbmciLCJpYXQiOjE3NDUyNTY0MzAsImV4cCI6MTkwMjkzNjQzMH0.upCkLGH885pZYVXKEaPnNxlHt5W6RV6ScUM90IxtSBs",
"https://gsuoseezgicejjayrtce.supabase.co/storage/v1/object/sign/pbi-assistant-images/Sharable%20Snippets.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzkxNzNhMjBmLTAzN2QtNDJiYS1iNWJhLTcwMjYwNWEzY2JiMCJ9.eyJ1cmwiOiJwYmktYXNzaXN0YW50LWltYWdlcy9TaGFyYWJsZSBTbmlwcGV0cy5wbmciLCJpYXQiOjE3NDUyNTY0NDUsImV4cCI6MTkwMjkzNjQ0NX0.DjlGGI5DsUX2VE6E5WawVEk7pb5hCj-FxZ1QQaBsXf0",
"https://gsuoseezgicejjayrtce.supabase.co/storage/v1/object/sign/pbi-assistant-images/AI.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzkxNzNhMjBmLTAzN2QtNDJiYS1iNWJhLTcwMjYwNWEzY2JiMCJ9.eyJ1cmwiOiJwYmktYXNzaXN0YW50LWltYWdlcy9BSS5wbmciLCJpYXQiOjE3NDUyNTY0NTgsImV4cCI6MTkwMjkzNjQ1OH0.FuAK_ol3fY2vWjS7gvErRMDNM1eJ9H1aXir8XUNWKoU"
];

const FeatureHighlight = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-24 px-4">
      <div className="space-y-6">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
          Analyze Power BI models in minutes
        </h2>
        <p className="text-lg text-muted-foreground max-w-[600px]">
          Upload your Power BI models and get instant insights. Analyze relationships,
          measure dependencies, and optimize performance with our powerful analysis tools.
        </p>
        <Button 
                      variant="default"
                      size="lg"
                      className="flex items-center gap-2"
                      style={{ backgroundColor: 'rgb(0, 128, 255)', color: 'white' }}
                      onClick={() => navigate('/auth')}
                    >
                      <LogIn className="h-4 w-4" />
                      Try on your PowerBI Models
                    </Button>
        {/* <Button 
          onClick={() => navigate('/premium')} 
          size="lg"
          className="bg-[#0080ff] hover:bg-[#2A2F3C] text-white group"
        >
          Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button> */}
      </div>
      <div className="relative max-w-xl w-full mx-auto">
        <Carousel>
          {/* Position the arrows absolutely on top of the image */}
          <div
            className="absolute top-1/2 left-0 w-full z-20 flex justify-between px-4 pointer-events-none"
            style={{ transform: 'translateY(-50%)' }}
          >
            <div className="pointer-events-auto">
              <CarouselPrevious />
            </div>
            <div className="pointer-events-auto">
              <CarouselNext />
            </div>
          </div>
          <CarouselContent>
            {CAROUSEL_IMAGES.map((src, idx) => (
              <CarouselItem key={src} className="aspect-video bg-black/5 rounded-lg overflow-hidden flex items-center justify-center relative">
                <img 
                  src={src}
                  alt={`Demo ${idx + 1}`}
                  className="w-full h-full object-cover opacity-90"
                  draggable={false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default FeatureHighlight;
