'use client';

import { useState } from 'react';
import { X, Users, TrendingUp, Heart, Lightbulb, Building2, Search, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters: any;
}

const goalOptions = [
  { id: 'join-a-team', label: 'Join a team', icon: Users, description: 'an idea that already exists' },
  { id: 'build-up-a-team', label: 'Build up a team', icon: Building2, description: 'for my own idea / startup' },
  { id: 'find-investors', label: 'Find investors', icon: TrendingUp, description: 'for my startup project' },
  { id: 'invest', label: 'Invest', icon: TrendingUp, description: 'in startups and founding teams' },
  { id: 'need-support', label: 'Find external support', icon: Lightbulb, description: 'for my startup' },
  { id: 'support-startups', label: 'Offer support', icon: Heart, description: 'to founders / startups' },
];

const interestCategories = [
  "Advertising & Marketing",
  "AI & Machine Learning", 
  "Architecture & Construction",
  "Biotech & Pharmaceuticals",
  "Business Developer",
  "Consumer Hardware & Electronics",
  "Developer (Frontend)",
  "Developer (Backend)",
  "Food & Beverage",
  "Growth & Venture Relations",
  "Healthcare & Medical Devices",
  "Human-Machine Interaction & UX Design",
  "Marketing & Sales",
  "Product & Design",
  "Recruiting & Human Resources",
  "Safety & Security Solutions",
  "Sales Manager",
  "Social Impact & Community Development",
  "Software & SaaS",
  "Software Engineer",
  "Space Technology & Exploration",
  "Tech",
  "Tourism & Hospitality"
];

const skillCategories = [
  "Developer (Frontend)",
  "Developer (Backend)", 
  "Designer (UX/UI)",
  "Product Manager",
  "Marketing Manager",
  "Sales Manager",
  "Business Developer",
  "Data Scientist",
  "Software Engineer",
  "Growth Manager"
];

