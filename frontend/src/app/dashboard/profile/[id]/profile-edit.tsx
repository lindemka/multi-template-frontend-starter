'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Save, X, Loader2, MapPin, Briefcase, Globe, Target, Heart, 
  Building2, DollarSign, Users, Lightbulb, Edit2, Plus, Trash2 
} from "lucide-react";

interface ProfileEditProps {
  profileId: string;
  onCancel: () => void;
  onSave: () => void;
}

export default function ProfileEdit({ profileId, onCancel, onSave }: ProfileEditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    tagline: '',
    shortDescription: '',
    lookingFor: '',
    offering: '',
    goals: [] as string[],
    interests: [] as string[],
    skills: [] as string[],
    industries: [] as string[],
    languages: [] as string[],
    isFounder: false,
    isInvestor: false,
    founderProfile: {
      myIntroduction: '',
      myMotivation: '',
      lookingForCofounder: false,
      lookingForInvestor: false,
      yearsExperience: 0
    },
    investorProfile: {
      investmentFocus: '',
      investmentExperience: '',
      investmentRangeMin: 0,
      investmentRangeMax: 0
    }
  });

  useEffect(() => {
    checkPermissionsAndLoadProfile();
  }, [profileId]);

  const checkPermissionsAndLoadProfile = async () => {
    try {
      const user = auth.getUser();
      setCurrentUser(user);
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Load profile data
      const profileResponse = await api.get(`/api/members/${profileId}`);
      const profileData = profileResponse.data;
      
      // Check if user can edit (owner or admin)
      const isOwner = user.id.toString() === profileId;
      const isAdmin = user.role === 'ADMIN';
      setCanEdit(isOwner || isAdmin);
      
      if (!canEdit && !isOwner && !isAdmin) {
        setMessage({ type: 'error', text: 'You do not have permission to edit this profile' });
        setTimeout(() => onCancel(), 2000);
        return;
      }
      
      setProfile(profileData);
      
      // Initialize form data
      setFormData({
        name: profileData.name || '',
        location: profileData.location || '',
        tagline: profileData.tagline || '',
        shortDescription: profileData.about?.shortDescription || '',
        lookingFor: profileData.about?.lookingFor || '',
        offering: profileData.about?.offering || '',
        goals: profileData.goals || [],
        interests: profileData.interests || [],
        skills: profileData.skills || [],
        industries: profileData.about?.industries || [],
        languages: profileData.about?.languages || [],
        isFounder: profileData.isFounder || false,
        isInvestor: profileData.isInvestor || false,
        founderProfile: profileData.founderProfile || {
          myIntroduction: '',
          myMotivation: '',
          lookingForCofounder: false,
          lookingForInvestor: false,
          yearsExperience: 0
        },
        investorProfile: profileData.investorProfile || {
          investmentFocus: '',
          investmentExperience: '',
          investmentRangeMin: 0,
          investmentRangeMax: 0
        }
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Update profile
      await api.put(`/api/members/${profileId}`, {
        name: formData.name,
        location: formData.location,
        tagline: formData.tagline,
        about: {
          shortDescription: formData.shortDescription,
          lookingFor: formData.lookingFor,
          offering: formData.offering,
          industries: formData.industries,
          languages: formData.languages
        },
        goals: formData.goals,
        interests: formData.interests,
        skills: formData.skills
      });

      // Update founder profile if applicable
      if (formData.isFounder) {
        await api.put(`/api/members/${profileId}/founder-profile`, formData.founderProfile);
      }

      // Update investor profile if applicable
      if (formData.isInvestor) {
        await api.put(`/api/members/${profileId}/investor-profile`, formData.investorProfile);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => onSave(), 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: string, value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData as any)[field], value.trim()]
      });
    }
  };

  const removeItem = (field: string, index: number) => {
    const items = [...(formData as any)[field]];
    items.splice(index, 1);
    setFormData({
      ...formData,
      [field]: items
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <Alert variant="destructive">
        <AlertDescription>You do not have permission to edit this profile.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {message.text && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="skills">Skills & Goals</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Your professional tagline"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.tagline.length}/100 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lookingFor">What I\'m Looking For</Label>
                <Textarea
                  id="lookingFor"
                  value={formData.lookingFor}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                  placeholder="Describe what you're looking for..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offering">What I Can Offer</Label>
                <Textarea
                  id="offering"
                  value={formData.offering}
                  onChange={(e) => setFormData({ ...formData, offering: e.target.value })}
                  placeholder="Describe what you can offer..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills, Goals & Interests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Goals */}
              <div className="space-y-2">
                <Label>Goals</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.goals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {goal}
                      <button
                        onClick={() => removeItem('goals', index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a goal"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem('goals', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a goal"]') as HTMLInputElement;
                      if (input) {
                        addItem('goals', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        onClick={() => removeItem('skills', index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem('skills', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a skill"]') as HTMLInputElement;
                      if (input) {
                        addItem('skills', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {interest}
                      <button
                        onClick={() => removeItem('interests', index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem('interests', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add an interest"]') as HTMLInputElement;
                      if (input) {
                        addItem('interests', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Founder Profile */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFounder" className="text-base font-semibold">
                    I am a Founder
                  </Label>
                  <Switch
                    id="isFounder"
                    checked={formData.isFounder}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFounder: checked })}
                  />
                </div>
                
                {formData.isFounder && (
                  <div className="space-y-4 pl-4 border-l-2">
                    <div className="space-y-2">
                      <Label>Introduction</Label>
                      <Textarea
                        value={formData.founderProfile.myIntroduction}
                        onChange={(e) => setFormData({
                          ...formData,
                          founderProfile: { ...formData.founderProfile, myIntroduction: e.target.value }
                        })}
                        placeholder="Introduce yourself as a founder..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Motivation</Label>
                      <Textarea
                        value={formData.founderProfile.myMotivation}
                        onChange={(e) => setFormData({
                          ...formData,
                          founderProfile: { ...formData.founderProfile, myMotivation: e.target.value }
                        })}
                        placeholder="What motivates you..."
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="lookingForCofounder"
                        checked={formData.founderProfile.lookingForCofounder}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          founderProfile: { ...formData.founderProfile, lookingForCofounder: checked }
                        })}
                      />
                      <Label htmlFor="lookingForCofounder">Looking for Co-founder</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="lookingForInvestor"
                        checked={formData.founderProfile.lookingForInvestor}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          founderProfile: { ...formData.founderProfile, lookingForInvestor: checked }
                        })}
                      />
                      <Label htmlFor="lookingForInvestor">Looking for Investors</Label>
                    </div>
                  </div>
                )}
              </div>

              {/* Investor Profile */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isInvestor" className="text-base font-semibold">
                    I am an Investor
                  </Label>
                  <Switch
                    id="isInvestor"
                    checked={formData.isInvestor}
                    onCheckedChange={(checked) => setFormData({ ...formData, isInvestor: checked })}
                  />
                </div>
                
                {formData.isInvestor && (
                  <div className="space-y-4 pl-4 border-l-2">
                    <div className="space-y-2">
                      <Label>Investment Focus</Label>
                      <Textarea
                        value={formData.investorProfile.investmentFocus}
                        onChange={(e) => setFormData({
                          ...formData,
                          investorProfile: { ...formData.investorProfile, investmentFocus: e.target.value }
                        })}
                        placeholder="Industries and stages you focus on..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Investment Experience</Label>
                      <Textarea
                        value={formData.investorProfile.investmentExperience}
                        onChange={(e) => setFormData({
                          ...formData,
                          investorProfile: { ...formData.investorProfile, investmentExperience: e.target.value }
                        })}
                        placeholder="Your investment experience..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Min Investment ($)</Label>
                        <Input
                          type="number"
                          value={formData.investorProfile.investmentRangeMin}
                          onChange={(e) => setFormData({
                            ...formData,
                            investorProfile: { ...formData.investorProfile, investmentRangeMin: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Investment ($)</Label>
                        <Input
                          type="number"
                          value={formData.investorProfile.investmentRangeMax}
                          onChange={(e) => setFormData({
                            ...formData,
                            investorProfile: { ...formData.investorProfile, investmentRangeMax: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}