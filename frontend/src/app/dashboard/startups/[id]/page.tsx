'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Globe, 
  Briefcase,
  Mail,
  Phone,
  Rocket
} from "lucide-react";
import Link from "next/link";

interface Startup {
  id: number;
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  website?: string;
  foundedDate?: string;
  stage: string;
  industry: string;
  teamSize: number;
  location: string;
  isHiring: boolean;
  isFundraising: boolean;
  fundingAmount?: number;
  revenueRange?: string;
  productStatus?: string;
  createdAt: string;
  updatedAt: string;
}

interface StartupMember {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  role: string;
  equityPercentage?: number;
  joinedDate: string;
  isActive: boolean;
}

// Dynamic route - will be handled by SPA routing

export default function StartupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [members, setMembers] = useState<StartupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchStartupDetails();
    }
  }, [params.id]);

  const fetchStartupDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch startup details
      const startupResponse = await api.get(`/api/startups/${params.id}`);
      setStartup(startupResponse.data);
      
      // Fetch startup members
      const membersResponse = await api.get(`/api/startups/${params.id}/members`);
      setMembers(membersResponse.data);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching startup details:', err);
      setError('Failed to fetch startup details');
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'idea': return 'bg-gray-500';
      case 'mvp': return 'bg-blue-500';
      case 'seed': return 'bg-green-500';
      case 'growth': return 'bg-purple-500';
      case 'revenue': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/startups')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Startups
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-xl font-semibold mb-2">Startup not found</p>
            <p className="text-muted-foreground">{error || 'The startup you are looking for does not exist.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/startups')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Startups
        </Button>
        <div className="flex gap-2">
          {startup.website && (
            <Link href={startup.website} target="_blank">
              <Button variant="outline" className="gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Button>
            </Link>
          )}
          <Button>Contact Team</Button>
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {startup.logoUrl && (
                <img 
                  src={startup.logoUrl} 
                  alt={startup.name} 
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div>
                <CardTitle className="text-2xl">{startup.name}</CardTitle>
                <CardDescription className="text-lg mt-1">
                  {startup.tagline}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={`${getStageColor(startup.stage)} text-white`}>
                    {startup.stage}
                  </Badge>
                  <Badge variant="outline">{startup.industry}</Badge>
                  {startup.isHiring && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Briefcase className="h-3 w-3 mr-1" />
                      Hiring
                    </Badge>
                  )}
                  {startup.isFundraising && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Fundraising
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            {startup.description}
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{startup.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="font-medium">{startup.teamSize} members</p>
              </div>
            </div>
            {startup.foundedDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p className="font-medium">
                    {new Date(startup.foundedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            {startup.fundingAmount && (
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Funding</p>
                  <p className="font-medium">
                    ${(startup.fundingAmount / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="team" className="space-y-4">
        <TabsList>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="jobs">Open Positions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Meet the people building {startup.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarImage 
                        src={`https://ui-avatars.com/api/?name=${member.user.firstName}+${member.user.lastName}&background=6366f1&color=fff`} 
                      />
                      <AvatarFallback>
                        {member.user.firstName[0]}{member.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {member.user.firstName} {member.user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      {member.equityPercentage && (
                        <p className="text-xs text-muted-foreground">
                          {member.equityPercentage}% equity
                        </p>
                      )}
                    </div>
                    <Link href={`/dashboard/profile/${member.user.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About {startup.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Product Status</h3>
                <p className="text-muted-foreground">
                  {startup.productStatus || 'In development'}
                </p>
              </div>
              {startup.revenueRange && (
                <div>
                  <h3 className="font-semibold mb-2">Revenue Range</h3>
                  <p className="text-muted-foreground">{startup.revenueRange}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Industry</h3>
                <p className="text-muted-foreground">{startup.industry}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>
                Join the team at {startup.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {startup.isHiring ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">We're hiring!</p>
                  <p className="text-muted-foreground mb-4">
                    Contact the team to learn about open positions
                  </p>
                  <Button>Get in Touch</Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No open positions at this time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}