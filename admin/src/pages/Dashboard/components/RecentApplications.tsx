interface Application {
  candidate: {
    name: string;
    email: string;
  };
  status: string;
  appliedAt: string;
}

interface RecentApplicationsProps {
  applications: Application[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'reviewed': return 'bg-blue-50 text-blue-700';
      case 'accepted': return 'bg-emerald-50 text-emerald-700';
      case 'rejected': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-[#625F6E]">Recent Applications</h2>
          <p className="text-sm text-gray-500">Latest candidates</p>
        </div>
      </div>
      <div className="space-y-4">
        {applications.map((application, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{application.candidate.name}</h3>
              <p className="text-sm text-gray-500">{application.candidate.email}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
              <span className="capitalize">{application.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}