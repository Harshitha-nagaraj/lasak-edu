import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, ChevronDown, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { useNativeScrollProgress } from '../hooks/useNativeScroll';
import { COMPANY_LOGOS, CATEGORIES } from '../constants/ui';
import SEO from './SEO';

const CompanyTicker = React.lazy(() => import('./CompanyTicker'));
const FloatingButtons = React.lazy(() => import('./FloatingButtons'));
const Footer = React.lazy(() => import('./Footer'));
const ChatWidget = React.lazy(() => import('./ChatWidget/ChatWidget'));
const chatIcon = "/img/favicon.png";

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
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      rafId = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
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
      className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] z-[60] opacity-30 blur-[100px] rounded-full will-change-transform"
      style={{
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.2), transparent)',
        pointerEvents: 'none'
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
    submenu: CATEGORIES.map(cat => ({
      name: cat.name,
      path: `/courses/${cat.id}`
    }))
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
  const [contactInfo, setContactInfo] = useState<{ email?: string; address?: string; phone?: string }>(fallbackContactInfo);

  useEffect(() => {
    const run = () => {
      fetchNavigation();
      fetchContactInfo();
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run);
    } else {
      setTimeout(run, 1000);
    }
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { query, collection, where } = await import('firebase/firestore');
      const { fetchWithCache } = await import('../lib/cacheUtils');
      
      const db = await getFirestoreDb();
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
      const { getFirestoreDb } = await import('../lib/firebase');
      const { query, collection, where } = await import('firebase/firestore');
      const { fetchWithCache } = await import('../lib/cacheUtils');

      const db = await getFirestoreDb();
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
          const firestoreByPath = new Map(mappedLinks.map((l: any) => [l.path, l]));
          const orderedLinks = fallbackNavLinks.map(fallback => {
            const fromFirestore = firestoreByPath.get(fallback.path) as any;
            let finalSubmenu = fromFirestore?.submenu || (fallback as any).submenu;
            
            // If it's the courses menu, ensure submenu follows CATEGORIES order
            if (fallback.path === '/courses' && finalSubmenu) {
              const predefinedOrder = CATEGORIES.map(c => `/courses/${c.id}`);
              finalSubmenu = [...finalSubmenu].sort((a: any, b: any) => {
                const idxA = predefinedOrder.indexOf(a.path);
                const idxB = predefinedOrder.indexOf(b.path);
                if (idxA === -1 && idxB === -1) return 0;
                if (idxA === -1) return 1;
                if (idxB === -1) return -1;
                return idxA - idxB;
              });
              
              // Also ensure names are updated to match CATEGORIES names (e.g. IT -> CSE/IT)
              finalSubmenu = finalSubmenu.map((sub: any) => {
                const cat = CATEGORIES.find(c => `/courses/${c.id}` === sub.path);
                return cat ? { ...sub, name: cat.name } : sub;
              });
            }

            return fromFirestore ? { ...fallback, ...fromFirestore, submenu: finalSubmenu } : { ...fallback, submenu: finalSubmenu };
          });
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
      <ScrollProgress />
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
        <div className="flex items-center justify-between h-20 lg:h-24">
          <div className="flex items-center pr-2">
            <Link to="/" className="flex-shrink-0">
              <img 
                src={cleanPath("/img/lasakedu-logo.png")} 
                alt="Lasak Edu Logo" 
                width="224" 
                height="112" 
                sizes="224px"
                fetchpriority="high"
                style={{ imageRendering: 'crisp-edges' }}
                className="h-12 md:h-14 lg:h-20 w-auto object-contain transition-all" 
              />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                    {link.isExternal ? (
                      <a href={link.path} target="_blank" rel="noopener noreferrer" className="px-1 py-1.5 rounded-md text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-300 flex items-center gap-1 whitespace-nowrap">
                        {link.name} <ExternalLink size={12} className="opacity-70" />
                      </a>
                    ) : link.submenu ? (
                      <div className="relative group">
                        <Link 
                          to={link.path} 
                          aria-current={location.pathname.startsWith(link.path) ? 'page' : undefined}
                          className={`px-1 py-1.5 rounded-md text-sm font-bold transition-all duration-300 hover:text-blue-600 hover:bg-slate-50 flex items-center gap-1 whitespace-nowrap ${location.pathname.startsWith(link.path) ? 'text-blue-600' : 'text-slate-600'}`}>
                          {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                        </Link>
                        <div className="absolute left-0 top-full w-56 pt-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <div className="rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden bg-white border border-gray-100">
                            <div className="py-2">
                              {link.submenu.map((subItem: any) => (
                                <Link key={subItem.name} to={subItem.path} className="block px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-0">{subItem.name}</Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link 
                        to={link.path} 
                        aria-current={location.pathname === link.path ? 'page' : undefined}
                        className={`px-1 py-1.5 rounded-md text-sm font-bold transition-all duration-300 hover:text-blue-600 hover:bg-slate-50 whitespace-nowrap ${location.pathname === link.path ? 'text-blue-600' : 'text-slate-600'}`}>{link.name}</Link>
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
            <button aria-label="Toggle mobile menu" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-800 hover:text-blue-600 hover:bg-slate-100 focus:outline-none">{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          </div>
        </div>
      </div>
      
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 overflow-hidden shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link, idx) => (
                <div key={`${link.name}-${idx}`}>
                  {link.isExternal ? (
                    <a href={link.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">{link.name} <ExternalLink size={14} /></a>
                  ) : link.submenu ? (
                    <div>
                      <button onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === link.name ? null : link.name)} className="w-full text-left px-3 py-3 rounded-md text-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between">{link.name} <ChevronDown size={16} className={`transform transition-transform ${mobileSubmenuOpen === link.name ? 'rotate-180' : ''}`} /></button>
                      
                        {mobileSubmenuOpen === link.name && (
                          <div className="pl-4 space-y-1 bg-slate-50 rounded-lg mt-1">
                            {link.submenu.map((subItem: any) => (
                              <Link key={subItem.name} to={subItem.path} onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:text-blue-600">{subItem.name}</Link>
                            ))}
                          </div>
                        )}
                      
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
          </div>
        )}
      
    </header>
  );
};

const ScrollProgress = React.memo(() => {
  const progress = useNativeScrollProgress();
  return (
    <div 
      style={{ transform: `scaleX(${progress})` }} 
      className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-blue-500 to-green-500 origin-left will-change-transform" 
    />
  );
});

interface LayoutProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans flex flex-col relative overflow-x-clip">
      <CursorGlow />
      <SEO
        title={title || "LASAK EDU – Training Institute in Coimbatore | IT, Mechanical & Civil Courses"}
        description={description || "LASAK EDU – Leading training institute in Coimbatore offering industry-standard IT, Mechanical & Civil courses with 100% placement support. Enroll now at lasakedu.in."}
        keywords="LASAK EDU, lasakedu, lasak edu, LASAK Institute, LasakEdu Coimbatore, IT training Coimbatore, Mechanical training Coimbatore, Civil training Coimbatore"
        image="/img/lasakedu-logo.png"
      />
      <Navbar />
      <main className="pt-32 lg:pt-36 flex-grow">{children || <Outlet />}</main>
      <React.Suspense fallback={<div className="h-40" />}>
        <CompanyTicker />
      </React.Suspense>
      <React.Suspense fallback={<div className="h-40" />}>
        <Footer />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <FloatingButtons />
      </React.Suspense>
    </div>
  );
};

export default Layout;
