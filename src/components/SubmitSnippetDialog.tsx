
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const snippetFormSchema = z.object({
  authorName: z.string().min(1, { message: 'Name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  code: z.string().min(10, { message: 'Snippet must be at least 10 characters' })
});

type SnippetFormValues = z.infer<typeof snippetFormSchema>;

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
  const form = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: {
      authorName: '',
      category: '',
      code: ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: SnippetFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting snippet:', data);
      
      // Insert the snippet with proper fields - make sure we're not using an array
      const { error } = await supabase
        .from('user_snippets')
        .insert({
          author_name: data.authorName,
          category: data.category,
          code: data.code,
          status: 'pending',
          user_id: null // Allowing anonymous submissions
        });

      if (error) {
        console.error('Error submitting snippet:', error);
        throw error;
      }

      toast.success('Snippet submitted successfully!');
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error details:', error);
      toast.error('Failed to submit snippet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Submit a Snippet</DialogTitle>
          <DialogDescription>
            Share your useful code snippets with the community
          </DialogDescription>
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
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Snippet'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
