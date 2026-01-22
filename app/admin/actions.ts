'use server';

import { getDb } from '@/lib/db';
import { topics, content } from '@/db/schema';
import { revalidatePath } from 'next/cache';

// Helper for UUID
function generateId() {
    return crypto.randomUUID();
}

export async function createTopicAction(prevState: unknown, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const thumbnail = formData.get('thumbnail') as string; // URL

    if (!title) return { error: 'Title required' };

    try {
        const db = getDb();
        await db.insert(topics).values({
            id: generateId(),
            title,
            description,
            thumbnailUrl: thumbnail,
            createdAt: new Date(),
        });
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create topic' };
    }
}

export async function addVideoAction(topicId: string, title: string, videoKey: string, order: number) {
    try {
        const db = getDb();
        await db.insert(content).values({
            id: generateId(),
            topicId,
            title,
            videoR2Key: videoKey,
            order,
            createdAt: new Date(),
        });
        return { success: true };
    } catch (e) {
        return { error: 'Failed to add video' };
    }
}
