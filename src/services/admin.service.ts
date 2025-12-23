'use server';

import { createClient } from '@supabase/supabase-js';
import { cacheTag, revalidateTag } from 'next/cache';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);


export async function getAllUsers() {
  'use cache';
  cacheTag('users');
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()

  if (error) throw error;
  return data;
}

export async function verifyUser(userId: string, role: string) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { user_metadata: { role } });
  if (error) throw error;
  revalidateTag('users', {});
  revalidateTag('user_profile', {});
  return true;
}
