"use client"

import React, { Suspense } from 'react';
import Feed from '@/components/feed/Feed';

function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <Feed />
      </div>
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