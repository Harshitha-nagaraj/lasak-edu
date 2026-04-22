
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
    <div className="w-full bg-slate-50 relative pb-32">
      <div className="relative w-full">
        {/* Header Section */}
        <div className="pt-24 pb-12 text-center relative z-20 bg-slate-50">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 px-4 tracking-tight">
            Important Program Segments
          </h2>
          <p className="text-slate-600 text-sm md:text-lg max-w-2xl mx-auto px-6 font-medium">
            Specialized training tracks designed to launch your career in top industries.
          </p>
        </div>

        {/* Sticky Cards Container */}
        <div className="relative max-w-[1200px] mx-auto w-full px-4 md:px-8">
          {displaySegments.map((program, i) => {
            return (
              <div
                key={program.id}
                className="sticky w-full mb-[8vh] last:mb-0"
                style={{ 
                  top: `calc(100px + ${i * 32}px)`, 
                  zIndex: i + 1
                }}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  @media (min-width: 1024px) {
                    .sticky-card-${i} { top: calc(140px + ${i * 40}px) !important; }
                  }
                `}} />
                
                <div 
                  className={`sticky-card-${i} w-full min-h-[40vh] md:h-[60vh] rounded-[24px] md:rounded-[48px] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-500`}
                  style={{ 
                    backgroundColor: program.bgColor,
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="relative flex flex-col h-full overflow-y-auto p-6 md:p-12 custom-scrollbar">
                    <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-center py-4">
                      {/* Badge */}
                      <div className="mb-4 md:mb-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-slate-900 text-[9px] md:text-xs font-black uppercase tracking-widest">
                          {program.badge}
                        </span>
                      </div>

                      {/* Heading */}
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tight">
                        {program.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-white/90 text-xs md:text-lg mb-8 md:mb-10 max-w-3xl leading-relaxed font-semibold opacity-90">
                        {program.description}
                      </p>

                      {/* Content Grid / Ticker */}
                      <div className="w-full mb-8 md:mb-10">
                        {program.layout === 'sap' || program.layout === 'externship' ? (
                          <div className={`grid grid-cols-1 ${program.layout === 'sap' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 md:gap-6`}>
                            {(program.categories || []).map((cat: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[1.5rem] group cursor-pointer transition-all duration-500 hover:bg-white/20"
                              >
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4 group-hover:bg-white group-hover:text-slate-900 transition-all">
                                  {typeof cat.icon === 'string' ? getIcon(cat.icon) : cat.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-white mb-2">{cat.name}</h3>
                                <p className="text-white/80 text-[10px] md:text-xs leading-relaxed mb-4 line-clamp-3 font-semibold">
                                  {cat.desc}
                                </p>
                                <div className="flex items-center text-white font-black text-[10px] md:text-xs group-hover:translate-x-2 transition-transform">
                                  <span>Learn More</span>
                                  <ArrowRight size={14} className="ml-2" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative overflow-hidden group/ticker py-4">
                            <div className="flex animate-scroll hover:pause space-x-4 md:space-x-8">
                              {[...(program.categories || []), ...(program.categories || [])].map((cat: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex-shrink-0 w-36 md:w-56 bg-white/10 hover:bg-white/20 transition-all p-5 rounded-[1.5rem] border border-white/10 flex flex-col items-center md:items-start text-center md:text-left backdrop-blur-lg group cursor-pointer"
                                >
                                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4 group-hover:bg-white group-hover:text-slate-900 transition-all">
                                    {typeof cat.icon === 'string' ? getIcon(cat.icon) : cat.icon}
                                  </div>
                                  <h3 className="text-white font-black text-[10px] md:text-base leading-tight uppercase tracking-wider">
                                    {cat.name}
                                  </h3>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 md:gap-8 pt-4">
                        <Link
                          to="/contact"
                          className="px-8 py-3.5 md:px-12 md:py-5 bg-white text-slate-900 font-black text-[10px] md:text-base rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-xl flex items-center gap-3 group"
                        >
                          Register Now
                          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link
                          to="/courses"
                          className="px-8 py-3.5 md:px-12 md:py-5 bg-transparent border-2 border-white text-white font-black text-[10px] md:text-base rounded-xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3 group"
                        >
                          Explore Tracks
                          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
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
