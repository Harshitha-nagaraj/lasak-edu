import React, { useState, useEffect } from "react";
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

const StudentTestimonials = ({ 
  videos = [], 
  title = "Student Testimonials", 
  subtitle = "Our learners sharing their experience.",
  className = ""
}: { 
  videos?: any[], 
  title?: string, 
  subtitle?: string,
  className?: string
}) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Use fallback if no videos are provided
  const displayVideos = videos.length > 0 ? videos : FALLBACK_VIDEOS;

  return (
    <section className={`relative py-24 overflow-hidden ${className}`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* ---------------- HEADER ---------------- */}
      <div className="container mx-auto px-4 text-center mb-16 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Success Stories
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* ---------------- SCROLLING ROW ---------------- */}
      <div className="relative w-full">
        <div
          className="student-testimonials-scroller pb-12 px-4 md:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflowX: displayVideos.length >= 3 ? 'auto' : 'hidden'
          }}
        >
          <div
            className={`flex w-max ${displayVideos.length >= 3 ? 'animate-scroll-loop hover:pause active:pause' : 'justify-center mx-auto'} gap-6 md:gap-10`}
            style={{ '--duration': `${displayVideos.length * 4}s` } as React.CSSProperties}
          >
            {(displayVideos.length >= 3
              ? [...displayVideos, ...displayVideos]
              : displayVideos
            ).map((v, i) => (
              <div
                key={`${v.id || 'fallback'}-${i}`}
                onClick={() => {
                  const ytId = getYoutubeId(v.video_url);
                  const driveId = getGoogleDriveId(v.video_url);
                  setActiveVideo(ytId || driveId ? v.video_url : cleanPath(v.video_url));
                }}
                className="
                  relative cursor-pointer
                  w-[160px] xs:w-[200px] md:w-[300px]
                  h-[280px] xs:h-[350px] md:h-[500px]
                  bg-slate-900 rounded-[2.5rem]
                  overflow-hidden
                  border-4 border-white
                  shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]
                  flex-shrink-0
                  group
                  transition-all duration-500
                  hover:-translate-y-4 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.4)]
                  hover:border-blue-500/20
                "
              >
                {/* Thumbnail Logic */}
                {getYoutubeId(v.video_url) ? (
                  <img
                    src={`https://img.youtube.com/vi/${getYoutubeId(v.video_url)}/maxresdefault.jpg`}
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-700"
                    alt="Video Thumbnail"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYoutubeId(v.video_url)}/hqdefault.jpg`;
                    }}
                  />
                ) : (
                  <video
                    src={v.video_url.startsWith('http') ? v.video_url : `${cleanPath(v.video_url)}#t=0.5`}
                    muted
                    playsInline
                    loop
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => {
                      const videoElem = (e.target as HTMLVideoElement);
                      videoElem.pause();
                      videoElem.currentTime = 0.5;
                    }}
                    preload="metadata"
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-700"
                  />
                )}

                {/* Glass Badge Overlay */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-white uppercase tracking-widest shadow-lg">
                    {v.title?.includes('IT') ? '💻 Tech' : v.title?.includes('Mech') ? '⚙️ Core' : '🎓 Graduate'}
                  </div>
                </div>

                {/* Overlay with glassmorphism */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-blue-900/60 transition-all duration-500 flex flex-col items-center justify-end p-6 md:p-8">
                  <div
                    className="
                      w-14 h-14 md:w-20 md:h-20
                      bg-white rounded-full
                      flex items-center justify-center
                      shadow-2xl border-4 border-white/20 mb-6
                      scale-90 group-hover:scale-100 group-hover:bg-blue-600 transition-all duration-500
                    "
                  >
                    <Play className="text-blue-600 group-hover:text-white ml-1 fill-current" size={32} />
                  </div>
                  {v.title && (
                    <h3 className="text-white text-base md:text-xl font-bold text-center drop-shadow-xl leading-tight group-hover:translate-y-[-10px] transition-transform duration-500">
                      {v.title}
                    </h3>
                  )}
                  <div className="w-8 h-1 bg-blue-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fades */}
        <div className="absolute top-0 left-0 w-12 md:w-48 h-full bg-gradient-to-r from-slate-50/80 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-12 md:w-48 h-full bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* View All CTA */}
      <div className="container mx-auto px-4 text-center mt-12 relative z-20">
        <button 
          onClick={() => window.location.href = '/student-testimonials'}
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-2xl hover:shadow-blue-500/40 active:scale-95 group"
        >
          Explore All Stories 
          <Play size={18} className="fill-white group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* ---------------- MODAL VIDEO ---------------- */}
      
        {activeVideo && (
          <div
            className="
              fixed inset-0 z-[9999]
              bg-black/80 backdrop-blur-sm
              flex items-center justify-center
              px-4
            "
          >
            <div
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
            </div>
          </div>
        )}
    </section>
  );
};

export default React.memo(StudentTestimonials);
