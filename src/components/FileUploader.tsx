
import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

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
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.vpax')) {
        setFileName(file.name);
        onFileUpload(file);
        toast.success('File uploaded successfully');
      } else {
        toast.error('Please upload a .vpax file');
      }
    }
  };

  return (
    <div 
      className={`animate-fade-in mt-8 w-full max-w-2xl mx-auto border-2 ${
        isDragging ? 'border-primary border-dashed bg-primary/5' : 'border-dashed border-border'
      } rounded-lg p-10 text-center transition-all-ease hover:border-primary/50`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-primary/10 rounded-full">
          {fileName ? (
            <FileText className="h-12 w-12 text-primary" />
          ) : (
            <Upload className="h-12 w-12 text-primary" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {fileName ? 'File ready for processing' : 'Upload VPAX File'}
          </h3>
          
          {fileName ? (
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {fileName}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Drag and drop your .vpax file here, or click to browse
            </p>
          )}
        </div>
        
        <label className="btn btn-primary px-4 py-2 cursor-pointer">
          {fileName ? 'Choose another file' : 'Browse Files'}
          <input 
            type="file" 
            accept=".vpax" 
            className="hidden" 
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
