// src/components/quick-role-login.tsx
'use client'

import { Shield, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TUserRole } from '@/types';

const mockUsers = [
    { id: '1', name: 'Capt. Ahmed Khan', role: 'mt_office', email: 'ahmed.khan@army.mil' },
    { id: '2', name: 'Maj. Hassan Ali', role: 'adjutant', email: 'hassan.ali@army.mil' },
    { id: '3', name: 'Lt. Col. Imran Malik', role: 'co', email: 'imran.malik@army.mil' },
    { id: '4', name: 'Col. Tariq Mahmood', role: 'gso1', email: 'tariq.mahmood@army.mil' },
    { id: '5', name: 'Brig. Aslam Shah', role: 'col_staff', email: 'aslam.shah@army.mil' },
    { id: '6', name: 'Havaldar Rashid', role: 'mp_checkpost', email: 'rashid@army.mil' },
];

const ROLE_LABELS: Record<TUserRole, string> = {
    mt_office: 'MT Office',
    adjutant: 'Adjutant',
    co: 'Commanding Officer',
    gso1: 'GSO-1',
    col_staff: 'Col Staff',
    mp_checkpost: 'MP Checkpost',
    admin: 'Admin',
};

const ROLE_COLORS: Record<TUserRole, string> = {
    mt_office: 'bg-info/15 text-info',
    adjutant: 'bg-purple-500/15 text-purple-600',
    co: 'bg-amber-500/15 text-amber-600',
    gso1: 'bg-emerald-500/15 text-emerald-600',
    col_staff: 'bg-primary/15 text-primary',
    mp_checkpost: 'bg-slate-500/15 text-slate-600',
    admin: 'bg-green/15 text-info',
};

// Map roles to demo users and credentials
const ROLE_USERS = [
    { role: 'mt_office', email: 'mtoffice@example.com', password: 'password123' },
    { role: 'adjutant', email: 'adjutant@example.com', password: 'password123' },
    { role: 'co', email: 'co@example.com', password: 'password123' },
    { role: 'gso1', email: 'gso1@example.com', password: 'password123' },
    { role: 'col_staff', email: 'colstaff@example.com', password: 'password123' },
    { role: 'mp_checkpost', email: 'mpcheckpost@example.com', password: 'password123' },
    { role: 'admin', email: 'admin@example.com', password: 'password123' },
];

export default function QuickRoleLogin({ onSubmit }: { onSubmit: (data: { email: string, password: string }) => void }) {
    return (
        <div className="my-8">
            <Card className="border-none shadow-soft max-w-2xl mx-auto animate-fade-in w-full">
                <CardHeader className="text-center">
                    <CardTitle>Quick Login as Role</CardTitle>
                    <CardDescription>
                        Choose a role to login instantly (Temporary Demo)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {ROLE_USERS.map((user, index) => {
                            // Type assertion to TUserRole if possible, else fallback
                            const roleKey = user.role as TUserRole;
                            const label = (ROLE_LABELS && ROLE_LABELS[roleKey]) || user.role.replace('_', ' ').toUpperCase();
                            const color = (ROLE_COLORS && ROLE_COLORS[roleKey]) || 'bg-gray-200';
                            const mockUser = mockUsers?.find(u => u.role === user.role);
                            return (
                                <Button
                                    key={user.role}
                                    variant="outline"
                                    className="h-auto flex-col items-start p-4 text-left group hover:border-primary/50 transition-all"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => onSubmit({ email: user.email, password: user.password })}
                                >
                                    <div className="flex w-full items-center justify-between mb-2">
                                        <div className={`rounded-full p-2 ${color}`}>
                                            <User className="h-4 w-4" />
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground">
                                            {label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {mockUser?.name || user.email}
                                        </p>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
