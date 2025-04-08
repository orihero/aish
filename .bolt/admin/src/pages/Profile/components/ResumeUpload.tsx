import { useState, useRef } from 'react';
import { FileText, Upload } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface ResumeUploadProps {
  onUpload: (name: string, file: File) => Promise<void>;
  error?: string;
}

export function ResumeUpload({ onUpload, error }: ResumeUploadProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setSelectedFile(file);
      setName(file.name.replace(/\.[^/.]+$/, '')); // Remove file extension
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && name) {
      await onUpload(name, selectedFile);
      setSelectedFile(null);
      setName('');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-500'
          }`}
        >
          <div className="mx-auto w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload your resume
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your resume here, or click to browse
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Browse Files
          </button>

          <p className="text-xs text-gray-500 mt-2">
            Supported formats: PDF, DOC, DOCX (up to 5MB)
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                placeholder="Enter resume name"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}