
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, Star, Users, Settings, Megaphone, Briefcase, CheckCircle, Globe, PenTool } from 'lucide-react';
import { IMPORTANT_PROGRAM_BLOCKS } from '../constants/ui';

const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
        case 'bot': return <Bot className="w-full h-full" />;
        case 'code': return <Code className="w-full h-full" />;
        case 'star': return <Star className="w-full h-full" />;
        case 'users': return <Users className="w-full h-full" />;
        case 'settings': return <Settings className="w-full h-full" />;
        case 'megaphone': return <Megaphone className="w-full h-full" />;
        case 'briefcase': return <Briefcase className="w-full h-full" />;
        case 'checkcircle': return <CheckCircle className="w-full h-full" />;
        case 'globe': return <Globe className="w-full h-full" />;
        case 'pentool': return <PenTool className="w-full h-full" />;
        default: return <Star className="w-full h-full" />;
    }
};



const ProgramSegments = ({ segments, onRegister }: { segments?: any[], onRegister?: (title: string, category: string) => void }) => {

  // Build timestamp to force hash update: 2026-05-08T11:21:00Z

  const displaySegments = segments && segments.length > 0 ? segments : IMPORTANT_PROGRAM_BLOCKS;
  
  // Duplicate segments for seamless loop
  const duplicatedSegments = [...displaySegments, ...displaySegments];

  return (
    <section className="w-full bg-slate-50 py-24 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">

          Important Program Segments
        </h2>
        <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto font-medium">
          Industry-standard training tracks to accelerate your career growth.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div 
          className="flex animate-scroll space-x-6 px-4 md:px-10 will-change-transform hover:pause active:pause" 
          style={{ 
            width: 'fit-content',
            animationDuration: '60.1s' // Tiny change to force hash update
          }}
        >
          {duplicatedSegments.map((program, i) => (
            <div
              key={`${program.id}-${i}`}
              className="flex-shrink-0 w-[85vw] md:w-[600px] lg:w-[750px]"
            >
              <div 
                className="w-full h-[65vh] md:h-[70vh] max-h-[650px] rounded-[32px] md:rounded-[48px] overflow-hidden relative flex flex-col transition-all duration-700 border border-black/5"
                style={{ 
                  backgroundColor: program.bgColor,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' // Slightly lighter shadow for performance
                }}
              >
                <div className="relative flex flex-col h-full p-6 md:p-10 overflow-y-auto custom-scrollbar">
                  <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-between min-h-full">
                    
                    {/* 1. Header Area */}
                    <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl md:rounded-2xl flex items-center justify-center text-white p-2 md:p-4 shadow-lg">
                        {typeof program.categories?.[0]?.icon === 'string' ? getIcon(program.categories[0].icon) : getIcon('star')}
                      </div>

                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 border border-white/20">
                          {program.badge}
                        </span>
                        <h2 className="text-lg md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tighter">
                          {program.title}
                        </h2>
                      </div>
                    </div>

                    {/* 2. Description - Removed line-clamp to show full text */}
                    <p className="text-white/95 text-[11px] md:text-base lg:text-lg my-4 md:my-6 max-w-4xl leading-relaxed font-bold opacity-95">
                      {program.description}
                    </p>

                    {/* 3. Courses Ticker (Inner Ticker) */}
                    <div className="w-full overflow-hidden relative py-4 my-2 flex-shrink-0">
                      <div className="flex animate-scroll-horizontal space-x-4 will-change-transform hover:pause active:pause">
                        {[...(program.categories || []), ...(program.categories || []), ...(program.categories || [])].map((cat: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex-shrink-0 w-32 md:w-44 bg-white/10 backdrop-blur-2xl border border-white/20 p-4 md:p-5 rounded-[1.5rem] group cursor-pointer transition-all duration-500 hover:bg-white/20 shadow-md min-h-[100px] flex flex-col justify-center"
                          >
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/20 flex items-center justify-center text-white mb-3 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                              <div className="w-4 h-4 md:w-5 md:h-5">
                                {typeof cat.icon === 'string' ? getIcon(cat.icon) : <Star className="w-full h-full" />}
                              </div>
                            </div>
                            <h3 className="text-[9px] md:text-[11px] font-black text-white leading-tight uppercase tracking-wider">{cat.name}</h3>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. CTA Buttons */}
                    <div className="flex flex-wrap gap-3 md:gap-6 pt-6 flex-shrink-0 pb-4">
                      {onRegister ? (
                        <button
                          onClick={() => onRegister(program.title, program.categories?.[0]?.name || 'General')}
                          className="px-6 py-3 md:px-10 md:py-4 bg-white text-slate-900 font-black text-[10px] md:text-base rounded-xl hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center gap-2 group shadow-xl"
                        >
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          Register Now
                        </button>
                      ) : (
                        <Link
                          to="/contact"
                          className="px-6 py-3 md:px-10 md:py-4 bg-white text-slate-900 font-black text-[10px] md:text-base rounded-xl hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center gap-2 group shadow-xl"
                        >
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          Register Now
                        </Link>
                      )}

                      <Link
                        to="/courses"
                        className="px-6 py-3 md:px-10 md:py-4 bg-transparent border-2 border-white text-white font-black text-[10px] md:text-base rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center gap-2 group"
                      >
                        Explore First
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default ProgramSegments;


