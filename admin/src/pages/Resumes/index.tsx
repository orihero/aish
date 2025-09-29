import { useResumesStore } from '../../stores/resumes.store';

export function Resumes() {
  const { resumes, loading, error } = useResumesStore();

  if (loading) {
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
          <div key={resume._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium">{resume.name}</h2>
            <p className="text-gray-600">{resume.parsedData.basics.summary || 'No description available'}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 