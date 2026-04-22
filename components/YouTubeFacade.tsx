import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useNativeInView } from '../hooks/useNativeInView';

export const YouTubeFacade = ({ videoId, title, className = "w-full h-full" }: { videoId: string, title?: string, className?: string }) => {
    const [loaded, setLoaded] = useState(false);
    const [ref, isVisible] = useNativeInView<HTMLDivElement>({ once: true, rootMargin: '200px' });

    if (!loaded) {
        return (
            <div 
                ref={ref}
                className={`relative cursor-pointer bg-black flex items-center justify-center group ${className}`} 
                onClick={() => setLoaded(true)}
            >
                {isVisible && (
                    <img 
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                        }}
                        loading="lazy" 
                        alt={title || "Play video"} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-white/30 group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                    <Play className="text-white ml-1 fill-white" size={32} />
                  </div>
                </div>
            </div>
        );
    }

    return (
        <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title || "YouTube Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={className}
        />
    );
};
