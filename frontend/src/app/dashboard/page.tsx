"use client"

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import UserTableShadcn from '@/components/dashboard/UserTableShadcn';
import Feed from '@/components/feed/Feed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function DashboardContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'feed';
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={tab} value={tab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="feed">Activity Feed</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        <TabsContent value="feed" className="mt-6">
          <div className="max-w-3xl">
            <Feed />
          </div>
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UserTableShadcn />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}