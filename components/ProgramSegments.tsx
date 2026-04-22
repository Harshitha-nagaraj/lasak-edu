
import React from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, Star, Users, Settings, Megaphone, Briefcase, CheckCircle, Globe, PenTool } from 'lucide-react';
import { IMPORTANT_PROGRAM_BLOCKS } from '../constants/ui';

const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
        case 'bot': return <Bot className="w-6 h-6" />;
        case 'code': return <Code className="w-6 h-6" />;
        case 'star': return <Star className="w-6 h-6" />;
        case 'users': return <Users className="w-6 h-6" />;
        case 'settings': return <Settings className="w-6 h-6" />;
        case 'megaphone': return <Megaphone className="w-6 h-6" />;
        case 'briefcase': return <Briefcase className="w-6 h-6" />;
        case 'checkcircle': return <CheckCircle className="w-6 h-6" />;
        case 'globe': return <Globe className="w-6 h-6" />;
        case 'pentool': return <PenTool className="w-6 h-6" />;
        default: return <Star className="w-6 h-6" />;
    }
};

const ProgramSegments = ({ segments }: { segments?: any[] }) => {
  const displaySegments = segments && segments.length > 0 ? segments : IMPORTANT_PROGRAM_BLOCKS;

  return (
    <div className="w-full bg-slate-50 relative pb-[20vh]">
      <div className="relative w-full">
        {/* Header Section */}
        <div className="pt-24 pb-16 text-center relative z-20 bg-slate-50">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 px-4 tracking-tighter">
            Important Program Segments
          </h2>
          <p className="text-slate-600 text-base md:text-xl max-w-3xl mx-auto px-6 font-medium">
            Specialized career-launching tracks with industry-standard curriculum and placement support.
          </p>
        </div>

        {/* Sticky Cards Container */}
        <div className="relative max-w-[1300px] mx-auto w-full px-4 md:px-10">
          {displaySegments.map((program, i) => {
            return (
              <div
                key={program.id}
                className="sticky w-full mb-[15vh] last:mb-0"
                style={{ 
                  top: `calc(100px + ${i * 40}px)`, // Increased spacing for "tab" effect
                  zIndex: i + 1
                }}
              >
                {/* Responsive top for Desktop */}
                <style dangerouslySetInnerHTML={{ __html: `
                  @media (min-width: 1024px) {
                    .sticky-card-${i} { top: calc(160px + ${i * 48}px) !important; }
                  }
                `}} />
                
                <div 
                  className={`sticky-card-${i} w-full min-h-[50vh] md:h-[70vh] rounded-[32px] md:rounded-[60px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden relative flex flex-col transition-all duration-500`}
                  style={{ 
                    backgroundColor: program.bgColor,
                  }}
                >
                  <div className="relative flex flex-col h-full overflow-y-auto p-8 md:p-20 custom-scrollbar">
                    <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col justify-center">
                      {/* Badge */}
                      <div className="mb-6 md:mb-10">
                        <span className="inline-block px-5 py-2 rounded-full bg-white text-slate-900 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                          {program.badge}
                        </span>
                      </div>

                      {/* Heading */}
                      <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-white mb-6 md:mb-10 leading-[0.95] tracking-tighter">
                        {program.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-white/90 text-sm md:text-2xl mb-10 md:mb-16 max-w-4xl leading-relaxed font-semibold opacity-90">
                        {program.description}
                      </p>

                      {/* Content Grid / Ticker */}
                      <div className="w-full mb-12 md:mb-16">
                        {program.layout === 'sap' || program.layout === 'externship' ? (
                          <div className={`grid grid-cols-1 ${program.layout === 'sap' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 md:gap-10`}>
                            {(program.categories || []).map((cat: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 md:p-10 rounded-[3rem] group cursor-pointer transition-all duration-700 hover:bg-white/20 hover:scale-[1.03]"
                              >
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-8 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                                  {typeof cat.icon === 'string' ? getIcon(cat.icon) : cat.icon}
                                </div>
                                <h3 className="text-xl md:text-3xl font-black text-white mb-4 leading-tight">{cat.name}</h3>
                                <p className="text-white/80 text-xs md:text-base leading-relaxed mb-8 line-clamp-3 font-semibold">
                                  {cat.desc}
                                </p>
                                <div className="flex items-center text-white font-black text-xs md:text-base group-hover:translate-x-3 transition-transform duration-500">
                                  <span>Learn More</span>
                                  <ArrowRight size={20} className="ml-3" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative overflow-hidden group/ticker py-6">
                            <div className="flex animate-scroll hover:pause space-x-6 md:space-x-10">
                              {[...(program.categories || []), ...(program.categories || [])].map((cat: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex-shrink-0 w-44 md:w-72 bg-white/10 hover:bg-white/20 transition-all duration-700 p-6 md:p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center md:items-start text-center md:text-left backdrop-blur-xl group cursor-pointer hover:scale-[1.05]"
                                >
                                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-[1.5rem] bg-white/20 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                                    {typeof cat.icon === 'string' ? getIcon(cat.icon) : cat.icon}
                                  </div>
                                  <h3 className="text-white font-black text-[12px] md:text-xl leading-tight uppercase tracking-widest">
                                    {cat.name}
                                  </h3>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-6 md:gap-10 mt-auto pt-6">
                        <Link
                          to="/contact"
                          className="px-10 py-5 md:px-16 md:py-8 bg-white text-slate-900 font-black text-xs md:text-xl rounded-2xl hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.4)] transition-all duration-500 active:scale-95 shadow-2xl flex items-center gap-4 group"
                        >
                          Register Now
                          <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                        </Link>
                        <Link
                          to="/courses"
                          className="px-10 py-5 md:px-16 md:py-8 bg-transparent border-4 border-white text-white font-black text-xs md:text-xl rounded-2xl hover:bg-white/10 transition-all duration-500 active:scale-95 flex items-center gap-4 group"
                        >
                          Explore Tracks
                          <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgramSegments;
