
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="animate-fade-in text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <FileQuestion className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Oops! Page not found</p>
        
        <div className="pt-4">
          <a 
            href="/" 
            className="btn btn-primary px-6 py-2 inline-flex items-center space-x-2"
          >
            <span>Return to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
