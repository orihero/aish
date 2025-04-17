import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumesStore } from '../../../stores/resumes.store';
import { useApplicationsStore } from '../../../stores/application.store';
import { Spinner } from '../../../components/Spinner';
import type { Job } from '../../../stores/jobs.store';
import { X } from 'lucide-react';
import { Alert } from '../../../components/Alert';

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
}

export const ApplyModal = ({ job, onClose }: ApplyModalProps) => {
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { resumes, loading: isLoadingResumes, getMyResumes } = useResumesStore();
  const { createApplication } = useApplicationsStore();
  const navigate = useNavigate();

  useEffect(() => {
    getMyResumes();
  }, [getMyResumes]);

  const handleApply = async () => {
    if (!selectedResume) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const resume = resumes.find(r => r._id === selectedResume);
      if (!resume) {
        throw new Error('Selected resume not found');
      }
      await createApplication(resume._id, job._id);
      navigate('/jobs/my-applications', { state: { applicationId: job._id } });
    } catch (error) {
      console.error('Failed to apply:', error);
      setError(error instanceof Error ? error.message : 'Failed to apply for the job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Apply to {job.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Select your resume to apply for this position
        </p>

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {isLoadingResumes ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-6">
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-gray-600">
                You need to create a resume first to apply for this job.
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              Create Resume
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Resume
              </label>
              <select
                className="w-full bg-gray-50 border-0 rounded-lg py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500"
                value={selectedResume || ''}
                onChange={(e) => setSelectedResume(e.target.value)}
              >
                <option value="">Select a resume</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!selectedResume || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 