'use client';

import { X, MapPin, Briefcase, Users, Star, Mail, Phone, Globe, Linkedin, Twitter, Github, MessageCircle, UserPlus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { openChatWith, resolveUsernameForProfileId } from '@/lib/openChat'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

type MemberData = {
  id: number;
  name: string;
  email?: string;
  role?: string;
  status?: string;
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

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberData | null;
  onViewFullProfile: (id: number) => void;
}

export default function ProfileDrawer({ isOpen, onClose, member, onViewFullProfile }: ProfileDrawerProps) {
  if (!member) return null;

  const getGoalIcon = (goal: string) => {
    switch (goal.toLowerCase()) {
      case 'join a team':
        return <Users className="h-3 w-3" />;
      case 'build up a team':
        return <Users className="h-3 w-3" />;
      case 'find investors':
        return <Briefcase className="h-3 w-3" />;
      case 'invest':
        return <Briefcase className="h-3 w-3" />;
      case 'support startups':
        return <Star className="h-3 w-3" />;
      case 'need support':
        return <Star className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0" showCloseButton={false}>
        {/* Header with gradient background */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/10 backdrop-blur p-2 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="text-2xl">
                {member.name?.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
          <div className="p-6 pt-16">
            {/* Name and basic info */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {member.location}
              </p>
              {member.tagline && (
                <p className="text-sm text-gray-600">{member.tagline}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">{member.followers}</span>
                <span className="text-gray-500">followers</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-orange-400" />
                <span className="font-semibold">{member.rating?.toFixed(1)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => onViewFullProfile(member.id)}
              >
                View Full Profile
              </Button>
              <Button
                aria-label={`Message ${member.name}`}
                variant="outline"
                size="icon"
                onClick={async () => {
                  const username = await resolveUsernameForProfileId(member.id)
                  if (username) openChatWith(username)
                }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Assets and Status */}
            {(member.assets || member.status) && (
              <>
                <div className="space-y-3">
                  {member.assets && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Asset</span>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{member.assets.label}</span>
                      </div>
                    </div>
                  )}
                  {member.status && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <Badge variant="outline" className="text-xs">
                        {member.status}
                      </Badge>
                    </div>
                  )}
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Goals */}
            {member.goals && member.goals.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {member.goals.map((goal: string, index: number) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {getGoalIcon(goal)}
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {member.skills && member.skills.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="font-semibold text-sm">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {member.interests && member.interests.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="font-semibold text-sm">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {member.interests.slice(0, 6).map((interest: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {member.interests.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.interests.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* About section */}
            {member.about && (
              <div className="space-y-3 mt-6">
                <h3 className="font-semibold text-sm">About</h3>
                <p className="text-sm text-gray-600">
                  {member.about.short}
                </p>

                {member.about.lookingFor && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Looking for</h4>
                    <p className="text-sm text-gray-600">{member.about.lookingFor}</p>
                  </div>
                )}

                {member.about.offering && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Offering</h4>
                    <p className="text-sm text-gray-600">{member.about.offering}</p>
                  </div>
                )}

                {member.about.languages && member.about.languages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.about.languages.map((lang: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Contact Card */}
            <Card className="mt-6 bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-3">Quick Contact</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    View Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}