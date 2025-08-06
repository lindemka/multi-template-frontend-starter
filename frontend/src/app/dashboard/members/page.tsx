'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Users, 
  Briefcase, 
  MapPin, 
  Mail, 
  Phone,
  Building2,
  Target,
  Heart,
  TrendingUp,
  Lightbulb,
  MessageCircle,
  MoreHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FiltersModal from '@/components/members/FiltersModal';
import { userApi } from '@/lib/api';
import { User } from '@/types/api';

// Extended mock data for founders with additional fields
const mockFoundersData = [
  {
    id: 1,
    name: "Ahmed Salman",
    location: "New York City, US",
    avatar: "https://i.pravatar.cc/150?img=14",
    followers: 342,
    rating: 4.5,
    goals: ["Join a team", "Support startups"],
    interests: ["Advertising & Marketing", "AI & Machine Learning", "Software & SaaS"],
    skills: ["Marketing Manager", "Growth Manager", "Data Scientist"],
    assets: null,
    status: null
  },
  {
    id: 2,
    name: "Andy Mitchell",
    location: "San Francisco, US",
    avatar: "https://i.pravatar.cc/150?img=33",
    followers: 1289,
    rating: 5,
    goals: ["Build up a team", "Find investors", "Need support"],
    interests: ["Tourism & Hospitality", "Marketing & Sales", "Business Developer", "Growth & Venture Relations"],
    skills: ["Business Developer", "Sales Manager"],
    assets: { type: "Startup", label: "TravelTech Inc." },
    status: "Open Jobs"
  },
  {
    id: 3,
    name: "Kinne Zhang",
    location: "London, UK",
    avatar: "https://i.pravatar.cc/150?img=5",
    followers: 567,
    rating: 4.8,
    goals: ["Build up a team", "Find investors"],
    interests: ["Advertising & Marketing", "Architecture & Construction", "AI & Machine Learning"],
    skills: ["Product Manager", "Designer (UX/UI)"],
    assets: { type: "Startup", label: "BuildSmart AI" },
    status: "Funded Series A"
  },
  {
    id: 4,
    name: "Brent Thompson",
    location: "Berlin, Germany",
    avatar: "https://i.pravatar.cc/150?img=7",
    followers: 423,
    rating: 4.5,
    goals: ["Join a team", "Support startups"],
    interests: ["AI & Machine Learning", "Healthcare & Medical Devices", "Biotech & Pharmaceuticals"],
    skills: ["Developer (Backend)", "Software Engineer", "Data Scientist"],
    assets: null,
    status: null
  },
  {
    id: 5,
    name: "Theresa Chen",
    location: "Toronto, Canada",
    avatar: "https://i.pravatar.cc/150?img=9",
    followers: 892,
    rating: 4.9,
    goals: ["Build up a team", "Find investors"],
    interests: ["AI & Machine Learning", "Human-Machine Interaction & UX Design", "Tech", "Product & Design"],
    skills: ["Developer (Frontend)", "Developer (Backend)", "Software Engineer", "Designer (UX/UI)"],
    assets: { type: "Startup", label: "DesignAI Labs" },
    status: "Hiring Engineers"
  },
  {
    id: 6,
    name: "Alex Rodriguez",
    location: "Paris, France",
    avatar: "https://i.pravatar.cc/150?img=11",
    followers: 1023,
    rating: 5,
    goals: ["Invest"],
    interests: ["Food & Beverage", "Recruiting & Human Resources", "Social Impact & Community Development"],
    skills: ["Business Developer", "Growth Manager"],
    assets: { type: "VC Fund", label: "Emerge Ventures" },
    status: "Accepting Pitches"
  },
  {
    id: 7,
    name: "Rohith Reddy",
    location: "Singapore",
    avatar: "https://i.pravatar.cc/150?img=12",
    followers: 645,
    rating: 4.7,
    goals: ["Build up a team", "Find investors"],
    interests: ["AI & Machine Learning", "Consumer Hardware & Electronics", "Space Technology & Exploration"],
    skills: ["Software Engineer", "Developer (Backend)", "Product Manager"],
    assets: null,
    status: null
  },
  {
    id: 8,
    name: "Sarah Kim",
    location: "Sydney, Australia",
    avatar: "https://i.pravatar.cc/150?img=1",
    followers: 234,
    rating: 4.3,
    goals: ["Join a team"],
    interests: ["Healthcare & Medical Devices", "Biotech & Pharmaceuticals", "AI & Machine Learning"],
    skills: ["Data Scientist", "Developer (Backend)"],
    assets: null,
    status: "Looking for Opportunities"
  },
  {
    id: 9,
    name: "Marcus Johnson",
    location: "Remote",
    avatar: "https://i.pravatar.cc/150?img=15",
    followers: 1567,
    rating: 4.9,
    goals: ["Support startups", "Invest"],
    interests: ["Software & SaaS", "AI & Machine Learning", "Tech"],
    skills: ["Software Engineer", "Developer (Frontend)", "Developer (Backend)"],
    assets: { type: "Angel Investor", label: "50+ Portfolio Companies" },
    status: null
  },
  {
    id: 10,
    name: "Lisa Wang",
    location: "Dallas, US",
    avatar: "https://i.pravatar.cc/150?img=16",
    followers: 445,
    rating: 4.6,
    goals: ["Build up a team", "Need support"],
    interests: ["Marketing & Sales", "Growth & Venture Relations", "Social Impact & Community Development"],
    skills: ["Marketing Manager", "Sales Manager", "Growth Manager"],
    assets: { type: "Startup", label: "SocialGood Platform" },
    status: "Pre-Seed"
  },
  {
    id: 11,
    name: "David Park",
    location: "Boston, US",
    avatar: "https://i.pravatar.cc/150?img=18",
    followers: 789,
    rating: 4.8,
    goals: ["Find investors", "Build up a team"],
    interests: ["Space Technology & Exploration", "AI & Machine Learning", "Consumer Hardware & Electronics"],
    skills: ["Software Engineer", "Product Manager"],
    assets: { type: "Startup", label: "SpaceTech Solutions" },
    status: "Seeking $2M Seed"
  },
  {
    id: 12,
    name: "Emma Wilson",
    location: "Los Angeles, US",
    avatar: "https://i.pravatar.cc/150?img=20",
    followers: 923,
    rating: 5,
    goals: ["Join a team", "Support startups"],
    interests: ["Human-Machine Interaction & UX Design", "Product & Design", "Tech"],
    skills: ["Designer (UX/UI)", "Product Manager", "Marketing Manager"],
    assets: null,
    status: null
  },
  {
    id: 13,
    name: "James Liu",
    location: "Vancouver, Canada",
    avatar: "https://i.pravatar.cc/150?img=22",
    followers: 156,
    rating: 4.2,
    goals: ["Join a team"],
    interests: ["Developer (Frontend)", "Developer (Backend)", "Software & SaaS"],
    skills: ["Developer (Frontend)", "Developer (Backend)", "Software Engineer"],
    assets: null,
    status: "Open to Work"
  },
  {
    id: 14,
    name: "Sophia Martinez",
    location: "Miami, US",
    avatar: "https://i.pravatar.cc/150?img=23",
    followers: 2341,
    rating: 4.9,
    goals: ["Invest", "Support startups"],
    interests: ["Tourism & Hospitality", "Food & Beverage", "Marketing & Sales"],
    skills: ["Business Developer", "Sales Manager"],
    assets: { type: "VC Fund", label: "Hospitality Ventures" },
    status: null
  },
  {
    id: 15,
    name: "Oliver Brown",
    location: "Chicago, US",
    avatar: "https://i.pravatar.cc/150?img=25",
    followers: 567,
    rating: 4.5,
    goals: ["Build up a team", "Find investors"],
    interests: ["Safety & Security Solutions", "AI & Machine Learning", "Software & SaaS"],
    skills: ["Software Engineer", "Developer (Backend)", "Data Scientist"],
    assets: { type: "Startup", label: "SecureAI" },
    status: "Series A Ready"
  },
  {
    id: 16,
    name: "Nina Patel",
    location: "Austin, US",
    avatar: "https://i.pravatar.cc/150?img=26",
    followers: 432,
    rating: 4.7,
    goals: ["Join a team", "Build up a team"],
    interests: ["Biotech & Pharmaceuticals", "Healthcare & Medical Devices"],
    skills: ["Data Scientist", "Product Manager"],
    assets: null,
    status: null
  },
  {
    id: 17,
    name: "Carlos Rivera",
    location: "Mexico City, Mexico",
    avatar: "https://i.pravatar.cc/150?img=28",
    followers: 876,
    rating: 4.8,
    goals: ["Build up a team", "Need support"],
    interests: ["Food & Beverage", "Tourism & Hospitality", "Social Impact & Community Development"],
    skills: ["Business Developer", "Marketing Manager"],
    assets: { type: "Startup", label: "LocalEats" },
    status: "Bootstrapped"
  },
  {
    id: 18,
    name: "Anna Schmidt",
    location: "Berlin, Germany",
    avatar: "https://i.pravatar.cc/150?img=29",
    followers: 1234,
    rating: 5,
    goals: ["Support startups", "Invest"],
    interests: ["Tech", "AI & Machine Learning", "Software & SaaS"],
    skills: ["Software Engineer", "Growth Manager"],
    assets: { type: "Accelerator", label: "TechStars Berlin" },
    status: null
  },
  {
    id: 19,
    name: "Robert Taylor",
    location: "Seattle, US",
    avatar: "https://i.pravatar.cc/150?img=31",
    followers: 345,
    rating: 4.4,
    goals: ["Join a team"],
    interests: ["Software & SaaS", "Developer (Backend)", "Tech"],
    skills: ["Developer (Backend)", "Software Engineer", "Data Scientist"],
    assets: null,
    status: "Exploring Opportunities"
  },
  {
    id: 20,
    name: "Maya Johnson",
    location: "Atlanta, US",
    avatar: "https://i.pravatar.cc/150?img=32",
    followers: 678,
    rating: 4.6,
    goals: ["Build up a team", "Find investors"],
    interests: ["Social Impact & Community Development", "Human-Machine Interaction & UX Design"],
    skills: ["Designer (UX/UI)", "Product Manager", "Marketing Manager"],
    assets: { type: "Startup", label: "ImpactHub" },
    status: "Raising Seed"
  },
  {
    id: 21,
    name: "Thomas Anderson",
    location: "Remote",
    avatar: "https://i.pravatar.cc/150?img=34",
    followers: 2890,
    rating: 4.9,
    goals: ["Support startups"],
    interests: ["AI & Machine Learning", "Software & SaaS", "Tech"],
    skills: ["Software Engineer", "Developer (Frontend)", "Developer (Backend)"],
    assets: { type: "Consultant", label: "Tech Advisory" },
    status: null
  },
  {
    id: 22,
    name: "Isabella Garcia",
    location: "Barcelona, Spain",
    avatar: "https://i.pravatar.cc/150?img=35",
    followers: 556,
    rating: 4.7,
    goals: ["Build up a team", "Need support"],
    interests: ["Tourism & Hospitality", "Marketing & Sales", "Product & Design"],
    skills: ["Marketing Manager", "Designer (UX/UI)", "Growth Manager"],
    assets: { type: "Startup", label: "TravelConnect" },
    status: "MVP Launched"
  },
  {
    id: 23,
    name: "Kevin Wu",
    location: "Tokyo, Japan",
    avatar: "https://i.pravatar.cc/150?img=36",
    followers: 423,
    rating: 4.5,
    goals: ["Join a team", "Support startups"],
    interests: ["Consumer Hardware & Electronics", "AI & Machine Learning", "Space Technology & Exploration"],
    skills: ["Software Engineer", "Product Manager"],
    assets: null,
    status: null
  },
  {
    id: 24,
    name: "Rachel Green",
    location: "Denver, US",
    avatar: "https://i.pravatar.cc/150?img=38",
    followers: 890,
    rating: 4.8,
    goals: ["Invest"],
    interests: ["Healthcare & Medical Devices", "Biotech & Pharmaceuticals", "AI & Machine Learning"],
    skills: ["Business Developer", "Data Scientist"],
    assets: { type: "VC Fund", label: "HealthTech Capital" },
    status: "Active Investing"
  },
  {
    id: 25,
    name: "Mohamed Ali",
    location: "Dubai, UAE",
    avatar: "https://i.pravatar.cc/150?img=40",
    followers: 1456,
    rating: 4.9,
    goals: ["Build up a team", "Find investors"],
    interests: ["Architecture & Construction", "AI & Machine Learning", "Safety & Security Solutions"],
    skills: ["Product Manager", "Business Developer"],
    assets: { type: "Startup", label: "SmartBuild MENA" },
    status: "Series B"
  }
];

