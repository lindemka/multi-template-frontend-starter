import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ExternalLink, Home, Users, TestTube } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Logo/Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Your App Name
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12">
            A modern web application built with Next.js and Spring Boot
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Internal Link - Dashboard */}
            <Button asChild size="lg" className="group">
              <Link href="/dashboard">
                Enter Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            {/* External Link */}
            <Button asChild size="lg" variant="outline">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                View on GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link href="/" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Welcome Home</CardTitle>
                <CardDescription>
                  Start here to explore our modern web application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Welcome to your dashboard! This is the main landing page. 
                  Explore our modern Next.js application with hot reload enabled.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-blue-600 hover:underline">
                  You are here →
                </span>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/dashboard" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>User Dashboard</CardTitle>
                <CardDescription>
                  Manage users and explore the admin interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Manage users with our modern dashboard featuring Shadcn/ui tables, 
                  advanced filtering, and live data from Spring Boot API.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-green-600 hover:underline">
                  Go to Dashboard →
                </span>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/test" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TestTube className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Hot Reload Test</CardTitle>
                <CardDescription>
                  Test the development environment and hot reload features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Interactive test page to verify hot reload, state persistence, 
                  and API connectivity. Perfect for development testing.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-purple-600 hover:underline">
                  Test Features →
                </span>
              </CardFooter>
            </Card>
          </Link>
        </div>
        
        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Built with ❤️ using Next.js, Tailwind CSS, and Shadcn/ui
        </p>
      </div>
    </div>
  );
}