import axios from 'axios';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useSkillIcons } from '../../../hooks/useSkills';
import { ResumeData } from '../../Register';
import { RegistrationModal } from './RegistrationModal';

interface ResumePreviewProps {
  data: ResumeData;
  resumeFile?: {
    url: string;
    filename: string;
  };
  onDownload?: () => void;
  onContinue?: () => void;
}

interface WorkExperience {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  name: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  url?: string;
}

interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

interface Keyword {
  name: string;
  icon: string;
}

export function ResumePreview({ data, resumeFile, onDownload }: ResumePreviewProps) {
  const { mutateAsync: lookupSkillIcons, data: skillIcons } = useSkillIcons();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  console.log('ResumePreview received data:', data);

  useEffect(() => {
    const skillNames = [
      ...data.skills.map((skill: Skill) => skill.name.toLowerCase()),
      ...data.skills.flatMap((skill: Skill) => (skill.keywords || []).map(k => k.toLowerCase()))
    ];
    if (skillNames.length > 0) {
      lookupSkillIcons(skillNames);
    }
  }, [data.skills, lookupSkillIcons]);

  const getSkillIcon = (skillName: string): string => {
    return skillIcons?.[skillName.toLowerCase()] || '/default-skill.svg';
  };

  const renderEditableField = (value: string | undefined) => {
    if (!value || value.trim() === '') return null;
    return value;
  };

  // Early return with loading state if data is not properly initialized
  if (!data || !data.basics) {
    return (
      <div className="fixed inset-0 bg-[#111] text-white flex flex-col items-center justify-center">
        <div className="text-xl">Loading resume data...</div>
      </div>
    );
  }

  const handleContinue = () => {
    setShowRegistrationModal(true);
  };

  const handleRegistration = async (registrationData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!resumeFile) {
        throw new Error('Resume file information is missing');
      }

      // Create a copy of resumeData with the registration email
      const updatedResumeData = {
        ...data,
        basics: {
          ...data.basics,
          email: registrationData.email
        }
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register-with-resume`, {
        ...registrationData,
        resumeData: updatedResumeData,
        resumeFile
      });

      // Login the user
      login(response.data.token);

      // Redirect to jobs page for employees
      navigate('/jobs');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to register. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#111] text-white flex flex-col">
        {/* Header with actions */}
        <div className="border-b border-gray-800">
          <div className="w-full px-6 flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Resume Preview</h1>
            <div className="flex gap-4">
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-sm font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
        {error && (
          <div className="px-6 py-2 bg-red-500 text-white text-sm">
            {error}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="h-full w-full grid grid-cols-[400px,1fr]">
            {/* Left Column - Dark sidebar */}
            <div className="bg-[#0A0A0A] p-8 space-y-10 overflow-y-auto">
              {/* Profile Image and Basic Info */}
              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-gray-800 rounded-full overflow-hidden mb-6">
                  {data.basics.image ? (
                    <img src={data.basics.image} alt={data.basics.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                  )}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{renderEditableField(data.basics.name)}</h2>
                  <p className="text-lg text-gray-400">{renderEditableField(data.basics.label)}</p>
                  <p className="text-cyan-500">{renderEditableField(data.basics.email)}</p>
                  <p>{renderEditableField(data.basics.phone)}</p>
                  {(data.basics.location?.city || data.basics.location?.countryCode) && (
                    <p className="text-gray-400">
                      {renderEditableField(data.basics.location?.city)}
                      {data.basics.location?.city && data.basics.location?.countryCode && ', '}
                      {renderEditableField(data.basics.location?.countryCode)}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills */}
              {data.skills && data.skills.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase text-gray-500 mb-6">Skills</h3>
                  <div className="space-y-4">
                    {data.skills.map((skill: Skill, index: number) => {
                      const skillIcon = getSkillIcon(skill.name);
                      return (
                        <div key={index} className="flex items-center gap-3">
                          {skillIcon !== '/default-skill.svg' && (
                            <img
                              src={skillIcon}
                              alt={skill.name}
                              className="w-8 h-8 bg-gray-800 rounded-lg p-1"
                            />
                          )}
                          <span className="text-lg">{skill.name}</span>
                          {skill.level && (
                            <span className="text-gray-500 text-sm ml-auto">{skill.level}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {data.skills && data.skills.some((skill: Skill) => skill.keywords && skill.keywords.length > 0) && (
                <div>
                  <h3 className="text-xs uppercase text-gray-500 mb-6">Keywords</h3>
                  <div className="flex flex-wrap gap-3">
                    {data.skills
                      .flatMap((skill: Skill) =>
                        (skill.keywords || []).map((keyword: string) => ({
                          name: keyword,
                          icon: getSkillIcon(keyword)
                        }))
                      )
                      .map((keyword: Keyword, index: number) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                          {keyword.icon !== '/default-skill.svg' && (
                            <img
                              src={keyword.icon}
                              alt={keyword.name}
                              className="w-5 h-5"
                            />
                          )}
                          <span className="text-sm">{keyword.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Main content */}
            <div className="p-12 overflow-y-auto">
              <div className="max-w-3xl space-y-12">
                {/* Professional Summary */}
                {data.basics.summary && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">Professional Summary</h3>
                    <p className="text-gray-300">{renderEditableField(data.basics.summary)}</p>
                  </div>
                )}

                {/* Experience */}
                {data.work && data.work.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-8">Professional Experience</h3>
                    <div className="space-y-10">
                      {data.work.map((job: WorkExperience, index: number) => (
                        <div key={index} className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xl font-medium">{renderEditableField(job.position)}</h4>
                              <p className="text-gray-400">{renderEditableField(job.name)}</p>
                            </div>
                            <div className="text-sm text-gray-400">
                              {renderEditableField(job.startDate)}
                              {job.startDate && (job.endDate || 'Present') && ' - '}
                              {renderEditableField(job.endDate || 'Present')}
                            </div>
                          </div>
                          {job.summary && <p className="text-gray-300">{job.summary}</p>}
                          {job.highlights && job.highlights.length > 0 && (
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                              {job.highlights.map((highlight: string, i: number) => (
                                <li key={i}>{highlight}</li>
                              ))}
                            </ul>
                          )}
                          {job.technologies && job.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                              {job.technologies.map((tech: string, techIndex: number) => (
                                <div key={techIndex} className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                                  <img src={getSkillIcon(tech)} alt={tech} className="w-5 h-5" />
                                  <span className="text-sm">{tech}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-8">Education</h3>
                    <div className="space-y-8">
                      {data.education.map((edu: Education, index: number) => (
                        <div key={index} className="space-y-2">
                          <h4 className="text-xl font-medium">{renderEditableField(edu.institution)}</h4>
                          <p className="text-gray-300">
                            {renderEditableField(edu.studyType)}
                            {edu.studyType && edu.area && ' in '}
                            {renderEditableField(edu.area)}
                          </p>
                          <div className="text-sm text-gray-400">
                            {renderEditableField(edu.startDate)}
                            {edu.startDate && (edu.endDate || 'Present') && ' - '}
                            {renderEditableField(edu.endDate || 'Present')}
                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-8">Projects</h3>
                    <div className="space-y-8">
                      {data.projects.map((project: Project, index: number) => (
                        <div key={index} className="space-y-3">
                          <h4 className="text-xl font-medium">{renderEditableField(project.name)}</h4>
                          {project.description && <p className="text-gray-300">{project.description}</p>}
                          {project.highlights && project.highlights.length > 0 && (
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                              {project.highlights.map((highlight: string, i: number) => (
                                <li key={i}>{highlight}</li>
                              ))}
                            </ul>
                          )}
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-500 hover:text-cyan-400 inline-block"
                            >
                              View Project
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmit={handleRegistration}
        defaultEmail={data.basics.email}
        defaultName={data.basics.name}
        isLoading={isLoading}
      />
    </>
  );
}