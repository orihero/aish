import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  error: string | null;
}

export function ResumeUpload({ onUpload, error }: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
        >
          <div className="mx-auto flex flex-col items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-900">Click to upload your resume</p>
              <p className="text-sm text-gray-500">PDF, DOC, DOCX (max. 5MB)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-500"
            >
              Upload Resume
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}