"use client"

import React from 'react';
import { MemberData } from '@/types/member';
import { MemberCard } from './MemberCard';
import { Loader2 } from 'lucide-react';

interface MembersListProps {
  members: MemberData[];
  loading: boolean;
  error: string | null;
  onMemberClick: (member: MemberData) => void;
}

export function MembersList({ members, loading, error, onMemberClick }: MembersListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No members found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          onClick={() => onMemberClick(member)}
        />
      ))}
    </div>
  );
}