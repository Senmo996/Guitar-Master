import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface TabUploaderProps {
  onFileSelect: (file: File) => void;
  accept: {
    [key: string]: string[];
  };
  maxSize?: number;
}

export const TabUploader: React.FC<TabUploaderProps> = ({ 
  onFileSelect, 
  accept, 
  maxSize = 5242880 // 5MB default
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive ? (
          '松开以上传文件...'
        ) : (
          <>
            拖动文件到这里
            <br />
            <span className="text-xs text-gray-500">
              支持格式：PDF，PNG，JPG（最大 {Math.round(maxSize / 1048576)}MB)
            </span>
          </>
        )}
      </p>
    </div>
  );
};