interface VacancyStat {
  id: string;
  title: string;
  totalApplications: number;
  status: string;
  applicationsByStatus: {
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
}

interface VacancyStatsProps {
  stats: VacancyStat[];
}

export function VacancyStats({ stats }: VacancyStatsProps) {
  return (
    <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-[#625F6E]">Vacancy Statistics</h2>
          <p className="text-sm text-gray-500">Applications by vacancy</p>
        </div>
      </div>
      <div className="space-y-4">
        {stats.map((vacancy) => (
          <div key={vacancy.id} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{vacancy.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                vacancy.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-700'
              }`}>
                {vacancy.status}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Total</div>
                <div className="font-medium">{vacancy.totalApplications}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-amber-500">Pending</div>
                <div className="font-medium">{vacancy.applicationsByStatus.pending}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-blue-500">Reviewed</div>
                <div className="font-medium">{vacancy.applicationsByStatus.reviewed}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-emerald-500">Accepted</div>
                <div className="font-medium">{vacancy.applicationsByStatus.accepted}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}