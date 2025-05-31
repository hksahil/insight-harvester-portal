
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { UserProfileButton } from './UserProfileButton';
import { useUserUsage } from '@/hooks/useUserUsage';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);
  const { usage } = useUserUsage();

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
    navigate('/premium');
  };

  const goToBlogs = () => {
    navigate('/blogs');
  };

  const goToSnippets = () => {
    navigate('/snippets');
  };

  const goToPbixAnalyser = () => {
    navigate('/pbix-analyser');
  };

  // Only show Premium button if user is logged in but not premium
  const shouldShowPremium = user && !usage?.is_premium;

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
            Home
          </Button>

          <Button 
            onClick={goToPbixAnalyser}
            variant="ghost"
            className="flex items-center gap-2"
            title="Open PBIX Analyser"
          >
            PBIX Analyser
          </Button>
          
          <Button 
            onClick={goToSnippets}
            variant="ghost"
            className="flex items-center gap-2"
            title="View DAX Snippets"
          >
            Snippets Library
          </Button>

          <Button 
            onClick={() => setInfoDialogOpen(true)}
            variant="ghost"
            className="flex items-center gap-2"
            title="Information about the app"
          >
            FAQ
          </Button>
          
          <Button 
            onClick={goToBlogs}
            variant="ghost"
            className="flex items-center gap-2"
            title="View blogs"
          >
            Blog
          </Button>
          
          {shouldShowPremium && (
            <Button 
              onClick={goToPricing}
              variant="ghost"
              className="flex items-center gap-2"
              title="View pricing options"
            >
              Premium
            </Button>
          )}
          
          <Button 
            onClick={() => setUpcomingDialogOpen(true)}
            variant="ghost"
            className="flex items-center gap-2"
            title="Upcoming features"
          >
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

      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Frequently Asked Questions</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <h3 className="font-medium">What is this tool about?</h3>
              <p className="text-sm text-muted-foreground">
                This tool, PowerBI Assistant is designed to help Power BI developers understand their model better, 
                identify optimization opportunities, document their models & leverage AI to create new measures/find insights.
              </p>
              
              <div className="mt-4 space-y-2">
                              <h3 className="font-medium">How exactly does this tool work?</h3>
              <p className="text-sm text-muted-foreground">
                We take your model's VPAX file as input & process it to perform the detailed analysis. <br></br>A VPAX file is an export format of Power BI models that contains metadata about the model structure, relationships, measures, and more.
              </p>
                {/* <h4 className="font-medium">How to use the app:</h4>
                <ol className=" text-sm text-muted-foreground">
                  <li>1. Upload a VPAX file using the file uploader on the homepage</li>
                  <li>2. Browse through the different tabs to analyze your Power BI model</li>
                  <li>3. Use filters and search to find specific information</li>
                  <li>4. Export data for documentation purposes</li>
                </ol> */}
              </div>
            </div>
            
            <div>
            
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Is my data secure?</h4>
                <p className="text-sm text-muted-foreground">
                Yes, your VPAX file is just a metadata file. No actual data is stored inside it. Plus, your file is processed entirely in your browser. No data is sent to any server.
                <br></br><br></br>P.S: Even if you reach out to Microsoft official support, they will ask you to share your VPAX with them to debug/analyse so it's 100% safe
                </p>
              </div>

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
                <h4 className="font-medium">How is this app different from other tools like Tabular Editor?</h4>
                <p className="text-sm text-muted-foreground">
                <ol className=" text-sm text-muted-foreground">
                  <li>1. They don't have a web-based solution. </li>
                  <li>2. You need to have the access of client's environment to use them</li>
                  <li>3. If you want someone else to help you in debugging, you will need to share actual PBIX files</li>
                  <li>4. There are lot more custom features in this tool, which other tools lack</li>
                </ol>

                  {/* Other tools have a major limitation. 
                  <br></br> 
                  <br></br> Plus, 
                  <br></br> Plus, 
                  <br></br>  */}
                </p>
              </div> 
{/* 
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">How to use the app:</h4>
                <ol className=" text-sm text-muted-foreground">
                  <li>1. Upload a VPAX file using the file uploader on the homepage</li>
                  <li>2. Browse through the different tabs to analyze your Power BI model</li>
                  <li>3. Use filters and search to find specific information</li>
                  <li>4. Export data for documentation purposes</li>
                </ol>
              </div>  */}

            </div>
          </div>
        </DialogContent>
      </Dialog>

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
