import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: { name: string; size: string } | null) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  maxSizeMB = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileProcess = (file: File) => {
    setError(null);

    // Validate type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Only PDF and JPEGs/PNGs are accepted.`);
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the limit of ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          onFileSelect({
            name: file.name,
            size: formatFileSize(file.size),
          });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setUploadProgress(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full mb-4 text-left">
      <label className="block text-xs font-semibold text-primary-text/80 uppercase tracking-wider mb-1.5">
        Upload Verification Document
      </label>
      
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-walnut bg-cream/20 scale-[0.99]' 
              : 'border-taupe/40 bg-white hover:border-mocha hover:bg-bg-base'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
          <UploadCloud className="mx-auto h-10 w-10 text-mocha mb-3" />
          <p className="text-sm font-medium text-primary-text mb-1">
            Drag & drop your document here, or <span className="text-walnut font-semibold underline">browse</span>
          </p>
          <p className="text-xs text-secondary-text">
            Supports PDF, JPEG, PNG up to {maxSizeMB}MB
          </p>
          {error && (
            <p className="mt-3 text-xs text-rejected font-medium flex items-center justify-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rejected mr-1.5"></span>
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="border border-taupe/30 rounded-lg p-4 bg-white shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0 mr-4">
            <div className="p-2.5 rounded-lg bg-cream/30 text-walnut">
              <File size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-text truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-secondary-text">
                {formatFileSize(selectedFile.size)}
              </p>
              
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="w-full bg-taupe/20 rounded-full h-1.5 mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="bg-walnut h-1.5 rounded-full"
                  />
                </div>
              )}
              {uploadProgress === 100 && (
                <span className="text-[10px] bg-success-light text-success font-semibold px-2 py-0.5 rounded-full mt-2 inline-flex items-center">
                  <Check size={10} className="mr-1" /> Upload Completed
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 rounded-full text-secondary-text hover:bg-rejected/10 hover:text-rejected transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
