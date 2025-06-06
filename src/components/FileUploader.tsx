import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, LockIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserUsage } from '@/hooks/useUserUsage';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileUpload: (file: File, fileType: 'vpax' | 'pbix') => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'vpax' | 'pbix' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { usage, loading, incrementFileCount, isLimitReached } = useUserUsage();

  const handleFileProcess = async (files: FileList) => {
    setError(null);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please sign in to upload files');
      navigate('/auth');
      return;
    }

    // Check if user has reached the limit
    if (usage && !usage.is_premium && (usage.processed_files_count >= 5)) {
      toast.error('You have reached the limit of 5 free file uploads. Please upgrade to premium.');
      navigate('/premium');
      return;
    }

    if (files.length > 0) {
      const file = files[0];
      
      // Only accept VPAX files
      if (file.name.endsWith('.vpax')) {
        setFileName(file.name);
        setFileType('vpax');
        
        try {
          // Process file first
          onFileUpload(file, 'vpax');
          
          // Increment count only AFTER successful processing
          const success = await incrementFileCount();
          if (!success) {
            toast.error('Failed to update file count');
          } else {
            toast.success('VPAX file uploaded and processed successfully');
          }
        } catch (error) {
          toast.error('Error processing file: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      } else {
        setError('Please upload a .vpax file only');
        toast.error('Please upload a .vpax file only');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileProcess(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileProcess(files);
    }
  };

  const renderUploadContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    const isAtLimit = usage && !usage.is_premium && (usage.processed_files_count >= 5);

    if (isAtLimit) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-destructive/10">
            <LockIcon className="h-12 w-12 text-destructive" />
          </div>
          
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-medium text-destructive">
              File Upload Limit Reached
            </h3>
            
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              You have used all 5 free file uploads. Upgrade to premium to continue.
            </p>
            
            <Button 
              onClick={() => navigate('/premium')} 
              className="mt-4"
              variant="default"
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${error ? 'bg-destructive/10' : fileName ? 'bg-primary/10' : 'bg-primary/10'}`}>
          {error ? (
            <AlertCircle className="h-12 w-12 text-destructive" />
          ) : fileName ? (
            <FileText className="h-12 w-12 text-primary" />
          ) : (
            <Upload className="h-12 w-12 text-primary" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {error ? 'Invalid File Type' : fileName ? 'File ready for processing' : 'Upload VPAX File'}
          </h3>
          
          {error ? (
            <p className="text-sm text-destructive max-w-xs mx-auto">
              {error}
            </p>
          ) : fileName ? (
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {fileName} (VPAX)
            </p>
          ) : (
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {usage && !usage.is_premium ? 
                `${5 - (usage.processed_files_count || 0)} free uploads remaining` : 
                'Drag and drop your .vpax file here, or click to browse'}
            </p>
          )}
        </div>
        
        <label className={`btn ${error ? 'bg-destructive hover:bg-destructive/90' : 'btn-primary'} px-4 py-2 cursor-pointer`}>
          {error ? 'Try again' : fileName ? 'Choose another file' : 'Browse Files'}
          <input 
            type="file" 
            accept=".vpax" 
            className="hidden" 
            onChange={handleFileInput}
          />
        </label>
      </div>
    );
  };

  return (
    <div 
      className={`animate-fade-in w-full max-w-2xl mx-auto border-2 ${
        isDragging ? 'border-primary border-dashed bg-primary/5' : 
        error ? 'border-dashed border-destructive/50' : 'border-dashed border-border'
      } rounded-lg p-10 text-center transition-all-ease hover:border-primary/50`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {renderUploadContent()}
    </div>
  );
};

export default FileUploader;
