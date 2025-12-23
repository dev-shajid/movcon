'use server'

import { createClient } from '@/supabase/server'
import z from 'zod';
import { SignupSchema } from '@/components/signup-form';
import { TUserRole } from '@/types';
import { cacheTag, revalidateTag } from 'next/cache';


interface Response<T> {
  success: boolean;
  data?: T;
  error?: string
}

export async function login(data: { email: string; password: string }): Promise<Response<null>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function signup(data: z.infer<typeof SignupSchema>): Promise<Response<null>> {
  const supabase = await createClient()
  // we include the `name` in user_metadata

  const { password, ...rest } = data
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: password,
    options: {
      data: {
        ...rest,
        role: null,
      }
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }
  revalidateTag('users', {});

  // Optionally: You can redirect to a “check your email” page
  // rather than logging in immediately.
  return { success: true }
}

export async function logout(): Promise<Response<null>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  role: TUserRole
  appointment?: string
  baNo?: string
  formation?: string
  mobile?: string
  rank?: string
  unitName?: string
  email_verified?: boolean
  phone_verified?: boolean
}

// Get current user's profile data with role (excludes password)
export async function getUserProfile(): Promise<Response<UserProfile>> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  if (!data.user) {
    return { success: false, error: 'User not found' }
  }
  
  const { user } = data
  const metadata = user.user_metadata as any

  // Extract all fields except password

  const profile: UserProfile = {
    id: user.id,
    email: user.email || '',
    role: metadata?.role || null,
    ...metadata,
  }
  
  return { success: true, data: profile }
}

// Check if current user is admin
export async function isAdmin(): Promise<boolean> {
  const result = await getUserProfile()
  return result.success && result.data?.role === 'admin'
}

export async function resetPassword(email: string): Promise<Response<null>> {
  const supabase = await createClient()
  const redirectTo = `${new URL('reset-password', process.env.NEXT_PUBLIC_BASE_URL).toString()}`
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  })
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

