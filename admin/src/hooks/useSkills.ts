import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';

export interface Skill {
  name: string;
  icon: string;
  category: string;
  aliases: string[];
}

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data } = await api.get('/skills');
      return data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Changed from cacheTime to gcTime
  });
}

export function useSkillIcons() {
  return useMutation({
    mutationFn: async (skills: string[]) => {
      const { data } = await api.post('/skills/icons', { skills });
      return data;
    },
  });
} 