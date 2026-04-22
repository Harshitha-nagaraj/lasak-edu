
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
        {/* Header Section (Placed above the sticky stack) */}
        <div className="pt-20 pb-12 text-center relative z-[9999] bg-slate-50">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            Important Program Segments
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto px-4">
            Choose from our specialized training tracks designed to launch your career.
          </p>
        </div>

        {/* Sticky Cards Container */}
        <div className="relative max-w-[1200px] mx-auto w-full px-4 md:px-8 pb-[10vh]">
          {displaySegments.map((program, i) => {
            return (
              <div
                key={program.id}
                className="sticky top-0 w-full h-[100vh] flex flex-col justify-center items-center"
                style={{ 
                  zIndex: i
                }}
              >
                <div 
                  className="w-full h-[85vh] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col justify-center p-8 md:p-16 transition-colors duration-500 overflow-y-auto"
                  style={{ 
                    backgroundColor: program.bgColor,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    transform: `translateY(${i * 20}px)`, // Spacing for visual depth at the top!
                  }}
                >
                  <div className="relative flex flex-col justify-center min-h-min">
                    <div className="w-full">
                      {/* Badge */}
                      <div className="mb-4 md:mb-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-slate-900 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-md">
                          {program.badge}
                        </span>
                      </div>

                      {/* Heading */}
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-[1.1] max-w-4xl tracking-tight">
                        {program.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-white/90 text-base md:text-lg mb-8 md:mb-10 max-w-3xl leading-relaxed font-medium">
                        {program.description}
                      </p>

                      {/* Content Grid / Ticker */}
                      <div className="w-full mb-8 md:mb-10">
                        {program.layout === 'sap' || program.layout === 'externship' ? (
                          <div className={`grid grid-cols-1 ${program.layout === 'sap' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 md:gap-6`}>
                            {(program.categories || []).map((cat: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white/10 backdrop-blur-md border border-white/20 p-5 md:p-6 rounded-[2rem] group cursor-pointer transition-all duration-300 hover:bg-white/20"
                              >
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                  {typeof cat.icon === 'string' ? getIcon(cat.icon) : cat.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-white mb-2">{cat.name}</h3>
                                <p className="text-white/70 text-[10px] md:text-xs leading-relaxed mb-4 line-clamp-3">
                                  {cat.desc}
                                </p>
                                <div className="flex items-center text-white font-bold text-xs group-hover:gap-2 transition-all">
                                  <span>Learn More</span>
                                  <ArrowRight size={14} className="ml-1" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative overflow-hidden group/ticker">
                            {/* Horizontal Autoscrolling Ticker for Many Items */}
                            <div className="flex animate-scroll hover:pause space-x-4 md:space-x-6">
                              {[...(program.categories || []), ...(program.categories || [])].map((cat: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex-shrink-0 w-40 md:w-56 bg-white/10 hover:bg-white/20 transition-all p-4 md:p-6 rounded-[1.5rem] border border-white/10 flex flex-col items-center md:items-start text-center md:text-left backdrop-blur-sm group cursor-pointer"
                                >
                                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                                    {typeof cat.icon === 'string' ? getIcon(cat.icon) : cat.icon}
                                  </div>
                                  <h3 className="text-white font-bold text-xs md:text-base leading-tight">
                                    {cat.name}
                                  </h3>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 md:gap-6 mt-auto">
                        <Link
                          to="/contact"
                          className="px-8 py-3.5 md:px-12 md:py-4 bg-white text-slate-900 font-black text-xs md:text-lg rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-lg flex items-center gap-3 group"
                        >
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          Register Now
                        </Link>
                        <Link
                          to="/courses"
                          className="px-8 py-3.5 md:px-12 md:py-4 bg-transparent border-2 border-white text-white font-black text-xs md:text-lg rounded-xl md:rounded-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3 group"
                        >
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
