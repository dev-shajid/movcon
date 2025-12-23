import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import { ChevronsUpDown, Key, LogOut, Moon, Sun } from 'lucide-react'
import { logout } from '@/services/auth.service'
import { useUserStore } from '@/hooks/use-user-store'
import { useOverlay } from '@/hooks/use-overlay'
import { toast } from 'sonner'
import { AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { AUTH_REDIRECT_URL } from '@/route'
import { Skeleton } from './ui/skeleton'
import { useTheme } from 'next-themes'

export default function AppSidebarUser() {
    const { isMobile } = useSidebar()
    const userStore = useUserStore()
    const { showOverlay, hideOverlay } = useOverlay()
    const router = useRouter()
    const { theme, setTheme } = useTheme();

    async function handleLogout() {
        try {
            showOverlay()
            const res = await logout()
            if (!res.success) throw Error(res.error)
            userStore.logout()
            router.push(AUTH_REDIRECT_URL)
        } catch (error) {
            toast.error("Error", {
                description: (error as AuthError).message ?? 'Failed to logout. Please try again.'
            })
            hideOverlay()
        }
    }

    return (
        <>
            <SidebarMenu>
                {
                    userStore.user ?
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg border-foreground">
                                            {/* <AvatarImage src={userStore.user} alt={userStore.user?.user_metadata?.name} /> */}
                                            <AvatarFallback className="rounded-lg bg-sidebar-primary">
                                                {userStore.user?.name
                                                    ?.split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{userStore.user?.name}</span>
                                            <span className="truncate text-xs">{userStore.user?.email}</span>
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
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                {/* <AvatarImage src={userStore.user?.avatar} alt={userStore.user?.name} /> */}
                                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{userStore.user?.name}</span>
                                                <span className="truncate text-xs">{userStore.user?.email ?? ''}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem href='/profile'>
                                        <Key />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        className='cursor-pointer'
                                    >
                                        {
                                            theme == "dark" ?
                                                <>
                                                    <Sun className='h-4 w-4' />
                                                    <span>Light</span>
                                                </> :
                                                <>
                                                    <Moon className='h-4 w-4' />
                                                    <span>Dark</span>
                                                </>
                                        }
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant='destructive'
                                        onClick={handleLogout}
                                    >
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                        :
                        <SidebarMenuItem>
                            <Skeleton className='w-full h-8 rounded-md' />
                        </SidebarMenuItem>
                }
            </SidebarMenu>
        </>
    )
}
