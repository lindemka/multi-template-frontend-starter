'use client';

import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, MoreHorizontal, Mail, Phone, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Member {
  id: number;
  name: string;
  email?: string;
  location: string;
  avatar: string;
  followers: number;
  rating: number;
  goals: string[];
  interests: string[];
  tagline?: string;
}

interface MembersTableProps {
  members: Member[];
  loading: boolean;
  onMemberClick: (member: Member) => void;
}

const TableSkeleton: FC = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Member</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Goals</TableHead>
        <TableHead>Rating</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const MemberRow: FC<{ member: Member; onClick: (member: Member) => void }> = ({ member, onClick }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onClick(member)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{member.name}</p>
            {member.tagline && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {member.tagline}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {member.location}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 flex-wrap">
          {member.goals.slice(0, 2).map((goal, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {goal}
            </Badge>
          ))}
          {member.goals.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{member.goals.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className={`font-medium ${getRatingColor(member.rating)}`}>
          ★ {member.rating.toFixed(1)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export const MembersTable: FC<MembersTableProps> = ({ 
  members, 
  loading,
  onMemberClick 
}) => {
  if (loading) return <TableSkeleton />;
  
  if (!members.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No members found</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Goals</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map(member => (
          <MemberRow 
            key={member.id}
            member={member}
            onClick={onMemberClick}
          />
        ))}
      </TableBody>
    </Table>
  );
};