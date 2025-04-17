import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isValid } from "date-fns";
import { MessageSquare, Building2, FileText, Calendar } from "lucide-react";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: {
      name: string;
      logo?: string;
    };
    location: string;
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
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["jobApplications", jobId],
    queryFn: async () => {
      const { data } = await api.get(`/applications/me`);
      return data;
    },
  });

  const handleChatClick = (application: Application) => {
    if (application.chat?._id) {
      navigate(`/chats/${application.chat._id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PPP") : "Invalid date";
  };

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Total: {applications?.length || 0}
          </Badge>
        </div>
      </div>
      <div className="grid gap-4">
        {applications?.map((application: Application) => (
          <Card key={application._id} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{application.job.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building2 className="h-4 w-4" />
                    {application.job.company.name}
                  </div>
                </div>
                <Badge className={`${getStatusColor(application.status)} px-2 py-0.5 text-xs`}>
                  {application.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{application.resume.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Applied: {formatDate(application.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChatClick(application)}
                    className="flex items-center gap-2"
                    disabled={!application.chat?._id}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 