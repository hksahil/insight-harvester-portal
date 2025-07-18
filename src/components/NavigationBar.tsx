import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { UserProfileButton } from './UserProfileButton';
import { useUserUsage } from '@/hooks/useUserUsage';
import { X } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Close menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const goToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const goToAuth = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const goToPricing = () => {
    navigate('/premium');
    setIsMenuOpen(false);
  };

  const goToBlogs = () => {
    navigate('/blogs');
    setIsMenuOpen(false);
  };

  const goToSnippets = () => {
    navigate('/snippets');
    setIsMenuOpen(false);
  };

  const goToPbixAnalyser = () => {
    navigate('/pbix-analyser');
    setIsMenuOpen(false);
  };

  const openInfoDialog = () => {
    setInfoDialogOpen(true);
    setIsMenuOpen(false);
  };

  const openUpcomingDialog = () => {
    setUpcomingDialogOpen(true);
    setIsMenuOpen(false);
  };

  // Only show Premium button if user is logged in but not premium
  const shouldShowPremium = user && !usage?.is_premium;

  return (
    <>
      <header className="animate-slide-down glass fixed top-0 left-0 right-0 z-50 border-b border-border/40">
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <Link to={'/'}>
              <span className="text-xl font-semibold tracking-tight">Power BI Assistant</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
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

          {/* Mobile Navigation - Burger Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Show user profile or login button on mobile header */}
            {user ? (
              <UserProfileButton />
            ) : (
              <Button
                onClick={goToAuth}
                size="sm"
                className="flex items-center gap-2"
                style={{ backgroundColor: 'rgb(0, 128, 255)', color: 'white' }}
                title="Login"
              >
                Login
              </Button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-8 h-8 flex flex-col justify-center items-center space-y-1 group focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-1"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              type="button"
            >
              <span
                className={`w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
              />
              <span
                className={`w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0 scale-0' : ''
                  }`}
              />
              <span
                className={`w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-md border-l border-border/40 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/40">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <button
              title='Close Menu'
              type='button'
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-accent rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <Button
                onClick={goToHome}
                variant="ghost"
                className="w-full justify-start text-left h-12 text-base font-medium"
                title="Go back to homepage"
              >
                Home
              </Button>

              <Button
                onClick={goToPbixAnalyser}
                variant="ghost"
                className="w-full justify-start text-left h-12 text-base font-medium"
                title="Open PBIX Analyser"
              >
                PBIX Analyser
              </Button>

              <Button
                onClick={goToSnippets}
                variant="ghost"
                className="w-full justify-start text-left h-12 text-base font-medium"
                title="View DAX Snippets"
              >
                Snippets Library
              </Button>

              <Button
                onClick={openInfoDialog}
                variant="ghost"
                className="w-full justify-start text-left h-12 text-base font-medium"
                title="Information about the app"
              >
                FAQ
              </Button>

              <Button
                onClick={goToBlogs}
                variant="ghost"
                className="w-full justify-start text-left h-12 text-base font-medium"
                title="View blogs"
              >
                Blog
              </Button>

              {shouldShowPremium && (
                <Button
                  onClick={goToPricing}
                  variant="ghost"
                  className="w-full justify-start text-left h-12 text-base font-medium"
                  title="View pricing options"
                >
                  Premium
                </Button>
              )}

              <Button
                onClick={openUpcomingDialog}
                variant="ghost"
                className="w-full justify-start text-left h-12 text-base font-medium"
                title="Upcoming features"
              >
                Upcoming Features
              </Button>
            </div>
          </nav>

          {/* Menu Footer */}
          <div className="p-4 border-t border-border/40">
            <div className="text-xs text-muted-foreground text-center">
              Power BI Assistant v1.0
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Dialog */}
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
                </p>
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
    </>
  );
};

export default NavigationBar;