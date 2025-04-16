import { FileText, Briefcase, Users, Building2, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  type: 'applications' | 'jobs' | 'candidates' | 'companies' | 'categories';
  action?: React.ReactNode;
  className?: string;
}

const emptyStates = {
  applications: {
    icon: FileText,
    title: 'No Applications Yet',
    description: 'Your job applications will appear here. Start applying to jobs to see them listed!',
    illustration: '📝'
  },
  jobs: {
    icon: Briefcase,
    title: 'No Jobs Posted Yet',
    description: 'Your posted jobs will appear here. Create your first job posting to get started!',
    illustration: '💼'
  },
  candidates: {
    icon: Users,
    title: 'No Candidates Yet',
    description: 'Candidates who apply to your jobs will appear here. Start posting jobs to attract talent!',
    illustration: '👥'
  },
  companies: {
    icon: Building2,
    title: 'No Companies Yet',
    description: 'Companies you create will appear here. Add your first company to start posting jobs!',
    illustration: '🏢'
  },
  categories: {
    icon: Tag,
    title: 'No Categories Yet',
    description: 'Job categories will appear here. Create categories to organize your job postings!',
    illustration: '🏷️'
  }
};

export const EmptyState = ({ type, action, className }: EmptyStateProps) => {
  const { title, description, illustration } = emptyStates[type];

  return (
    <div className={cn('text-center py-12', className)}>
      <div className="text-6xl mb-4">{illustration}</div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}; 