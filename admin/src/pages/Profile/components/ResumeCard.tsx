import { FileText, Download, Trash2, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

interface ResumeCardProps {
  resume: {
    id: string;
    name: string;
    cvFile: {
      url: string;
      filename: string;
    };
    applications: {
      id: string;
      vacancy: {
        title: string;
        company: string;
      };
      status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
      appliedAt: string;
    }[];
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'reviewed':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700';
      case 'reviewed':
        return 'bg-blue-50 text-blue-700';
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{resume.name}</h3>
            <p className="text-sm text-gray-500">
              {t('resume.uploadedOn')} {new Date(resume.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={resume.cvFile.url}
            download={resume.cvFile.filename}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Download className="h-5 w-5" />
          </a>
          <button
            onClick={() => onDelete(resume.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-50 rounded-lg"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {resume.applications.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">{t('resume.applications')}</h4>
          <div className="space-y-3">
            {resume.applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {application.vacancy.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {application.vacancy.company}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(application.status)}`}>
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{t(`resume.status.${application.status}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}