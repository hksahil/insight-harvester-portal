import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
const categories = [{
  id: 'prompt',
  name: 'Prompt'
}, {
  id: 'tmdl',
  name: 'TMDL'
}, {
  id: 'dax',
  name: 'DAX'
}, {
  id: 'sql',
  name: 'SQL'
}, {
  id: 'python',
  name: 'Python'
}, {
  id: 'powerquery',
  name: 'PowerQuery'
}, {
  id: 'powershell',
  name: 'PowerShell'
}];
export function SubmitSnippetDialog() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [code, setCode] = React.useState('');
  const [category, setCategory] = React.useState('prompt');
  const [authorName, setAuthorName] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code || !authorName) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.from('user_snippets').insert({
        title,
        description,
        code,
        language: category === 'prompt' ? 'markdown' : category,
        category,
        author_name: authorName,
        live_flag: false // Set live_flag to false by default
      });
      if (error) throw error;
      toast.success('Snippet submitted successfully!');
      setIsOpen(false);
      resetForm();

      // Notify the user that their snippet is pending review
      toast.info('Your snippet is pending review and will be displayed after approval');
    } catch (error) {
      console.error('Error submitting snippet:', error);
      toast.error('Failed to submit snippet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCode('');
    setCategory('prompt');
    setAuthorName('');
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-4 bg-gray-300 hover:bg-gray-200 text-gray-950">+ Submit your snippet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit a New Snippet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Enter snippet title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter snippet description" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <Textarea value={code} onChange={e => setCode(e.target.value)} required placeholder="Enter your code snippet" className="min-h-[200px] font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author Name</label>
            <Input value={authorName} onChange={e => setAuthorName(e.target.value)} required placeholder="Enter your name" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Snippet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}