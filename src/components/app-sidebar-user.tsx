'use client'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
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
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { ChevronsUpDown, Key, LogOut, Monitor, Moon, Sun, User } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { useAuth } from '@/context/auth.context'
import { ROLE_LABELS } from '@/types'
import { useTheme } from 'next-themes'


export default function AppSidebarUser() {
    const { isMobile } = useSidebar()
    const { user, logout } = useAuth()
    const { theme, setTheme } = useTheme();

    if (!user) {
        return (
            <AppSidebarUserSkeleton />
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg border-foreground">
                                <AvatarFallback className="rounded-lg">
                                    <User className="h-5 w-5 text-sidebar-accent-foreground" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-1 flex-col overflow-hidden">
                                <span className="truncate text-sm font-medium text-sidebar-foreground">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs text-sidebar-foreground/60">
                                    {ROLE_LABELS[user.role]}
                                </span>
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

                        <DropdownMenuLabel className='text-xs font-medium text-muted-foreground px-2 py-1'>
                            Theme
                        </DropdownMenuLabel>

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => setTheme("light")}
                                className='cursor-pointer'
                            >
                                <Sun className='mr-2 h-4 w-4' />
                                <span>Light</span>
                                {theme === "light" && (
                                    <div className='ml-auto h-2 w-2 rounded-full bg-primary' />
                                )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => setTheme("dark")}
                                className='cursor-pointer'
                            >
                                <Moon className='mr-2 h-4 w-4' />
                                <span>Dark</span>
                                {theme === "dark" && (
                                    <div className='ml-auto h-2 w-2 rounded-full bg-primary' />
                                )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => setTheme("system")}
                                className='cursor-pointer'
                            >
                                <Monitor className='mr-2 h-4 w-4' />
                                <span>System</span>
                                {theme === "system" && (
                                    <div className='ml-auto h-2 w-2 rounded-full bg-primary' />
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={async () => await logout()}
                            className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950'
                        >
                            <LogOut />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export function AppSidebarUserSkeleton() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Skeleton className="h-10 w-full rounded-lg" />
            </SidebarMenuItem>
        </SidebarMenu>
    )
}