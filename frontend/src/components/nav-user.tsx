"use client"

import { ChevronsUpDown, LogOut, User, BookText, Shield } from "lucide-react"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [displayUser, setDisplayUser] = useState(user)

  useEffect(() => {
    let cancelled = false
    const hydrate = async () => {
      // Try BFF first (cookie-based auth), fallback to local storage
      try {
        const res = await fetch('/api/account/me', { cache: 'no-store' })
        if (!cancelled && res.ok) {
          const data = await res.json()
          setCurrentUser(data)
          setDisplayUser({
            name: [data.firstName, data.lastName].filter(Boolean).join(' ') || data.username || user.name,
            email: data.email || user.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username || data.email || 'User')}&background=0D8ABC&color=fff`,
          })
          return
        }
      } catch { }
      const ls = auth.getUser()
      if (!cancelled && ls) {
        setCurrentUser(ls)
        setDisplayUser({
          name: ls.username || user.name,
          email: ls.email || user.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(ls.username || 'User')}&background=0D8ABC&color=fff`,
        })
      }
    }
    hydrate()
    return () => { cancelled = true }
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayUser.name}</span>
                <span className="truncate text-xs">{displayUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <Link href={currentUser ? `/dashboard/profile/${currentUser.id}` : '/dashboard/profile'}>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer hover:bg-sidebar-accent rounded-md">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayUser.name}</span>
                    <span className="truncate text-xs">{displayUser.email}</span>
                  </div>
                </div>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push(currentUser ? `/dashboard/profile/${currentUser.id}` : '/dashboard/profile')}>
                <User />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/account')}>
                <Shield />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/account/help')}>
                <BookText />
                Account Manual
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => auth.logout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
