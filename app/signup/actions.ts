'use server';

import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, login } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function signupAction(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }

    try {
        const db = getDb();

        // Check if user already exists
        const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser) {
            return { error: 'User already exists' };
        }

        // Hash password
        const passwordHash = await hashPassword(password);
        const userId = crypto.randomUUID();

        // Insert new user
        const newUser = {
            id: userId,
            email,
            passwordHash,
            role: 'user',
            createdAt: new Date(),
        };

        await db.insert(users).values(newUser);

        // Create session
        await login({ id: newUser.id, email: newUser.email, role: newUser.role });
    } catch (error) {
        console.error('Signup error:', error);
        return { error: 'Something went wrong' };
    }

    redirect('/');
}
