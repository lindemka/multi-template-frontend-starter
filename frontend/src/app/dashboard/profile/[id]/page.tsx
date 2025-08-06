'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Building2, Link, Calendar, Users, Eye, MessageSquare, 
  ThumbsUp, Share2, Send, MoreHorizontal, PencilLine, Plus, 
  ArrowRight, CheckCircle2, ArrowLeft, Loader2 
} from "lucide-react";
import EditProfileModal from '@/components/profile/EditProfileModal';
import { userApi } from '@/lib/api';
import { User } from '@/types/api';

// Mock extended data for demonstration
const mockExtendedData = {
  goals: ["Build up a team", "Find investors", "Support startups"],
  interests: ["AI & Machine Learning", "Software & SaaS", "Biotech & Pharmaceuticals"],
  skills: ["Product Management", "Business Development", "Strategic Planning"],
  tagline: "Senior Product Manager, Ex-Scout24, Business Angel, Startup Enthusiast",
  followers: 41,
  contacts: 29,
  completionPercentage: 95,
  about: {
    short: "It's important for me to support entrepreneurial thinkers and contribute to seeing more business ideas come to life.",
    industries: ["Aerospace & Aircraft", "AI & Machine Learning", "Biotech & Pharmaceuticals", "Software & SaaS"],
    lookingFor: "Entrepreneurial minds. Founders who start building or want to join their next startup team.",
    offering: "Hands-on mentality, Marathon not sprint, Impact driven, Better try than sorry. MSc. Developmental Biology, Ex-Scout24, Senior Product Manager, Private Pilot (SPL)",
    age: "Not Specified",
    languages: ["German", "English", "Spanish", "French"]
  },
  activities: [
    { id: 1, type: "post", content: "Excited about the new AI developments in healthcare!", date: "6d" },
    { id: 2, type: "post", content: "Looking for co-founders in the biotech space.", date: "2w" },
    { id: 3, type: "post", content: "Just invested in an amazing EdTech startup!", date: "1m" }
  ],
  peopleViewed: [
    { name: "Andrew Jernigan", role: "Outside the box thinker, connector and builder", following: false },
    { name: "Alec Brewer", role: "Working to change the way we think about self, wealth, & the...", following: true },
    { name: "Michael Thompson", role: "Founder & CEO of FinFlow and fintech evangelist by heart |...", following: false },
    { name: "Emily Davis", role: "Results driven UX Design - I make your interfaces shine!", following: true }
  ]
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchUserProfile(params.id as string);
    }
  }, [params.id]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // Check if viewing own profile (you can get current user ID from auth context)
      // For now, assume ID 1 is the current user
      setIsOwnProfile(userId === '1');
      
      const userData = await userApi.getById(parseInt(userId));
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">{error || 'User not found'}</p>
              <Button 
                className="mt-4" 
                onClick={() => router.push('/dashboard/members')}
              >
                Back to Members
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => router.push('/dashboard/members')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Members
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Profile Header Card */}
            <Card className="overflow-hidden p-0">
              <div>
                {/* Cover Image - Full width */}
                <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />
                
                <div className="relative px-6 pb-4">
                  {/* Profile Avatar */}
                  <div className="absolute -top-16 left-6">
                    <div className="h-32 w-32 rounded-full ring-4 ring-white bg-white overflow-hidden">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`} />
                        <AvatarFallback className="text-3xl bg-gray-100">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Edit Profile Button - Only show for own profile */}
                  <div className="flex justify-end mb-4 pt-4">
                    {isOwnProfile && (
                      <>
                        <Button variant="ghost" size="icon" className="mr-2">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
                          <PencilLine className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      </>
                    )}
                    {!isOwnProfile && (
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Users className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="mt-8 space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold">{user.name}</h1>
                      <p className="text-gray-600">@{user.email?.split('@')[0] || 'username'}</p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{user.role || 'Member'}</span>
                    </div>

                    <p className="text-gray-700">
                      {mockExtendedData.tagline}
                    </p>

                    <div className="text-sm text-gray-600">
                      Goals: {mockExtendedData.goals.join(', ')}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-gray-600">
                        {mockExtendedData.followers} Followers · {mockExtendedData.contacts} Contacts
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.city || 'New York'}, {user.country || 'US'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {isOwnProfile ? (
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Improve profile
                        </Button>
                      ) : (
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Users className="h-4 w-4 mr-2" />
                          Follow
                        </Button>
                      )}
                      <Button variant="outline">More</Button>
                    </div>
                  </div>

                  {/* Profile Completeness - Only for own profile */}
                  {isOwnProfile && (
                    <Card className="mt-6 bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-white rounded-full p-3">
                            <div className="text-2xl font-bold text-green-600">
                              {mockExtendedData.completionPercentage}%
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">Complete Your Profile</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Awesome profile! Fully visible everywhere. Enjoy Foundersbase!
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              7 tasks remaining • Skip this for now
                            </p>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </Card>

            {/* Activity Section */}
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="posts" className="w-full">
                  <TabsList>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="reactions">Reactions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="posts" className="space-y-4 mt-4">
                    {mockExtendedData.activities.map((activity) => (
                      <Card key={activity.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{user.name}</span>
                                <span className="text-sm text-gray-500">posted this • {activity.date}</span>
                              </div>
                              <p className="mt-2">{activity.content}</p>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <button className="flex items-center gap-1 hover:text-blue-600">
                                  <ThumbsUp className="h-4 w-4" />
                                  Like
                                </button>
                                <button className="flex items-center gap-1 hover:text-blue-600">
                                  <MessageSquare className="h-4 w-4" />
                                  Comment
                                </button>
                                <button className="flex items-center gap-1 hover:text-blue-600">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="comments" className="mt-4">
                    <p className="text-gray-500 text-center py-8">No comments yet</p>
                  </TabsContent>

                  <TabsContent value="reactions" className="mt-4">
                    <p className="text-gray-500 text-center py-8">No reactions yet</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>About</CardTitle>
                  {isOwnProfile && (
                    <Button variant="ghost" size="icon">
                      <PencilLine className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">In short</h3>
                    <p className="text-gray-600">{mockExtendedData.about.short}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockExtendedData.about.industries.map((industry, i) => (
                        <Badge key={i} variant="secondary">{industry}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Looking for</h3>
                    <p className="text-gray-600">{mockExtendedData.about.lookingFor}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Offering</h3>
                    <p className="text-gray-600">{mockExtendedData.about.offering}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Languages</h3>
                    <div className="flex gap-2">
                      {mockExtendedData.about.languages.map((lang, i) => (
                        <Badge key={i} variant="secondary">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="space-y-4">
            {/* People Also Viewed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">People also viewed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExtendedData.peopleViewed.map((person, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/api/placeholder/48/48`} />
                          <AvatarFallback className="text-sm">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-tight">{person.name}</p>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">{person.role}</p>
                          <Button 
                            variant={person.following ? "secondary" : "outline"} 
                            size="sm" 
                            className="mt-2"
                          >
                            {person.following ? "Following" : "Follow"}
                          </Button>
                        </div>
                      </div>
                      {index < mockExtendedData.peopleViewed.length - 1 && <div className="border-t pt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockExtendedData.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockExtendedData.interests.map((interest, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal - Only for own profile */}
      {isOwnProfile && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
}