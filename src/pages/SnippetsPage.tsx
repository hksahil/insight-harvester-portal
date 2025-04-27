
import React from 'react';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import SnippetsTab from "@/components/SnippetsTab";

const SnippetsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <NavigationBar />
      <main className="flex-grow container mx-auto px-4" style={{ paddingTop: '8rem' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">DAX Snippets Library</h1>
          <SnippetsTab />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SnippetsPage;
