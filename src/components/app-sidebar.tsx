'use client'

import {
    LayoutDashboard,
    FileText,
    FilePlus,
    CheckCircle,
    Shield,
    ClipboardList,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { TUserRole } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getPendingCountForRole } from '@/data/mockData';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AppSidebarUser from './app-sidebar-user';
import { useUserStore } from '@/hooks/use-user-store';

interface ISidebarItem {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
    items?: ISidebarItem[];
}

const getMenuItemsForRole = (role: TUserRole) => {
    const baseItems = [
        { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    ];

    switch (role) {
        case 'mt_office':
            return [
                ...baseItems,
                { title: 'New Request', url: '/requests/new', icon: FilePlus },
                { title: 'All Requests', url: '/requests', icon: FileText },
                { title: 'Certificates', url: '/certificates', icon: CheckCircle },
            ];
        case 'adjutant':
        case 'co':
        case 'gso1':
        case 'col_staff':
            return [
                ...baseItems,
                { title: 'Pending Approvals', url: '/approvals', icon: ClipboardList },
                { title: 'All Requests', url: '/requests', icon: FileText },
            ];
        case 'mp_checkpost':
            return [
                ...baseItems,
                { title: 'Permitted Movements', url: '/movements', icon: Shield },
                { title: 'IN/OUT Logs', url: '/logs', icon: FileText },
            ];
        default:
            return baseItems;
    }
};

export function AppSidebar() {
    const { user } = useUserStore();
    const pathname = usePathname()

    function isItemActive(item: ISidebarItem): boolean {
        return item.url === pathname ||
            (item.items ? item.items.some(isItemActive) : false)
    }

    const menuItems = user?.role ? getMenuItemsForRole(user?.role) : [];
    const pendingCount = user?.role ? getPendingCountForRole(user?.role) : 0;

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
                        <Shield className="h-6 w-6 text-sidebar-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-sidebar-foreground">MOVCON</span>
                        <span className="text-xs text-sidebar-foreground/60">Vehicle Movement System</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item, index) => {
                            const showBadge = item.title === 'Pending Approvals' && pendingCount > 0;

                            return (
                                <Link href={item.url} key={index}>
                                    <SidebarMenuButton
                                        isActive={isItemActive(item)}
                                        className="data-[active=true]:bg-sidebar-active/20 data-[active=true]:text-sidebar-active-foreground data-[active=true]:hover:bg-sidebar-active/30 cursor-pointer py-5"
                                    >
                                        {item.icon && <item.icon />}
                                        <span className="flex-1">{item.title}</span>
                                        {showBadge && (
                                            <Badge variant='warning' className="ml-auto">
                                                {pendingCount}
                                            </Badge>
                                        )}
                                    </SidebarMenuButton>
                                </Link>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-4">
                <AppSidebarUser />
            </SidebarFooter>
        </Sidebar>
    );
}
