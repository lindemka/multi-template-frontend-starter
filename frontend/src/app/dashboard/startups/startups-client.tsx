"use client"

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Users as UsersIcon, TrendingUp, DollarSign, Search, Rocket, Briefcase } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

export default function StartupsClient() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');

  useEffect(() => {
    fetchStartups();
  }, [page, filter]);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      let endpoint = `/api/startups?page=${page}&size=9`;
      
      if (filter === 'hiring') {
        endpoint = `/api/startups/hiring?page=${page}&size=9`;
      } else if (filter === 'fundraising') {
        endpoint = `/api/startups/fundraising?page=${page}&size=9`;
      } else if (searchTerm) {
        endpoint = `/api/startups?page=${page}&size=9&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await api.get(endpoint);
      setStartups(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching startups:', err);
      setError('Failed to fetch startups');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchStartups();
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

  const getFilterTitle = () => {
    if (filter === 'hiring') return 'Startups Hiring Now';
    if (filter === 'fundraising') return 'Startups Fundraising';
    return 'All Startups';
  };

  if (loading && startups.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading startups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getFilterTitle()}</h1>
          <p className="text-muted-foreground">
            Discover innovative startups and founding teams
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {filter && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {filter === 'hiring' ? '💼 Hiring' : '💰 Fundraising'}
            </Badge>
            <Link href="/dashboard/startups">
              <Button variant="ghost" size="sm">Clear filter</Button>
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
          {error}
        </div>
      )}

      {startups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Rocket className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">No startups found</p>
            <p className="text-muted-foreground text-center">
              {filter ? 'Try clearing the filter or search for something else' : 'Be the first to create a startup!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {startups.map((startup) => (
            <Card key={startup.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{startup.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {startup.tagline}
                    </CardDescription>
                  </div>
                  {startup.logoUrl && (
                    <img 
                      src={startup.logoUrl} 
                      alt={startup.name} 
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {startup.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
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

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{startup.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    <span>{startup.teamSize} team members</span>
                  </div>
                  {startup.fundingAmount && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>${(startup.fundingAmount / 1000000).toFixed(1)}M raised</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/startups/${startup.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}