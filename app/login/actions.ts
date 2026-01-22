'use server';

import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { login, verifyPassword } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    try {
        const db = getDb();
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) {
            return { error: 'Invalid credentials' };
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return { error: 'Invalid credentials' };
        }

        await login({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Something went wrong' };
    }

    redirect('/');
}
