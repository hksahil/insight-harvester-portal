
import React, { useState } from 'react';
import { Send, Brain } from 'lucide-react';
import { toast } from 'sonner';

const AskGPT: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (!apiKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }
    
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setAnswer("This is a simulated response. In a real implementation, this would call the OpenAI API with your question and the model data. The response would analyze the Power BI model structure and provide insights based on your question.");
      setIsLoading(false);
      toast.success('Response generated');
    }, 1500);
  };
  
  return (
    <div className="animate-fade-in p-2 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-medium">Ask about your Power BI model</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            OpenAI API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="question" className="text-sm font-medium">
            Your Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about tables, relationships, measures, etc."
            rows={3}
            className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary px-4 py-2 w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Question</span>
            </>
          )}
        </button>
      </form>
      
      {answer && (
        <div className="mt-6 p-6 border border-border rounded-lg bg-card animate-slide-in-right">
          <h3 className="text-lg font-medium mb-2">Response:</h3>
          <div className="text-sm whitespace-pre-line">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};

export default AskGPT;
