import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export const getDb = () => {
    const { env } = getRequestContext();
    if (!env.DB) {
        throw new Error('Database binding (DB) not found. Ensure D1 is configured and you are running in a compatible environment.');
    }
    return drizzle(env.DB, { schema });
};
