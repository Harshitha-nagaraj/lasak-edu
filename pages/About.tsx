import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target, Eye, CheckCircle, Users, Monitor, BookOpen, Clock, Heart, ArrowRight, User,
  Star, Award, Shield, Zap, TrendingUp, ThumbsUp, Lightbulb, Rocket, Trophy, Gift, Smile,
  MessageCircle, Phone, Mail, Globe, Home, Settings, Lock, Unlock, Key, Search,
  Calendar, FileText, Folder, Download, Upload, Share2, Link2, ExternalLink,
  AlertCircle, Info, HelpCircle, XCircle, CheckCircle2, AlertTriangle,
  Briefcase, GraduationCap, Code, Cpu, Database, Server, Wifi, Bluetooth,
  Camera, Image, Video, Music, Headphones, Mic, Volume2, Play, Pause,
  ShoppingCart, CreditCard, DollarSign, TrendingDown, BarChart, PieChart, Activity
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { fetchWithCache } from '../lib/cacheUtils';
import SEO from '../components/SEO';

const cleanPath = (url: string) => {
  if (!url) return url;
  if (url.startsWith('https://') || url.startsWith('http://')) return url;

  // Ensure we don't have double slashes and remove 'public' if it exists at the start
  let cleaned = url.replace(/^\/?public\//, '/').replace(/\/+/g, '/');

  // Normalize the final filename part to match our strict on-disk naming
  const parts = cleaned.split('/');
  const lastPart = parts[parts.length - 1];
  if (lastPart.includes('.')) {
    const extIndex = lastPart.lastIndexOf('.');
    const base = lastPart.slice(0, extIndex);
    const ext = lastPart.slice(extIndex).toLowerCase();
    // Normalize base: lowercase, replace non-alphanumeric with hyphen
    const normalizedBase = base.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    parts[parts.length - 1] = normalizedBase + ext;

    // Also normalize mid-path directories if any
    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i] && parts[i] !== 'img') {
        parts[i] = parts[i].toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      }
    }

    cleaned = parts.join('/');
  }

  return cleaned.startsWith('/') ? cleaned : '/' + cleaned;
};

const GlassWaveBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Top Blue Wave */}
    <motion.svg
      className="absolute top-0 left-0 w-full h-[35vh]"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      animate={{ x: [0, -40, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        fill="rgba(59,130,246,0.18)"
        d="M0,160L48,170C96,180,192,200,288,186.7C384,173,480,127,576,122.7C672,117,768,149,864,160C960,171,1056,160,1152,138.7C1248,117,1344,85,1392,69.3L1440,53L1440,0L0,0Z"
      />
    </motion.svg>

    {/* Soft Glow Layer (NOT blur) */}
    <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 via-white/40 to-white" />

    {/* Bottom Blue Wave */}
    <motion.svg
      className="absolute bottom-0 left-0 w-full h-[35vh]"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      animate={{ x: [0, 40, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        fill="rgba(56,189,248,0.18)"
        d="M0,64L48,85.3C96,107,192,149,288,170.7C384,192,480,192,576,170.7C672,149,768,107,864,96C960,85,1056,107,1152,128C1248,149,1344,171,1392,181.3L1440,192L1440,320L0,320Z"
      />
    </motion.svg>
  </div>
);

const About = () => {
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mission, setMission] = useState({ title: 'Our Mission', description: 'To provide affordable and effective skill training that enables students to start successful careers. We aim to make every student job-ready by building confidence and technical expertise.' });
  const [vision, setVision] = useState({ title: 'Our Vision', description: 'To be the most trusted educational institute in Coimbatore, producing skilled professionals who contribute positively to society and industry.' });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [mous, setMous] = useState<any[]>([
    {
      id: 'fallback-1',
      college_name: 'Government College of Technology, Coimbatore',
      description: 'Lasak Edu is proud to partner with GCT Coimbatore to provide advanced technical training and skill development programs for engineering students.',
      image: '/img/mou-jct.webp',
      date: 'March 2024',
      order_num: 1,
      active: true
    },
    {
      id: 'fallback-2',
      college_name: 'Bishop Appasamy College of Arts and Science',
      description: 'Lasak Edu has signed a strategic MOU with Bishop Appasamy College to empower students with industry-relevant IT skills and placement-oriented training.',
      image: '/img/moubishop.webp',
      date: 'February 2024',
      order_num: 2,
      active: true
    }
  ]);
  const [categories, setCategories] = useState<any[]>([]);

  const [journey, setJourney] = useState({
    title: 'Our Journey',
    description: "LASAK EDU (Lasak Overseas Education, and Lasak Technologies) was founded in 2019 by Sharan Gautham Sakthivel, BE, MBA. With over five years of expertise in both education and industry, we specialize in delivering high-quality training in IT and Mechanical Engineering domains.\n\nAt LASAK EDU, we aim to empower students with career-oriented courses and industry-relevant training programs. Our programs are designed to equip learners with the skills and confidence needed to explore opportunities, achieve their career goals, and become valuable resources in the global workforce.",
    image: '/img/journyabout.webp'
  });

  const [teachingApproach, setTeachingApproach] = useState({
    title: 'Our Teaching Approach',
    description: 'We believe that the best way to learn is by doing.',
    items: [
      '80% Practical sessions in labs.',
      'Real-world project assignments.',
      'Regular feedback and assessments.',
      'Workshops by industry experts.'
    ],
    image: '/img/about2.webp'
  });

  const [infrastructure, setInfrastructure] = useState({
    title: 'Our Infrastructure',
    description: 'We provide a comfortable and professional environment for learning.',
    items: [
      'Modern Computer Labs with high-speed internet.',
      'Installed with latest software (Solidworks, Python, etc).',
      'Clean and spacious classrooms with projectors.',
      'Discussion rooms for group study.'
    ],
    image: '/img/about-1.webp'
  });

  const [coreValues, setCoreValues] = useState({
    title: 'Our Core Values',
    items: [
      { icon: 'CheckCircle', title: "Quality", text: "We never compromise on training quality." },
      { icon: 'Clock', title: "Discipline", text: "We value time and professionalism." },
      { icon: 'Heart', title: "Support", text: "We support students even after courses." },
      { icon: 'Users', title: "Ethics", text: "Transparent and honest guidance." }
    ]
  });

  const [whyChooseUs, setWhyChooseUs] = useState({
    title: 'Why Choose Us?',
    subtitle: 'Simple reasons to start your learning journey with us.',
    items: [
      { title: "Practical Learning", desc: "We focus on hands-on training, not just theory." },
      { title: "Experienced Faculty", desc: "Learn from trainers who have worked in the industry." },
      { title: "Placement Support", desc: "We help you prepare for interviews and find jobs." },
      { title: "Affordable Fees", desc: "Quality education at reasonable prices for everyone." },
      { title: "Updated Syllabus", desc: "We teach what companies are looking for today." },
      { title: "Personal Attention", desc: "Small batch sizes to ensure every student learns well." }
    ]
  });

  const [introHero, setIntroHero] = useState({
    title: 'About LASAK EDU',
    description: "LASAK EDU is a professional training institute located in Coimbatore. We are dedicated to providing high-quality technical education in IT, Mechanical, Civil Engineering, and Arts.\n\nOur purpose is simple: to help students and job seekers gain practical skills needed to get hired. We focus on doing, not just reading — treating students like professionals from day one."
  });

  const [cta, setCta] = useState({
    title: 'Ready to Start Learning?',
    description: 'Join us to upgrade your skills and build a better future. Visit our institute or contact us for more details.',
    button_1_text: 'Explore Courses',
    button_1_link: '/courses',
    button_2_text: 'Contact Us',
    button_2_link: '/contact'
  });

  const IconMap = {
    // Basic
    CheckCircle, Clock, Heart, Users, Target, Eye, Monitor, BookOpen, ArrowRight, User,
    // Achievement & Success
    Star, Award, Shield, Zap, TrendingUp, ThumbsUp, Trophy,
    // Ideas & Innovation
    Lightbulb, Rocket, Gift, Smile,
    // Communication
    MessageCircle, Phone, Mail, Globe, Home,
    // System & Security
    Settings, Lock, Unlock, Key, Search,
    // Documents & Files
    Calendar, FileText, Folder, Download, Upload, Share2, Link2, ExternalLink,
    // Alerts & Info
    AlertCircle, Info, HelpCircle, XCircle, CheckCircle2, AlertTriangle,
    // Professional & Education
    Briefcase, GraduationCap, Code, Cpu, Database, Server, Wifi, Bluetooth,
    // Media
    Camera, Image, Video, Music, Headphones, Mic, Volume2, Play, Pause,
    // Business & Finance
    ShoppingCart, CreditCard, DollarSign, TrendingDown, BarChart, PieChart, Activity
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const aboutQ = query(collection(db, 'about_content'), orderBy('order_num', 'asc'));
      const aboutData = await fetchWithCache('cache_about_content', aboutQ);

      if (aboutData && aboutData.length > 0) {
        const data = aboutData;
        const missionData = data.find((item: any) => item.section === 'mission');
        const visionData = data.find((item: any) => item.section === 'vision');
        const journeyData = data.find((item: any) => item.section === 'journey');
        const teachingData = data.find(item => item.section === 'teaching_approach');
        const infrastructureData = data.find(item => item.section === 'infrastructure');
        const coreValuesData = data.find(item => item.section === 'core_values');
        const whyChooseUsData = data.find(item => item.section === 'why_choose_us');
        const teamData = data.filter(item => item.section === 'team_member');
        const introHeroData = data.find(item => item.section === 'intro_hero');
        const ctaData = data.find(item => item.section === 'cta');

        if (missionData?.content && typeof missionData.content === 'object') setMission(missionData.content);
        if (visionData?.content && typeof visionData.content === 'object') setVision(visionData.content);
        if (journeyData?.content && typeof journeyData.content === 'object') setJourney(journeyData.content);
        if (teachingData?.content && typeof teachingData.content === 'object') setTeachingApproach(teachingData.content);
        if (infrastructureData?.content && typeof infrastructureData.content === 'object') setInfrastructure(infrastructureData.content);
        if (coreValuesData?.content && typeof coreValuesData.content === 'object') setCoreValues(coreValuesData.content);
        if (whyChooseUsData?.content && typeof whyChooseUsData.content === 'object') setWhyChooseUs(whyChooseUsData.content);
        if (introHeroData?.content && typeof introHeroData.content === 'object') setIntroHero(introHeroData.content);
        if (ctaData?.content && typeof ctaData.content === 'object') setCta(ctaData.content);

        if (teamData && teamData.length > 0) {
          const validTeam = teamData
            .filter(t => t && t.content && typeof t.content === 'object')
            .map(t => ({
              name: t.content.name || 'Team Member',
              role: t.content.role || '',
              desc: t.content.desc || '',
              image: t.content.image || ''
            }));
          setTeamMembers(validTeam);
        }
      }

      // Fetch MOUs (independent of about_content)
      try {
        const mousQ = query(collection(db, 'mous'));
        const mousData = await fetchWithCache('cache_mous', mousQ);
        if (mousData && mousData.length > 0) {
          const sortedMous = mousData
            .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0));
          setMous(sortedMous);
        }
      } catch (mouError) {
        console.warn('Could not fetch MOUs from Firestore, using fallback data:', mouError);
        // Keep fallback data already set in initial state
      }

      // Fetch Categories
      const categoriesQ = query(collection(db, 'categories'), orderBy('order_num', 'asc'));
      const categoriesData = await fetchWithCache('cache_categories_all', categoriesQ);
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
      }
    } catch (error: any) {
      console.error('Error fetching about content:', error);
      setHasError(true);
    }
  };

  // Show error fallback if something goes wrong
  if (hasError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Unable to Load About Page</h1>
          <p className="text-slate-600 mb-6">
            We're experiencing technical difficulties. Please try refreshing the page or contact us directly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-transparent font-sans text-slate-800 relative overflow-hidden">
      <SEO
        title="About LASAK EDU | Leading Training Institute in Coimbatore"
        description="Learn more about LASAK EDU, a leading training institute in Coimbatore offering industry-standard IT, Mechanical & Civil courses with 100% placement support."
        keywords="about LASAK EDU, LASAK EDU Coimbatore, best training institute Coimbatore, IT courses Coimbatore, mechanical training Coimbatore, civil engineering institute Coimbatore, LASAK EDU history"
        url="https://lasakedu.in/about"
      />


      {/* 1. Hero / Intro Section */}
      <section className="relative z-10 py-28 overflow-hidden">

        {/* Blue glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-200"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-24 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4 max-w-5xl">

          {/* Glass Card */}
          <div className="
  bg-gradient-to-br from-blue-900/60 via-indigo-900/55 to-blue-800/60
  backdrop-blur-2xl
  border border-white/25
  rounded-3xl
  p-10 md:p-14
  shadow-[0_20px_60px_rgba(0,0,0,0.25)]
  text-center
  relative
">

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold font-tech text-white drop-shadow-lg mb-6 leading-tight">
              {introHero.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-lg text-blue-100 leading-relaxed drop-shadow-sm whitespace-pre-wrap"
            >
              <p>
                {introHero.description}
              </p>
            </motion.div>

          </div>
        </div>
      </section>


      {/* 2 & 3. Mission & Vision */}
      <section className="relative z-10 py-20 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl border border-blue-100 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-blue-600 w-9 h-9" />
                <h2 className="text-2xl font-bold">{mission?.title}</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {mission?.description}
              </p>

              <img
                src={cleanPath((mission as any).image || "/img/about1.webp")}
                alt="Our Mission"
                className="mt-6 rounded-xl shadow-md bg-white p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/about1.webp'; // Double fallback
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-3xl border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-slate-600 w-9 h-9" />
                <h2 className="text-2xl font-bold">{vision?.title}</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {vision?.description}
              </p>

              <img
                src={cleanPath((vision as any).image || "/img/about4.webp")}
                alt="Our Vision"
                className="mt-6 rounded-xl shadow-md bg-white p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/about4.webp';
                }}
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 8. Our Journey (Placed here for flow) */}
      {/* 8. Our Journey */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Title */}
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            {journey?.title}
          </h2>
          {/* Image */}
          <motion.img
            src={cleanPath((journey as any).image || "/img/journyabout.webp")}
            alt="Our Journey"
            className="
        mx-auto mb-10
        w-full max-w-3xl
        rounded-3xl
        shadow-xl
        border border-slate-200
        object-cover
      "
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/journyabout.webp';
            }}
          />

          {/* Content */}
          <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">
            {journey?.description}
          </p>

        </div>
      </section>

      {/* MOU Section */}
      {mous.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mb-4"
            >
              <Briefcase size={16} /> OUR PARTNERSHIPS
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 px-2">MOUs with Prestigious Colleges</h2>
            <p className="text-slate-600 max-w-2xl mx-auto px-4">
              We have signed several Memorandums of Understanding (MOUs) with leading educational institutions to bridge the gap between academia and industry.
            </p>
          </div>

          {mous.length > 5 ? (
            /* Autoscrolling Marquee for > 5 MOUs */
            <div className="relative flex overflow-hidden">
              <motion.div
                className="flex gap-8 whitespace-nowrap py-10 px-4"
                animate={{
                  x: [0, -2000],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 60,
                    ease: "linear",
                  },
                }}
                whileHover={{ animationPlayState: "paused" }}
                style={{ display: 'flex' }}
              >
                {[...mous, ...mous, ...mous, ...mous].map((mou, idx) => (
                  <div
                    key={`${mou.id}-${idx}`}
                    className="inline-block bg-white rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5 border border-slate-100 group w-[350px] shrink-0"
                  >
                    <div className="h-52 overflow-hidden relative bg-slate-100">
                      {mou.image ? (
                        <img
                          src={cleanPath(mou.image)}
                          alt={mou.college_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Briefcase size={64} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white text-sm font-medium">{mou.date}</span>
                      </div>
                    </div>
                    <div className="p-8 whitespace-normal">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {mou.college_name}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 h-15">
                        {mou.description}
                      </p>
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">MOU Partner</span>
                        <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold">
                          {mou.date || 'Active'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
            /* Centered Flex Layout for <= 5 MOUs */
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap gap-8 justify-center">
                {mous.map((mou, idx) => (
                  <motion.div
                    key={mou.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`
                      bg-white rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5 
                      border border-slate-100 group w-full 
                      ${mous.length === 2
                        ? 'sm:w-[calc(45%-1rem)] max-w-md'
                        : 'sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] max-w-sm'
                      }
                    `}
                  >
                    <div className="h-52 overflow-hidden relative bg-slate-100">
                      {mou.image ? (
                        <img
                          src={cleanPath(mou.image)}
                          alt={mou.college_name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Briefcase size={64} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white text-sm font-medium">{mou.date}</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {mou.college_name}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {mou.description}
                      </p>
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">MOU Partner</span>
                        <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold">
                          {mou.date || 'Active'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}


      {/* 4. Why Choose Us */}
      <section className="relative z-10 py-20 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {whyChooseUs?.title}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              {whyChooseUs?.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {Array.isArray(whyChooseUs?.items) && whyChooseUs.items.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="
            bg-white p-8 rounded-2xl
            border border-slate-200
            shadow-md hover:shadow-xl
            transition-all duration-300
            max-w-sm w-full
          "
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">
                      {item?.title}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {item?.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* 5. Our Courses (Overview) */}
      <section className="relative z-10 py-20 bg-white/70 backdrop-blur-xl">

        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Our Course Categories</h2>
          <div className="flex flex-wrap gap-4 justify-center text-center">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat.id} className="p-6 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors min-w-[150px]">
                  <p className="font-bold text-slate-700">{cat.name}</p>
                </div>
              ))
            ) : (
              ['IT & Software', 'Mechanical', 'Civil', 'Arts & Media', 'Kids Coding'].map((cat, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors min-w-[150px]">
                  <p className="font-bold text-slate-700">{cat}</p>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <p className="text-slate-500 mb-4">We offer short-term and long-term diploma courses in these fields.</p>
            <Link to="/courses" className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1">
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6 & 7. Teaching Approach & Infrastructure */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-y border-slate-100">
        <div className="container mx-auto px-4 space-y-20">

          <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-10 md:gap-16 mx-auto max-w-6xl">
            <div className="md:w-1/2 flex flex-col items-center md:items-start">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BookOpen className="text-blue-600" /> {teachingApproach?.title}
              </h2>
              <p className="text-slate-600 mb-4 text-lg">
                {teachingApproach?.description}
              </p>

              <ul className="space-y-3 text-slate-600">
                {Array.isArray(teachingApproach?.items) && teachingApproach.items.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {typeof item === 'string'
                      ? item
                      : (item && typeof item === 'object' && Object.keys(item).every(k => !isNaN(Number(k))))
                        ? Object.values(item).join('')
                        : JSON.stringify(item)
                    }
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <img
                src={cleanPath(teachingApproach?.image)}
                alt="Teaching"
                className="rounded-2xl shadow-lg w-full max-w-xl md:max-w-2xl"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/about2.webp';
                }}
              />
            </div>
          </div>

          {/* Infrastructure */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-center text-center md:text-left gap-10 md:gap-16 mx-auto max-w-7xl">

            <div className="md:w-1/2 flex flex-col items-center md:items-start">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Monitor className="text-blue-600" /> {infrastructure?.title}
              </h2>

              <p className="text-slate-600 mb-4 text-lg">
                {infrastructure?.description}
              </p>

              <ul className="space-y-3 text-slate-600">
                {Array.isArray(infrastructure?.items) && infrastructure.items.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {typeof item === 'string'
                      ? item
                      : (item && typeof item === 'object' && Object.keys(item).every(k => !isNaN(Number(k))))
                        ? Object.values(item).join('')
                        : JSON.stringify(item)
                    }
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <img
                src={cleanPath(infrastructure?.image)}
                alt="Lab Infrastructure"
                className="rounded-2xl shadow-lg w-full max-w-xl md:max-w-2xl"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/about-1.webp';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Our Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            {coreValues?.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
            {Array.isArray(coreValues?.items) && coreValues.items.map((val: any, i: number) => {
              const IconComponent = (IconMap as any)[val?.icon] || CheckCircle;

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className="
                    bg-slate-50 p-8 rounded-2xl
                    border border-slate-200
                    shadow-sm hover:shadow-lg
                    transition-all duration-300
                    max-w-xs w-full
                    text-center
                "
                >
                  <div className="text-blue-600 flex justify-center mb-4 text-3xl">
                    <IconComponent />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">
                    {val?.title}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {val?.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 10. Our Team Members */}
      {
        teamMembers.length > 0 && (
          <section className="relative z-10 py-20 bg-white/70 backdrop-blur-xl border-t border-slate-200">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
                <p className="text-slate-500">The dedicated people behind LASAK EDU.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="
                    bg-white p-6 rounded-3xl
                    shadow-md hover:shadow-xl
                    border border-slate-100
                    flex items-start gap-4
                    transition-all duration-300
                    hover:-translate-y-2
                  "
                  >
                    <img
                      src={cleanPath(member.image)}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover bg-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
                      <p className="text-blue-600 text-sm font-semibold mb-2">{member.role}</p>
                      <p className="text-slate-500 text-sm leading-snug">{member.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* 11. Call to Action */}
      <section className="relative z-10 py-20 bg-white/70 backdrop-blur-xl text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{cta.title}</h2>
          <p className="text-slate-600 text-lg mb-8">
            {cta.description}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to={cta.button_1_link}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:-translate-y-1 transform duration-200"
            >
              {cta.button_1_text}
            </Link>
            <Link
              to={cta.button_2_link}
              className="px-8 py-3 bg-white text-slate-700 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              {cta.button_2_text}
            </Link>
          </div>
        </div>
      </section>

    </div >
  );
};

export default About;
