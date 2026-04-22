import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Award, Target, ArrowRight, Zap, Briefcase, BookOpen, MapPin, Settings, Percent, Flame, Calendar, Clock } from 'lucide-react';
import { fetchWithCache } from '../lib/cacheUtils';
import SEO from '../components/SEO';
import InquiryModal from '../components/InquiryModal';
import { DEFAULT_WORKSHOPS } from '../constants/ui';

// Helper to render icon by name
const IconDisplay = ({ name, size = 24, className }: { name: string, size?: number, className?: string }) => {
  const icons: any = { Award, Target, Zap, Briefcase, BookOpen, MapPin, Settings, Percent, Flame, Calendar, Clock, CheckCircle };
  const IconComponent = icons[name] || Zap;
  return <IconComponent size={size} className={className} />;
};

const Programs = () => {
  const [activeTab, setActiveTab] = useState('IT');
  const [workshops, setWorkshops] = useState<any[]>(DEFAULT_WORKSHOPS);
  const [programFeatures, setProgramFeatures] = useState<any[]>([]);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState({ id: 'general', title: 'Workshops', category: 'General' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, where, orderBy } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      // Fetch Workshops
      const wsQ = query(
        collection(db, 'workshops'),
        where('active', '==', true),
        orderBy('order_num', 'asc')
      );
      const wsData = await fetchWithCache('cache_workshops', wsQ);

      if (wsData && wsData.length > 0) {
        setWorkshops(wsData);
      } else {
        setWorkshops(DEFAULT_WORKSHOPS);
      }

      // Fetch Features
      const featQ = query(collection(db, 'program_features'), orderBy('order_num', 'asc'));
      const featData = await fetchWithCache('cache_program_features', featQ);
      if (featData && featData.length > 0) {
        setProgramFeatures(featData);
      }
    } catch (error) {
      console.error("Error fetching programs data:", error);
      setWorkshops(DEFAULT_WORKSHOPS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO
        title="Professional Training Workshops & Courses in Coimbatore | IT, Mechanical, Civil | LasakEdu"
        description="Join LasakEdu's industry-focused training workshops in IT, Mechanical, Civil Engineering. 100% placement assistance, hands-on projects, certification. Enquiry now for 2025 batch in Coimbatore."
        keywords="training workshops coimbatore, IT training, mechanical engineering courses, civil engineering training, software development courses, placement training, internship workshops, professional certification courses, skill development workshops, career training coimbatore"
        url="https://lasakedu.in/programs"
      />


      {/* 1. Landing Hero (White) */}
      <section className="hero-section relative bg-white pt-24 pb-20 border-b border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm mb-6 border border-blue-100 shadow-sm">
                🚀 Admissions Open for 2025 Batch
              </div>
              <h1 className="text-5xl lg:text-7xl font-black font-tech text-slate-900 mb-6 leading-tight">
                Accelerate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">Tech Career</span>
              </h1>
              <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                Join LASAK EDU's industry-focused workshops. Master the skills that employers are looking for in IT, Mechanical, and Civil Engineering.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setSelectedWorkshop({ id: 'workshop-hero', title: 'Workshops 2025', category: 'General' });
                    setInquiryModalOpen(true);
                  }}
                  aria-label="Enquire about 2025 workshops"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-2 hover:-translate-y-1"
                >
                  Enquiry now <ArrowRight size={20} />
                </button>
                <a href="tel:+917418732525" className="px-8 py-4 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 transition-all text-center flex items-center justify-center gap-2">
                  Book Free Demo
                </a>
                <Link to="/courses" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold shadow-md hover:bg-slate-50 hover:text-blue-600 transition-all text-center">
                  Explore Courses
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-yellow-100 rounded-3xl transform rotate-3 scale-105 blur-lg opacity-60"></div>
              <img
                src="/our career.webp"
                alt="Students in classroom"
                width="650"
                height="433"
                sizes="(max-width: 768px) 100vw, 650px"
                className="relative rounded-3xl shadow-2xl border-4 border-white z-10 w-full h-auto"
                loading="eager"
                fetchPriority="high"
              />
              {/* Floating Badge */}
              <m.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 z-20 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">98%</div>
                    <div className="text-slate-500 text-sm font-semibold">Placement Rate</div>
                  </div>
                </div>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section - SEO Content */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Transform Your Career with Industry-Ready Workshops</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              At <strong>LASAK EDU</strong>, we offer specialized workshops designed to bridge the gap between academic knowledge and industry requirements. Our skill-based training approach combines theoretical foundations with hands-on practical experience, ensuring students are job-ready from day one.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Whether you're a student looking to enhance your employability, a professional seeking to upskill, or a fresher aiming to break into the tech industry, our comprehensive workshops in <strong>IT, Mechanical Engineering, and Civil Engineering</strong> are tailored to meet your career goals. We focus on real-world projects, industry-standard tools, and personalized mentorship to accelerate your career growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/about" className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2">
                Learn About Us <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2">
                Contact Our Team <ArrowRight size={16} />
              </Link>
            </div>

            <p className="mt-8 text-slate-600">
              Explore our <Link to="/courses" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all">Courses here →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 2. Unique Workshops & Exclusive Offers (Dark Theme - Unique) */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-xs mb-2">
                <Flame size={16} /> Hot & Trending
              </div>
              <h2 className="text-3xl font-black font-tech text-white">Workshops & Offers</h2>
              <p className="text-slate-600 mt-2">Grab these limited-time opportunities.</p>
            </div>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x scrollbar-hide">

            {workshops.length === 0 ? (
              /* Fallback if no data */
              <div className="text-slate-500 italic p-4">No active workshops at the moment. Check back soon!</div>
            ) : workshops.map((item) => (
              <m.div
                key={item.id}
                whileHover={{ y: -5 }}
                className={`min-w-[320px] md:min-w-[380px] rounded-2xl p-6 border shadow-xl snap-center flex flex-col relative overflow-hidden group 
                     ${item.type === 'offer' ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-500/30' : 'bg-slate-800 border-slate-700'}`}
              >
                {/* Badge */}
                {item.badge_text && (
                  <div className="absolute top-0 right-0 p-3">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border
                              ${item.type === 'live' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        item.type === 'offline' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                      {item.type === 'live' && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                      {item.badge_text}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border transition-colors
                       ${item.type === 'offer' ? 'bg-white/10 text-white backdrop-blur-sm' :
                    item.type === 'live' ? 'bg-blue-900/50 text-blue-400 border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white' :
                      'bg-orange-900/50 text-orange-400 border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white'}`}>
                  <IconDisplay name={item.icon} size={24} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className={`text-sm mb-6 leading-relaxed ${item.type === 'offer' ? 'text-blue-100' : 'text-slate-600'}`}>
                  {item.description}
                </p>

                <div className="mt-auto space-y-4">
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-sm">
                      {item.tags.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/50 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    {item.type === 'offer' ? (
                      <button
                        onClick={() => {
                          setSelectedWorkshop({ id: item.id || 'offer', title: item.title, category: 'General' });
                          setInquiryModalOpen(true);
                        }}
                        aria-label={`Claim discount for ${item.title}`}
                        className="w-full text-blue-900 bg-white hover:bg-blue-50 px-4 py-3 rounded-lg text-sm font-bold transition-colors shadow-lg"
                      >
                        {item.button_text}
                      </button>
                    ) : (
                      <>
                        <span className="text-green-400 font-bold text-sm">Register Now</span>
                        <button
                          className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                          aria-label={`Register for ${item.title}`}
                          onClick={() => {
                            setSelectedWorkshop({ id: item.id || 'workshop', title: item.title, category: 'General' });
                            setInquiryModalOpen(true);
                          }}
                        >
                          {item.button_text}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Key Features (White) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Why Choose Our Workshops?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We don't just teach; we train you for the job. Our methodology is built around practical application.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programFeatures.length === 0 ? (
              // Fallback static
              [
                { icon: <Award size={24} className="text-red-500" />, title: "Certified Training", desc: "Get certificates recognized by top MNCs and ISO." },
                { icon: <Briefcase size={24} className="text-blue-500" />, title: "100% Placement", desc: "Dedicated placement cell to help you land your dream job." },
                { icon: <Target size={24} className="text-green-500" />, title: "Expert Mentors", desc: "Learn from industry professionals with 5+ years of experience." },
                { icon: <BookOpen size={24} className="text-purple-500" />, title: "Practical Projects", desc: "Work on real-world industry projects to build a strong portfolio." }
              ].map((f, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              ))
            ) : programFeatures.map((feature, i) => (
              <m.div
                key={i}
                whileHover={{ y: -10, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)" }}
                className="bg-slate-50 p-6 xs:p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className={`w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <IconDisplay name={feature.icon}
                    className={
                      feature.color === 'red' ? 'text-red-500' :
                        feature.color === 'yellow' ? 'text-yellow-500' :
                          feature.color === 'green' ? 'text-green-500' : 'text-blue-500'
                    }
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.description}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Detailed Program Tracks */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Our Specialized Workshops</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">Choose from our industry-focused workshops designed to equip you with in-demand skills and prepare you for successful careers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* IT Programs */}
            <m.div
              whileHover={{ y: -10, boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.2)" }}
              className="bg-white rounded-2xl p-6 xs:p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Briefcase size={100} />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-3">IT & Software Development</h3>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Duration: 3-6 Months</span>
              </div>
              <p className="text-sm text-slate-600 mb-4"><strong>For:</strong> Students, Freshers, Career Switchers</p>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Key Skills Covered:</h4>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Full Stack Development (MERN/MEAN)</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Python & Data Analytics</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Software Testing & Automation</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Digital Marketing & UI/UX</li>
              </ul>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Tools & Technologies:</h4>
              <p className="text-xs text-slate-500 mb-4">React, Node.js, Python, Java, MongoDB, MySQL, Git, AWS, Selenium, Figma</p>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Career Outcomes:</h4>
              <p className="text-xs text-slate-600 mb-6">Software Developer, Full Stack Engineer, QA Engineer, Data Analyst, UI/UX Designer</p>

              <Link to="/courses/IT" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Explore IT Courses <ArrowRight size={16} />
              </Link>
            </m.div>

            {/* Mechanical Programs */}
            <m.div
              whileHover={{ y: -10, boxShadow: "0 20px 40px -10px rgba(147, 51, 234, 0.2)" }}
              className="bg-white rounded-2xl p-6 xs:p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={100} />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-3">Mechanical Engineering</h3>
              <div className="mb-4">
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Duration: 2-4 Months</span>
              </div>
              <p className="text-sm text-slate-600 mb-4"><strong>For:</strong> Mechanical Students, Engineering Graduates, Industry Professionals</p>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Key Skills Covered:</h4>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> CAD Design & 3D Modeling</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> FEA & CFD Analysis</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Product Design & Development</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Manufacturing & Prototyping</li>
              </ul>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Tools & Technologies:</h4>
              <p className="text-xs text-slate-500 mb-4">SolidWorks, AutoCAD, CATIA, ANSYS, HyperMesh, Creo, NX CAD, 3D Printing</p>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Career Outcomes:</h4>
              <p className="text-xs text-slate-600 mb-6">Design Engineer, CAD Engineer, Product Developer, FEA Analyst, Manufacturing Engineer</p>

              <Link to="/courses/Mechanical" className="text-purple-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Explore Mechanical Courses <ArrowRight size={16} />
              </Link>
            </m.div>

            {/* Civil Programs */}
            <m.div
              whileHover={{ y: -10, boxShadow: "0 20px 40px -10px rgba(22, 163, 74, 0.2)" }}
              className="bg-white rounded-2xl p-6 xs:p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={100} />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-3">Civil Engineering & BIM</h3>
              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Duration: 1.5-3 Months</span>
              </div>
              <p className="text-sm text-slate-600 mb-4"><strong>For:</strong> Civil Students, Architecture Graduates, Construction Professionals</p>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Key Skills Covered:</h4>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Building Information Modeling (BIM)</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Structural Analysis & Design</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Architectural Modeling</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Construction Documentation</li>
              </ul>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Tools & Technologies:</h4>
              <p className="text-xs text-slate-500 mb-4">Revit, AutoCAD Civil, STAAD.Pro, SketchUp, Navisworks, BIM 360</p>

              <h4 className="font-bold text-slate-900 mb-2 text-sm">Career Outcomes:</h4>
              <p className="text-xs text-slate-600 mb-6">BIM Engineer, Structural Designer, Revit Architect, Civil CAD Engineer, BIM Coordinator</p>

              <Link to="/courses/Civil" className="text-green-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Explore Civil Courses <ArrowRight size={16} />
              </Link>
            </m.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Join LASAK EDU Workshops?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We go beyond traditional education to provide comprehensive career development support.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <CheckCircle className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Industry-Oriented Curriculum</h3>
                <p className="text-sm text-slate-600">Learn skills that employers actually need, updated with latest industry trends.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Hands-On Practical Training</h3>
                <p className="text-sm text-slate-600">Work on real-world projects and gain practical experience, not just theory.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-purple-50 rounded-xl border border-purple-100">
              <CheckCircle className="text-purple-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Real-Time Projects</h3>
                <p className="text-sm text-slate-600">Build a professional portfolio with live industry projects.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-yellow-50 rounded-xl border border-yellow-100">
              <CheckCircle className="text-yellow-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Industry Certification</h3>
                <p className="text-sm text-slate-600">Receive certificates recognized by top companies and MNCs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
              <CheckCircle className="text-indigo-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Flexible Timings</h3>
                <p className="text-sm text-slate-600">Choose from weekday, weekend, or online batches that fit your schedule.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-red-50 rounded-xl border border-red-100">
              <CheckCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Affordable Fees</h3>
                <p className="text-sm text-slate-600">Quality education at competitive prices with EMI options available.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placement & Career Support */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">100% Placement Assistance & Career Support</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">Our dedicated placement team works tirelessly to help you land your dream job.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Resume Building</h3>
              <p className="text-sm text-blue-100">Professional resume crafting to highlight your skills and projects effectively.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <Target size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Interview Preparation</h3>
              <p className="text-sm text-blue-100">Technical and HR interview training with industry experts.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Briefcase size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Mock Interviews</h3>
              <p className="text-sm text-blue-100">Practice sessions with real interview scenarios to build confidence.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Job Assistance</h3>
              <p className="text-sm text-blue-100">Direct placement support with our 500+ hiring partners nationwide.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg">
              Talk to Career Counselor <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Lead Gen Form Section (White container) */}
      <section id="enquire" className="py-20 container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 md:p-16 text-white shadow-2xl flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-black font-tech mb-6">Ready to Start?</h2>
            <p className="text-blue-200 text-lg mb-8 leading-relaxed">
              Take the first step towards a successful career. Fill out the form, and our career counselors will get back to you with a personalized roadmap.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Briefcase className="text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-xl">500+</div>
                <div className="text-blue-300 text-sm">Hiring Partners</div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full bg-[#0a0f1e] text-white p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-800">
            <h2 className="text-3xl font-bold mb-8 text-white">Submit Your Details</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const submission = {
                  full_name: formData.get('fullName'),
                  qualification: formData.get('qualification'),
                  phone: formData.get('phone'),
                  email: formData.get('email'),
                  message: formData.get('address') + ` (Branch: ${formData.get('branch')})`,
                  branch: formData.get('branch'),
                  department: formData.get('department'),
                  status: formData.get('status'),
                  source: formData.get('applyFrom')
                };

                try {
                  const { getFirestoreDb } = await import('../lib/firebase');
                  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                  const db = await getFirestoreDb();
                  // 1. Save to Firestore
                  const enquiryData = {
                    ...submission,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp()
                  };
                  await addDoc(collection(db, 'enquiries'), enquiryData);

                  // 2. Send to Google Sheets as JSON Payload

                  const scriptUrl = "https://script.google.com/macros/s/AKfycbyCXeBcecLMxEqsI895ypcAgNwa0v4obpE6lXMczvDolz3kaMRPf6aDxmTH9vEL5FzKsw/exec";
                  
                  const sheetsData = {
                    fullName: String(formData.get('fullName')),
                    qualification: String(formData.get('qualification')),
                    phone: String(formData.get('phone')),
                    email: String(formData.get('email')),
                    department: String(formData.get('department')),
                    status: String(formData.get('status')),
                    preferredBranch: String(formData.get('branch')),
                    course: "Workshop Lead"
                  };

                  fetch(scriptUrl, {
                    method: "POST",
                    mode: 'no-cors',
                    body: JSON.stringify(sheetsData),
                  }).catch(err => console.error("Google Sheets Error:", err));

                  alert("Enquiry Submitted Successfully! We will contact you soon.");
                  form.reset();
                } catch (error) {
                  console.error("Submission error:", error);
                  alert("Submission Failed! Please try again later.");
                }
              }}
              className="space-y-5"
            >
              {/* Full Name */}
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-500"
              />

              {/* Qualification */}
              <input
                name="qualification"
                type="text"
                placeholder="Qualification"
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-500"
              />

              {/* Phone Number */}
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-500"
              />

              {/* Email Address */}
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-500"
              />

              {/* Address */}
              <textarea
                name="address"
                placeholder="Address"
                rows={3}
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-500 resize-none"
              ></textarea>

              {/* Branch */}
              <select
                name="branch"
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled selected className="text-slate-500 bg-[#161e2e]">Select Branch</option>
                <option value="Peelamedu" className="bg-[#161e2e]">Peelamedu</option>
                <option value="Gandhipuram" className="bg-[#161e2e]">Gandhipuram</option>
              </select>

              {/* Department */}
              <select
                name="department"
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled selected className="text-slate-500 bg-[#161e2e]">Select Department</option>
                <option value="Mechanical" className="bg-[#161e2e]">Mechanical</option>
                <option value="Civil" className="bg-[#161e2e]">Civil</option>
                <option value="IT" className="bg-[#161e2e]">IT</option>
                <option value="ECE" className="bg-[#161e2e]">ECE</option>
              </select>

              {/* Current Status */}
              <select
                name="status"
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled selected className="text-slate-500 bg-[#161e2e]">Current Status</option>
                <option value="Student" className="bg-[#161e2e]">Student</option>
                <option value="Working Professional" className="bg-[#161e2e]">Working Professional</option>
                <option value="Fresher" className="bg-[#161e2e]">Fresher</option>
              </select>

              {/* Apply From */}
              <select
                name="applyFrom"
                required
                className="w-full p-4 rounded-lg bg-[#161e2e] text-white border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled selected className="text-slate-500 bg-[#161e2e]">Applying From</option>
                <option value="Instagram" className="bg-[#161e2e]">Instagram</option>
                <option value="Facebook" className="bg-[#161e2e]">Facebook</option>
                <option value="Google" className="bg-[#161e2e]">Google</option>
                <option value="Friends" className="bg-[#161e2e]">Friends</option>
              </select>

              <button
                type="submit"
                aria-label="Submit workshop enquiry"
                className="w-full bg-cyan-400 text-[#0a0f1e] font-black py-4 rounded-lg hover:bg-cyan-300 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] mt-2"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        courseId={selectedWorkshop.id}
        courseTitle={selectedWorkshop.title}
        category={selectedWorkshop.category}
        actionType="enroll"
        onSuccess={() => {
          alert("Registration Successful! We will contact you soon.");
          setInquiryModalOpen(false);
        }}
      />
    </div>
  );
};

export default Programs;
