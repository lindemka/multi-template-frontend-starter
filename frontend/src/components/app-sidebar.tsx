"use client"

import * as React from "react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import {
  Users,
  Home,
  LifeBuoy,
  Send,
  Rocket,
  ChevronsLeft,
  ChevronsRight,
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff",
  },
  navMain: [
    {
      title: "Feed",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [],
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Foundersbase">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg font-bold text-xl shadow-sm">
                  F
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-base">Foundersbase</span>
                  <span className="truncate text-xs text-muted-foreground">Startup Network</span>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger asChild>
              <SidebarMenuButton tooltip="Toggle Sidebar">
                <ChevronsLeft className="transition-transform group-data-[state=collapsed]:rotate-180" />
                <span>Collapse</span>
              </SidebarMenuButton>
            </SidebarTrigger>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
