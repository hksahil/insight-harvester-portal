
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SampleDataProps {
  onLoadSample: () => void;
}

const SampleData: React.FC<SampleDataProps> = ({ onLoadSample }) => {
  return (
    <div className="animate-fade-in mt-6 w-full max-w-2xl mx-auto border border-border rounded-lg p-6 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10">
          <Play className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            Try with Sample Data
          </h3>
          
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Don't have a VPAX file? No problem! Try the app with our sample data to see how it works.
          </p>
        </div>
        
        <Button 
          onClick={onLoadSample}
          variant="default"
          size="lg"
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          Load Sample Data
        </Button>
      </div>
    </div>
  );
};

export default SampleData;
