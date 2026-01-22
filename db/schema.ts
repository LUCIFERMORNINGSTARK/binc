import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: text('role').default('user'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const topics = sqliteTable('topics', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    thumbnailUrl: text('thumbnail_url'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const content = sqliteTable('content', {
    id: text('id').primaryKey(),
    topicId: text('topic_id').notNull().references(() => topics.id),
    title: text('title').notNull(),
    videoR2Key: text('video_r2_key').notNull(),
    order: integer('order').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
