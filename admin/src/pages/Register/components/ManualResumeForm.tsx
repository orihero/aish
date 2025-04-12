import { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import type { ResumeData } from '../../Register';

interface ManualResumeFormProps {
  onSubmit: (data: ResumeData) => void;
}

export function ManualResumeForm({ onSubmit }: ManualResumeFormProps) {
  const [formData, setFormData] = useState<ResumeData>({
    basics: {
      name: '',
      label: '',
      email: '',
      phone: '',
      summary: '',
      location: {
        city: '',
        countryCode: ''
      }
    },
    work: [],
    education: [],
    skills: []
  });

  const addWork = () => {
    setFormData({
      ...formData,
      work: [...(formData.work || []), {
        name: '',
        position: '',
        startDate: '',
        endDate: '',
        summary: '',
        highlights: []
      }]
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...(formData.education || []), {
        institution: '',
        area: '',
        studyType: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }]
    });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...(formData.skills || []), {
        name: '',
        level: '',
        keywords: []
      }]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#111] text-white p-8 rounded-xl">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.basics.name}
              onChange={(e) => setFormData({
                ...formData,
                basics: { ...formData.basics, name: e.target.value }
              })}
              className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.basics.label}
              onChange={(e) => setFormData({
                ...formData,
                basics: { ...formData.basics, label: e.target.value }
              })}
              className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
              placeholder="Senior Developer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.basics.email}
              onChange={(e) => setFormData({
                ...formData,
                basics: { ...formData.basics, email: e.target.value }
              })}
              className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.basics.phone}
              onChange={(e) => setFormData({
                ...formData,
                basics: { ...formData.basics, phone: e.target.value }
              })}
              className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.basics.location?.city}
              onChange={(e) => setFormData({
                ...formData,
                basics: { 
                  ...formData.basics, 
                  location: { 
                    ...formData.basics.location,
                    city: e.target.value 
                  }
                }
              })}
              className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.basics.location?.countryCode}
              onChange={(e) => setFormData({
                ...formData,
                basics: { 
                  ...formData.basics, 
                  location: { 
                    ...formData.basics.location,
                    countryCode: e.target.value 
                  }
                }
              })}
              className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
              placeholder="USA"
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Skills</h3>
          <button
            type="button"
            onClick={addSkill}
            className="px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>

        <div className="space-y-4">
          {formData.skills?.map((skill, index) => (
            <div key={index} className="flex items-center gap-4">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => {
                  const newSkills = [...(formData.skills || [])];
                  newSkills[index] = { ...newSkills[index], name: e.target.value };
                  setFormData({ ...formData, skills: newSkills });
                }}
                placeholder="Skill name"
                className="flex-1 rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
              />
              <select
                value={skill.level}
                onChange={(e) => {
                  const newSkills = [...(formData.skills || [])];
                  newSkills[index] = { ...newSkills[index], level: e.target.value };
                  setFormData({ ...formData, skills: newSkills });
                }}
                className="w-40 rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
              >
                <option value="">Level</option>
                <option value="1">1/10</option>
                <option value="2">2/10</option>
                <option value="3">3/10</option>
                <option value="4">4/10</option>
                <option value="5">5/10</option>
                <option value="6">6/10</option>
                <option value="7">7/10</option>
                <option value="8">8/10</option>
                <option value="9">9/10</option>
                <option value="10">10/10</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  const newSkills = formData.skills?.filter((_, i) => i !== index);
                  setFormData({ ...formData, skills: newSkills });
                }}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Experience</h3>
          <button
            type="button"
            onClick={addWork}
            className="px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        <div className="space-y-6">
          {formData.work?.map((work, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={work.name}
                      onChange={(e) => {
                        const newWork = [...(formData.work || [])];
                        newWork[index] = { ...newWork[index], name: e.target.value };
                        setFormData({ ...formData, work: newWork });
                      }}
                      className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={work.position}
                      onChange={(e) => {
                        const newWork = [...(formData.work || [])];
                        newWork[index] = { ...newWork[index], position: e.target.value };
                        setFormData({ ...formData, work: newWork });
                      }}
                      className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
                      placeholder="Job title"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newWork = formData.work?.filter((_, i) => i !== index);
                    setFormData({ ...formData, work: newWork });
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={work.startDate}
                      onChange={(e) => {
                        const newWork = [...(formData.work || [])];
                        newWork[index] = { ...newWork[index], startDate: e.target.value };
                        setFormData({ ...formData, work: newWork });
                      }}
                      className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={work.endDate}
                      onChange={(e) => {
                        const newWork = [...(formData.work || [])];
                        newWork[index] = { ...newWork[index], endDate: e.target.value };
                        setFormData({ ...formData, work: newWork });
                      }}
                      className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={work.summary}
                  onChange={(e) => {
                    const newWork = [...(formData.work || [])];
                    newWork[index] = { ...newWork[index], summary: e.target.value };
                    setFormData({ ...formData, work: newWork });
                  }}
                  rows={3}
                  className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
                  placeholder="Describe your role and achievements"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Education</h3>
          <button
            type="button"
            onClick={addEducation}
            className="px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>

        <div className="space-y-6">
          {formData.education?.map((edu, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...(formData.education || [])];
                        newEdu[index] = { ...newEdu[index], institution: e.target.value };
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
                      placeholder="University name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.studyType}
                      onChange={(e) => {
                        const newEdu = [...(formData.education || [])];
                        newEdu[index] = { ...newEdu[index], studyType: e.target.value };
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 px-4 text-sm text-white"
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newEdu = formData.education?.filter((_, i) => i !== index);
                    setFormData({ ...formData, education: newEdu });
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEdu = [...(formData.education || [])];
                        newEdu[index] = { ...newEdu[index], startDate: e.target.value };
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEdu = [...(formData.education || [])];
                        newEdu[index] = { ...newEdu[index], endDate: e.target.value };
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="block w-full rounded-lg border-gray-700 bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400"
        >
          Continue
        </button>
      </div>
    </form>
  );
}