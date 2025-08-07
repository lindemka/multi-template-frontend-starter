'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { memberApi, Member } from '@/lib/memberApi';

type ProfileData = Member & {
  email?: string;
  role?: string;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
  about?: {
    short?: string;
    shortDescription?: string;
    industries: string[];
    lookingFor: string;
    offering: string;
    languages: string[];
  };
};
import { mockFoundersData, mockExtendedProfiles } from '@/data/mockMembers';

// Old mock data structure for fallback
const oldMockFoundersData = [
  {
    id: 1,
    name: "Ahmed Salman",
    location: "New York City, US",
    avatar: "https://i.pravatar.cc/150?img=14",
    followers: 342,
    rating: 4.5,
    goals: ["Join a team", "Support startups"],
    interests: ["Advertising & Marketing", "AI & Machine Learning", "Software & SaaS"],
    skills: ["Marketing Manager", "Growth Manager", "Data Scientist"],
    assets: null,
    status: null,
    tagline: "Growth Marketing Expert | Data-Driven Strategist | Startup Enthusiast",
    about: {
      short: "Passionate about helping startups scale through data-driven marketing strategies and growth hacking techniques.",
      industries: ["Advertising & Marketing", "AI & Machine Learning", "Software & SaaS"],
      lookingFor: "Innovative teams working on AI-powered marketing solutions.",
      offering: "10+ years of growth marketing experience, expertise in A/B testing, analytics, and user acquisition.",
      languages: ["English", "Arabic", "Spanish"]
    }
  },
  {
    id: 2,
    name: "Andy Mitchell",
    location: "San Francisco, US",
    avatar: "https://i.pravatar.cc/150?img=33",
    followers: 1289,
    rating: 5,
    goals: ["Build up a team", "Find investors", "Need support"],
    interests: ["Tourism & Hospitality", "Marketing & Sales", "Business Developer", "Growth & Venture Relations"],
    skills: ["Business Developer", "Sales Manager"],
    assets: { type: "Startup", label: "TravelTech Inc." },
    status: "Open Jobs",
    tagline: "CEO @ TravelTech Inc. | Revolutionizing Travel Experiences",
    about: {
      short: "Building the future of travel technology with AI-powered personalization and seamless booking experiences.",
      industries: ["Tourism & Hospitality", "Marketing & Sales", "Tech"],
      lookingFor: "Technical co-founder with expertise in ML and passionate investors in travel tech.",
      offering: "Industry connections, proven track record in hospitality tech, Series A ready.",
      languages: ["English", "French"]
    }
  },
  {
    id: 3,
    name: "Kinne Zhang",
    location: "London, UK",
    avatar: "https://i.pravatar.cc/150?img=5",
    followers: 567,
    rating: 4.8,
    goals: ["Build up a team", "Find investors"],
    interests: ["Advertising & Marketing", "Architecture & Construction", "AI & Machine Learning"],
    skills: ["Product Manager", "Designer (UX/UI)"],
    assets: { type: "Startup", label: "BuildSmart AI" },
    status: "Funded Series A",
    tagline: "Founder @ BuildSmart AI | Making Construction Smarter",
    about: {
      short: "Using AI to revolutionize the construction industry with predictive analytics and smart project management.",
      industries: ["Architecture & Construction", "AI & Machine Learning"],
      lookingFor: "Engineers passionate about PropTech and investors for Series B.",
      offering: "Deep industry knowledge, technical expertise, proven product-market fit.",
      languages: ["English", "Mandarin", "Cantonese"]
    }
  },
  {
    id: 4,
    name: "Brent Thompson",
    location: "Berlin, Germany",
    avatar: "https://i.pravatar.cc/150?img=7",
    followers: 423,
    rating: 4.5,
    goals: ["Join a team", "Support startups"],
    interests: ["AI & Machine Learning", "Healthcare & Medical Devices", "Biotech & Pharmaceuticals"],
    skills: ["Developer (Backend)", "Software Engineer", "Data Scientist"],
    assets: null,
    status: null,
    tagline: "Full-Stack ML Engineer | Healthcare Tech Specialist",
    about: {
      short: "Combining software engineering with machine learning to solve healthcare challenges.",
      industries: ["Healthcare & Medical Devices", "AI & Machine Learning", "Biotech & Pharmaceuticals"],
      lookingFor: "HealthTech startups working on meaningful problems.",
      offering: "8 years experience in ML/AI, expertise in Python, TensorFlow, cloud architecture.",
      languages: ["English", "German"]
    }
  },
  {
    id: 5,
    name: "Theresa Chen",
    location: "Toronto, Canada",
    avatar: "https://i.pravatar.cc/150?img=9",
    followers: 892,
    rating: 4.9,
    goals: ["Build up a team", "Find investors"],
    interests: ["AI & Machine Learning", "Human-Machine Interaction & UX Design", "Tech", "Product & Design"],
    skills: ["Developer (Frontend)", "Developer (Backend)", "Software Engineer", "Designer (UX/UI)"],
    assets: { type: "Startup", label: "DesignAI Labs" },
    status: "Hiring Engineers",
    tagline: "CTO @ DesignAI Labs | Making Design Accessible with AI",
    about: {
      short: "Building AI tools that empower designers and democratize great design.",
      industries: ["AI & Machine Learning", "Human-Machine Interaction & UX Design", "Tech"],
      lookingFor: "Senior engineers and seed investors passionate about design tools.",
      offering: "Technical leadership, full-stack expertise, design thinking methodology.",
      languages: ["English", "Mandarin", "French"]
    }
  }
];

