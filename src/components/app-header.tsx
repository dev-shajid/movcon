'use client'

import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ROLE_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/hooks/use-user-store';

export default function AppHeader() {
  const { user } = useUserStore();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-foreground">
            Movement Control System
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && user?.role && (
          <Badge variant="outline" className="hidden sm:flex">
            {ROLE_LABELS[user.role]}
          </Badge>
        )}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>
      </div>
    </header>
  );
}
