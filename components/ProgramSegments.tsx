
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
        <div className="relative max-w-[1300px] mx-auto w-full px-4 md:px-10">
          {displaySegments.map((program, i) => {
            return (
              <div
                key={program.id}
                className="sticky w-full mb-[8vh] last:mb-0"
                style={{ 
                  top: `calc(100px + ${i * 32}px)`, // Adjusted to sit just below header
                  zIndex: i + 1
                }}
              >
                <div 
                  className={`w-full h-[70vh] md:h-[80vh] max-h-[750px] rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-700`}
                  style={{ 
                    backgroundColor: program.bgColor,
                    boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="relative flex flex-col h-full p-6 md:p-14">
                    <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-between">
                      
                      {/* 1. Header Area */}
                      <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                        <div className="w-14 h-14 md:w-24 md:h-24 flex-shrink-0 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white p-3 md:p-6 shadow-xl">
                          {typeof program.categories?.[0]?.icon === 'string' ? getIcon(program.categories[0].icon) : getIcon('star')}
                        </div>

                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-2 border border-white/20">
                            {program.badge}
                          </span>
                          <h2 className="text-xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                            {program.title}
                          </h2>
                        </div>
                      </div>

                      {/* 2. Description */}
                      <p className="text-white/90 text-[10px] md:text-xl lg:text-2xl my-4 md:my-8 max-w-4xl leading-relaxed font-bold opacity-95 line-clamp-3">
                        {program.description}
                      </p>

                      {/* 3. Autoscrolling Courses Ticker */}
                      <div className="w-full overflow-hidden relative py-4 my-2 flex-shrink-0">
                        <div className="flex animate-scroll hover:pause space-x-4 md:space-x-8">
                          {[...(program.categories || []), ...(program.categories || []), ...(program.categories || [])].map((cat: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex-shrink-0 w-32 md:w-64 bg-white/10 backdrop-blur-3xl border border-white/20 p-4 md:p-8 rounded-[2rem] group cursor-pointer transition-all duration-500 hover:bg-white/20 shadow-lg"
                            >
                              <div className="w-8 h-8 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center text-white mb-3 md:mb-6 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                                <div className="w-5 h-5 md:w-9 md:h-9">
                                  {typeof cat.icon === 'string' ? getIcon(cat.icon) : <Star className="w-full h-full" />}
                                </div>
                              </div>
                              <h3 className="text-[9px] md:text-base lg:text-lg font-black text-white leading-tight uppercase tracking-wider">{cat.name}</h3>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. CTA Buttons */}
                      <div className="flex flex-wrap gap-4 md:gap-10 pt-4 flex-shrink-0">
                        <Link
                          to="/contact"
                          className="px-8 py-3.5 md:px-16 md:py-6 bg-white text-slate-900 font-black text-[10px] md:text-xl rounded-2xl hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center gap-4 group"
                        >
                          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                          Register Now
                        </Link>
                        <Link
                          to="/courses"
                          className="px-8 py-3.5 md:px-16 md:py-6 bg-transparent border-2 md:border-4 border-white text-white font-black text-[10px] md:text-xl rounded-2xl hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center gap-4 group"
                        >
                          Explore First
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
