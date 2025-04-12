import { Download } from 'lucide-react';
import type { ResumeData } from '../../Register';

interface ResumePreviewProps {
  data: ResumeData;
  onDownload?: () => void;
  onContinue: () => void;
}

export function ResumePreview({ data, onDownload, onContinue }: ResumePreviewProps) {
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
              <h2 className="text-3xl font-bold mb-2">{data.basics.name || 'Your Name'}</h2>
              <p className="text-gray-400 mb-4">{data.basics.location?.city}, {data.basics.location?.countryCode}</p>
              <div className="text-cyan-500 text-2xl font-semibold mb-6">$21/h</div>
              <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium">
                Message me
              </button>
            </div>

            {/* Communication and Technical Skills */}
            <div>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Communication</span>
                  <span>6/10</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Technical skill</span>
                  <span>9/10</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>

            {/* Expertise Skills */}
            <div>
              <h3 className="text-xs uppercase text-gray-500 mb-6">Expertise Skills</h3>
              <div className="space-y-4">
                {data.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img src={`/icons/${skill.name.toLowerCase()}.svg`} alt={skill.name} className="w-8 h-8" />
                    <span className="text-lg">{skill.name}</span>
                    <span className="text-gray-500 text-sm ml-auto">{skill.level} years</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All Skills */}
            <div>
              <h3 className="text-xs uppercase text-gray-500 mb-6">All Skills</h3>
              <div className="flex flex-wrap gap-3">
                {['Flutter', 'React Native', 'JavaScript'].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                    <img src={`/icons/${skill.toLowerCase()}.svg`} alt={skill} className="w-5 h-5" />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Main content */}
          <div className="p-12 overflow-y-auto">
            <div className="max-w-3xl space-y-12">
              {/* Professional Summary */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Professional Experience</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {data.basics.summary || 'Software Engineer with experience in developing web applications, microservices, and distributed systems participating in the complete product development lifecycle of successfully launched applications. An empathetic team player and mentor.'}
                </p>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-2xl font-semibold mb-8">Professional Experience</h3>
                <div className="space-y-10">
                  {data.work?.map((job, index) => (
                    <div key={index}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-medium mb-1">{job.position}</h4>
                          <div className="text-cyan-500 text-lg">{job.name}</div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {job.startDate} - {job.endDate || 'Present'}
                        </div>
                      </div>
                      <p className="text-gray-400 text-lg mb-4 leading-relaxed">{job.summary}</p>
                      <div className="flex gap-3">
                        {['Golang', 'NodeJS', 'Docker'].map((tech) => (
                          <div key={tech} className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                            <img src={`/icons/${tech.toLowerCase()}.svg`} alt={tech} className="w-5 h-5" />
                            <span className="text-sm">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-2xl font-semibold mb-8">Education</h3>
                <div className="space-y-8">
                  {data.education?.map((edu, index) => (
                    <div key={index}>
                      <h4 className="text-xl font-medium mb-1">{edu.institution}</h4>
                      <div className="text-cyan-500 text-lg">{edu.studyType} in {edu.area}</div>
                      <div className="text-sm text-gray-400 mt-2">
                        {edu.startDate} - {edu.endDate || 'Present'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}