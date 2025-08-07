// Member API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Member {
  id: number;
  name: string;
  location: string;
  avatar: string;
  followers: number;
  rating: number;
  tagline: string;
  goals: string[];
  interests: string[];
  skills: string[];
  assets: {
    type: string;
    label: string;
  } | null;
  status: string | null;
  about: {
    shortDescription: string;
    industries: string[];
    lookingFor: string;
    offering: string;
    languages: string[];
  };
  isFounder?: boolean;
  isInvestor?: boolean;
  founderProfile?: {
    completeness: number;
    myIntroduction: string;
    myMotivation: string;
    lookingForCofounder: boolean;
    lookingForInvestor: boolean;
    yearsExperience: number;
  };
  investorProfile?: {
    completeness: number;
    investmentFocus: string;
    investmentExperience: string;
    investmentRangeMin: number;
    investmentRangeMax: number;
  };
}

export const memberApi = {
  async getAll(): Promise<Member[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Member> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching member:', error);
      throw error;
    }
  },

  async search(params: {
    name?: string;
    location?: string;
    skill?: string;
    interest?: string;
  }): Promise<Member[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.name) queryParams.append('name', params.name);
      if (params.location) queryParams.append('location', params.location);
      if (params.skill) queryParams.append('skill', params.skill);
      if (params.interest) queryParams.append('interest', params.interest);

      const response = await fetch(`${API_BASE_URL}/api/members/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching members:', error);
      throw error;
    }
  },
};