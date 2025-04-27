import React, { useState, useEffect } from 'react';
import { Search, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CodeDisplay from '@/components/CodeDisplay';
import { toast } from 'sonner';
import UseCaseHelper from './UseCaseHelper';
import { SubmitSnippetDialog } from './SubmitSnippetDialog';
import { supabase } from '@/integrations/supabase/client';

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  category: string;
  author_name: string;
  submitted_date: string;
}

const SnippetsTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'prompt', name: 'Prompt' },
    { id: 'tmdl', name: 'TMDL' },
    { id: 'dax', name: 'DAX' },
    { id: 'sql', name: 'SQL' },
    { id: 'python', name: 'Python' },
    { id: 'powerquery', name: 'PowerQuery' },
    { id: 'powershell', name: 'PowerShell' },
    { id: 'excel', name: 'Excel' }
  ];

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_snippets')
        .select('*')
        .order('submitted_date', { ascending: false });

      if (error) {
        console.error('Error fetching snippets:', error);
        toast.error('Failed to load snippets');
      } else {
        console.log('Fetched snippets:', data);
        setSnippets(data || []);
      }
    } catch (e) {
      console.error('Exception in fetchSnippets:', e);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredSnippets = snippets.filter(snippet => {
    const matchesCategory = activeCategory === 'all' || snippet.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (snippet.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 max-w-[550px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search snippet titles and code, contributors, or categories..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <SubmitSnippetDialog />
      </div>
      <UseCaseHelper type="snippets" />
      
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="text-center p-8">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading snippets...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredSnippets.length > 0 ? (
            filteredSnippets.map(snippet => (
              <div key={snippet.id} className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{snippet.title}</h3>
                      <p className="text-muted-foreground text-sm">{snippet.description}</p>
                    </div>
                    <Badge className="uppercase">{snippet.category === 'tmdl' ? 'TMDL' : snippet.category}</Badge>
                  </div>
                </div>
                
                <CodeDisplay code={snippet.code} language={snippet.language === 'prompt' ? 'markdown' : snippet.language} />
                
                <div className="p-4 border-t border-border flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        navigator.clipboard.writeText(snippet.code);
                        toast.success('Copied to clipboard');
                      }}
                      className="gap-1.5"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Submitted by {snippet.author_name} on {new Date(snippet.submitted_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">
                {searchQuery || activeCategory !== 'all' 
                  ? 'No snippets found matching your criteria' 
                  : 'No snippets have been submitted yet. Be the first to contribute!'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SnippetsTab;
