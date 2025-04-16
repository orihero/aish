import { FileText, Trash2, Download } from 'lucide-react';

interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
}

interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => void;
}

export const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => {
  const handleDownload = () => {
    window.open(resume.fileUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{resume.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
            title="Download"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(resume.id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};