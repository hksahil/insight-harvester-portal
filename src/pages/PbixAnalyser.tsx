
import React from 'react';
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";

const PbixAnalyser = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <NavigationBar />
      
      <main className="pt-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-primary">PBIX Analyser</h1>
            <p className="text-muted-foreground mt-2">
              Analyze your Power BI files with advanced tools and insights.
            </p>
          </div>
          
          <div className="w-full h-[calc(100vh-12rem)] border border-border rounded-lg overflow-hidden">
            <iframe 
              src="https://pbi-scrapper.onrender.com"
              className="w-full h-full border-0"
              title="PBIX Analyser"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PbixAnalyser;