export default function FiltersModal({ isOpen, onClose, onApply, currentFilters }: FiltersModalProps) {
  const [localFilters, setLocalFilters] = useState({
    goals: currentFilters.goals || [],
    interests: currentFilters.interests || [],
    skills: currentFilters.skills || [],
    availability: currentFilters.availability || [],
    location: currentFilters.location || '',
    platforms: currentFilters.platforms || []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('goals');

  const handleGoalToggle = (goalId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((id: string) => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setLocalFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i: string) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setLocalFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s: string) => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      goals: [],
      interests: [],
      skills: [],
      availability: [],
      location: '',
      platforms: []
    });
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const getTotalFilterCount = () => {
    return localFilters.goals.length + 
           localFilters.interests.length + 
           localFilters.skills.length + 
           (localFilters.location ? 1 : 0);
  };

  const filteredInterests = interestCategories.filter(interest =>
    interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSkills = skillCategories.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col overflow-hidden" showCloseButton={false}>
        {/* Header */}
        <div className="px-6 py-4 border-b bg-white shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Filters</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 p-1.5 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 grid w-fit grid-cols-4 bg-gray-100/50">
              <TabsTrigger value="goals" className="data-[state=active]:bg-white">
                <span>Goals</span>
                {localFilters.goals.length > 0 && (
                  <Badge className="ml-1.5 h-5 min-w-[20px] px-1 bg-blue-100 text-blue-700 border-0">
                    {localFilters.goals.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="interests" className="data-[state=active]:bg-white">
                <span>Interests</span>
                {localFilters.interests.length > 0 && (
                  <Badge className="ml-1.5 h-5 min-w-[20px] px-1 bg-blue-100 text-blue-700 border-0">
                    {localFilters.interests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-white">
                <span>Skills</span>
                {localFilters.skills.length > 0 && (
                  <Badge className="ml-1.5 h-5 min-w-[20px] px-1 bg-blue-100 text-blue-700 border-0">
                    {localFilters.skills.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="location" className="data-[state=active]:bg-white">
                <span>Location</span>
                {localFilters.location && (
                  <Badge className="ml-1.5 h-5 min-w-[20px] px-1 bg-blue-100 text-blue-700 border-0">1</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Goals Tab */}
              <TabsContent value="goals" className="mt-6 space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Type of co-founder you're looking for
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = localFilters.goals.includes(goal.id);
                      
                      return (
                        <button
                          key={goal.id}
                          onClick={() => handleGoalToggle(goal.id)}
                          className={cn(
                            "relative border-2 rounded-lg p-4 transition-all text-center",
                            isSelected
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white"
                          )}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <Icon className="h-8 w-8 text-gray-600" />
                            <span className="text-sm font-medium">{goal.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Availability of your co-founder
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '0-10', label: '0-10 hours per week' },
                      { value: '10-20', label: '10-20 hours per week' },
                      { value: '20-30', label: '20-30 hours per week' },
                      { value: '30+', label: '30+ hours per week' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={localFilters.availability.includes(option.value) ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => {
                          setLocalFilters(prev => ({
                            ...prev,
                            availability: prev.availability.includes(option.value)
                              ? prev.availability.filter((a: string) => a !== option.value)
                              : [...prev.availability, option.value]
                          }));
                        }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Interests Tab */}
              <TabsContent value="interests" className="mt-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Industries your co-founder is interested in
                  </Label>
                  
                  {/* Selected interests */}
                  {localFilters.interests.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {localFilters.interests.map((interest: string) => (
                        <Badge 
                          key={interest} 
                          variant="secondary"
                          className="gap-1 bg-blue-100 text-blue-700 border-0"
                        >
                          {interest}
                          <button
                            onClick={() => handleInterestToggle(interest)}
                            className="ml-1 hover:bg-blue-200 rounded-full px-1"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Search and select */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Select industries"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <ScrollArea className="h-[300px] border rounded-lg p-2">
                      <div className="space-y-1">
                        {filteredInterests.map((interest) => (
                          <button
                            key={interest}
                            onClick={() => handleInterestToggle(interest)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                              localFilters.interests.includes(interest)
                                ? "bg-blue-100 text-blue-700"
                                : "hover:bg-gray-100"
                            )}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="mt-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Skills of your co-founder
                  </Label>
                  
                  {/* Selected skills */}
                  {localFilters.skills.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {localFilters.skills.map((skill: string) => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="gap-1 bg-blue-100 text-blue-700 border-0"
                        >
                          {skill}
                          <button
                            onClick={() => handleSkillToggle(skill)}
                            className="ml-1 hover:bg-blue-200 rounded-full px-1"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {skillCategories.map((skill) => (
                      <Button
                        key={skill}
                        variant={localFilters.skills.includes(skill) ? "default" : "outline"}
                        className="justify-start text-sm"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="mt-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Location of your co-founder
                  </Label>
                  
                  {/* Current location filter */}
                  {localFilters.location && (
                    <div className="mb-4">
                      <Badge 
                        variant="secondary"
                        className="gap-1 bg-blue-100 text-blue-700 border-0"
                      >
                        📍 {localFilters.location}
                        <button
                          onClick={() => setLocalFilters(prev => ({ ...prev, location: '' }))}
                          className="ml-1 hover:bg-blue-200 rounded-full px-1"
                        >
                          ×
                        </button>
                      </Badge>
                    </div>
                  )}

                  {/* Location search */}
                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by city or country..."
                        value={localFilters.location}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, location: e.target.value }))}
                        className="pl-10"
                      />
                    </div>

                    {/* Popular locations */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Popular locations</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'New York City, US',
                          'San Francisco, US',
                          'London, UK',
                          'Berlin, Germany',
                          'Paris, France',
                          'Toronto, Canada',
                          'Sydney, Australia',
                          'Singapore'
                        ].map((location) => (
                          <Button
                            key={location}
                            variant={localFilters.location === location ? "default" : "outline"}
                            className="justify-start text-sm"
                            onClick={() => setLocalFilters(prev => ({ ...prev, location }))}
                          >
                            <MapPin className="h-3 w-3 mr-2" />
                            {location}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Remote option */}
                    <div className="border-t pt-4">
                      <Button
                        variant={localFilters.location === 'Remote' ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setLocalFilters(prev => ({ ...prev, location: 'Remote' }))}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        Remote / Anywhere
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleReset} className="text-gray-600">
              Reset all
            </Button>
            {getTotalFilterCount() > 0 && (
              <span className="text-sm text-muted-foreground">
                {getTotalFilterCount()} filter{getTotalFilterCount() !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
              Apply filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}