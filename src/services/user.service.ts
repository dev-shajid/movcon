// src/services/user.service.ts
'use server'
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function getAllUsers() {
    await connectToDatabase();
    return User.find();
}

export async function createUser(data: any) {
    await connectToDatabase();
    const user = new User(data);
    return user.save();
}
