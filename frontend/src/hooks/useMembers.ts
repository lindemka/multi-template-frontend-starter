import { useState, useEffect } from 'react';
import { memberApi, Member } from '@/lib/memberApi';
import useSWR from 'swr';

export interface FilterState {
  goals: string[];
  interests: string[];
  skills: string[];
  availability: string[];
  location: string;
  search?: string;
}

export interface UseMembersResult {
  members: Member[];
  loading: boolean;
  error: Error | null;
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  refresh: () => void;
  totalCount: number;
}

const buildQueryString = (filters: FilterState): string => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.location) params.append('location', filters.location);
  if (filters.goals.length) params.append('goals', filters.goals.join(','));
  if (filters.interests.length) params.append('interests', filters.interests.join(','));
  if (filters.skills.length) params.append('skills', filters.skills.join(','));
  if (filters.availability.length) params.append('availability', filters.availability.join(','));
  
  return params.toString();
};

export const useMembers = (): UseMembersResult => {
  const [filters, setFiltersState] = useState<FilterState>({
    goals: [],
    interests: [],
    skills: [],
    availability: [],
    location: '',
  });

  const queryString = buildQueryString(filters);
  const cacheKey = `/api/members${queryString ? `?${queryString}` : ''}`;
  
  const { data, error, mutate } = useSWR(
    cacheKey,
    () => memberApi.getAll(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
    }
  );

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  return {
    members: data || [],
    loading: !data && !error,
    error,
    filters,
    setFilters,
    refresh: mutate,
    totalCount: data?.length || 0,
  };
};