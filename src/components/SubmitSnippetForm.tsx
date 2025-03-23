
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface SubmitSnippetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubmitSnippetForm: React.FC<SubmitSnippetFormProps> = ({ open, onOpenChange }) => {
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmitSuccess = () => {
    setSubmitted(true);
    toast.success('Your snippet has been submitted. Thank you!');
  };
  
  const handleClose = () => {
    setSubmitted(false);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{submitted ? "Submission Received" : "Submit Your Snippet"}</DialogTitle>
          <DialogDescription>
            {submitted 
              ? "Thank you for your contribution!" 
              : "Share your useful PowerBI snippet with the community."}
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <p className="text-center">Your snippet has been submitted successfully. We'll review it and add it to our collection.</p>
            <Button onClick={handleClose}>Go Back</Button>
          </div>
        ) : (
          <form 
            name="snippet-submission" 
            method="POST" 
            data-netlify="true"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitSuccess();
            }}
            className="space-y-4 py-4"
            netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="snippet-submission" />
            <p className="hidden">
              <label>Don't fill this out if you're human: <input name="bot-field" /></label>
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="snippet-name">Snippet Name</Label>
              <Input id="snippet-name" name="snippet-name" placeholder="E.g., Date Table Generator" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="snippet-description">Snippet Description</Label>
              <Textarea 
                id="snippet-description" 
                name="snippet-description" 
                placeholder="Describe what this snippet does and how it's useful" 
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="submitted-by">Submitted By</Label>
              <Input id="submitted-by" name="submitted-by" placeholder="Your name (optional)" />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit">Submit Snippet</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmitSnippetForm;
