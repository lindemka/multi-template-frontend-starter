import React from 'react';
import DashboardLayoutShadcn from '@/components/layouts/DashboardLayoutShadcn';
import UserTableShadcn from '@/components/dashboard/UserTableShadcn';

export default function DashboardPage() {
  return (
    <DashboardLayoutShadcn>
      <UserTableShadcn />
    </DashboardLayoutShadcn>
  );
}