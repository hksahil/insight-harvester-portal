import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, LockIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processedFilesCount, setProcessedFilesCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserUsage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please sign in to upload files');
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('user_usage')
        .select('processed_files_count, is_premium')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user usage:', error);
        return;
      }

      setProcessedFilesCount(data?.processed_files_count || 0);
      setIsPremium(data?.is_premium || false);
    };

    fetchUserUsage();
  }, [navigate]);

  const updateUserFileCount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { error } = await supabase
      .from('user_usage')
      .update({ processed_files_count: processedFilesCount + 1 })
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating file count:', error);
    }
  };

  const handleFileProcess = async (files: FileList) => {
    setError(null);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please sign in to upload files');
      navigate('/auth');
      return;
    }

    if (processedFilesCount >= 5 && !isPremium) {
      toast.error('You have reached the limit of 5 free file uploads. Please upgrade to premium.');
      return;
    }

    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.vpax')) {
        setFileName(file.name);
        onFileUpload(file);
        
        // Update file count
        await updateUserFileCount();
        setProcessedFilesCount(prev => prev + 1);
        
        toast.success('File uploaded successfully');
      } else {
        setError('Please upload a .vpax file');
        toast.error('Please upload a .vpax file');
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
    if (processedFilesCount >= 5 && !isPremium) {
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
            
            <button 
              onClick={() => navigate('/premium')} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Upgrade to Premium
            </button>
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
              {fileName}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Drag and drop your .vpax file here, or click to browse
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
      className={`animate-fade-in mt-8 w-full max-w-2xl mx-auto border-2 ${
        isDragging ? 'border-primary border-dashed bg-primary/5' : 
        error ? 'border-dashed border-destructive/50' : 'border-dashed border-border'
      } rounded-lg p-10 text-center transition-all-ease hover:border-primary/50`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {renderUploadContent()}
      </div>
    </div>
  );
};

export default FileUploader;
