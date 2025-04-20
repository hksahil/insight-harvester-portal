
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      
      <div className="relative">
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-black/5">
          <img 
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
            alt="Demo visualization"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default FeatureHighlight;
