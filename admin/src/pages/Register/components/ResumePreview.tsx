import React, { useEffect } from 'react';
import { Download } from 'lucide-react';
import { ResumeData } from '../../Register';
import { useSkillIcons } from '../../../hooks/useSkills';

interface ResumePreviewProps {
  data: ResumeData;
  onDownload?: () => void;
  onContinue?: () => void;
}

export function ResumePreview({ data, onDownload, onContinue }: ResumePreviewProps) {
  const { mutateAsync: lookupSkillIcons, data: skillIcons } = useSkillIcons();
  
  useEffect(() => {
    const skillNames = [
      ...data.skills.map(skill => skill.name),
      ...data.skills.flatMap(skill => skill.keywords || [])
    ];
    if (skillNames.length > 0) {
      lookupSkillIcons(skillNames);
    }
  }, [data.skills, lookupSkillIcons]);

  const getSkillIcon = (skillName: string): string => {
    return skillIcons?.[skillName.toLowerCase()] || '/default-skill.svg';
  };

  const renderEditableField = (value: string | undefined) => {
    if (!value) return null;
    return value;
  };

  return (
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
              onClick={onContinue}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-sm font-medium"
            >
              Continue to Account Details
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full w-full grid grid-cols-[400px,1fr]">
          {/* Left Column - Dark sidebar */}
          <div className="bg-[#0A0A0A] p-8 space-y-10 overflow-y-auto">
            {/* Profile Image and Basic Info */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-gray-800 rounded-full overflow-hidden mb-6">
                {data.basics.image ? (
                  <img src={data.basics.image} alt={data.basics.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
              </div>
              {renderEditableField(data.basics.name)}
              {renderEditableField(data.basics.label)}
              {renderEditableField(data.basics.email)}
              {renderEditableField(data.basics.phone)}
              {(data.basics.location?.city || data.basics.location?.countryCode) && (
                <div className="text-gray-400">
                  {renderEditableField(data.basics.location?.city || '')}
                  {data.basics.location?.city && data.basics.location?.countryCode && ', '}
                  {renderEditableField(data.basics.location?.countryCode || '')}
                </div>
              )}
            </div>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <h3 className="text-xs uppercase text-gray-500 mb-6">Skills</h3>
                <div className="space-y-4">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={getSkillIcon(skill.name)}
                        alt={skill.name}
                        className="w-8 h-8 bg-gray-800 rounded-lg p-1"
                      />
                      <span className="text-lg">{skill.name}</span>
                      {skill.level && (
                        <span className="text-gray-500 text-sm ml-auto">{skill.level}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {data.skills && data.skills.some(skill => Array.isArray(skill.keywords) && skill.keywords.length > 0) && (
              <div>
                <h3 className="text-xs uppercase text-gray-500 mb-6">Keywords</h3>
                <div className="flex flex-wrap gap-3">
                  {data.skills
                    .flatMap(skill => 
                      (Array.isArray(skill.keywords) ? skill.keywords : []).map(keyword => ({
                        name: keyword,
                        icon: getSkillIcon(keyword)
                      }))
                    )
                    .map((keyword, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                        <img
                          src={keyword.icon}
                          alt={keyword.name}
                          className="w-5 h-5"
                        />
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
                  {renderEditableField(data.basics.summary)}
                </div>
              )}

              {/* Experience */}
              {data.work.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-8">Professional Experience</h3>
                  <div className="space-y-10">
                    {data.work.map((job, index) => (
                      <div key={index}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            {renderEditableField(job.position)}
                            {renderEditableField(job.name)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {renderEditableField(job.startDate)}
                            {job.startDate && (job.endDate || 'Present') && ' - '}
                            {renderEditableField(job.endDate || 'Present')}
                          </div>
                        </div>
                        {renderEditableField(job.summary)}
                        {job.technologies?.length > 0 && (
                          <div className="flex gap-3">
                            {job.technologies.map((tech, techIndex) => (
                              <div key={techIndex} className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                                <img src={`/icons/${tech.toLowerCase()}.svg`} alt={tech} className="w-5 h-5" />
                                {renderEditableField(tech)}
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
              {data.education.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-8">Education</h3>
                  <div className="space-y-8">
                    {data.education.map((edu, index) => (
                      <div key={index}>
                        {renderEditableField(edu.institution)}
                        {renderEditableField(edu.studyType)}
                        {renderEditableField(edu.area)}
                        <div className="text-sm text-gray-400 mt-2">
                          {renderEditableField(edu.startDate)}
                          {edu.startDate && (edu.endDate || 'Present') && ' - '}
                          {renderEditableField(edu.endDate || 'Present')}
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
                    {data.projects.map((project, index) => (
                      <div key={index}>
                        {renderEditableField(project.name)}
                        {renderEditableField(project.description || '')}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-500 hover:text-cyan-400"
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
  );
}