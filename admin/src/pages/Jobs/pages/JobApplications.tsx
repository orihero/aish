import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useApplicationsStore } from "@/stores/application.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { MessageSquare, CheckCircle2, XCircle } from "lucide-react";

interface Application {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  resume: {
    _id: string;
    name: string;
  };
  status: "pending" | "reviewed" | "accepted" | "rejected";
  chat: {
    _id: string;
  };
  appliedAt: string;
  updatedAt: string;
}

export function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { updateApplication } = useApplicationsStore();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["jobApplications", jobId],
    queryFn: async () => {
      const { data } = await api.get(`/applications/me`);
      return data;
    },
  });

  const handleStatusChange = async (applicationId: string, status: Application["status"]) => {
    try {
      await updateApplication(applicationId, status);
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const handleChatClick = (application: Application) => {
    navigate(`/applications/${application._id}/chat`);
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Job Applications</h1>
      <div className="grid gap-4">
        {applications?.map((application: Application) => (
          <Card key={application._id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <p className="text-lg">{application.user.name}</p>
                  <p className="text-sm text-gray-500">
                    Applied on {format(new Date(application.appliedAt), "PPP")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      application.status === "accepted"
                        ? "success"
                        : application.status === "rejected"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {application.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChatClick(application)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(application._id, "accepted")}
                  disabled={application.status === "accepted"}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(application._id, "rejected")}
                  disabled={application.status === "rejected"}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 