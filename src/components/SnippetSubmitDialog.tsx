
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SnippetSubmitDialogProps {
  trigger: React.ReactNode;
}

const SnippetSubmitDialog: React.FC<SnippetSubmitDialogProps> = ({ trigger }) => {
  const navigate = useNavigate();
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to submit a snippet');
      setOpen(false);
      navigate('/auth?redirectTo=/');
      return;
    }
    
    if (!authorName || !category || !code) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('user_snippets').insert({
        author_name: authorName,
        category,
        code,
        user_id: userData.user?.id
      });
      
      if (error) throw error;
      
      toast.success('Snippet submitted successfully for review!');
      setAuthorName('');
      setCategory('');
      setCode('');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to submit snippet. Please try again.');
      console.error('Error submitting snippet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !isAuthenticated) {
      navigate('/auth?redirectTo=/');
      return;
    }
    setOpen(newOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Your Snippet</DialogTitle>
            <DialogDescription>
              Share your code snippets with the community. Submissions are reviewed before publishing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="author-name" className="text-right text-sm">
                Your Name
              </label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="col-span-3"
                placeholder="Display name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm">
                Category
              </label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TMDL">TMDL</SelectItem>
                  <SelectItem value="DAX">DAX</SelectItem>
                  <SelectItem value="SQL">SQL</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="PowerQuery">PowerQuery</SelectItem>
                  <SelectItem value="prompt">Prompt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="code" className="text-right text-sm">
                Snippet Code
              </label>
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="col-span-3 min-h-[200px] font-mono"
                placeholder="Paste your code snippet here..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Snippet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SnippetSubmitDialog;
