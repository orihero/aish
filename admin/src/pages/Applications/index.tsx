import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch applications from API
    setApplications([
      {
        id: '1',
        jobTitle: 'Senior React Developer',
        company: 'Tech Solutions Inc',
        appliedDate: '2024-03-15',
        status: 'pending'
      },
      {
        id: '2',
        jobTitle: 'Frontend Engineer',
        company: 'Digital Innovations',
        appliedDate: '2024-03-10',
        status: 'reviewed'
      },
      {
        id: '3',
        jobTitle: 'Full Stack Developer',
        company: 'Global Systems',
        appliedDate: '2024-03-05',
        status: 'accepted'
      }
    ]);
    setIsLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'reviewed':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
        <p className="mt-1 text-gray-600">
          Track the status of your job applications
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't applied to any jobs yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map((application) => (
              <div
                key={application.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {application.jobTitle}
                    </h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span>{application.company}</span>
                      <span>•</span>
                      <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="capitalize">{application.status}</span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}