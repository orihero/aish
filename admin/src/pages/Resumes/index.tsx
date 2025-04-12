import { useResumesStore } from '../../stores/resumes.store';

export function Resumes() {
  const { resumes, isLoading, error, getResumes } = useResumesStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Resumes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map(resume => (
          <div key={resume.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium">{resume.title}</h2>
            <p className="text-gray-600">{resume.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 