export default function ProfilePageClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
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
      
      // Check if viewing own profile
      setIsOwnProfile(userId === '1');
      
      try {
        // Try to fetch member from API
        const memberData = await memberApi.getById(parseInt(userId));
        setProfileData(memberData as ProfileData);
      } catch (apiErr) {
        // If API fails, try mock data
        const mockUser = mockFoundersData.find(u => u.id === parseInt(userId));
        
        if (mockUser) {
          setProfileData({
            ...mockUser,
            status: mockUser.status || undefined,
            assets: mockUser.assets ? { label: mockUser.assets.label } : undefined
          } as ProfileData);
        } else {
          // Use fallback mock data
          const fallbackUser = mockFoundersData[parseInt(userId) % mockFoundersData.length] || mockFoundersData[0];
          setProfileData({
            ...fallbackUser,
            id: parseInt(userId),
            status: fallbackUser.status || undefined,
            assets: fallbackUser.assets ? { label: fallbackUser.assets.label } : undefined
          } as ProfileData);
        }
      }
    } catch (err) {
      console.error('Failed to fetch member profile:', err);
      setError('Failed to load member profile');
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

  if (error || !profileData) {
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
                        <AvatarImage src={profileData.avatar} />
                        <AvatarFallback className="text-3xl bg-gray-100">
                          {(profileData?.name || '').split(' ').map(n => n[0]).join('')}
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
                      <h1 className="text-2xl font-bold">{profileData.name}</h1>
                      <p className="text-gray-600">@{profileData.email?.split('@')[0] || profileData.name.toLowerCase().replace(/\s+/g, '')}</p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData?.location || 'Location not set'}</span>
                    </div>

                    <p className="text-gray-700">
                      {profileData.tagline || 'Building something amazing'}
                    </p>

                    <div className="text-sm text-gray-600">
                      Goals: {profileData.goals?.join(', ') || 'Not specified'}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-gray-600">
                        {profileData.followers || 0} Followers · {Math.floor(profileData.followers * 0.3) || 0} Contacts
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profileData.location || 'New York, US'}
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
                              {mockExtendedProfiles.completionPercentage}%
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
                    {mockExtendedProfiles.activities.map((activity) => (
                      <Card key={activity.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={profileData.avatar} />
                              <AvatarFallback>{(profileData?.name || '').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{profileData?.name}</span>
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
                    <p className="text-gray-600">{profileData.about?.shortDescription || profileData.about?.short || 'No description available'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      {(profileData.about?.industries || profileData.interests || []).slice(0, 4).map((industry, i) => (
                        <Badge key={i} variant="secondary">{industry}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Looking for</h3>
                    <p className="text-gray-600">{profileData.about?.lookingFor || 'Open to opportunities'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Offering</h3>
                    <p className="text-gray-600">{profileData.about?.offering || 'Skills and expertise'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Languages</h3>
                    <div className="flex gap-2">
                      {(profileData.about?.languages || ['English']).map((lang, i) => (
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
                  {mockExtendedProfiles.peopleViewed.map((person, index) => (
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
                      {index < mockExtendedProfiles.peopleViewed.length - 1 && <div className="border-t pt-3" />}
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
                  {(profileData.skills || []).map((skill, i) => (
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
                  {(profileData.interests || []).map((interest, i) => (
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