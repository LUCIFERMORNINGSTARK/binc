import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    const { env } = getRequestContext();

    if (!env.R2) {
        return new NextResponse('R2 binding not found', { status: 500 });
    }

    try {
        const object = await env.R2.get(key);
        if (!object) {
            return new NextResponse('Object Not Found', { status: 404 });
        }

        const headers = new Headers();
        if (object.httpMetadata?.contentType) headers.set('Content-Type', object.httpMetadata.contentType);
        if (object.httpMetadata?.contentDisposition) headers.set('Content-Disposition', object.httpMetadata.contentDisposition);
        if (object.httpMetadata?.cacheControl) headers.set('Cache-Control', object.httpMetadata.cacheControl);

        headers.set('etag', object.httpEtag);

        return new NextResponse(object.body, { headers });
    } catch (e) {
        console.error(e);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
