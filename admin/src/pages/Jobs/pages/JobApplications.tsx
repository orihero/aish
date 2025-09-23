import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { MessageSquare, ArrowUpDown, Eye, CheckCircle, XCircle } from "lucide-react";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: {
      name: string;
      logo?: string;
    };
    location: {
      country: string;
      city: string;
      address?: string;
      type: string;
    };
    type: string;
  };
  resume: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  status: "pending" | "reviewed" | "accepted" | "rejected";
  chat: {
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function JobApplications() {
  const { jobId, id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  
  // Use jobId from /jobs/:id/applications or id from the same route
  const actualJobId = jobId || id;
  
  // Determine if this is for a specific job or user's own applications
  const isJobSpecific = Boolean(actualJobId);

  const { data: applications, isLoading } = useQuery({
    queryKey: isJobSpecific ? ["jobApplications", actualJobId] : ["myApplications"],
    queryFn: async () => {
      const endpoint = isJobSpecific ? `/applications/job/${actualJobId}` : `/applications/me`;
      const { data } = await api.get(endpoint);
      return data;
    },
  });

  const handleChatClick = (application: Application) => {
    if (application.chat?._id) {
      navigate(`/chats/${application.chat._id}`);
    }
  };

  const handleInvite = async (application: Application) => {
    const actionKey = `invite-${application._id}`;
    setLoadingActions(prev => new Set(prev).add(actionKey));
    
    try {
      await api.patch(`/applications/${application._id}`, { status: 'accepted' });
      // Invalidate and refetch the applications data
      queryClient.invalidateQueries({
        queryKey: isJobSpecific ? ["jobApplications", actualJobId] : ["myApplications"]
      });
    } catch (error) {
      console.error('Failed to invite candidate :', error);
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  const handleReject = async (application: Application) => {
    const actionKey = `reject-${application._id}`;
    setLoadingActions(prev => new Set(prev).add(actionKey));
    
    try {
      await api.patch(`/applications/${application._id}`, { status: 'rejected' });
      // Invalidate and refetch the applications data
      queryClient.invalidateQueries({
        queryKey: isJobSpecific ? ["jobApplications", actualJobId] : ["myApplications"]
      });
    } catch (error) {
      console.error('Failed to reject candidate:', error);
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  const handlePreviewResume = (application: Application) => {
    // Navigate to resume preview
    navigate(`/resumes/${application.resume._id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  const formatLocation = (location: Application["job"]["location"]) => {
    if (typeof location === 'string') {
      return location;
    }
    if (location && typeof location === 'object') {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.country) parts.push(location.country);
      return parts.length > 0 ? parts.join(', ') : 'Location not specified';
    }
    return 'Location not specified';
  };

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 text-emerald-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      case "reviewed":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isJobSpecific ? "Job Applications" : "My Applications"}
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Total: {applications?.length || 0}
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-12 px-6 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                <button className="flex items-center gap-2">
                  CANDIDATE
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">JOB</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">COMPANY</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">STATUS</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">APPLIED</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : applications?.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            ) : applications?.map((application: Application) => (
              <tr key={application._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-sm font-medium">
                        {application.resume.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{application.resume.name}</div>
                      <div className="text-sm text-gray-500">{application.resume.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{application.job.title}</div>
                  <div className="text-sm text-gray-500">{formatLocation(application.job.location)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {application.job.company.logo && (
                      <img 
                        src={application.job.company.logo} 
                        alt={application.job.company.name}
                        className="w-6 h-6 rounded"
                      />
                    )}
                    <span className="text-gray-900">{application.job.company.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(application.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreviewResume(application)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Preview Resume"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleChatClick(application)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Chat"
                      disabled={!application.chat?._id}
                    >
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleInvite(application)}
                      className="p-1 hover:bg-green-100 rounded disabled:opacity-50"
                      title="Invite"
                      disabled={application.status === 'accepted' || loadingActions.has(`invite-${application._id}`)}
                    >
                      {loadingActions.has(`invite-${application._id}`) ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(application)}
                      className="p-1 hover:bg-red-100 rounded disabled:opacity-50"
                      title="Reject"
                      disabled={application.status === 'rejected' || loadingActions.has(`reject-${application._id}`)}
                    >
                      {loadingActions.has(`reject-${application._id}`) ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 