'use client'


import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { ROLE_LABELS, TUserRole } from '@/types';
import { useEffect, useState } from 'react';
import { getAllUsers, verifyUser } from '@/services/admin.service';
import { UserRole } from '@/lib/UserRole';
import { toast } from 'sonner';


type User = {
    id: string;
    email?: string;
    user_metadata?: {
        role?: TUserRole;
        name?: string;
    };
};


export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [updating, setUpdating] = useState<string | null>(null);
    const [roleSelections, setRoleSelections] = useState<Record<string, TUserRole>>({});

    async function handleUsers() {
        getAllUsers().then((data) => {
            setUsers(data?.users || []);
            setIsLoadingUsers(false);
        });
    }

    useEffect(() => {
        setIsLoadingUsers(true);
        handleUsers();
    }, []);

    // Unverified: no role; Verified: has role
    const unverifiedUsers = users.filter((u) => !u.user_metadata?.role);
    const verifiedUsers = users.filter((u) => u.user_metadata?.role);

    const handleRoleChange = (userId: string, role: TUserRole) => {
        setRoleSelections((prev) => ({ ...prev, [userId]: role }));
    };

    const handleUpdateRole = async (userId: string) => {
        const role = roleSelections[userId];
        if (!role) return;
        setUpdating(userId);
        const res = await verifyUser(userId, role);
        if (res) {
            toast.success('User role updated successfully');
            handleUsers();
        } else {
            toast.error('Failed to update user role');
        }
        setUpdating(null);
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Welcome, Admin</h1>
                    <p className="text-muted-foreground">Admin Dashboard</p>
                </div>
            </div>

            <UserTableSkeleton show={isLoadingUsers} />
            <div className="mb-10">
                {!isLoadingUsers && unverifiedUsers.length !== 0 && (
                    <>
                        <h2 className="text-lg font-semibold mb-2">Unverified Users</h2>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 dark:bg-gray-800">
                                    <TableHead className="w-1/4">Email</TableHead>
                                    <TableHead className="w-1/4">Name</TableHead>
                                    <TableHead className="w-1/4">Assign Role</TableHead>
                                    <TableHead className="w-1/4">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {unverifiedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No unverified users</TableCell>
                                    </TableRow>
                                ) : (
                                    unverifiedUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <TableCell className="font-medium">{user.email}</TableCell>
                                            <TableCell>{user.user_metadata?.name || '-'}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={roleSelections[user.id] || ''}
                                                    disabled={user.user_metadata?.role == UserRole.ADMIN}
                                                    onValueChange={(val) => handleRoleChange(user.id, val as TUserRole)}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(ROLE_LABELS).map(([role, label]) => (
                                                            <SelectItem key={role} value={role}>{label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    disabled={!roleSelections[user.id] || updating === user.id}
                                                    onClick={() => handleUpdateRole(user.id)}
                                                    className="px-4 py-1"
                                                >
                                                    {updating === user.id ? 'Updating...' : 'Verify'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </>
                )}
            </div>

            <div>
                {!isLoadingUsers && (
                    <>
                        <h2 className="text-lg font-semibold mb-2">Verified Users</h2>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 dark:bg-gray-800">
                                    <TableHead className="w-1/4">Email</TableHead>
                                    <TableHead className="w-1/4">Name</TableHead>
                                    <TableHead className="w-1/4">Role</TableHead>
                                    <TableHead className="w-1/4">Change Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {verifiedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No verified users</TableCell>
                                    </TableRow>
                                ) : (
                                    verifiedUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <TableCell className="font-medium">{user.email}</TableCell>
                                            <TableCell>{user.user_metadata?.name || '-'}</TableCell>
                                            <TableCell>
                                                <span className="inline-block rounded px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    {ROLE_LABELS[(user.user_metadata?.role as TUserRole) || ''] || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 items-center">
                                                    {
                                                        user.user_metadata?.role == 'admin' ? '' : (
                                                            <>
                                                                <Select
                                                                    value={roleSelections[user.id] || user.user_metadata?.role || ''}
                                                                    disabled={user.user_metadata?.role == UserRole.ADMIN}
                                                                    onValueChange={(val) => handleRoleChange(user.id, val as TUserRole)}
                                                                >
                                                                    <SelectTrigger className="w-40">
                                                                        <SelectValue placeholder="Change role" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Object.entries(ROLE_LABELS).map(([role, label]) => (
                                                                            <SelectItem key={role} value={role}>{label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Button
                                                                    disabled={(!roleSelections[user.id] || roleSelections[user.id] === user.user_metadata?.role) || updating === user.id}
                                                                    onClick={() => handleUpdateRole(user.id)}
                                                                    className="px-4 py-1"
                                                                >
                                                                    {updating === user.id ? 'Updating...' : 'Update'}
                                                                </Button>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </>
                )}
            </div>
        </div>
    );
}



function UserTableSkeleton({ show }: { show: boolean }) {
    if (!show) return null;
    return (
        <div className="w-full space-y-2 mb-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex space-x-2">
                    <Skeleton className="h-8 w-1/4 rounded-md" />
                    <Skeleton className="h-8 w-1/4 rounded-md" />
                    <Skeleton className="h-8 w-1/4 rounded-md" />
                    <Skeleton className="h-8 w-1/4 rounded-md" />
                </div>
            ))}
        </div>
    );
}