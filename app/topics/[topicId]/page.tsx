import { getDb } from '@/lib/db';
import { topics, content } from '@/db/schema';
import { eq, asc, type InferSelectModel } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import VideoPlayer from '@/components/video-player';

type Topic = InferSelectModel<typeof topics>;
type Video = InferSelectModel<typeof content>;

export const runtime = 'edge';

export default async function TopicPage({ params, searchParams }: {
    params: Promise<{ topicId: string }>,
    searchParams: Promise<{ v?: string }>
}) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { topicId } = await params;
    const { v: videoId } = await searchParams;

    let topic: Topic | null = null;
    let videos: Video[] = [];

    try {
        const db = getDb();
        const topicResult = await db.select().from(topics).where(eq(topics.id, topicId)).limit(1);
        topic = topicResult[0];

        if (topic) {
            videos = await db.select().from(content).where(eq(content.topicId, topicId)).orderBy(asc(content.order)).all();
        }
    } catch (e) {
        console.error(e);
    }

    if (!topic) {
        return <div className="text-white text-center p-20">Topic not found</div>;
    }

    const selectedVideo = videos.find(v => v.id === videoId) || videos[0];

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft />
                    </Link>
                    <h1 className="text-xl font-bold truncate">{topic.title}</h1>
                </div>
            </div>

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                        {selectedVideo ? (
                            <VideoPlayer url={`/api/video/${selectedVideo.videoR2Key}`} title={selectedVideo.title} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                <p className="text-gray-500">No videos available</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold">{topic.title}</h2>
                        {selectedVideo && <p className="text-blue-400 text-lg mb-2">{selectedVideo.title}</p>}
                        <p className="text-gray-400 mt-4 leading-relaxed">{topic.description}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-widest text-xs mb-4">Course Content</h3>
                    <div className="space-y-2">
                        {videos.length === 0 ? (
                            <p className="text-gray-500 text-sm">No content added yet.</p>
                        ) : (
                            videos.map((video, index) => (
                                <Link
                                    href={`/topics/${topicId}?v=${video.id}`}
                                    key={video.id}
                                    className={`block group transition-all duration-300 ${selectedVideo?.id === video.id ? 'transform scale-[1.02]' : ''}`}
                                >
                                    <div className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${selectedVideo?.id === video.id ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}>
                                        <div className={`h-16 w-24 rounded-lg flex items-center justify-center transition-colors ${selectedVideo?.id === video.id ? 'bg-blue-500/20 text-blue-400' : 'bg-black/40 text-gray-600 group-hover:text-blue-400'}`}>
                                            <PlayCircle size={24} />
                                        </div>
                                        <div>
                                            <span className={`text-xs font-mono mb-1 block ${selectedVideo?.id === video.id ? 'text-blue-300' : 'text-blue-400'}`}>Lesson {index + 1}</span>
                                            <h4 className={`font-medium transition-colors line-clamp-2 ${selectedVideo?.id === video.id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>{video.title}</h4>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
