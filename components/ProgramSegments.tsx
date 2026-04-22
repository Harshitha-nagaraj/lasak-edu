
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
    <div className="w-full bg-slate-50 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        .snap-container {
          scroll-snap-type: y mandatory;
          overflow-y: visible;
        }
        .snap-card {
          scroll-snap-align: center;
          scroll-snap-stop: always;
        }
      `}} />

      <div className="relative w-full snap-container">
        {/* Header Section */}
        <div className="pt-24 pb-12 text-center relative z-20 bg-slate-50">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 px-4 tracking-tight">
            Important Program Segments
          </h2>
          <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto px-6 font-medium">
            Step into the future of learning with our specialized career tracks.
          </p>
        </div>

        {/* Sticky Cards Container */}
        <div className="relative max-w-[1400px] mx-auto w-full px-4 md:px-10 pb-40">
          {displaySegments.map((program, i) => {
            return (
              <div
                key={program.id}
                className="snap-card sticky w-full mb-[15vh] last:mb-0"
                style={{ 
                  top: `calc(80px + ${i * 32}px)`, 
                  zIndex: i + 1
                }}
              >
                <div 
                  className={`w-full h-[85vh] md:h-[90vh] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col transition-all duration-700`}
                  style={{ 
                    backgroundColor: program.bgColor,
                    boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <div className="relative flex flex-col h-full overflow-y-auto p-6 md:p-16 custom-scrollbar">
                    <div className="w-full max-w-6xl mx-auto">
                      
                      {/* Top Header Area (Icon + Title) */}
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 mb-10 md:mb-16">
                        {/* Large Icon Box */}
                        <div className="w-24 h-24 md:w-40 md:h-40 flex-shrink-0 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center text-white p-6 md:p-10 shadow-2xl">
                          {typeof program.categories?.[0]?.icon === 'string' ? getIcon(program.categories[0].icon) : getIcon('star')}
                        </div>

                        <div className="flex-grow">
                          {/* Badge */}
                          <div className="mb-4">
                            <span className="inline-block px-5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-white/20">
                              {program.badge}
                            </span>
                          </div>
                          {/* Title */}
                          <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tighter">
                            {program.title}
                          </h2>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/90 text-sm md:text-2xl mb-12 md:mb-20 max-w-5xl leading-relaxed font-bold opacity-95">
                        {program.description}
                      </p>

                      {/* Content Grid (Skillryt Style) */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
                        {(program.categories || []).map((cat: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white/10 backdrop-blur-3xl border border-white/20 p-5 md:p-8 rounded-[2rem] group cursor-pointer transition-all duration-500 hover:bg-white/20 hover:scale-[1.03]"
                          >
                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-4 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                              <div className="w-6 h-6 md:w-8 md:h-8">
                                {typeof cat.icon === 'string' ? getIcon(cat.icon) : <Star className="w-full h-full" />}
                              </div>
                            </div>
                            <h3 className="text-xs md:text-xl font-black text-white leading-tight uppercase tracking-wide">{cat.name}</h3>
                          </div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 md:gap-8 mt-auto pt-6">
                        <Link
                          to="/contact"
                          className="px-10 py-4 md:px-16 md:py-6 bg-white text-slate-900 font-black text-xs md:text-xl rounded-2xl hover:shadow-2xl transition-all duration-500 active:scale-95 flex items-center gap-4 group"
                        >
                          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                          Register Now
                        </Link>
                        <Link
                          to="/courses"
                          className="px-10 py-4 md:px-16 md:py-6 bg-transparent border-2 md:border-4 border-white text-white font-black text-xs md:text-xl rounded-2xl hover:bg-white/10 transition-all duration-500 active:scale-95 flex items-center gap-4 group"
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
