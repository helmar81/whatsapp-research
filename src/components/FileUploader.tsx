import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.txt')) {
        onFileUpload(file);
      } else {
        alert("Please upload a .txt file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div 
        className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-whatsapp hover:bg-green-50 dark:hover:bg-gray-800 transition-colors cursor-pointer bg-white dark:bg-gray-800 shadow-sm"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex justify-center">
          <UploadCloud className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Upload WhatsApp Chat</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Drag and drop your .txt file here, or click to browse
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          (Export from WhatsApp &gt; Chat Info &gt; Export Chat &gt; Without Media)
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".txt" 
          onChange={handleFileChange}
        />
        <div className="mt-6">
           <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-whatsapp hover:bg-whatsapp-dark shadow-sm">
             Choose File
           </span>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;