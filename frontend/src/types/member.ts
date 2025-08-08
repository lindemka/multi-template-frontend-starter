export interface MemberData {
  id: number;
  authUserId?: number;
  firstName: string;
  lastName: string;
  bio?: string;
  email: string;
  phone?: string;
  location?: string;
  company?: string;
  companyRole?: string;
  professionalTitle?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  interests?: string[];
  skills?: string[];
  role: string;
  rating?: number;
  joinedDate?: string;
  lastLogin?: string;
  availability?: string;
  lookingFor?: string[];
  canOffer?: string[];
  createdAt?: string;
  updatedAt?: string;
  authUser?: {
    username?: string;
    email?: string;
    role?: string;
  };
}

export interface FilterOptions {
  search: string;
  role: string;
  company: string;
  interests: string[];
  skills: string[];
  lookingFor: string[];
  canOffer: string[];
  availabilityStatus: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  pageSize: number;
}

export const defaultFilterOptions: FilterOptions = {
  search: '',
  role: 'all',
  company: 'all',
  interests: [],
  skills: [],
  lookingFor: [],
  canOffer: [],
  availabilityStatus: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'newest',
  pageSize: 10,
};

export const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'founder', label: 'Founder' },
  { value: 'investor', label: 'Investor' },
  { value: 'advisor', label: 'Advisor' },
  { value: 'user', label: 'User' },
];

export const availabilityOptions = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'away', label: 'Away' },
];

export const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'rating', label: 'Highest Rated' },
];