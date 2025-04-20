
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SampleDataProps {
  onLoadSample: () => void;
}

const SampleData: React.FC<SampleDataProps> = ({ onLoadSample }) => {
  return (
    <Button 
      onClick={onLoadSample}
      variant="outline"
      size="lg"
      className="gap-2"
    >
      <Play className="h-4 w-4" />
      Try with Sample Data
    </Button>
  );
};

export default SampleData;
