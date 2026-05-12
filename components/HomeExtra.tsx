
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { useNativeInView } from '../hooks/useNativeInView';
import { Play, ExternalLink, Sparkles } from 'lucide-react';

// --- Sub Components ---

export const StatCounter = React.memo(({ end, label }: { end: number, label: string }) => {
  const [ref, isInView] = useNativeInView<HTMLDivElement>({ once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const duration = 2000;
      let frameId: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        }
      };

      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    }
  }, [isInView, end]);

  return (
    <div
      ref={ref}
      className="text-center p-6 bg-white/90 border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
        <Sparkles className="text-blue-500" />
      </div>
      <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-2 font-tech">
        {count}+
      </h3>
      <p className="text-slate-600 font-bold uppercase tracking-wider text-xs md:text-sm">{label}</p>
    </div>
  );
});

// Video Card for Demo Section
const VideoCard: React.FC<{ videoId: string; title?: string; thumbnail: string }> = ({
  videoId,
  title = "Watch on YouTube",
  thumbnail,
}) => {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${title} on YouTube`}
      className="block"
    >
      <div
        className="w-[140px] xs:w-[180px] md:w-[400px] flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg group transition-all duration-300"
      >
        <div className="aspect-video bg-black relative">
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt="YouTube Video"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition">
              <Play fill="white" className="text-white ml-1" />
            </div>
          </div>
        </div>
        <div className="p-4 text-center">
          <p className="text-blue-600 font-bold text-sm flex items-center justify-center gap-1">
            Watch on YouTube <ExternalLink size={14} />
          </p>
        </div>
      </div>
    </a>
  );
};

// YouTube Scroller Component
export const YouTubeScroller = React.memo(({ youtubeVideos }: { youtubeVideos: any[] }) => {
  const [ref, isInView] = useNativeInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="relative w-full" ref={ref}>
      <div
        className={`youtube-scroller pb-4 px-4 md:px-0 ${!isInView ? 'paused' : ''}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflowX: youtubeVideos.length >= 3 ? 'auto' : 'hidden'
        }}
      >
        <div
          className={`flex w-max hover:pause active:pause ${youtubeVideos.length >= 3 ? 'animate-scroll-loop' : 'justify-center'}`}
          style={{ '--duration': `${youtubeVideos.length * 3}s` } as React.CSSProperties}
        >
          {(youtubeVideos.length >= 3
            ? [...youtubeVideos, ...youtubeVideos]
            : youtubeVideos
          ).map((video, idx) => (
            <div key={`${video.id || video.video_id}-${idx}`} className="mr-4 md:mr-8 flex-shrink-0">
              <VideoCard
                videoId={video.video_id}
                thumbnail={video.thumbnail}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Achievers Scroller Component
export const AchieversScroller = React.memo(({ testimonials, cleanPath }: { testimonials: any[], cleanPath: (path: string) => string }) => {
  const [ref, isInView] = useNativeInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="relative w-full" ref={ref}>
      <div
        className={`achievers-scroller pb-4 px-4 md:px-0 ${!isInView ? 'paused' : ''}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflowX: testimonials.length >= 3 ? 'auto' : 'hidden'
        }}
      >
        <div
          className={`flex w-max hover:pause active:pause ${testimonials.length >= 3 ? 'animate-scroll-loop' : 'justify-center'}`}
          style={{ '--duration': `${testimonials.length * 4}s` } as React.CSSProperties}
        >
          {(testimonials.length >= 3
            ? [...testimonials, ...testimonials]
            : testimonials
          ).map((story, i) => (
            <div
              key={`${story.id}-${i}`}
              className="w-[280px] md:w-[340px] lg:w-[380px] xl:w-[400px] bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 flex-shrink-0 mr-4 md:mr-6"
            >
              <div className="flex flex-col items-center text-center gap-4 mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-white shadow-md overflow-hidden bg-blue-50 flex items-center justify-center shrink-0">
                  {story.image ? (
                    <img
                      src={cleanPath(story.image)}
                      alt={story.name}
                      width="96"
                      height="96"
                      loading="lazy"
                      className="w-full h-full object-cover object-[center_10%]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xl">{story.name.charAt(0)}</div>
                  )}
                </div>
                <div className="flex flex-col items-center text-center">
                  <h4 className="font-bold text-lg text-slate-900">{story.name}</h4>
                  <p className="text-sm text-blue-600 font-semibold leading-tight mt-1">
                    {story.role}
                  </p>
                  <div className="flex justify-center text-yellow-400 text-xs mt-2">
                    {[...Array(story.rating || 5)].map((_, i) => <span key={i}>★</span>)}
                  </div>
                </div>
              </div>
              {story.company && (
                <p className="text-xs text-slate-500 font-semibold mb-3 flex items-center justify-center gap-1 w-full text-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                  {story.company}
                  {story.package && <span className="ml-1 text-green-600 font-bold">{story.package}</span>}
                </p>
              )}
              <p className="text-slate-600 italic leading-relaxed line-clamp-4 text-center">
                &ldquo;{story.content || story.quote || ''}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
