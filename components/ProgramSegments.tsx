
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
    <div className="w-full bg-slate-50 relative pb-40">
      <div className="relative w-full">
        {/* Header Section */}
        <div className="pt-24 pb-8 text-center relative z-20 bg-slate-50">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 px-4 tracking-tight">
            Important Program Segments
          </h2>
          <p className="text-slate-500 text-xs md:text-base max-w-xl mx-auto px-6 font-medium">
            Discover our specialized tracks designed for modern career success.
          </p>
        </div>

        {/* Sticky Cards Container */}
        <div className="relative max-w-[1400px] mx-auto w-full px-2 md:px-6">
          {displaySegments.map((program, i) => {
            return (
              <div
                key={program.id}
                className="sticky w-full mb-[12vh] last:mb-0"
                style={{ 
                  top: `calc(60px + ${i * 24}px)`, // Lower top offset to show more card
                  zIndex: i + 1
                }}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  @media (min-width: 1024px) {
                    .sticky-card-${i} { top: calc(80px + ${i * 32}px) !important; }
                  }
                `}} />
                
                <div 
                  className={`sticky-card-${i} w-full h-[80vh] md:h-[85vh] rounded-[32px] md:rounded-[56px] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-500`}
                  style={{ 
                    backgroundColor: program.bgColor,
                    boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.45)'
                  }}
                >
                  <div className="relative flex flex-col h-full overflow-y-auto p-5 md:p-14 custom-scrollbar">
                    <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col justify-center py-2">
                      {/* Badge */}
                      <div className="mb-3 md:mb-6">
                        <span className="inline-block px-4 py-1 rounded-full bg-white text-slate-900 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                          {program.badge}
                        </span>
                      </div>

                      {/* Heading */}
                      <h2 className="text-2xl md:text-5xl lg:text-7xl font-black text-white mb-3 md:mb-6 leading-[1.05] tracking-tight">
                        {program.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-white/90 text-[10px] md:text-xl mb-6 md:mb-10 max-w-4xl leading-relaxed font-semibold opacity-95">
                        {program.description}
                      </p>

                      {/* Content Grid / Ticker */}
                      <div className="w-full mb-6 md:mb-10">
                        {program.layout === 'sap' || program.layout === 'externship' ? (
                          <div className={`grid grid-cols-1 ${program.layout === 'sap' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3 md:gap-8`}>
                            {(program.categories || []).map((cat: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white/10 backdrop-blur-2xl border border-white/20 p-5 md:p-10 rounded-[2.5rem] group cursor-pointer transition-all duration-500 hover:bg-white/20"
                              >
                                <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-4 md:mb-8 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                                  {typeof cat.icon === 'string' ? getIcon(cat.icon) : cat.icon}
                                </div>
                                <h3 className="text-lg md:text-3xl font-black text-white mb-2 md:mb-4 leading-tight">{cat.name}</h3>
                                <p className="text-white/80 text-[10px] md:text-base leading-relaxed mb-4 md:mb-10 line-clamp-3 font-bold">
                                  {cat.desc}
                                </p>
                                <div className="flex items-center text-white font-black text-[10px] md:text-base group-hover:translate-x-3 transition-transform duration-500">
                                  <span>View Details</span>
                                  <ArrowRight size={18} className="ml-3" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative overflow-hidden group/ticker py-4">
                            <div className="flex animate-scroll hover:pause space-x-4 md:space-x-10">
                              {[...(program.categories || []), ...(program.categories || [])].map((cat: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex-shrink-0 w-36 md:w-72 bg-white/10 hover:bg-white/20 transition-all duration-500 p-5 md:p-12 rounded-[2.5rem] border border-white/10 flex flex-col items-center md:items-start text-center md:text-left backdrop-blur-xl group cursor-pointer hover:scale-[1.05]"
                                >
                                  <div className="w-10 h-10 md:w-20 md:h-20 rounded-[1.5rem] bg-white/20 flex items-center justify-center text-white mb-4 md:mb-8 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                                    {typeof cat.icon === 'string' ? getIcon(cat.icon) : cat.icon}
                                  </div>
                                  <h3 className="text-white font-black text-[10px] md:text-xl leading-tight uppercase tracking-[0.1em]">
                                    {cat.name}
                                  </h3>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 md:gap-10 mt-auto pt-4">
                        <Link
                          to="/contact"
                          className="px-8 py-3 md:px-14 md:py-6 bg-white text-slate-900 font-black text-[10px] md:text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 active:scale-95 shadow-xl flex items-center gap-4 group"
                        >
                          Register Now
                          <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform" />
                        </Link>
                        <Link
                          to="/courses"
                          className="px-8 py-3 md:px-14 md:py-6 bg-transparent border-2 md:border-4 border-white text-white font-black text-[10px] md:text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center gap-4 group"
                        >
                          View Courses
                          <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform" />
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
