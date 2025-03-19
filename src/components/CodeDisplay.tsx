
import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CodeDisplayProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ 
  code, 
  language = 'typescript', 
  title 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="animate-fade-in rounded-lg overflow-hidden border border-border bg-card mb-4">
      {title && (
        <div className="px-4 py-2 border-b border-border bg-muted flex items-center justify-between">
          <span className="font-medium text-sm">{title}</span>
          <button 
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      )}
      <pre className="p-4 overflow-auto text-sm">
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeDisplay;
