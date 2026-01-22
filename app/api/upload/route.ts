import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const { env } = getRequestContext();
        if (!env.R2) {
            return NextResponse.json({ error: 'R2 binding not found' }, { status: 500 });
        }

        const key = `${crypto.randomUUID()}-${file.name}`;
        await env.R2.put(key, file);

        return NextResponse.json({ key });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
