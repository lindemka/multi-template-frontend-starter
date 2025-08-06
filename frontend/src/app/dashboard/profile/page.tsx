'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Building2, Link, Calendar, Users, Eye, MessageSquare, ThumbsUp, Share2, Send, MoreHorizontal, PencilLine, Plus, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import EditProfileModal from '@/components/profile/EditProfileModal';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Redirect to current user's profile (assuming user ID 1 for demo)
  // In a real app, get this from auth context
  useEffect(() => {
    router.push('/dashboard/profile/1');
  }, [router]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
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
                        <AvatarImage src="/api/placeholder/150/150" alt="Profile" />
                        <AvatarFallback className="text-3xl bg-gray-100">KL</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <div className="flex justify-end mb-4 pt-4">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                    <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
                      <PencilLine className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="mt-8 space-y-4">
                    <div>
                    <h1 className="text-2xl font-bold">Kai Lindemann</h1>
                    <p className="text-gray-600">@kailindemann</p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Admin: Manage User</span>
                  </div>

                  <p className="text-gray-700">
                    CEO @ foundersbase.com - Senior Product Manager, Ex-Scout24, Business Angel, Startup Enthusiast
                  </p>

                  <div className="text-sm text-gray-600">
                    Goals: Support startups
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-600">41 Followers · 29 Contacts</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      New York City, United States (USA)
                    </span>
                    <a href="#" className="text-blue-600 hover:underline">Contact information</a>
                  </div>

                    <div className="flex gap-2">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Improve profile
                      </Button>
                      <Button variant="outline">More</Button>
                    </div>
                  </div>

                  {/* Profile Completeness */}
                  <Card className="mt-6 bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-white rounded-full p-3">
                        <div className="text-2xl font-bold text-green-600">95%</div>
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

                    <Card className="mt-4 bg-white">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Tell Us More About You</p>
                            <p className="text-sm text-gray-600">Share who you are and why you're on Foundersbase</p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-blue-600">
                            Ready →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                      <Button variant="link" className="mt-2 text-blue-600 p-0">
                        View improvements →
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Card>

            {/* Suggestions Section */}
            <Card>
              <CardHeader>
                <CardTitle>Suggestions for You</CardTitle>
                <CardDescription>Visible only to you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="/api/placeholder/50/50" alt="Ahmed" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">Ahmed Salman Noor</h4>
                      <Badge variant="secondary" className="text-xs">New York City</Badge>
                      <Badge variant="secondary" className="text-xs">Join a team</Badge>
                      <Badge variant="secondary" className="text-xs">Support startups</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      I bring a deep technical foundation, a product-first mindset, and a bias for action. I don't just build — I build with purpose...
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Profile →
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Section */}
            <Card>
              <CardHeader>
                <CardTitle>My Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="posts" className="w-full">
                  <TabsList>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="reactions">Reactions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="posts" className="space-y-4 mt-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/api/placeholder/40/40" />
                              <AvatarFallback>KL</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Kai Lindemann</span>
                                <span className="text-sm text-gray-500">posted this • 6d</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                CEO @ foundersbase.com - Senior Product Manager, Ex-Scout24, Business Angel, Startup Enthusiast
                              </p>
                              <p className="mt-2">
                                Read More
                              </p>
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
                                <button className="flex items-center gap-1 hover:text-blue-600">
                                  <Send className="h-4 w-4" />
                                  Send
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="text-center pt-4">
                      <Button variant="link">View All Activities →</Button>
                    </div>
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
                  <CardTitle>About me</CardTitle>
                  <Button variant="ghost" size="icon">
                    <PencilLine className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">In short</h3>
                    <p className="text-gray-600">
                      It's important for me to support entrepreneurial thinkers and contribute to seeing more business ideas come to life. 
                      With foundersbase I am at providing a missing piece of infrastructure for founders and startups worldwide.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Aerospace & Aircraft</Badge>
                      <Badge variant="secondary">AI & Machine Learning</Badge>
                      <Badge variant="secondary">Biotech & Pharmaceuticals</Badge>
                      <Badge variant="secondary">Software & SaaS</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Looking for</h3>
                    <p className="text-gray-600">
                      Entrepreneurial minds. Founders who start building or want to join their next startup team.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Offering</h3>
                    <p className="text-gray-600">
                      Hands-on mentality, Marathon not sprint, Impact driven, Better try than sorry. 
                      MSc. Developmental Biology, Ex-Scout24, Senior Product Manager, Private Pilot (SPL)
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Age</h3>
                    <p className="text-gray-600">Not Specified</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Languages</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary">German</Badge>
                      <Badge variant="secondary">English</Badge>
                      <Badge variant="secondary">Spanish</Badge>
                      <Badge variant="secondary">French</Badge>
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
                  {[
                    { name: "Andrew Jernigan", role: "Outside the box thinker, connector and builder", following: false },
                    { name: "Alec Brewer", role: "Working to change the way we think about self, wealth, & the...", following: true },
                    { name: "Michael Thompson", role: "Founder & CEO of FinFlow and fintech evangelist by heart |...", following: false },
                    { name: "Emily Davis", role: "Results driven UX Design - I make your interfaces shine!", following: true }
                  ].map((person, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/api/placeholder/48/48`} />
                          <AvatarFallback className="text-sm">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-tight">{person.name}</p>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">{person.role}</p>
                          <Button variant={person.following ? "secondary" : "outline"} size="sm" className="mt-2">
                            {person.following ? "Following" : "Follow"}
                          </Button>
                        </div>
                      </div>
                      {index < 3 && <div className="border-t pt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Sidebar Widgets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-sm text-gray-500">
                  <p>Get the latest updates</p>
                  <p className="mt-2">Kai, unlock your full potential with premium</p>
                  <Button className="mt-3 w-full" size="sm">
                    Try Premium for free
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="px-4 py-3 text-xs text-gray-500 space-y-1">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:text-blue-600">About</a>
                <a href="#" className="hover:text-blue-600">Accessibility</a>
                <a href="#" className="hover:text-blue-600">Help Center</a>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:text-blue-600">Privacy & Terms</a>
                <a href="#" className="hover:text-blue-600">Ad Choices</a>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:text-blue-600">Advertising</a>
                <a href="#" className="hover:text-blue-600">Business Services</a>
              </div>
              <div className="pt-2">
                <p>© foundersbase.com 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
}