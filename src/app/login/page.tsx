'use client'

import { Shield, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole, ROLE_LABELS, ROLE_COLORS } from '@/types';
import { mockUsers } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';

const roles: UserRole[] = ['mt_office', 'adjutant', 'co', 'gso1', 'col_staff', 'mp_checkpost'];

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary mb-4">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">MOVCON</h1>
          <p className="text-lg text-muted-foreground">
            Vehicle Movement Control System
          </p>
        </div>

        {/* Role Selection */}
        <Card className="border-none shadow-soft">
          <CardHeader className="text-center">
            <CardTitle>Select Your Role</CardTitle>
            <CardDescription>
              Choose a role to access the system (Demo Mode)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role, index) => {
                const user = mockUsers.find(u => u.role === role);
                return (
                  <Button
                    key={role}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 text-left group hover:border-primary/50 transition-all"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleLogin(role)}
                  >
                    <div className="flex w-full items-center justify-between mb-2">
                      <div className={`rounded-full p-2 ${ROLE_COLORS[role]}`}>
                        <User className="h-4 w-4" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {ROLE_LABELS[role]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.name}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Military Vehicle Movement Authorization System
        </p>
      </div>
    </div>
  );
}
