
import React from 'react';
import { m } from 'framer-motion';
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

const ProgramSegments = ({ segments }: { segments?: any[] }) => {
  const displaySegments = segments && segments.length > 0 ? segments : IMPORTANT_PROGRAM_BLOCKS;

  return (
    <div className="w-full bg-slate-50 relative pb-32">
      <div className="relative w-full">
        {/* Header Section */}
        <div className="pt-24 pb-10 text-center relative z-20 bg-slate-50">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 px-4 tracking-tight">
            Important Program Segments
          </h2>
          <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto px-6 font-medium">
            Industry-standard training tracks to accelerate your career growth.
          </p>
        </div>

        {/* Sticky Cards Container */}
        <div className="relative max-w-[1200px] mx-auto w-full px-4 md:px-8">
          {displaySegments.map((program, i) => {
            return (
              <div
                key={program.id}
                className="sticky w-full mb-[10vh] last:mb-0"
                style={{ 
                  top: `calc(130px + ${i * 32}px)`, // Increased top offset to clear header
                  zIndex: i + 1
                }}
              >
                <div 
                  className={`w-full h-[65vh] md:h-[75vh] rounded-[24px] md:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-700`}
                  style={{ 
                    backgroundColor: program.bgColor,
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="relative flex flex-col h-full overflow-y-auto p-6 md:p-12 custom-scrollbar">
                    <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col justify-center py-4">
                      
                      {/* Compact Header Area */}
                      <div className="flex items-center gap-4 md:gap-8 mb-6 md:mb-10">
                        <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl md:rounded-3xl flex items-center justify-center text-white p-4 md:p-6">
                          {typeof program.categories?.[0]?.icon === 'string' ? getIcon(program.categories[0].icon) : getIcon('star')}
                        </div>

                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-2 border border-white/20">
                            {program.badge}
                          </span>
                          <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                            {program.title}
                          </h2>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/90 text-[10px] md:text-lg mb-8 md:mb-12 max-w-4xl leading-relaxed font-semibold opacity-95">
                        {program.description}
                      </p>

                      {/* Tighter Content Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
                        {(program.categories || []).map((cat: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 md:p-6 rounded-[1.5rem] group cursor-pointer transition-all duration-500 hover:bg-white/20"
                          >
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center text-white mb-3 group-hover:bg-white group-hover:text-slate-900 transition-all">
                              <div className="w-5 h-5 md:w-6 md:h-6">
                                {typeof cat.icon === 'string' ? getIcon(cat.icon) : <Star className="w-full h-full" />}
                              </div>
                            </div>
                            <h3 className="text-[10px] md:text-sm font-black text-white leading-tight uppercase tracking-wider">{cat.name}</h3>
                          </div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 md:gap-6 pt-4">
                        <Link
                          to="/contact"
                          className="px-8 py-3 md:px-12 md:py-4 bg-white text-slate-900 font-black text-[10px] md:text-base rounded-xl hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center gap-3 group"
                        >
                          Register Now
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          to="/courses"
                          className="px-8 py-3 md:px-12 md:py-4 bg-transparent border-2 border-white text-white font-black text-[10px] md:text-base rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center gap-3 group"
                        >
                          View Details
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
