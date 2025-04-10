import { useState } from 'react';
import { Download } from 'lucide-react';
import type { Resume } from '../../../stores/resumes.store';

interface ResumePreviewProps {
  data: Resume['parsedData'];
  onEdit: (section: string, data: any) => void;
  onDownload?: () => void;
  onContinue: () => void;
}

export function ResumePreview({ data, onEdit, onDownload, onContinue }: ResumePreviewProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  return (
    <div className="bg-[#111] text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-8">
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
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="mb-12">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-cyan-400 mb-2">
                {data.basics.name || 'Your Name'}
              </h2>
              <div className="text-xl text-gray-400 mb-4">
                {data.basics.label || 'Professional Title'}
              </div>
              <div className="text-gray-400 space-y-1">
                <div>{data.basics.email}</div>
                <div>{data.basics.phone}</div>
                <div>{data.basics.location?.city}, {data.basics.location?.country}</div>
              </div>
            </div>
            <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
              {data.basics.image ? (
                <img src={data.basics.image} alt={data.basics.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-gray-600">No Image</div>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Skills</h3>
            <button
              onClick={() => setEditingSection('skills')}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill, index) => (
              <div key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                <span className="font-medium">{skill.name}</span>
                {skill.level && (
                  <span className="text-gray-400"> • {skill.level}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Experience</h3>
            <button
              onClick={() => setEditingSection('work')}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Edit
            </button>
          </div>
          <div className="space-y-6">
            {data.work?.map((job, index) => (
              <div key={index} className="border-l-2 border-gray-800 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{job.position}</h4>
                    <div className="text-cyan-400">{job.name}</div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {job.startDate} - {job.endDate || 'Present'}
                  </div>
                </div>
                <p className="mt-2 text-gray-400">{job.summary}</p>
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1 text-gray-400">
                    {job.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Education</h3>
            <button
              onClick={() => setEditingSection('education')}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Edit
            </button>
          </div>
          <div className="space-y-6">
            {data.education?.map((edu, index) => (
              <div key={index} className="border-l-2 border-gray-800 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{edu.institution}</h4>
                    <div className="text-cyan-400">{edu.studyType} in {edu.area}</div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </div>
                </div>
                {edu.gpa && (
                  <div className="mt-1 text-gray-400">GPA: {edu.gpa}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Languages</h3>
            <button
              onClick={() => setEditingSection('languages')}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {data.languages?.map((lang, index) => (
              <div key={index} className="bg-gray-800 rounded-lg px-4 py-2">
                <div className="font-medium">{lang.language}</div>
                <div className="text-sm text-gray-400">{lang.fluency}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Projects</h3>
            <button
              onClick={() => setEditingSection('projects')}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Edit
            </button>
          </div>
          <div className="space-y-6">
            {data.projects?.map((project, index) => (
              <div key={index} className="border-l-2 border-gray-800 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{project.name}</h4>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  {project.startDate && (
                    <div className="text-sm text-gray-400">
                      {project.startDate}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-gray-400">{project.description}</p>
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1 text-gray-400">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}