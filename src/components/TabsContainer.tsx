
import React, { useState } from 'react';

interface TabsContainerProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

const TabsContainer: React.FC<TabsContainerProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="animate-fade-in w-full space-y-4">
      <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium relative transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-fade-in" />
            )}
          </button>
        ))}
      </div>
      
      <div className="min-h-[300px]">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={`${activeTab === tab.id ? 'block animate-zoom-in' : 'hidden'}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabsContainer;
