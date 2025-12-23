'use client'

import React, { useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import AppHeader from '@/components/app-header'
import { useUserStore } from '@/hooks/use-user-store'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserProfile } from '@/services/auth.service'
import { getRequestedMovementsForRole } from '@/services/request.service'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, login, setPendingRequests } = useUserStore();

  async function handleCurrentUser() {
    const res = await getUserProfile()
    if (res.data) {
      login(res.data)
      const pendReqs = await getRequestedMovementsForRole(res.data.role);
      setPendingRequests(pendReqs);
    }
  }

  useEffect(() => {
    handleCurrentUser()
  }, [])

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="p-6 space-y-4 max-w-lg w-full">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="h-full container mx-auto p-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
