"use client"

import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building, Star, Calendar, CheckCircle2 } from "lucide-react";
import { MemberData } from '@/types/member';

interface MemberCardProps {
  member: MemberData;
  onClick: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'founder': return 'bg-purple-100 text-purple-800';
      case 'investor': return 'bg-green-100 text-green-800';
      case 'advisor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability?: string) => {
    switch (availability?.toLowerCase()) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.profileImageUrl} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback>{getInitials(member.firstName, member.lastName)}</AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getAvailabilityColor(member.availability)}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {member.firstName} {member.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{member.professionalTitle || 'Member'}</p>
          </div>
        </div>
        <Badge className={getRoleBadgeColor(member.role)}>
          {member.role}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        {member.company && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{member.company}</span>
          </div>
        )}
        
        {member.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{member.location}</span>
          </div>
        )}

        {member.rating && (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{member.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Joined {formatDate(member.joinedDate || member.createdAt)}</span>
        </div>
      </div>

      {member.skills && member.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {member.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {member.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{member.skills.length - 3}
            </Badge>
          )}
        </div>
      )}

      {member.bio && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {member.bio}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {member.lookingFor && member.lookingFor.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Looking for {member.lookingFor.length} things
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}