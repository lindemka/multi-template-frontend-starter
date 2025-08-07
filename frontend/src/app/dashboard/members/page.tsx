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
import ProfileDrawer from '@/components/members/ProfileDrawer';
import { memberApi, Member } from '@/lib/memberApi';

type MemberData = {
  id: number;
  name: string;
  email?: string;
  role?: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'MODERATOR';
  status?: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
  location: string;
  avatar: string;
  followers: number;
  rating: number;
  goals: string[];
  interests: string[];
  skills?: string[];
  assets?: { label: string } | null;
  tagline?: string;
  about?: {
    short: string;
    industries: string[];
    lookingFor: string;
    offering: string;
    languages: string[];
  };
};

export default function MembersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<{
    goals: string[];
    interests: string[];
    skills: string[];
    availability: string[];
    location: string;
  }>({
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
      const membersData = await memberApi.getAll();
      
      // Transform the API response to match MemberData type
      if (membersData && membersData.length > 0) {
        const transformedMembers = membersData.map((member: Member) => ({
          id: member.id,
          name: member.name,
          location: member.location,
          avatar: member.avatar,
          followers: member.followers,
          rating: member.rating,
          goals: member.goals,
          interests: member.interests,
          skills: member.skills || [],
          assets: member.assets ? { label: member.assets.label } : null,
          status: member.status as 'ACTIVE' | 'PENDING' | 'INACTIVE' | undefined,
          tagline: member.tagline,
          about: member.about ? {
            short: member.about.shortDescription,
            industries: member.about.industries,
            lookingFor: member.about.lookingFor,
            offering: member.about.offering,
            languages: member.about.languages
          } : undefined
        }));
        setMembers(transformedMembers);
      } else {
        // No data from API
        setMembers([]);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
      // Show empty state on error instead of mock data
      setMembers([]);
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

  const handleRowClick = (member: MemberData) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedMember(null), 300); // Clear after animation
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

  const applyFilters = (newFilters: typeof filters) => {
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

      {/* Members Table - Desktop */}
      <Card className="hidden lg:block">
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
              <TableRow 
                key={member.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(member)}
              >
                {/* Member Info */}
                <TableCell>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        {(member as any).isFounder && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            Founder
                          </Badge>
                        )}
                        {(member as any).isInvestor && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Investor
                          </Badge>
                        )}
                      </div>
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
                    {member.goals.map((goal: string, index: number) => (
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
                    {member.interests.slice(0, 3).map((interest: string, index: number) => (
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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      handleViewProfile(member.id);
                    }}
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

      {/* Members Cards - Mobile */}
      <div className="lg:hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : paginatedMembers.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No members found
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedMembers.map((member) => (
              <Card 
                key={member.id} 
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleRowClick(member)}
              >
                <CardContent className="p-4">
                  {/* Member Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {member.followers} Followers
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full ${
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

                  {/* Assets and Status */}
                  {(member.assets || member.status) && (
                    <div className="mb-3 pb-3 border-b">
                      {member.assets && (
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="h-3 w-3 text-blue-500" />
                          <span className="text-sm font-medium">{member.assets.label}</span>
                        </div>
                      )}
                      {member.status && (
                        <Badge variant="outline" className="text-xs">
                          {member.status}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Goals */}
                  {member.goals && member.goals.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">GOALS</p>
                      <div className="flex flex-wrap gap-1">
                        {member.goals.map((goal: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs gap-0.5">
                            {getGoalIcon(goal)}
                            <span className="truncate">{goal}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">SKILLS</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {member.interests && member.interests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">INTERESTS</p>
                      <div className="flex flex-wrap gap-1">
                        {member.interests.slice(0, 3).map((interest: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {member.interests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.interests.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(member.id);
                    }}
                  >
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredMembers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} results
            </p>
            <div className="hidden sm:flex items-center gap-2">
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

            {/* Page Numbers - Hidden on mobile */}
            <div className="hidden sm:flex gap-1">
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

            {/* Simple page indicator for mobile */}
            <span className="sm:hidden text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

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

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        member={selectedMember}
        onViewFullProfile={handleViewProfile}
      />
    </div>
  );
}