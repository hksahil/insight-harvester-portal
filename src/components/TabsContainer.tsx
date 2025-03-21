
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border">
          <TabsList className="h-auto bg-transparent p-0 w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="px-4 py-2 text-sm font-medium relative transition-all whitespace-nowrap data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-fade-in" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="min-h-[300px] pt-4">
          {tabs.map((tab) => (
            <TabsContent 
              key={tab.id} 
              value={tab.id}
              className="animate-zoom-in"
            >
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default TabsContainer;
