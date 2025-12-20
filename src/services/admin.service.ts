'use server';

import { createClient } from '@/supabase/server';
import { cacheTag, revalidateTag } from 'next/cache';

const supabaseAdmin = await createClient();
export async function getAllUsers() {
    'use cache';
    cacheTag('users');
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) throw error;
    return data;
}

export async function verifyUser(userId: string, role: string) {
    // Update the user's role in the users table
    //   const { error } = await supabase.from('users').update({ role }).eq('id', userId);
    //   if (error) throw error;
    // Optionally, update auth user metadata as well
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { user_metadata: { role } });
    if (error) throw error;
    revalidateTag('users', {});
    return true;
}
