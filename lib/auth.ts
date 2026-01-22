import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function signToken(payload: Record<string, unknown>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

// Simple SHA-256 Helper (Deterministic)
async function getHash(password: string, salt: string) {
    const enc = new TextEncoder();
    const data = enc.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

export async function hashPassword(password: string) {
    const salt = crypto.randomUUID();
    const hash = await getHash(password, salt);
    return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, storedHash: string) {
    const [salt, originalHash] = storedHash.split(':');
    console.log('[Auth] Verifying. Salt:', salt);
    console.log('[Auth] Stored Hash:', originalHash);

    if (!salt || !originalHash) return false;

    const hash = await getHash(password, salt);
    console.log('[Auth] Computed Hash:', hash);

    const match = hash === originalHash;
    console.log('[Auth] Match:', match);
    return match;
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function login(payload: Record<string, unknown>) {
    const token = await signToken(payload);
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
