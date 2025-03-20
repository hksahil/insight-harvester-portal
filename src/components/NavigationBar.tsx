
import React, { useState } from 'react';
import { Database, ArrowLeft, Info, HelpCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);

  const goToHome = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="animate-slide-down glass fixed top-0 left-0 right-0 z-50 border-b border-border/40">
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight">Power BI Assistant</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={goToHome}
            className="flex items-center justify-center rounded-full w-8 h-8 bg-primary/10 text-primary transition-all hover:bg-primary/20"
            title="Go back to homepage"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setInfoDialogOpen(true)}
            className="flex items-center justify-center rounded-full w-8 h-8 bg-primary/10 text-primary transition-all hover:bg-primary/20"
            title="Information about the app"
          >
            <Info className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setFaqDialogOpen(true)}
            className="flex items-center justify-center rounded-full w-8 h-8 bg-primary/10 text-primary transition-all hover:bg-primary/20"
            title="Frequently asked questions"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info Dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>About Power BI Assistant</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4">
            <p>Power BI Assistant is a tool to analyze and visualize the structure of Power BI models from VPAX files.</p>
            
            <div className="space-y-2">
              <h3 className="font-medium">How to use the app:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Upload a VPAX file using the file uploader on the homepage</li>
                <li>Browse through the different tabs to analyze your Power BI model</li>
                <li>Use filters and search to find specific information</li>
                <li>Export data for documentation purposes</li>
              </ol>
            </div>
            
            <p className="text-sm text-muted-foreground">
              This tool is designed to help Power BI developers understand their model structure better, 
              identify optimization opportunities, and document their models.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Frequently Asked Questions</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <h3 className="font-semibold">What is a VPAX file?</h3>
              <p className="text-sm text-muted-foreground">
                A VPAX file is an export format of Power BI models that contains metadata about the model structure, relationships, measures, and more.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">How do I create a VPAX file?</h3>
              <p className="text-sm text-muted-foreground">
                You can create a VPAX file using tools like DAX Studio, Tabular Editor, or the Power BI Performance Analyzer.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Is my data secure?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, your VPAX file is processed entirely in your browser. No data is sent to any server.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">What information can I find in the app?</h3>
              <p className="text-sm text-muted-foreground">
                You can analyze model metadata, relationships, tables, columns, measures, and M expressions from your Power BI model.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">How do I export data for documentation?</h3>
              <p className="text-sm text-muted-foreground">
                Use the Documentation tab to export data in PDF or Excel format.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default NavigationBar;
