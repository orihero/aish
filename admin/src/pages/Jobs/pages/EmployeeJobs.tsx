import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth.store';
import { JobCard } from '../components/JobCard';
import { Spinner } from '../../../components/Spinner';
import { Alert } from '../../../components/Alert';
import { EmptyState } from '../../../components/EmptyState';
import { Job } from '../../../stores/jobs.store';
import { ApplyModal } from '../components/ApplyModal';
import { api } from '../../../lib/axios';
import { Search, Filter, X } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface Filters {
  search: string;
  employmentType: string;
  workType: string;
  company: string;
}

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const workTypes = ['Remote', 'Hybrid', 'On-site'];

export const EmployeeJobs = () => {
  const { user } = useAuthStore();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    employmentType: '',
    workType: '',
    company: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { ref: loadMoreRef, inView } = useInView();

  const fetchJobs = async ({ pageParam = 1 }) => {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: '10',
      ...(filters.search && { search: filters.search }),
      ...(filters.employmentType && { employmentType: filters.employmentType }),
      ...(filters.workType && { workType: filters.workType }),
      ...(filters.company && { company: filters.company })
    });

    const { data } = await api.get(`/vacancies/employee?${params}`);
    return {
      ...data,
      nextPage: data.currentPage < data.pages ? data.currentPage + 1 : null
    };
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['jobs', filters],
    queryFn: fetchJobs,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1
  });

  // Effect for infinite scroll
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      employmentType: '',
      workType: '',
      company: ''
    });
    setSearchInput('');
    setShowFilters(false);
  };

  if (isLoading && !isFetchingNextPage) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        {error instanceof Error ? error.message : 'An error occurred while fetching jobs'}
      </Alert>
    );
  }

  const allJobs = data?.pages.flatMap(page => page.vacancies) ?? [];

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search jobs by title, company, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Search
          </button>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-5 w-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {(filters.employmentType || filters.workType || filters.company) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Employment Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                value={filters.employmentType}
                onChange={(e) => setFilters(prev => ({ ...prev, employmentType: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Types</option>
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Work Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Type
              </label>
              <select
                value={filters.workType}
                onChange={(e) => setFilters(prev => ({ ...prev, workType: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Types</option>
                {workTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                placeholder="Filter by company..."
                value={filters.company}
                onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        )}
      </div>

      {/* Jobs List */}
      {allJobs.length === 0 ? (
        <EmptyState
          type="jobs"
          action={
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh Jobs
            </button>
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {allJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                showApplyButton={user?.role === 'employee' && !job.isApplied}
                onApply={() => setSelectedJob(job)}
              />
            ))}
          </div>
          
          {/* Load More Trigger */}
          <div
            ref={loadMoreRef}
            className="py-4 flex justify-center"
          >
            {isFetchingNextPage && (
              <Spinner size="md" />
            )}
          </div>
        </>
      )}

      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}; 