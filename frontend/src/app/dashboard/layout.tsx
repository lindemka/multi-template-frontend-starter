"use client"

import React from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProtectedRoute } from "@/components/protected-route"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <SiteHeader />
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4">
                  {children}
                </div>
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}