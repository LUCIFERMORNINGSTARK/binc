'use client';

export default function VideoPlayer({ url, title }: { url: string, title?: string }) {
    return (
        <div className="relative w-full h-full bg-black">
            <video
                src={url}
                controls
                className="w-full h-full object-contain"
                poster="/placeholder-video-thumb.jpg" // We might want a poster
                playsInline
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
