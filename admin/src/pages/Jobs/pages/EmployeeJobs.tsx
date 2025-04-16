import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth.store';
import { JobCard } from '../components/JobCard';
import { Spinner } from '../../../components/Spinner';
import { Alert } from '../../../components/Alert';
import { EmptyState } from '../../../components/EmptyState';
import { Job } from '../../../stores/jobs.store';
import { ApplyModal } from '../components/ApplyModal';

interface VacanciesResponse {
  vacancies: Job[];
  total: number;
  pages: number;
  currentPage: number;
}

export const EmployeeJobs = () => {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data, isLoading, error } = useQuery<VacanciesResponse>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/vacancies`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (data?.vacancies) {
      setJobs(data.vacancies);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        {error instanceof Error ? error.message : 'An error occurred'}
      </Alert>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        type="jobs"
        action={
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Jobs
          </button>
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            showApplyButton={user?.role === 'employee'}
            onApply={() => setSelectedJob(job)}
          />
        ))}
      </div>

      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}; 