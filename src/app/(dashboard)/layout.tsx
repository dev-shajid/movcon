import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import AppHeader from '@/components/app-header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
