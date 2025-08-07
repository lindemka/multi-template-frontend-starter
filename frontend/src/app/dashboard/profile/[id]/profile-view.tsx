'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import api from '@/lib/api';
import ProfileEdit from './profile-edit';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, Building2, Calendar, Users, MessageSquare, 
  ThumbsUp, Share2, MoreHorizontal, PencilLine, 
  ArrowLeft, Loader2, Target, Heart, Lightbulb,
  Briefcase, TrendingUp, Globe, Mail, Phone, Star
} from "lucide-react";

interface ProfileViewProps {
  profileId: string;
}

export default function ProfileView({ profileId }: ProfileViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = auth.getUser();
      setCurrentUser(user);
      
      // Check if viewing own profile or if admin
      if (user) {
        setIsOwnProfile(user.id?.toString() === profileId);
        setIsAdmin(user.role === 'ADMIN');
      }
      
      // Fetch profile data
      const response = await api.get(`/api/members/${profileId}`);
      setProfile(response.data);
      
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
  };

  const handleEditSave = () => {
    setEditMode(false);
    loadProfile(); // Reload profile after save
  };

  const getGoalIcon = (goal: string) => {
    switch(goal.toLowerCase()) {
      case 'find co-founder':
      case 'build up a team':
        return <Users className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error || 'Profile not found'}</AlertDescription>
      </Alert>
    );
  }

  if (editMode) {
    return (
      <ProfileEdit 
        profileId={profileId}
        onCancel={handleEditCancel}
        onSave={handleEditSave}
      />
    );
  }

  const canEdit = isOwnProfile || isAdmin;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/members')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Members
        </Button>
        
        {canEdit && (
          <Button onClick={handleEditClick}>
            <PencilLine className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card>
        <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <CardContent className="relative">
          <div className="absolute -top-16 left-6">
            <Avatar className="h-32 w-32 ring-4 ring-white">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-2xl">
                {profile.name?.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="pt-20 space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                {profile.isFounder && (
                  <Badge className="bg-purple-100 text-purple-700">Founder</Badge>
                )}
                {profile.isInvestor && (
                  <Badge className="bg-green-100 text-green-700">Investor</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{profile.tagline}</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.location || 'Location not set'}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {profile.followers || 0} followers
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                {profile.rating || 0}
              </div>
            </div>
            
            {/* Goals */}
            {profile.goals && profile.goals.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.goals.map((goal: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="gap-1">
                    {getGoalIcon(goal)}
                    {goal}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
          {profile.isFounder && <TabsTrigger value="founder">Founder Profile</TabsTrigger>}
          {profile.isInvestor && <TabsTrigger value="investor">Investor Profile</TabsTrigger>}
        </TabsList>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Introduction</h3>
                <p className="text-muted-foreground">
                  {profile.about?.shortDescription || 'No introduction provided yet.'}
                </p>
              </div>
              
              {profile.about?.lookingFor && (
                <div>
                  <h3 className="font-semibold mb-2">Looking For</h3>
                  <p className="text-muted-foreground">{profile.about.lookingFor}</p>
                </div>
              )}
              
              {profile.about?.offering && (
                <div>
                  <h3 className="font-semibold mb-2">What I Offer</h3>
                  <p className="text-muted-foreground">{profile.about.offering}</p>
                </div>
              )}
              
              {profile.about?.industries && profile.about.industries.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.about.industries.map((industry: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{industry}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.about?.languages && profile.about.languages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.about.languages.map((language: string, idx: number) => (
                      <Badge key={idx} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Interests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-700">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {profile.isFounder && profile.founderProfile && (
          <TabsContent value="founder">
            <Card>
              <CardHeader>
                <CardTitle>Founder Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.founderProfile.myIntroduction && (
                  <div>
                    <h3 className="font-semibold mb-2">Introduction</h3>
                    <p className="text-muted-foreground">{profile.founderProfile.myIntroduction}</p>
                  </div>
                )}
                
                {profile.founderProfile.myMotivation && (
                  <div>
                    <h3 className="font-semibold mb-2">Motivation</h3>
                    <p className="text-muted-foreground">{profile.founderProfile.myMotivation}</p>
                  </div>
                )}
                
                <div className="flex gap-4">
                  {profile.founderProfile.lookingForCofounder && (
                    <Badge className="bg-purple-100 text-purple-700">
                      Looking for Co-founder
                    </Badge>
                  )}
                  {profile.founderProfile.lookingForInvestor && (
                    <Badge className="bg-green-100 text-green-700">
                      Looking for Investors
                    </Badge>
                  )}
                </div>
                
                {profile.founderProfile.yearsExperience > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {profile.founderProfile.yearsExperience} years of experience
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {profile.isInvestor && profile.investorProfile && (
          <TabsContent value="investor">
            <Card>
              <CardHeader>
                <CardTitle>Investor Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.investorProfile.investmentFocus && (
                  <div>
                    <h3 className="font-semibold mb-2">Investment Focus</h3>
                    <p className="text-muted-foreground">{profile.investorProfile.investmentFocus}</p>
                  </div>
                )}
                
                {profile.investorProfile.investmentExperience && (
                  <div>
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <p className="text-muted-foreground">{profile.investorProfile.investmentExperience}</p>
                  </div>
                )}
                
                {(profile.investorProfile.investmentRangeMin > 0 || profile.investorProfile.investmentRangeMax > 0) && (
                  <div>
                    <h3 className="font-semibold mb-2">Investment Range</h3>
                    <p className="text-lg font-semibold">
                      ${(profile.investorProfile.investmentRangeMin || 0).toLocaleString()} - 
                      ${(profile.investorProfile.investmentRangeMax || 0).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}