
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

// Use the 4 images you provided via URL
const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
  "https://images.unsplash.com/photo-1493397212122-2b85dda8106b",
  "https://images.unsplash.com/photo-1524230572899-a752b3835840",
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
          onClick={() => navigate('/premium')} 
          size="lg"
          className="bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white group"
        >
          Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
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
