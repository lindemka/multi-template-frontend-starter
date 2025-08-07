"use client"

import * as React from "react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import {
  BarChart3,
  Users,
  Home,
  Command,
  LifeBuoy,
  Send,
  Settings2,
  User,
  Rocket,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Activity Feed",
          url: "/dashboard?tab=feed",
        },
        {
          title: "User Management",
          url: "/dashboard?tab=users",
        },
      ],
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: Users,
      items: [],
    },
    {
      title: "Startups",
      url: "/dashboard/startups",
      icon: Rocket,
      items: [
        {
          title: "All Startups",
          url: "/dashboard/startups",
        },
        {
          title: "Hiring Now",
          url: "/dashboard/startups?filter=hiring",
        },
        {
          title: "Fundraising",
          url: "/dashboard/startups?filter=fundraising",
        },
      ],
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
      items: [],
    },
    {
      title: "Home",
      url: "/",
      icon: Home,
      items: [
        {
          title: "Landing Page",
          url: "/",
        },
        {
          title: "Test Page",
          url: "/test",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Preferences",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState(data.user);

  React.useEffect(() => {
    const currentUser = auth.getUser();
    if (currentUser) {
      setUser({
        name: currentUser.username || 'User',
        email: currentUser.email || 'user@example.com',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username || 'User')}&background=0D8ABC&color=fff`,
      });
    }
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BarChart3 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">fbase</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
