
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SubmitSnippetFormData {
  authorName: string;
  category: string;
  code: string;
}

interface SubmitSnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { id: 'prompt', name: 'Prompt' },
  { id: 'tmdl', name: 'TMDL' },
  { id: 'dax', name: 'DAX' },
  { id: 'sql', name: 'SQL' },
  { id: 'python', name: 'Python' },
  { id: 'powerquery', name: 'PowerQuery' }
];

export function SubmitSnippetDialog({ open, onOpenChange }: SubmitSnippetDialogProps) {
  const form = useForm<SubmitSnippetFormData>({
    defaultValues: {
      authorName: '',
      category: '',
      code: ''
    }
  });

  const onSubmit = async (data: SubmitSnippetFormData) => {
    try {
      const { error } = await supabase.from('user_snippets').insert({
        author_name: data.authorName,
        category: data.category,
        code: data.code
      });

      if (error) throw error;

      toast.success('Snippet submitted successfully!');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting snippet:', error);
      toast.error('Failed to submit snippet. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Submit a Snippet</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Snippet</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your code snippet here..." 
                      className="font-mono min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Submit Snippet</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
