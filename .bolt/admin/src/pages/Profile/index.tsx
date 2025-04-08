import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { Camera, Mail, Phone, MapPin, Calendar, Briefcase, Plus } from 'lucide-react';
import { ResumeCard } from './components/ResumeCard';
import { ResumeUpload } from './components/ResumeUpload';

export function Profile() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [resumes, setResumes] = useState([
    {
      id: '1',
      name: 'Software Engineer Resume',
      cvFile: {
        url: '#',
        filename: 'resume.pdf'
      },
      applications: [
        {
          id: '1',
          vacancy: {
            title: 'Senior React Developer',
            company: 'Tech Solutions Inc'
          },
          status: 'pending',
          appliedAt: '2024-03-15'
        },
        {
          id: '2',
          vacancy: {
            title: 'Frontend Engineer',
            company: 'Digital Innovations'
          },
          status: 'accepted',
          appliedAt: '2024-03-10'
        }
      ],
      createdAt: '2024-03-01'
    }
  ]);
  const [uploadError, setUploadError] = useState<string>();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    experience: '5 years',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    bio: 'Passionate software developer with expertise in modern web technologies.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update profile
    setIsEditing(false);
  };

  const handleUploadResume = async (name: string, file: File) => {
    try {
      // TODO: Implement resume upload
      console.log('Uploading resume:', { name, file });
      setUploadError(undefined);
    } catch (error) {
      setUploadError('Failed to upload resume. Please try again.');
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      // TODO: Implement resume deletion
      console.log('Deleting resume:', id);
      setResumes(resumes.filter(resume => resume.id !== id));
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover & Profile Picture */}
        <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=7C3AED&color=fff`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 px-8 pb-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{formData.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{formData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{formData.location}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{formData.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bio</h3>
                <textarea
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 px-4 text-sm disabled:opacity-75"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Resumes Section */}
      {user?.role === 'employee' && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Resumes</h2>
          <div className="grid grid-cols-1 gap-6">
            <ResumeUpload onUpload={handleUploadResume} error={uploadError} />
            {resumes.map(resume => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={handleDeleteResume}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}