export default function MembersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('@PlatformUSA');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    goals: [],
    interests: [],
    skills: [],
    availability: [],
    location: ''
  });

  // Fetch users from API on mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const users = await userApi.getAll();
      
      // If API returns data, enrich it with mock data details
      if (users && users.length > 0) {
        const enrichedMembers = users.map((user: User, index: number) => {
          // Use corresponding mock data or cycle through if more API users than mock data
          const mockData = mockFoundersData[index % mockFoundersData.length];
          return {
            ...user,
            location: mockData.location,
            avatar: mockData.avatar,
            followers: mockData.followers,
            rating: mockData.rating,
            goals: mockData.goals,
            interests: mockData.interests,
            skills: mockData.skills || [],
            assets: mockData.assets,
            status: mockData.status
          };
        });
        
        // If API returns fewer than 10 users, add some mock data to have more variety
        if (enrichedMembers.length < 10) {
          const additionalMocks = mockFoundersData.slice(enrichedMembers.length, 25);
          setMembers([...enrichedMembers, ...additionalMocks]);
        } else {
          setMembers(enrichedMembers);
        }
      } else {
        // No API data, use all mock data
        setMembers(mockFoundersData);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
      // Fallback to mock data if API fails
      setMembers(mockFoundersData);
    } finally {
      setLoading(false);
    }
  };

  // Apply all filters
  const filteredMembers = members.filter(member => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.interests.some((interest: string) => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Goals filter
    const matchesGoals = filters.goals.length === 0 ||
      filters.goals.some((goalId: string) => 
        member.goals.some((goal: string) => 
          goal.toLowerCase().replace(/\s+/g, '-').includes(goalId)
        )
      );
    
    // Interests filter
    const matchesInterests = filters.interests.length === 0 ||
      filters.interests.some((interest: string) => 
        member.interests.includes(interest)
      );
    
    // Skills filter
    const matchesSkills = filters.skills.length === 0 ||
      filters.skills.some((skill: string) => 
        member.skills && member.skills.includes(skill)
      );
    
    // Location filter
    const matchesLocation = !filters.location ||
      member.location.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesGoals && matchesInterests && matchesSkills && matchesLocation;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleViewProfile = (memberId: number) => {
    router.push(`/dashboard/profile/${memberId}`);
  };

  const clearAllFilters = () => {
    setFilters({
      goals: [],
      interests: [],
      skills: [],
      availability: [],
      location: ''
    });
    setSearchQuery('');
  };

  const getGoalIcon = (goal: string) => {
    switch(goal.toLowerCase()) {
      case 'join a team':
        return <Users className="h-4 w-4" />;
      case 'build up a team':
        return <Building2 className="h-4 w-4" />;
      case 'find investors':
        return <TrendingUp className="h-4 w-4" />;
      case 'support startups':
        return <Heart className="h-4 w-4" />;
      case 'need support':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    // Apply filtering logic here
    setIsFiltersOpen(false);
  };

  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Founders</h1>
          <p className="text-sm text-muted-foreground">
            {filteredMembers.length} results found
          </p>
        </div>
        <Button
          onClick={() => setIsFiltersOpen(true)}
          variant="outline"
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {(filters.goals.length > 0 || filters.interests.length > 0 || filters.skills.length > 0 || filters.location) && (
            <Badge variant="destructive" className="ml-1 rounded-full px-2 py-0 text-xs">
              {filters.goals.length + filters.interests.length + filters.skills.length + (filters.location ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Bar */}
      {(filters.goals.length > 0 || filters.interests.length > 0 || filters.skills.length > 0 || filters.location) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.goals.map((goalId: string) => (
            <Badge key={goalId} variant="secondary" className="gap-1 bg-blue-100 text-blue-700 border-0">
              {goalId.replace(/-/g, ' ')}
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  goals: prev.goals.filter(g => g !== goalId)
                }))}
                className="ml-1 hover:bg-blue-200 rounded-full px-1"
              >
                ×
              </button>
            </Badge>
          ))}
          
          {filters.interests.slice(0, 3).map((interest: string) => (
            <Badge key={interest} variant="secondary" className="gap-1 bg-blue-100 text-blue-700 border-0">
              {interest}
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  interests: prev.interests.filter(i => i !== interest)
                }))}
                className="ml-1 hover:bg-blue-200 rounded-full px-1"
              >
                ×
              </button>
            </Badge>
          ))}
          {filters.interests.length > 3 && (
            <Badge variant="secondary">+{filters.interests.length - 3} more</Badge>
          )}
          
          {filters.skills.map((skill: string) => (
            <Badge key={skill} variant="secondary" className="gap-1 bg-green-100 text-green-700 border-0">
              {skill}
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  skills: prev.skills.filter(s => s !== skill)
                }))}
                className="ml-1 hover:bg-green-200 rounded-full px-1"
              >
                ×
              </button>
            </Badge>
          ))}
          
          {filters.location && (
            <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 border-0">
              📍 {filters.location}
              <button
                onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                className="ml-1 hover:bg-blue-200 rounded-full px-1"
              >
                ×
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, location, interests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Members Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MEMBER</TableHead>
                <TableHead>GOALS</TableHead>
                <TableHead>INTERESTS & ROLES</TableHead>
                <TableHead>ASSETS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No members found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMembers.map((member) => (
              <TableRow key={member.id}>
                {/* Member Info */}
                <TableCell>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.location}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {member.followers} Followers
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${
                                i < Math.floor(member.rating)
                                  ? 'bg-orange-400'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Goals */}
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {member.goals.map((goal, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                      >
                        {getGoalIcon(goal)}
                        {goal}
                      </Button>
                    ))}
                  </div>
                </TableCell>

                {/* Interests & Roles */}
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-md">
                    {member.interests.slice(0, 3).map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {member.interests.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{member.interests.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Assets */}
                <TableCell>
                  {member.assets ? (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{member.assets.label}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                  {member.status && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {member.status}
                    </Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(member.id)}
                  >
                    View Profile
                  </Button>
                </TableCell>
              </TableRow>
              ))
            )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Pagination Controls */}
      {filteredMembers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} results
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    className="w-10"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </Button>
                  {currentPage > 4 && <span className="px-2 py-1 text-sm">...</span>}
                </>
              )}

              {/* Pages around current */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum > 0 && pageNum <= totalPages && (totalPages <= 5 || Math.abs(pageNum - currentPage) <= 2)) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-10"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}

              {/* Last page */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 py-1 text-sm">...</span>}
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    className="w-10"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={applyFilters}
        currentFilters={filters}
      />
    </div>
  );
}