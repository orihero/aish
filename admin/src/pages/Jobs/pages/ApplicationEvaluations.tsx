import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { ArrowLeft, Star, BarChart3, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// interface EvaluationItem {
//   name: string;
//   score: number;
//   scoreBase: number;
// }

// interface Evaluation {
//   name: string;
//   totalScore: number;
//   scoreBase: number;
//   items: EvaluationItem[];
// }

/*
interface ApplicationEvaluation {
  _id: string;
  status: string;
  evaluations: Evaluation[];
  evaluationSummary: string;
  totalEvaluationScore: number;
  job: {
    _id: string;
    title: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    location: any;
    workType: string;
  };
  resume: {
    _id: string;
    name: string;
    title: string;
    parsedData: any;
  };
  chat: {
    _id: string;
    status: string;
    score: number;
    feedback: string;
    messages: any[];
  } | null;
  appliedAt: string;
  updatedAt: string;
}
*/

export function ApplicationEvaluations() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { data: application, isLoading } = useQuery({
    queryKey: ["applicationEvaluations", applicationId],
    queryFn: async () => {
      const { data } = await api.get(`/applications/${applicationId}/evaluations`);
      return data;
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getTotalScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy 'at' HH:mm") : "Invalid date";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Application not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Application Evaluations</h1>
          <p className="text-gray-600">
            {application.resume.name} - {application.job.title}
          </p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Overall Evaluation</h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getTotalScoreColor(application.totalEvaluationScore)}`}>
            <Star className="w-5 h-5" />
            <span className="font-bold text-xl">{application.totalEvaluationScore}/100</span>
          </div>
        </div>
        
        {application.evaluationSummary && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">AI Summary</h3>
            <p className="text-gray-700">{application.evaluationSummary}</p>
          </div>
        )}
      </div>

      {/* Detailed Evaluations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Detailed Evaluations</h2>
        
        {application.evaluations?.map((evaluation: any, index: number) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{evaluation.name}</h3>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreColor(evaluation.totalScore)}`}>
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">{evaluation.totalScore}/{evaluation.scoreBase}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {evaluation.items.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{item.name}</span>
                  <div className={`flex items-center gap-2 px-2 py-1 rounded ${getScoreColor(item.score)}`}>
                    <span className="font-medium">{item.score}/{item.scoreBase}</span>
                    {item.score >= 8 && <CheckCircle className="w-4 h-4" />}
                    {item.score < 6 && <XCircle className="w-4 h-4" />}
                    {item.score >= 6 && item.score < 8 && <AlertCircle className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Job Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Job Information</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-gray-900">Title</h3>
            <p className="text-gray-600">{application.job.title}</p>
          </div>
          
          {application.job.description && (
            <div>
              <h3 className="font-medium text-gray-900">Description</h3>
              <p className="text-gray-600">{application.job.description}</p>
            </div>
          )}
          
          {application.job.requirements && application.job.requirements.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900">Requirements</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {application.job.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          {application.job.responsibilities && application.job.responsibilities.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900">Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {application.job.responsibilities.map((resp: string, index: number) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Application Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900">Status</h3>
            <Badge variant="outline" className="mt-1">
              {application.status}
            </Badge>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Applied Date</h3>
            <p className="text-gray-600">{formatDate(application.appliedAt)}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Last Updated</h3>
            <p className="text-gray-600">{formatDate(application.updatedAt)}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Work Type</h3>
            <p className="text-gray-600">{application.job.workType}</p>
          </div>
        </div>
      </div>

      {/* Chat Information */}
      {application.chat && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Interview Chat</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Chat Status</span>
              <Badge variant="outline">{application.chat.status}</Badge>
            </div>
            {application.chat.score !== undefined && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Chat Score</span>
                <span className={`font-medium ${getTotalScoreColor(application.chat.score)}`}>
                  {application.chat.score}/100
                </span>
              </div>
            )}
            {application.chat.feedback && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Chat Feedback</h3>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{application.chat.feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
