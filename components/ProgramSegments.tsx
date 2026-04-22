
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
    <div className="w-full bg-slate-50 relative pb-64"> {/* Added large bottom padding for last card clearance */}
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
                className="sticky w-full mb-[10vh] last:mb-0"
                style={{ 
                  top: `calc(100px + ${i * 32}px)`, 
                  zIndex: i + 1
                }}
              >
                <div 
                  className={`w-full h-[70vh] md:h-[75vh] max-h-[700px] rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-700`}
                  style={{ 
                    backgroundColor: program.bgColor,
                    boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div className="relative flex flex-col h-full p-6 md:p-12">
                    <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-between">
                      
                      {/* 1. Header Area */}
                      <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                        <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-white p-3 md:p-5 shadow-xl">
                          {typeof program.categories?.[0]?.icon === 'string' ? getIcon(program.categories[0].icon) : getIcon('star')}
                        </div>

                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 border border-white/20">
                            {program.badge}
                          </span>
                          <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter">
                            {program.title}
                          </h2>
                        </div>
                      </div>

                      {/* 2. Description */}
                      <p className="text-white/90 text-[10px] md:text-lg lg:text-xl my-3 md:my-6 max-w-4xl leading-relaxed font-bold opacity-95 line-clamp-2 md:line-clamp-3">
                        {program.description}
                      </p>

                      {/* 3. Autoscrolling Courses Ticker */}
                      <div className="w-full overflow-hidden relative py-3 my-2 flex-shrink-0">
                        <div className="flex animate-scroll hover:pause space-x-4 md:space-x-8">
                          {[...(program.categories || []), ...(program.categories || []), ...(program.categories || [])].map((cat: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex-shrink-0 w-32 md:w-56 bg-white/10 backdrop-blur-3xl border border-white/20 p-4 md:p-6 rounded-[1.5rem] group cursor-pointer transition-all duration-500 hover:bg-white/20 shadow-lg"
                            >
                              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center text-white mb-3 md:mb-4 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                                <div className="w-5 h-5 md:w-7 md:h-7">
                                  {typeof cat.icon === 'string' ? getIcon(cat.icon) : <Star className="w-full h-full" />}
                                </div>
                              </div>
                              <h3 className="text-[9px] md:text-sm lg:text-base font-black text-white leading-tight uppercase tracking-wider">{cat.name}</h3>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. CTA Buttons */}
                      <div className="flex flex-wrap gap-4 md:gap-8 pt-4 flex-shrink-0 pb-2">
                        <Link
                          to="/contact"
                          className="px-8 py-3 md:px-14 md:py-5 bg-white text-slate-900 font-black text-[10px] md:text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center gap-3 group"
                        >
                          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                          Register Now
                        </Link>
                        <Link
                          to="/courses"
                          className="px-8 py-3 md:px-14 md:py-5 bg-transparent border-2 md:border-4 border-white text-white font-black text-[10px] md:text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 active:scale-95 flex items-center gap-3 group"
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
