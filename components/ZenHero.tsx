
import React from 'react';
import { ArrowRight, Code, Settings, Home, Database, Sparkles, TrendingUp, Users, Briefcase } from 'lucide-react';

const ZenHero = () => {
    const bannerImages = [
        "/img/Website_banner_1.webp",
        "/img/Website_banner_2.webp",
        "/img/Website_banner_3.webp",
        "/img/Website_banner_4.webp"
    ];

    const [currentImage, setCurrentImage] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % bannerImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full bg-gradient-to-b from-white from-50% to-blue-50/40 pt-10 pb-0 overflow-hidden">
            
            {/* --- Premium Background Elements --- */}
            {/* Dot Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.2]" 
                 style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Tech Circuit Lines (Decorative) */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[1px] h-40 bg-blue-600"></div>
                <div className="absolute top-[20%] left-[10%] w-20 h-[1px] bg-blue-600"></div>
                <div className="absolute bottom-[30%] right-[15%] w-[1px] h-40 bg-indigo-600"></div>
                <div className="absolute bottom-[30%] right-[5%] w-20 h-[1px] bg-indigo-600"></div>
            </div>

            {/* Animated Mesh Gradients */}
            <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[150px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[130px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Floating Tech Orbs (Desktop) - Enhanced Visibility */}
            <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
                {/* Top Left Orb */}
                <div className="absolute top-[12%] left-[8%] animate-bounce-slow">
                    <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-[0_20px_50px_-12px_rgba(37,99,235,0.2)] flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Code size={26} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">IT & Cloud</span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase">Live Training</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Left Orb */}
                <div className="absolute bottom-[30%] left-[4%] animate-bounce-delayed">
                    <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)] flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Settings size={26} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">Mechanical</span>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase">Core Industry</span>
                        </div>
                    </div>
                </div>

                {/* Right Side Orb */}
                <div className="absolute top-[25%] right-[8%] animate-bounce-slow">
                    <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-[0_20px_50px_-12px_rgba(16,185,129,0.2)] flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Home size={26} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">Civil BIM</span>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Placement Support</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-20 text-center">
                {/* Trusted Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-black mb-10 shadow-sm">
                    <Sparkles size={18} className="animate-pulse text-blue-500" />
                    Trusted by 1000+ Students in Coimbatore
                </div>

                {/* Header Text */}
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1] font-tech text-center">
                    <span className="relative inline-block">
                        Accelerate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient-flow">
                            Tech Career
                        </span>
                        
                        {/* Correctly Aligned Trending Icon */}
                        <div className="absolute -right-24 md:-right-32 lg:-right-40 top-1/2 -translate-y-1/2 hidden md:block animate-bounce-slow">
                            <div className="bg-blue-600/10 p-4 lg:p-6 rounded-3xl border border-blue-600/20 backdrop-blur-sm shadow-xl">
                                <TrendingUp size={44} className="text-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                            </div>
                        </div>
                    </span>
                </h1>
                
                <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                    Industry-standard courses designed to get you hired in top MNCs. <br className="hidden md:block" />
                    Master skills with real-world project experience.
                </p>

                {/* Course Pills Grid */}
                <div className="flex flex-wrap justify-center gap-5 mb-24 max-w-5xl mx-auto">
                    {[
                        { name: 'Full Stack Development', icon: <Code size={20} />, color: 'bg-purple-50 text-purple-600 border-purple-100 shadow-purple-900/5' },
                        { name: 'Mechanical CAD/CAM', icon: <Settings size={20} />, color: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-900/5' },
                        { name: 'Civil BIM & Revit', icon: <Home size={20} />, color: 'bg-green-50 text-green-600 border-green-100 shadow-emerald-900/5' },
                        { name: 'Data Analytics & Python', icon: <Database size={20} />, color: 'bg-orange-50 text-orange-600 border-orange-100 shadow-orange-900/5' },
                    ].map((course, idx) => (
                        <div 
                            key={idx}
                            className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] shadow-2xl border ${course.color} hover:scale-105 hover:-translate-y-1 transition-all duration-500 cursor-pointer group`}
                        >
                            <div className="p-2.5 bg-white rounded-2xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                {course.icon}
                            </div>
                            <span className="font-black text-slate-800 tracking-tight">{course.name}</span>
                        </div>
                    ))}
                </div>

                {/* Students and Stats Section */}
                <div className="relative max-w-6xl mx-auto mt-0">
                    {/* Main Image Slider with Premium Styling */}
                    <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
                        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[3rem] md:rounded-[5rem] overflow-hidden p-2 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100">
                            {bannerImages.map((img, idx) => (
                                <img 
                                    key={idx}
                                    src={img} 
                                    alt={`Banner ${idx + 1}`}
                                    className={`absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-[2.5rem] md:rounded-[4.5rem] transition-all duration-1000 ease-in-out ${
                                        idx === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Stat Bubbles - Desktop Layout (Premium Glass) */}
                    <div className="absolute inset-0 pointer-events-none z-20 hidden md:block">
                        {/* Top Left: Students */}
                        <div className="absolute top-10 -left-24 animate-bounce-slow">
                            <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-[0_30px_60px_-12px_rgba(37,99,235,0.2)] border border-white flex flex-col items-center min-w-[220px]">
                                <div className="p-3 bg-blue-50 rounded-2xl mb-4">
                                    <Users size={32} className="text-blue-600" />
                                </div>
                                <span className="text-4xl lg:text-5xl font-black text-blue-600">1000+</span>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest text-center mt-2 leading-tight">Students<br/>Graduated</span>
                            </div>
                        </div>

                        {/* Top Right: Salary */}
                        <div className="absolute top-20 -right-24 animate-bounce-slow">
                            <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-[0_30px_60px_-12px_rgba(147,51,234,0.2)] border border-white flex flex-col items-center min-w-[220px]">
                                <div className="p-3 bg-purple-50 rounded-2xl mb-4">
                                    <Briefcase size={32} className="text-purple-600" />
                                </div>
                                <span className="text-4xl lg:text-5xl font-black text-purple-600">₹11 LPA</span>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest text-center mt-2 leading-tight">Highest<br/>Package</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Stat Grid */}
                <div className="grid grid-cols-2 gap-4 mt-16 md:hidden px-4 mb-10">
                    {[
                        { label: 'Graduated', value: '1000+', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Users size={20} /> },
                        { label: 'Partners', value: '50+', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Settings size={20} /> },
                        { label: 'Highest', value: '₹11 LPA', color: 'text-purple-600', bg: 'bg-purple-50', icon: <Briefcase size={20} /> },
                        { label: 'Support', value: '100%', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Sparkles size={20} /> },
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} p-8 rounded-[2rem] border border-white shadow-xl flex flex-col items-center`}>
                            <div className="mb-2 text-slate-400">{stat.icon}</div>
                            <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ZenHero;
