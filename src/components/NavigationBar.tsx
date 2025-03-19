
import React from 'react';
import { Database, BarChart, RefreshCw } from 'lucide-react';

const NavigationBar: React.FC = () => {
  return (
    <header className="animate-slide-down glass fixed top-0 left-0 right-0 z-50 border-b border-border/40">
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight">Power BI Assistant</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center justify-center rounded-full w-8 h-8 bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80">
            <BarChart className="h-4 w-4" />
          </button>
          <button className="flex items-center justify-center rounded-full w-8 h-8 bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
