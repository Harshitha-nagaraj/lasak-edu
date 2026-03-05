import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, ChevronDown, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ExternalLink, MessageCircle, ArrowUp, Globe, LogIn, LogOut, User as UserIcon, Check, UserCheck } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { COMPANY_LOGOS } from '../constants';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { fetchWithCache } from '../lib/cacheUtils';
import SEO from './SEO';
import ChatWidget from './ChatWidget/ChatWidget';
import chatIcon from "./ChatWidget/chatbot-icon.png";

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

const CursorGlow = () => {
  const glowRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices to save resources
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother and more efficient updates
      rafId = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.background = `radial-gradient(500px circle at ${e.clientX}px ${e.clientY}px, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.1), transparent 60%)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-[60] transition-opacity duration-300 overflow-hidden"
      style={{
        background: 'radial-gradient(500px circle at 0px 0px, transparent, transparent)',
        mixBlendMode: 'multiply'
      }}
    />
  );
};

const fallbackNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Workshops', path: '/programs' },
  {
    name: 'Courses',
    path: '/courses',
    submenu: [
      { name: 'CSE / IT', path: '/courses/IT' },
      { name: 'Mechanical', path: '/courses/Mechanical' },
      { name: 'Civil', path: '/courses/Civil' },
      { name: 'Arts', path: '/courses/Arts' },
      { name: 'Kids', path: '/courses/Kids' },
    ]
  },
  { name: 'Overseas Education', path: 'https://lasak.edumilestones.com/', isExternal: true },
  { name: 'Blog', path: '/blog' },
  { name: 'News', path: '/news' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const fallbackContactInfo = {
  email: 'info@lasakedu.in',
  address: 'Coimbatore',
  phone: '+91 74187 32525'
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<any[]>(fallbackNavLinks);
  const [recCourseButton, setRecCourseButton] = useState<any>({ label: 'Online Courses(Coming soon)', path: '', external: true, active: true });
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [contactInfo, setContactInfo] = useState<{ email?: string; address?: string; phone?: string }>(fallbackContactInfo);

  useEffect(() => {
    fetchNavigation();
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      // Simplified query to avoid index requirement for orderBy
      const q = query(collection(db, 'contact_info'), where('active', '==', true));
      const data = await fetchWithCache('cache_contact_info', q);
      if (data && data.length > 0) {
        const email = data.find(c => c.type === 'email')?.value;
        const address = data.find(c => c.type === 'address')?.value;
        const phone = data.find(c => c.type === 'phone')?.value;
        setContactInfo({ email, address, phone });
      }
    } catch (error) {
      console.error('Error fetching contact info for header:', error);
    }
  };

  const fetchNavigation = async () => {
    try {
      const q = query(collection(db, 'site_settings'), where('key', 'in', ['nav_menu', 'rec_course_button']));
      const settings = await fetchWithCache('cache_site_settings_nav', q);
      if (settings && settings.length > 0) {
        const navSetting = settings.find(s => s.id === 'nav_menu' || s.key === 'nav_menu');
        if (navSetting && navSetting.value && navSetting.value.items && navSetting.value.items.length > 0) {
          const mappedLinks = navSetting.value.items.map((item: any) => ({
            name: item.label || item.name,
            path: item.path,
            isExternal: item.external || false,
            submenu: item.submenu ? item.submenu.map((sub: any) => ({
              name: sub.label || sub.name,
              path: sub.path
            })) : undefined
          }));
          // Always use fallback order, but update items with Firestore data
          const firestoreByPath = new Map(mappedLinks.map((l: any) => [l.path, l]));
          const orderedLinks = fallbackNavLinks.map(fallback => {
            const fromFirestore = firestoreByPath.get(fallback.path) as any;
            return fromFirestore ? { ...fallback, ...fromFirestore, submenu: fromFirestore?.submenu || (fallback as any).submenu } : fallback;
          });
          // Add any Firestore-only links not in fallback
          const fallbackPaths = new Set(fallbackNavLinks.map(f => f.path));
          const extraLinks = mappedLinks.filter((l: any) => !fallbackPaths.has(l.path));
          setNavLinks([...orderedLinks, ...extraLinks]);
        } else {
          setNavLinks(fallbackNavLinks);
        }
        const recBtn = settings.find(s => s.key === 'rec_course_button');
        if (recBtn) setRecCourseButton(recBtn.value);
      } else {
        setNavLinks(fallbackNavLinks);
      }
    } catch (error) {
      console.error('Error fetching navigation:', error);
      setNavLinks(fallbackNavLinks);
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-white border-b border-gray-200 shadow-md">
      <motion.div style={{ scaleX }} className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-blue-500 to-green-500 origin-left" />
      <div className="hidden lg:block bg-slate-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-sm font-medium text-slate-600">
          <div className="flex items-center gap-6">
            {contactInfo.email && (
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Mail size={14} className="text-blue-600" />
                <span className="font-bold">{contactInfo.email}</span>
              </a>
            )}
            {contactInfo.address && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-600 shrink-0" />
                <span className="font-bold">Coimbatore</span>
              </div>
            )}
            {contactInfo.phone && (
              <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Phone size={14} className="text-blue-600" />
                <span className="font-bold">{contactInfo.phone}</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 lg:inline font-bold">Students can verify your certification</span>
            <Link to="/verify" className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm font-bold text-sm">click here to verify</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center pr-4">
            <Link to="/" className="flex-shrink-0">
              <img src={cleanPath("/img/lasakedu-logo.png")} alt="Lasak Edu Logo" className="h-16 md:h-20 w-auto object-contain transform-gpu scale-110 md:scale-125 transition-all" />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.isExternal ? (
                    <a href={link.path} target="_blank" rel="noopener noreferrer" className="px-1 py-2 rounded-md text-base font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-300 flex items-center gap-1 whitespace-nowrap">
                      {link.name} <ExternalLink size={12} className="opacity-70" />
                    </a>
                  ) : link.submenu ? (
                    <div className="relative group">
                      <Link to={link.path} className={`px-1 py-2 rounded-md text-base font-bold transition-all duration-300 hover:text-blue-600 hover:bg-slate-50 flex items-center gap-1 whitespace-nowrap ${location.pathname.startsWith(link.path) ? 'text-blue-600' : 'text-slate-600'}`}>
                        {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                      </Link>
                      <div className="absolute left-0 top-full w-56 pt-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden bg-white border border-gray-100">
                          <div className="py-2">
                            {link.submenu.map((subItem: any) => (
                              <Link key={subItem.name} to={subItem.path} className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-0">{subItem.name}</Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link to={link.path} className={`px-1 py-2 rounded-md text-base font-bold transition-all duration-300 hover:text-blue-600 hover:bg-slate-50 whitespace-nowrap ${location.pathname === link.path ? 'text-blue-600' : 'text-slate-600'}`}>{link.name}</Link>
                  )}
                </div>
              ))}
              {recCourseButton.active && (
                <div className="relative ml-1">
                  {recCourseButton.path ? (
                    <a href={recCourseButton.path} target={recCourseButton.external ? "_blank" : "_self"} rel={recCourseButton.external ? "noopener noreferrer" : ""} className="px-3 py-1.5 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-sm whitespace-nowrap inline-block">{recCourseButton.label}</a>
                  ) : (
                    <button type="button" className="px-3 py-1.5 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-sm whitespace-nowrap" title="Coming Soon">{recCourseButton.label}</button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none">{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-b border-gray-200 overflow-hidden shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link, idx) => (
                <div key={`${link.name}-${idx}`}>
                  {link.isExternal ? (
                    <a href={link.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">{link.name} <ExternalLink size={14} /></a>
                  ) : link.submenu ? (
                    <div>
                      <button onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === link.name ? null : link.name)} className="w-full text-left px-3 py-3 rounded-md text-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between">{link.name} <ChevronDown size={16} className={`transform transition-transform ${mobileSubmenuOpen === link.name ? 'rotate-180' : ''}`} /></button>
                      <AnimatePresence>
                        {mobileSubmenuOpen === link.name && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-4 space-y-1 bg-slate-50 rounded-lg mt-1">
                            {link.submenu.map((subItem: any) => (
                              <Link key={subItem.name} to={subItem.path} onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:text-blue-600">{subItem.name}</Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link to={link.path} onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-lg font-semibold text-slate-700 hover:bg-slate-50">{link.name}</Link>
                  )}
                </div>
              ))}
              <div className="px-1 py-1"><Link to="/verify" onClick={() => setIsOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-base font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-sm mb-2">Verify Certificate</Link></div>
              {recCourseButton.active && (
                <div className="px-1 py-1">
                  {recCourseButton.path ? (
                    <a href={recCourseButton.path} target={recCourseButton.external ? "_blank" : "_self"} rel={recCourseButton.external ? "noopener noreferrer" : ""} onClick={() => setIsOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm">{recCourseButton.label}</a>
                  ) : (
                    <button type="button" className="w-full text-center px-3 py-2 rounded-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm" title="Coming Soon">{recCourseButton.label}</button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const CompanyTicker = () => {
  const [logos, setLogos] = useState<string[]>(COMPANY_LOGOS);
  useEffect(() => { fetchPlacementPartners(); }, []);
  const fetchPlacementPartners = async () => {
    try {
      const q = query(collection(db, 'partners'), where('type', '==', 'placement'), orderBy('created_at', 'desc'), limit(30));
      const partners = await fetchWithCache('cache_placement_partners', q);
      if (partners && partners.length > 0) setLogos(partners.map((p: any) => p.logo));
    } catch (error) { console.error('Error fetching placement partners:', error); }
  };
  return (
    <section className="py-16 bg-white text-slate-900 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Where Do Our Students Work?</h2>
      </div>
      <div className="relative overflow-hidden py-6">
        <div
          className="flex items-center whitespace-nowrap animate-scroll hover:pause space-x-10"
          style={{ animationDuration: "30s" }}
        >
          {([...logos, ...logos, ...logos].slice(0, 30).filter(logo => logo && logo.trim() !== '')).map((logo, idx) => (
            <div key={idx} className="flex-shrink-0 px-2 pt-2 pb-6">
              <div className="w-44 h-24 md:w-64 md:h-32 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center p-3 md:p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <img
                  src={logo ? cleanPath(logo) : ''}
                  alt="Company Logo"
                  className="w-full h-full object-contain transition duration-300 transform scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/200x120?text=Partner';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [quickLinks, setQuickLinks] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [policyLinks, setPolicyLinks] = useState<any[]>([]);
  const [contactText, setContactText] = useState<any[]>([
    { id: 'main-address', type: 'address', label: 'Main Office', branch: 'main', value: '11A, STV Nagar, Peelamedu,\nCoimbatore - 641004', order_num: 0 },
    { id: 'main-phone', type: 'phone', label: 'Phone', branch: 'main', value: '+91 7418734466', order_num: 1 },
    { id: 'main-email', type: 'email', label: 'Email', branch: 'main', value: 'info@lasakedu.in', order_num: 2 },
    { id: 'gandhi-address', type: 'address', label: 'Gandhipuram Branch', branch: 'gandhipuram', value: 'No.655 F Shri Paaththaa Avenue, 1st Floor, Near GP Signal, Gandhipuram', order_num: 3 },
    { id: 'gandhi-phone', type: 'phone', label: 'Phone', branch: 'gandhipuram', value: '+91 74187 32525', order_num: 4 },
    { id: 'gandhi-email', type: 'email', label: 'Email', branch: 'gandhipuram', value: 'info@lasakedu.in', order_num: 5 },
  ]);
  const [footerText, setFooterText] = useState({ copyright: '', tagline: '', logo: '' });
  useEffect(() => { fetchFooterData(); }, []);
  const fetchFooterData = async () => {
    try {
      // Simplified query to avoid index requirement for orderBy
      const qContact = query(collection(db, 'contact_info'), where('active', '==', true));
      const contactData = await fetchWithCache('cache_contact_info', qContact);

      if (contactData && contactData.length > 0) {
        contactData.sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0));
        setSocialLinks(contactData.filter((c: any) => c.type === 'social_media' || c.type === 'social'));

        // Use Firestore contact data directly if available, replacing fallback entirely
        const firestoreContacts = contactData.filter((c: any) => ['address', 'phone', 'email'].includes(c.type));
        if (firestoreContacts.length > 0) {
          setContactText(firestoreContacts);
        }
      }

      const qSettings = query(collection(db, 'site_settings'));
      const settings = await fetchWithCache('cache_site_settings_all', qSettings);

      const ql = settings.find(s => s.id === 'footer_quick_links' || s.key === 'footer_quick_links'); if (ql) setQuickLinks(ql.value.items || []);
      const dep = settings.find(s => s.id === 'footer_departments' || s.key === 'footer_departments'); if (dep) setDepartments(dep.value.items || []);
      const pol = settings.find(s => s.id === 'footer_policy_links' || s.key === 'footer_policy_links'); if (pol) setPolicyLinks(pol.value.items || []);
      const ft = settings.find(s => s.id === 'footer_text' || s.key === 'footer_text');
      if (ft && ft.value) setFooterText(ft.value);
      else setFooterText({ copyright: `© ${new Date().getFullYear()} LASAK EDU. All rights reserved.`, tagline: 'Leading IT, Mechanical & Civil Training Institute in Coimbatore', logo: '' });
    } catch (error) {
      console.error('Error fetching footer data:', error);
      setFooterText({ copyright: `© ${new Date().getFullYear()} LASAK EDU. All rights reserved.`, tagline: 'Leading IT, Mechanical & Civil Training Institute in Coimbatore', logo: '' });
      // contactText fallback already set in initial state
    }
  };
  const getIcon = (item: any) => {
    const YoutubeIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    );
    if (item.icon) {
      const icons: any = { Facebook: <Facebook />, Twitter: <Twitter />, Instagram: <Instagram />, Linkedin: <Linkedin />, Youtube: <YoutubeIcon />, Phone: <Phone />, Mail: <Mail />, MapPin: <MapPin />, Globe: <Globe size={20} /> };
      if (icons[item.icon]) return icons[item.icon];
    }
    const lowerName = (item.label || item.type || '').toLowerCase();
    if (lowerName.includes('facebook')) return <Facebook />;
    if (lowerName.includes('twitter') || lowerName.includes('x')) return <Twitter />;
    if (lowerName.includes('instagram')) return <Instagram />;
    if (lowerName.includes('linkedin')) return <Linkedin />;
    if (lowerName.includes('youtube')) return <YoutubeIcon />;
    return <Globe size={20} />;
  };
  const defaultQuickLinks = [{ label: 'Home', path: '/' }, { label: 'Courses', path: '/courses' }, { label: 'Workshops', path: '/programs' }, { label: 'Overseas Education', path: 'https://lasak.edumilestones.com/', external: true }, { label: 'Latest Blogs', path: '/blog' }, { label: 'Latest News', path: '/news' }, { label: 'Verify Certificate', path: '/verify' }, { label: 'About Us', path: '/about' }, { label: 'Contact Us', path: '/contact' }];
  const defaultDepartments = [{ label: 'CSE / IT Training', path: '/courses/IT' }, { label: 'Mechanical Design', path: '/courses/Mechanical' }, { label: 'Civil & Arch', path: '/courses/Civil' }, { label: 'Arts', path: '/courses/Arts' }, { label: 'Kids Robotics', path: '/courses/Kids' }];
  const defaultPolicyLinks = [{ label: 'Privacy Policy', path: '/privacy-policy' }, { label: 'Terms & Conditions', path: '/terms-conditions' }, { label: 'Refund Policy', path: '/refund-policy' }, { label: 'Cancellation Policy', path: '/cancellation-policy' }];
  const displayQuickLinks = quickLinks.length > 0 ? quickLinks : defaultQuickLinks;
  const displayDepartments = departments.length > 0 ? departments : defaultDepartments;
  const displayPolicyLinks = policyLinks.length > 0 ? policyLinks : defaultPolicyLinks;
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
          <div className="space-y-4">
            <img src="/img/lasakedufotter.webp" alt="Lasak Edu" className="h-16 w-auto object-contain mb-2" />
            <p className="text-sm text-slate-400">{footerText.tagline || 'Empowering the next generation of tech leaders with industry-standard training and 100% placement support in Coimbatore.'}</p>
            <div className="flex gap-4 text-xl">
              {socialLinks.length > 0 ? socialLinks.map(social => (
                <a key={social.id} href={social.value} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="hover:text-blue-500 transition-colors">{getIcon(social)}</a>
              )) : (
                <>
                  <a href="https://www.instagram.com/lasak_edu/?next=%2F&hl=en" target="_blank" rel="noreferrer" className="hover:text-pink-500"><Instagram /></a>
                  <a href="https://www.linkedin.com/in/lasak-edu-a3a2ba254/" target="_blank" rel="noreferrer" className="hover:text-blue-600"><Linkedin /></a>
                  <a href="https://www.facebook.com/lasaktechnoinstitute" target="_blank" rel="noreferrer" className="hover:text-blue-500"><Facebook /></a>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-8 h-1 bg-blue-600 rounded-full"></span>Quick Links</h4>
            <ul className="space-y-2 text-sm">{displayQuickLinks.map((link, i) => (
              <li key={i}>{link.external ? <a href={link.path} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">{link.label} <ExternalLink size={12} /></a> : <Link to={link.path} className="hover:text-white transition-colors">{link.label}</Link>}</li>
            ))}</ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-8 h-1 bg-blue-600 rounded-full"></span>Departments</h4>
            <ul className="space-y-2 text-sm">{displayDepartments.map((link, i) => (
              <li key={i}>{link.external ? <a href={link.path} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">{link.label} <ExternalLink size={12} /></a> : <Link to={link.path} className="hover:text-white transition-colors">{link.label}</Link>}</li>
            ))}</ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-8 h-1 bg-blue-600 rounded-full"></span>Contact</h4>
            <div className="space-y-3 text-sm">
              {contactText.map((contact: any, idx: number) => {
                if (contact.type === 'address') {
                  return (
                    <div key={contact.id || idx}>
                      {/* Label line with pin icon */}
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-blue-400 shrink-0" />
                        <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">{contact.label}</span>
                      </div>
                      {/* Address value indented below */}
                      <p className="text-slate-300 leading-snug whitespace-pre-line pl-5">{contact.value}</p>
                    </div>
                  );
                }
                if (contact.type === 'phone') {
                  return (
                    <div key={contact.id || idx} className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <a href={`tel:${contact.value.replace(/\s+/g, '')}`} className="text-slate-300 hover:text-white transition-colors">{contact.value}</a>
                    </div>
                  );
                }
                if (contact.type === 'email') {
                  return (
                    <div key={contact.id || idx} className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <a href={`mailto:${contact.value}`} className="text-slate-300 hover:text-white transition-colors">{contact.value}</a>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          {displayPolicyLinks.map((link, i) => (
            <React.Fragment key={i}>{link.external ? <a href={link.path} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">{link.label} <ExternalLink size={12} /></a> : <Link to={link.path} className="hover:text-white transition-colors">{link.label}</Link>}</React.Fragment>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-sm text-slate-500"><p>{footerText.copyright || `© ${new Date().getFullYear()} LASAK EDU. All rights reserved.`}</p></div>
      </div>
    </footer>
  );
};

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [phone, setPhone] = useState('+917418732525');
  const [whatsapp, setWhatsapp] = useState('917418732525');
  const [onlineCourseButton, setOnlineCourseButton] = useState<any>({ label: 'Online Course', path: '', active: false, external: true });
  const [showGreeting, setShowGreeting] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  useEffect(() => {
    fetchContactNumbers(); fetchSiteSettings();
    const checkScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', checkScroll);
    const timer = setTimeout(() => setShowGreeting(true), 3000);
    return () => { window.removeEventListener('scroll', checkScroll); clearTimeout(timer); };
  }, []);
  const fetchContactNumbers = async () => {
    try {
      const q = query(collection(db, 'contact_info'), where('active', '==', true));
      const data = await fetchWithCache('cache_contact_info', q);
      if (data && data.length > 0) {
        const phoneEntry = data.find(c => c.type === 'phone' || c.label?.toLowerCase().includes('call'));
        const whatsappEntry = data.find(c => c.label?.toLowerCase().includes('whatsapp'));
        if (phoneEntry) setPhone(phoneEntry.value.replace(/\s+/g, ''));
        if (whatsappEntry) setWhatsapp(whatsappEntry.value.replace(/\D/g, ''));
      }
    } catch (error) { console.warn('FloatingButtons: Failed to fetch numbers'); }
  };
  const fetchSiteSettings = async () => {
    try {
      const q = query(collection(db, 'site_settings'), where('key', '==', 'online_course_button'), limit(1));
      const data = await fetchWithCache('cache_site_settings_online_course', q);
      if (data && data.length > 0) setOnlineCourseButton(data[0].value);
    } catch (error) { console.warn('FloatingButtons: Failed to fetch online course button settings'); }
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  if (isAdminPage) return null;
  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 flex flex-col gap-3 sm:gap-4 z-50">
        <AnimatePresence>{showScrollTop && (<motion.button whileTap={{ scale: 0.9 }} onClick={scrollToTop} className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shadow-lg border border-slate-200" title="Scroll to Top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}><ArrowUp className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" /></motion.button>)}</AnimatePresence>
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp" className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 hover:scale-110 transition-transform"><MessageCircle className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" /></a>
        {onlineCourseButton.active && onlineCourseButton.path && (<a href={onlineCourseButton.path} target={onlineCourseButton.external ? "_blank" : "_self"} rel={onlineCourseButton.external ? "noopener noreferrer" : ""} title={onlineCourseButton.label || "Online Courses"} className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 hover:scale-110 transition-transform"><Globe className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" /></a>)}
        <a href={`tel:${phone}`} title="Call Now" className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg active:scale-95 hover:scale-110 transition-transform"><Phone className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" /></a>
        <div className="relative group">
          <AnimatePresence>{showGreeting && !isChatOpen && (<motion.div initial={{ opacity: 0, scale: 0.8, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8, x: 20 }} className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 z-[60]"><div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45" /><button onClick={(e) => { e.stopPropagation(); setShowGreeting(false); }} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1"><X size={14} /></button><div className="flex flex-col gap-1"><h4 className="text-sm font-black text-slate-800 flex items-center gap-1">Hello! 👋</h4><p className="text-xs text-slate-500 font-medium leading-relaxed">I am Sakthi AI chatbot from LasakEdu. How can I help you?</p></div></motion.div>)}</AnimatePresence>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setIsChatOpen(true); setShowGreeting(false); }} title="Chat with Sakthi" className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200"><img src={chatIcon} alt="Sakthi Chat" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 object-contain" /></motion.button>
        </div>
      </div>
      <AnimatePresence>{isChatOpen && (<ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />)}</AnimatePresence>
    </>
  );
};

interface LayoutProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans flex flex-col relative overflow-hidden">
      <CursorGlow />
      <SEO
        title={title || "LASAK EDU – Training Institute in Coimbatore | IT, Mechanical & Civil Courses"}
        description={description || "LASAK EDU – Leading training institute in Coimbatore offering industry-standard IT, Mechanical & Civil courses with 100% placement support. Enroll now at lasakedu.in."}
        keywords="LASAK EDU, lasakedu, lasak edu, LASAK Institute, LasakEdu Coimbatore, IT training Coimbatore, Mechanical training Coimbatore, Civil training Coimbatore"
        image="/img/lasakedu-logo-v2.png"
      />
      <Navbar />
      <main className="pt-32 flex-grow">{children || <Outlet />}</main>
      <CompanyTicker />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Layout;
