'use client';

import { useState, useMemo } from 'react';
import { X, Lightbulb, Users, TrendingUp, HeartHandshake, HelpCircle, Briefcase, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// City data with country/state information
const cities = [
  { value: "new-york", label: "New York City", location: "New York, US" },
  { value: "san-francisco", label: "San Francisco", location: "California, US" },
  { value: "los-angeles", label: "Los Angeles", location: "California, US" },
  { value: "chicago", label: "Chicago", location: "Illinois, US" },
  { value: "boston", label: "Boston", location: "Massachusetts, US" },
  { value: "seattle", label: "Seattle", location: "Washington, US" },
  { value: "austin", label: "Austin", location: "Texas, US" },
  { value: "denver", label: "Denver", location: "Colorado, US" },
  { value: "miami", label: "Miami", location: "Florida, US" },
  { value: "london", label: "London", location: "England, GB" },
  { value: "paris", label: "Paris", location: "France" },
  { value: "berlin", label: "Berlin", location: "Germany" },
  { value: "toronto", label: "Toronto", location: "Ontario, CA" },
  { value: "sydney", label: "Sydney", location: "New South Wales, AU" },
  { value: "tokyo", label: "Tokyo", location: "Japan" },
  { value: "singapore", label: "Singapore", location: "Singapore" },
  { value: "newbury", label: "Newbury", location: "England, GB" },
  { value: "newberry", label: "Newberry", location: "Florida, US" },
];

const goals = [
  {
    id: 'join-startup',
    label: 'Join a startup',
    description: 'an idea that already exists',
    icon: Lightbulb,
    color: 'text-yellow-500'
  },
  {
    id: 'build-team',
    label: 'Build up a team',
    description: 'for my own idea / startup',
    icon: Users,
    color: 'text-blue-500'
  },
  {
    id: 'find-investors',
    label: 'Find investors',
    description: 'for my startup project',
    icon: TrendingUp,
    color: 'text-green-500'
  },
  {
    id: 'invest',
    label: 'Invest',
    description: 'in startups and founding teams',
    icon: TrendingUp,
    color: 'text-purple-500'
  },
  {
    id: 'find-support',
    label: 'Find external support',
    description: 'for my startup',
    icon: HeartHandshake,
    color: 'text-red-500'
  },
  {
    id: 'offer-support',
    label: 'Offer support',
    description: 'to founders / startups',
    icon: HelpCircle,
    color: 'text-indigo-500'
  }
];

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: 'Kai',
    lastName: 'Lindemann',
    pronoun: 'he/him',
    tagline: 'CEO @ foundersbase.com - Senior Product Manager, Ex-Scout24, Business Angel, Startup Enthusiast',
    city: 'new-york',
    selectedGoals: ['offer-support']
  });
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goalId)
        ? prev.selectedGoals.filter(id => id !== goalId)
        : [...prev.selectedGoals, goalId]
    }));
  };

  const handleSave = () => {
    // Mock save - just close the modal
    console.log('Saving profile data:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col overflow-hidden" showCloseButton={false}>
        {/* Header */}
        <div className="px-6 py-4 border-b bg-white shrink-0 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit</h2>
            <button
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 p-1.5 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Name Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium">
                  Full name<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center w-4 h-4" type="button">
                        <span className="sr-only">Info</span>
                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">Your full name as it will appear on your profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="First name"
                  className="bg-white border-gray-200 focus:border-blue-500 transition-colors"
                />
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Last name"
                  className="bg-white border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Pronoun */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="pronoun" className="text-sm font-medium">
                  Pronoun<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center w-4 h-4" type="button">
                        <span className="sr-only">Info</span>
                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">Select your preferred pronouns</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={formData.pronoun} onValueChange={(value) => setFormData({...formData, pronoun: value})}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="he/him">he/him</SelectItem>
                  <SelectItem value="she/her">she/her</SelectItem>
                  <SelectItem value="they/them">they/them</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="tagline" className="text-sm font-medium">
                  Tagline<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center w-4 h-4" type="button">
                        <span className="sr-only">Info</span>
                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">A brief description that appears under your name</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="tagline"
                value={formData.tagline}
                onChange={(e) => {
                  if (e.target.value.length <= 160) {
                    setFormData({...formData, tagline: e.target.value});
                  }
                }}
                placeholder="Your professional tagline"
                className="min-h-[80px] resize-none bg-white border-gray-200 focus:border-blue-500 transition-colors"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">Be specific about your role and experience</p>
                <p className={cn(
                  "text-xs transition-colors",
                  formData.tagline.length > 140 ? "text-orange-500" : "text-gray-500"
                )}>
                  {formData.tagline.length} / 160
                </p>
              </div>
            </div>

            {/* Goals Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium">
                  My goals<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center w-4 h-4" type="button">
                        <span className="sr-only">Info</span>
                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">Select what you want to achieve on Foundersbase</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = formData.selectedGoals.includes(goal.id);
                  
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={cn(
                        "relative bg-white border-2 rounded-lg p-4 transition-all text-center group hover:shadow-md",
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {/* Checkmark indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className={cn(
                          "p-3 rounded-full transition-colors",
                          isSelected ? "bg-blue-100" : "bg-gray-50 group-hover:bg-gray-100"
                        )}>
                          <Icon className={cn("h-8 w-8", goal.color)} />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{goal.label}</h4>
                          <p className="text-xs text-gray-500 mt-0.5 leading-tight">{goal.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {formData.selectedGoals.length === 0 && (
                <p className="text-xs text-orange-500">Please select at least one goal</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="city" className="text-sm font-medium">
                  City<span className="text-red-500 ml-0.5">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center w-4 h-4" type="button">
                        <span className="sr-only">Info</span>
                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">Your current city location</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityOpen}
                    className="w-full justify-between bg-white border-gray-200 hover:bg-gray-50 font-normal"
                  >
                    {formData.city
                      ? cities.find((city) => city.value === formData.city)?.label
                      : "Select city..."}
                    <svg className="ml-2 h-4 w-4 shrink-0 opacity-50" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4"/>
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search city..." 
                      value={citySearch}
                      onValueChange={setCitySearch}
                      className="h-9"
                    />
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {cities
                        .filter(city => 
                          city.label.toLowerCase().includes(citySearch.toLowerCase()) ||
                          city.location.toLowerCase().includes(citySearch.toLowerCase())
                        )
                        .map((city) => (
                          <CommandItem
                            key={city.value}
                            value={city.value}
                            onSelect={(currentValue) => {
                              setFormData({...formData, city: currentValue});
                              setCityOpen(false);
                              setCitySearch('');
                            }}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium">{city.label}</div>
                              <div className="text-xs text-gray-500">{city.location}</div>
                            </div>
                            {formData.city === city.value && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {formData.city && (
                <p className="text-xs text-gray-500">
                  {cities.find(c => c.value === formData.city)?.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-white shrink-0 flex justify-between items-center rounded-b-lg">
          <p className="text-xs text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={formData.selectedGoals.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}