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
  Loader2
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
import FiltersModal from '@/components/members/FiltersModal';
import { userApi } from '@/lib/api';
import { User } from '@/types/api';

// Extended mock data for founders with additional fields
const mockFoundersData = [
  {
    id: 1,
    name: "Ahmed",
    location: "New York City, US",
    avatar: "/api/placeholder/40/40",
    followers: 3,
    rating: 4,
    goals: ["Join a team", "Support startups"],
    interests: ["Advertising & Marketing", "AI & Machine Learning"],
    skills: [],
    assets: null,
    status: null
  },
  {
    id: 2,
    name: "Andy",
    location: "Dallas, US",
    avatar: "/api/placeholder/40/40",
    followers: 2,
    rating: 5,
    goals: ["Build up a team", "Find investors", "Need support"],
    interests: ["Tourism & Hospitality", "Marketing & Sales", "Business Developer", "Growth & Venture Relations", "Sales Manager"],
    skills: [],
    assets: { type: "Startup", label: "Startup" },
    status: "Open Jobs"
  },
  {
    id: 3,
    name: "Kinne",
    location: "Cambridge, US",
    avatar: "/api/placeholder/40/40",
    followers: 6,
    rating: 5,
    goals: ["Build up a team", "Find investors", "Need support"],
    interests: ["Advertising & Marketing", "Architecture & Construction"],
    skills: [],
    assets: { type: "Startup", label: "Startup" },
    status: null
  },
  {
    id: 4,
    name: "Brent",
    location: "Kansas City, US",
    avatar: "/api/placeholder/40/40",
    followers: 4,
    rating: 4.5,
    goals: ["Build up a team", "Join a team", "Support startups"],
    interests: ["AI & Machine Learning", "Healthcare & Medical Devices"],
    skills: [],
    assets: null,
    status: null
  },
  {
    id: 5,
    name: "Theresa",
    location: "San Diego, US",
    avatar: "/api/placeholder/40/40",
    followers: 3,
    rating: 4.5,
    goals: ["Build up a team", "Find investors", "Need support"],
    interests: ["AI & Machine Learning", "Human-Machine Interaction & UX Design", "Tech", "Product & Design", "Developer (Frontend)", "Developer (Backend)", "Software Engineer"],
    skills: [],
    assets: null,
    status: null
  },
  {
    id: 6,
    name: "Alex",
    location: "Boston, US",
    avatar: "/api/placeholder/40/40",
    followers: 10,
    rating: 5,
    goals: ["Build up a team"],
    interests: ["Food & Beverage", "Recruiting & Human Resources"],
    skills: [],
    assets: null,
    status: null
  },
  {
    id: 7,
    name: "Rohith Reddy",
    location: "San Jose, US",
    avatar: "/api/placeholder/40/40",
    followers: 5,
    rating: 4,
    goals: ["Build up a team"],
    interests: ["AI & Machine Learning", "Consumer Hardware & Electronics"],
    skills: [],
    assets: null,
    status: null
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
      
      // Merge API data with mock extended data
      const enrichedMembers = users.map((user: User) => {
        const mockData = mockFoundersData.find(m => m.name === user.name) || mockFoundersData[0];
        return {
          ...user,
          location: `${user.city || 'New York'}, ${user.country || 'US'}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`,
          followers: Math.floor(Math.random() * 10) + 1,
          rating: 3 + Math.random() * 2,
          goals: mockData.goals,
          interests: mockData.interests,
          skills: mockData.skills || [],
          assets: mockData.assets,
          status: mockData.status
        };
      });
      
      setMembers(enrichedMembers);
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
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
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