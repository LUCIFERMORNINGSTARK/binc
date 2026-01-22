import { getDb } from '@/lib/db';
import { topics } from '@/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import AdminClient from './client';

export const runtime = 'edge';

type Topic = InferSelectModel<typeof topics>;

export default async function AdminPage() {
    let allTopics: Topic[] = [];
    try {
        const db = getDb();
        if (db) {
            allTopics = await db.select().from(topics).all();
        }
    } catch (e) {
        console.error(e);
    }

    return <AdminClient topics={allTopics} />;
}
