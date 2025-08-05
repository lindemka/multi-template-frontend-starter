import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import UserTable from '@/components/dashboard/UserTable';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Template</h1>
          <p className="mt-1 text-sm text-gray-500">
            Simple dashboard page using dashboard template assets with modern React components
          </p>
        </div>

        {/* User Management Section */}
        <UserTable />
      </div>
    </DashboardLayout>
  );
}