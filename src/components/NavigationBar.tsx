
import React, { useState, useEffect } from 'react';
import { Home, Info, HelpCircle, Calendar, BookOpen, DollarSign } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { UserProfileButton } from './UserProfileButton';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Initial check
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const goToHome = () => {
    navigate('/');
    window.location.reload();
  };

  const goToAuth = () => {
    navigate('/auth');
  };

  const goToPricing = () => {
    navigate('/pricing');
  };

  const goToLearning = () => {
    navigate('/learning');
  };

  return (
    <header className="animate-slide-down glass fixed top-0 left-0 right-0 z-50 border-b border-border/40">
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-semibold tracking-tight">Power BI Assistant</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={goToHome}
            variant="ghost"
            className="flex items-center gap-2"
            title="Go back to homepage"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          
          <Button 
            onClick={() => setInfoDialogOpen(true)}
            variant="ghost"
            className="flex items-center gap-2"
            title="Information about the app"
          >
            <Info className="h-4 w-4" />
            Info & VPAX
          </Button>
          
          <Button 
            onClick={goToLearning}
            variant="ghost"
            className="flex items-center gap-2"
            title="Learning resources and blogs"
          >
            <BookOpen className="h-4 w-4" />
            Learning
          </Button>
          
          <Button 
            onClick={goToPricing}
            variant="ghost"
            className="flex items-center gap-2"
            title="View pricing options"
          >
            <DollarSign className="h-4 w-4" />
            Pricing
          </Button>
          
          <Button 
            onClick={() => setUpcomingDialogOpen(true)}
            variant="ghost"
            className="flex items-center gap-2"
            title="Upcoming features"
          >
            <Calendar className="h-4 w-4" />
            Upcoming Features
          </Button>

          {user ? (
            <UserProfileButton />
          ) : (
            <Button 
              onClick={goToAuth}
              className="flex items-center gap-2"
              style={{ backgroundColor: 'rgb(0, 128, 255)', color: 'white' }}
              title="Login"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Info and VPAX Dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>About Power BI Assistant & VPAX</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* App Info Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About Power BI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                PowerBI Assistant tool is designed to help Power BI developers understand their model better, 
                identify optimization opportunities, document their models & leverage AI to create new measures/find insights.
              </p>
              
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">How to use the app:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Upload a VPAX file using the file uploader on the homepage</li>
                  <li>Browse through the different tabs to analyze your Power BI model</li>
                  <li>Use filters and search to find specific information</li>
                  <li>Export data for documentation purposes</li>
                </ol>
              </div>
            </div>
            
            {/* VPAX Info Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">What is a VPAX file?</h3>
              <p className="text-sm text-muted-foreground">
                A VPAX file is an export format of Power BI models that contains metadata about the model structure, relationships, measures, and more.
              </p>
              
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">How do I create a VPAX file?</h4>
                <p className="text-sm text-muted-foreground">
                  You can create a VPAX file using tools like DAX Studio.{" "}
                  <a href="https://hksahil.notion.site/How-to-Generate-VPAX-File-of-your-DataModel-1bf6644e204a80618392dd02583ea4fb?pvs=4" 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-primary hover:underline">
                    Step by Step Guide
                  </a>
                </p>
              </div>
              
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Frequently Asked Questions</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Is my data secure?</p>
                    <p className="text-sm text-muted-foreground">
                      Yes, your VPAX file is processed entirely in your browser. No data is sent to any server.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">What information can I find in the app?</p>
                    <p className="text-sm text-muted-foreground">
                      You can analyze model metadata, relationships, tables, columns, measures, and M expressions from your Power BI model.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">How do I export data for documentation?</p>
                    <p className="text-sm text-muted-foreground">
                      Use the Documentation tab to export data in PDF or Excel format.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upcoming Features Dialog */}
      <Dialog open={upcomingDialogOpen} onOpenChange={setUpcomingDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upcoming Features</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <h3 className="font-semibold">DAX Formula Analyzer</h3>
              <p className="text-sm text-muted-foreground">
                Advanced analysis of DAX formulas to identify optimization opportunities and potential issues.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Documentation Export Improvements</h3>
              <p className="text-sm text-muted-foreground">
                Enhanced documentation export with customizable templates and more export formats.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Model Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Compare two different versions of your Power BI model to identify changes and potential issues.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Advanced Visualization Tools</h3>
              <p className="text-sm text-muted-foreground">
                More visualizations to help you understand your data model structure and dependencies.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default NavigationBar;
