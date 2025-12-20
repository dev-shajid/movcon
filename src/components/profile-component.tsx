"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, Shield, Building2, UserCircle, Briefcase, Flag } from 'lucide-react'
import { useUserStore } from '@/hooks/use-user-store'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileComponent() {
    const { user, isLoggedIn } = useUserStore()

    if (!isLoggedIn) {
        return (
            <div className="container max-w-5xl py-8 space-y-8 mx-auto">
                {/* Header Card Skeleton */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar Skeleton */}
                            <Skeleton className="h-24 w-24 rounded-full" />

                            {/* User Info Skeleton */}
                            <div className="flex-1 w-full text-center md:text-left space-y-3">
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <Skeleton className="h-9 w-64 mx-auto md:mx-0" />
                                    <Skeleton className="h-6 w-20 mx-auto md:mx-0" />
                                </div>
                                <Skeleton className="h-5 w-48 mx-auto md:mx-0" />
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Sections Skeleton */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((idx) => (
                        <Card key={idx}>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2, 3].map((itemIdx) => (
                                    <div key={itemIdx}>
                                        <div className="flex items-start gap-3">
                                            <Skeleton className="h-10 w-10 rounded-md" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-full" />
                                            </div>
                                        </div>
                                        {itemIdx < 2 && <Separator className="mt-4" />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Account Status Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((idx) => (
                                <div key={idx} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No user data found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const name = user.name || user.email?.split('@')[0] || 'Unknown User'
    const initials = name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const profileSections = [
        {
            title: 'Personal Information',
            items: [
                { label: 'BA No', value: user.baNo, icon: Shield },
                { label: 'Rank', value: user.rank, icon: UserCircle },
                { label: 'Name', value: user.name, icon: UserCircle },
            ]
        },
        {
            title: 'Assignment Details',
            items: [
                { label: 'Unit Name', value: user.unitName, icon: Building2 },
                { label: 'Appointment', value: user.appointment, icon: Briefcase },
                { label: 'Formation', value: user.formation, icon: Flag },
            ]
        },
        {
            title: 'Contact Information',
            items: [
                { label: 'Mobile Number', value: user.mobile, icon: Phone },
                { label: 'Email', value: user.email, icon: Mail },
            ]
        }
    ]

    return (
        <div className="container max-w-5xl py-8 space-y-8 mx-auto">
            {/* Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24 border-4 border-primary/10">
                            <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <h1 className="text-3xl font-bold">{name}</h1>
                            </div>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                                {user.rank && (
                                    <Badge variant="secondary">
                                        Rank: {user.rank}
                                    </Badge>
                                )}
                                {user.unitName && (
                                    <Badge variant="outline">
                                        {user.unitName}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Sections */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {profileSections.map((section, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {section.items.map((item, itemIdx) => {
                                const Icon = item.icon
                                return (
                                    <div key={itemIdx}>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 p-2 rounded-md bg-primary/10">
                                                <Icon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {item.label}
                                                </p>
                                                <p className="text-sm font-semibold truncate">
                                                    {item.value || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                        {itemIdx < section.items.length - 1 && (
                                            <Separator className="mt-4" />
                                        )}
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Account Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                    <CardDescription>Your account information and verification status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                            <Badge variant="default">{user.role}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
