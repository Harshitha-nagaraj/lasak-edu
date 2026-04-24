import React, { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

/* ---------------- DATA ---------------- */
const FALLBACK_VIDEOS = [
  { video_url: "https://youtube.com/shorts/1fi4stfhFxc?feature=share", title: "Student success story" },
  { video_url: "https://youtube.com/shorts/R9YEUvcamTY?feature=share", title: "Student success story" },
  { video_url: "https://youtube.com/shorts/I3c4t4_0QYE?feature=share", title: "Student success story" },
  { video_url: "https://youtube.com/shorts/4b79hKynNl0?feature=share", title: "Student success story" },
  { video_url: "https://youtube.com/shorts/QYwDl90Sgbw?feature=share", title: "Student success story" },
  { video_url: "https://youtube.com/shorts/Ieo5f-hb3M8?feature=share", title: "Student success story" },
  { video_url: "https://youtube.com/shorts/6PHA749J-ec?feature=share", title: "Student success story" },
  { video_url: "https://youtube.com/shorts/Fbw1g-TGemI?feature=share", title: "Student success story" },
  { video_url: "https://youtube.com/shorts/kwIZNS4KaDY?feature=share", title: "Student success story" },
];

import { normalizeImagePath as cleanPath } from "../lib/imageUtils";

export const getYoutubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  // If it's just an 11-char ID without / or .mp4
  if (url.length === 11 && !url.includes('/') && !url.includes('.mp4')) return url;
  return null;
};

export const getGoogleDriveId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

const StudentTestimonials = ({ videos = [] }: { videos?: any[] }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Use fallback if no videos are provided
  const displayVideos = videos.length > 0 ? videos : FALLBACK_VIDEOS;

  return (
    <section className="pt-8 pb-12 bg-white border-t border-slate-100 overflow-hidden">
      {/* ---------------- HEADER ---------------- */}
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 mt-0 mb-2">
          Student Testimonials
        </h2>
        <p className="text-slate-500">
          Our learners sharing their experience.
        </p>
      </div>

      {/* ---------------- SCROLLING ROW ---------------- */}
      <div className="relative w-full">
        <div
          className="student-testimonials-scroller pb-4 px-4 md:px-0"
          onMouseDown={(e) => e.currentTarget.classList.add('paused')}
          onMouseUp={(e) => e.currentTarget.classList.remove('paused')}
          onTouchStart={(e) => e.currentTarget.classList.add('paused')}
          onTouchEnd={(e) => e.currentTarget.classList.remove('paused')}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflowX: displayVideos.length >= 3 ? 'auto' : 'hidden'
          }}
        >
          <div
            className={`flex w-max ${displayVideos.length >= 3 ? 'animate-scroll-loop' : 'justify-center'}`}
            style={{ '--duration': `${displayVideos.length * 3}s` } as React.CSSProperties}
          >
            {(displayVideos.length >= 3
              ? [...displayVideos, ...displayVideos]
              : displayVideos
            ).map((v, i) => (
              <m.div
                key={`${v.id || 'fallback'}-${i}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const ytId = getYoutubeId(v.video_url);
                  const driveId = getGoogleDriveId(v.video_url);
                  setActiveVideo(ytId || driveId ? v.video_url : cleanPath(v.video_url));
                }}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' || e.key === ' ') {
                    const ytId = getYoutubeId(v.video_url);
                    const driveId = getGoogleDriveId(v.video_url);
                    setActiveVideo(ytId || driveId ? v.video_url : cleanPath(v.video_url));
                  }
                }}
                className="
                  relative cursor-pointer
                  w-[140px] xs:w-[180px] md:w-[260px]
                  h-[240px] xs:h-[300px] md:h-[400px]
                  bg-slate-900 rounded-2xl
                  overflow-hidden
                  border border-slate-200
                  shadow-xl flex-shrink-0
                  mr-4 md:mr-10
                  group
                "
              >
                {/* Thumbnail Logic */}
                {getYoutubeId(v.video_url) ? (
                  <img
                    src={`https://img.youtube.com/vi/${getYoutubeId(v.video_url)}/hqdefault.jpg`}
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-500"
                    alt="Video Thumbnail"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYoutubeId(v.video_url)}/mqdefault.jpg`;
                    }}
                  />
                ) : (
                  <video
                    src={v.video_url.startsWith('http') ? v.video_url : `${cleanPath(v.video_url)}#t=0.5`}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-500"
                    onLoadedData={(e) => {
                      // Attempt to show first frame
                      (e.target as HTMLVideoElement).currentTime = 0.5;
                    }}
                  />
                )}

                {/* Overlay with glassmorphism */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center p-4">
                  <div
                    className="
                      w-14 h-14 md:w-20 md:h-20
                      bg-white/20 backdrop-blur-md rounded-full
                      flex items-center justify-center
                      shadow-2xl border border-white/30 mb-4
                      group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300
                    "
                  >
                    <Play className="text-white ml-1 fill-white" size={32} />
                  </div>
                  {v.title && (
                    <p className="text-white text-sm md:text-base font-bold text-center drop-shadow-xl leading-tight">
                      {v.title}
                    </p>
                  )}
                </div>
              </m.div>
            ))}
          </div>
        </div>

        {/* Fades */}
        <div className="absolute top-0 left-0 w-6 md:w-24 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 md:w-24 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* ---------------- MODAL VIDEO ---------------- */}
      <AnimatePresence>
        {activeVideo && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 z-[9999]
              bg-black/80 backdrop-blur-sm
              flex items-center justify-center
              px-4
            "
          >
            <m.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ duration: 0.3 }}
              className="
                relative w-full max-w-4xl
                bg-black rounded-xl
                overflow-hidden shadow-2xl
              "
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
                className="
                  absolute top-3 right-3 z-10
                  w-10 h-10
                  bg-red-600 hover:bg-red-700
                  text-white rounded-full
                  flex items-center justify-center
                "
              >
                <X size={22} />
              </button>

              {/* Video */}
              <div className="w-full aspect-video bg-black">
                {getYoutubeId(activeVideo) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo)}?autoplay=1`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : getGoogleDriveId(activeVideo) ? (
                  <iframe
                    src={`https://drive.google.com/file/d/${getGoogleDriveId(activeVideo)}/preview`}
                    className="w-full h-full border-0"
                    allow="autoplay"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo}
                    autoPlay
                    controls
                    playsInline
                    controlsList="nodownload noplaybackrate noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default React.memo(StudentTestimonials);
