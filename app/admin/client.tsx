'use client';

import { useState } from 'react';
import { createTopicAction, addVideoAction } from './actions';
import { useActionState } from 'react';
import { Upload, Plus, Film, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminClient({ topics }: { topics: any[] }) {
    const [topicState, topicAction] = useActionState(createTopicAction, null);

    // Video State
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [videoKey, setVideoKey] = useState('');
    const router = useRouter();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setVideoKey(data.key);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleAddVideo = async () => {
        if (!selectedTopicId || !videoTitle || !videoKey) return;

        // Default order 0 for now, or fetch max order
        const res = await addVideoAction(selectedTopicId, videoTitle, videoKey, 0);
        if (!res.error) {
            alert('Video added!');
            setVideoTitle('');
            setVideoKey('');
            // router.refresh();
        } else {
            alert('Failed to add video');
        }
    };

    return (
        <div className="min-h-screen p-8 bg-black">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Admin Dashboard
                    </h1>
                </div>

                {/* Create Topic Section */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Plus className="text-blue-400" /> Create New Topic
                    </h2>

                    <form action={topicAction} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Topic Title</label>
                            <input name="title" required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="e.g. Advanced Typescript" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                            <textarea name="description" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none h-32" placeholder="Course description..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Thumbnail URL</label>
                            <input name="thumbnail" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="https://..." />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105">
                                Create Topic
                            </button>
                            {topicState?.success && <span className="ml-4 text-emerald-400">Topic Created!</span>}
                        </div>
                    </form>
                </section>

                {/* Video Upload Section */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Film className="text-purple-400" /> Add Videos
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Select Topic</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                                value={selectedTopicId}
                                onChange={(e) => setSelectedTopicId(e.target.value)}
                            >
                                <option value="">-- Choose a Topic --</option>
                                {topics.map(t => (
                                    <option key={t.id} value={t.id}>{t.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Video Title</label>
                            <input
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                                placeholder="e.g. Lesson 1: Intro"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Upload Video</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors border border-white/10">
                                    {uploading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                                    {uploading ? 'Uploading...' : 'Choose File'}
                                    <input type="file" className="hidden" accept="video/*" onChange={handleFileUpload} disabled={uploading} />
                                </label>
                                {videoKey && <span className="text-emerald-400 text-sm">Upload Complete!</span>}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleAddVideo}
                                disabled={!selectedTopicId || !videoTitle || !videoKey}
                                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Video to Topic
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
