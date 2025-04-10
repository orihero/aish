import { useState } from 'react';
import { Plus, Trash2, Calendar, Link as LinkIcon } from 'lucide-react';

interface ManualResumeFormProps {
  onSubmit: (data: any) => void;
}

export function ManualResumeForm({ onSubmit }: ManualResumeFormProps) {
  const [formData, setFormData] = useState({
    basics: {
      name: '',
      label: '',
      email: '',
      phone: '',
      url: '',
      summary: '',
      location: {
        address: '',
        postalCode: '',
        city: '',
        region: '',
        countryCode: ''
      },
      profiles: [] as { network: string; url: string }[]
    },
    work: [] as {
      name: string;
      position: string;
      startDate: string;
      endDate: string;
      summary: string;
      highlights: string[];
    }[],
    education: [] as {
      institution: string;
      area: string;
      studyType: string;
      startDate: string;
      endDate: string;
      gpa: string;
    }[],
    skills: [] as {
      name: string;
      level: string;
      keywords: string[];
    }[],
    languages: [] as {
      language: string;
      fluency: string;
    }[]
  });

  const addWork = () => {
    setFormData({
      ...formData,
      work: [...formData.work, {
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
      education: [...formData.education, {
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
      skills: [...formData.skills, {
        name: '',
        level: '',
        keywords: []
      }]
    });
  };

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [...formData.languages, {
        language: '',
        fluency: ''
      }]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.basics.name}
              onChange={(e) => setFormData({
                ...formData,
                basics: { ...formData.basics, name: e.target.value }
              })}
              className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.basics.label}
              onChange={(e) => setFormData({
                ...formData,
                basics: { ...formData.basics, label: e.target.value }
              })}
              className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.basics.email}
              onChange={(e) => setFormData({
                ...formData,
                basics: { ...formData.basics, email: e.target.value }
              })}
              className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.basics.phone}
              onChange={(e) => setFormData({
                ...formData,
                basics: { ...formData.basics, phone: e.target.value }
              })}
              className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Summary
          </label>
          <textarea
            value={formData.basics.summary}
            onChange={(e) => setFormData({
              ...formData,
              basics: { ...formData.basics, summary: e.target.value }
            })}
            rows={4}
            className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
          />
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          <button
            type="button"
            onClick={addWork}
            className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        <div className="space-y-6">
          {formData.work.map((work, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={work.name}
                      onChange={(e) => {
                        const newWork = [...formData.work];
                        newWork[index].name = e.target.value;
                        setFormData({ ...formData, work: newWork });
                      }}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={work.position}
                      onChange={(e) => {
                        const newWork = [...formData.work];
                        newWork[index].position = e.target.value;
                        setFormData({ ...formData, work: newWork });
                      }}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newWork = formData.work.filter((_, i) => i !== index);
                    setFormData({ ...formData, work: newWork });
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={work.startDate}
                      onChange={(e) => {
                        const newWork = [...formData.work];
                        newWork[index].startDate = e.target.value;
                        setFormData({ ...formData, work: newWork });
                      }}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={work.endDate}
                      onChange={(e) => {
                        const newWork = [...formData.work];
                        newWork[index].endDate = e.target.value;
                        setFormData({ ...formData, work: newWork });
                      }}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={work.summary}
                  onChange={(e) => {
                    const newWork = [...formData.work];
                    newWork[index].summary = e.target.value;
                    setFormData({ ...formData, work: newWork });
                  }}
                  rows={3}
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Education</h3>
          <button
            type="button"
            onClick={addEducation}
            className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>

        <div className="space-y-6">
          {formData.education.map((edu, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].institution = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.studyType}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].studyType = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newEdu = formData.education.filter((_, i) => i !== index);
                    setFormData({ ...formData, education: newEdu });
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].startDate = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].endDate = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
          <button
            type="button"
            onClick={addSkill}
            className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>

        <div className="space-y-4">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-4">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => {
                  const newSkills = [...formData.skills];
                  newSkills[index].name = e.target.value;
                  setFormData({ ...formData, skills: newSkills });
                }}
                placeholder="Skill name"
                className="flex-1 rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
              />
              <select
                value={skill.level}
                onChange={(e) => {
                  const newSkills = [...formData.skills];
                  newSkills[index].level = e.target.value;
                  setFormData({ ...formData, skills: newSkills });
                }}
                className="w-32 rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
              >
                <option value="">Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  const newSkills = formData.skills.filter((_, i) => i !== index);
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

      {/* Languages */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Languages</h3>
          <button
            type="button"
            onClick={addLanguage}
            className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Language
          </button>
        </div>

        <div className="space-y-4">
          {formData.languages.map((lang, index) => (
            <div key={index} className="flex items-center gap-4">
              <input
                type="text"
                value={lang.language}
                onChange={(e) => {
                  const newLangs = [...formData.languages];
                  newLangs[index].language = e.target.value;
                  setFormData({ ...formData, languages: newLangs });
                }}
                placeholder="Language"
                className="flex-1 rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
              />
              <select
                value={lang.fluency}
                onChange={(e) => {
                  const newLangs = [...formData.languages];
                  newLangs[index].fluency = e.target.value;
                  setFormData({ ...formData, languages: newLangs });
                }}
                className="w-40 rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm"
              >
                <option value="">Proficiency</option>
                <option value="elementary">Elementary</option>
                <option value="limited_working">Limited Working</option>
                <option value="professional_working">Professional Working</option>
                <option value="full_professional">Full Professional</option>
                <option value="native">Native</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  const newLangs = formData.languages.filter((_, i) => i !== index);
                  setFormData({ ...formData, languages: newLangs });
                }}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
        >
          Save Resume
        </button>
      </div>
    </form>
  );
}