
import React, { useState } from 'react';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import SnippetsTab from "@/components/SnippetsTab";
import SnippetsTable from "@/components/SnippetsTable";

const sampleSnippets = [
  {
    id: '1',
    title: 'TMDL view - Set descriptions for measures',
    description: 'Generates descriptions for measures in your model',
    code: `Help me add or replace descriptions for each measure...`,
    language: 'sql',
    category: 'prompt',
    submittedBy: 'data.zoe',
    submittedDate: '2023-08-15'
  },
  // ... Add all other snippets here
];

const SnippetsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4" style={{ paddingTop: '8rem' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">DAX Snippets Library</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'card' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary'
                }`}
              >
                Card View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'table' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary'
                }`}
              >
                Table View
              </button>
            </div>
          </div>
          
          {viewMode === 'card' ? (
            <SnippetsTab />
          ) : (
            <SnippetsTable snippets={sampleSnippets} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SnippetsPage;
