'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Building2, Link, Calendar, Users, Eye, MessageSquare, ThumbsUp, Share2, Send, MoreHorizontal, PencilLine, Plus, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <CardContent className="relative pb-4">
            {/* Profile Avatar */}
            <div className="absolute -top-16 left-6">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src="/api/placeholder/150/150" alt="Profile" />
                <AvatarFallback className="text-3xl">KL</AvatarFallback>
              </Avatar>
            </div>

            {/* Edit Profile Button */}
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="icon" className="mr-2">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="gap-2">
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
          </CardContent>
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

        {/* People Also Viewed */}
        <Card>
          <CardHeader>
            <CardTitle>People also viewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Andrew Jernigan", role: "Outside the box thinker, connector and builder", following: false },
                { name: "Alec Brewer", role: "Working to change the way we think about self, wealth, & the...", following: true },
                { name: "Michael Thompson", role: "Founder & CEO of FinFlow and fintech evangelist by heart |...", following: false },
                { name: "Emily Davis", role: "Results driven UX Design - I make your interfaces shine!", following: true }
              ].map((person, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/api/placeholder/40/40`} />
                      <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{person.role}</p>
                    </div>
                  </div>
                  <Button variant={person.following ? "secondary" : "outline"} size="sm">
                    {person.following ? "Following" : "Follow"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          © foundersbase.com 2025 | Countries
        </div>
      </div>
    </div>
  );
}