import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Mail, Phone, MapPin, Globe, Calendar, Briefcase, GraduationCap, Code, Languages, Award } from "lucide-react";
import { format, isValid } from "date-fns";

interface ResumeData {
  _id: string;
  name: string;
  userId: string;
  cvFile: {
    url: string;
    filename: string;
  };
  parsedData: {
    basics: {
      name: string;
      label: string;
      image?: string;
      email: string;
      phone: string;
      url?: string;
      summary?: string;
      location?: {
        address?: string;
        postalCode?: string;
        city?: string;
        region?: string;
        countryCode?: string;
      };
      profiles?: {
        network: string;
        username: string;
        url: string;
      }[];
    };
    work?: {
      name: string;
      position: string;
      url?: string;
      startDate: string;
      endDate?: string;
      summary?: string;
      highlights?: string[];
      location?: string;
    }[];
    education?: {
      institution: string;
      url?: string;
      area: string;
      studyType: string;
      startDate: string;
      endDate?: string;
      gpa?: string;
      courses?: string[];
    }[];
    skills?: {
      name: string;
      level?: string;
      keywords?: string[];
    }[];
    languages?: {
      language: string;
      fluency: string;
    }[];
    projects?: {
      name: string;
      description?: string;
      highlights?: string[];
      keywords?: string[];
      startDate?: string;
      url?: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

export function ResumePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: resume, isLoading, error } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      const { data } = await api.get(`/resumes/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM yyyy") : dateString;
  };

  const formatLocation = (location?: ResumeData["parsedData"]["basics"]["location"]) => {
    if (!location) return null;
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.countryCode) parts.push(location.countryCode);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const handleDownload = () => {
    if (resume?.cvFile?.url) {
      window.open(resume.cvFile.url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume not found</h1>
          <p className="text-gray-600 mb-6">The resume you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { parsedData } = resume;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Resume Preview</h1>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Basic Information */}
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-start gap-6">
              {parsedData.basics.image && (
                <img
                  src={parsedData.basics.image}
                  alt={parsedData.basics.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              )}
              <div className="flex-1">
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  {parsedData.basics.name}
                </CardTitle>
                {parsedData.basics.label && (
                  <p className="text-lg text-gray-600 mb-4">{parsedData.basics.label}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{parsedData.basics.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{parsedData.basics.phone}</span>
                  </div>
                  {formatLocation(parsedData.basics.location) && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{formatLocation(parsedData.basics.location)}</span>
                    </div>
                  )}
                  {parsedData.basics.url && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a href={parsedData.basics.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Summary */}
            {parsedData.basics.summary && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
                <p className="text-gray-700 leading-relaxed">{parsedData.basics.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {parsedData.work && parsedData.work.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {parsedData.work.map((job: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.position}</h3>
                          <p className="text-gray-600">{job.name}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(job.startDate)} - {job.endDate ? formatDate(job.endDate) : 'Present'}
                          </div>
                          {job.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {job.summary && (
                        <p className="text-gray-700 mb-2">{job.summary}</p>
                      )}
                      {job.highlights && job.highlights.length > 0 && (
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {job.highlights.map((highlight: any, idx: number) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h2>
                <div className="space-y-4">
                  {parsedData.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-4 border-green-200 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.studyType} in {edu.area}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                          </div>
                          {edu.gpa && (
                            <div className="mt-1">GPA: {edu.gpa}</div>
                          )}
                        </div>
                      </div>
                      {edu.courses && edu.courses.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Relevant Coursework:</p>
                          <div className="flex flex-wrap gap-2">
                            {edu.courses.map((course: any, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {parsedData.skills && parsedData.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parsedData.skills.map((skill: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        {skill.level && (
                          <Badge variant="secondary" className="text-xs">
                            {skill.level}
                          </Badge>
                        )}
                      </div>
                      {skill.keywords && skill.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {skill.keywords.map((keyword: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {parsedData.languages && parsedData.languages.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Languages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {parsedData.languages.map((lang: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-900">{lang.language}</span>
                      <Badge variant="secondary" className="text-xs">
                        {lang.fluency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {parsedData.projects && parsedData.projects.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Projects
                </h2>
                <div className="space-y-4">
                  {parsedData.projects.map((project: any, index: number) => (
                    <div key={index} className="border-l-4 border-purple-200 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                              View Project
                            </a>
                          )}
                        </div>
                        {project.startDate && (
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(project.startDate)}
                            </div>
                          </div>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-gray-700 mb-2">{project.description}</p>
                      )}
                      {project.highlights && project.highlights.length > 0 && (
                        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-2">
                          {project.highlights.map((highlight: any, idx: number) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                      {project.keywords && project.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.keywords.map((keyword: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Profiles */}
            {parsedData.basics.profiles && parsedData.basics.profiles.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Profiles</h2>
                <div className="flex flex-wrap gap-3">
                  {parsedData.basics.profiles.map((profile: any, index: number) => (
                    <a
                      key={index}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">{profile.network}</span>
                      <span className="text-gray-600">@{profile.username}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </div>
  );
}
