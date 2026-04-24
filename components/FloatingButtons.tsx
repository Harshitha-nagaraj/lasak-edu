import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, ArrowUp, Globe, Phone, X } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useNativeScrollY } from '../hooks/useNativeScroll';
import { fetchWithCache } from '../lib/cacheUtils';

const ChatWidget = React.lazy(() => import('./ChatWidget/ChatWidget'));
const chatIcon = "/img/favicon.png";

const FloatingButtons = React.memo(() => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [phone, setPhone] = useState('+917418732525');
  const [whatsapp, setWhatsapp] = useState('917418732525');
  const [onlineCourseButton, setOnlineCourseButton] = useState<any>({ label: 'Online Course', path: '', active: false, external: true });
  const [showGreeting, setShowGreeting] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const scrollY = useNativeScrollY();

  useEffect(() => {
    setShowScrollTop(scrollY > 400);
  }, [scrollY]);

  useEffect(() => {
    const run = () => {
      fetchContactNumbers(); 
      fetchSiteSettings();
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run);
    } else {
      setTimeout(run, 1500); // 1.5s delay if no rIC
    }
    const timer = setTimeout(() => setShowGreeting(true), 5000); // Also delay greeting
    return () => { clearTimeout(timer); };
  }, []);

  const fetchContactNumbers = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, where } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      const q = query(collection(db, 'contact_info'), where('active', '==', true));
      const data = await fetchWithCache('cache_contact_info', q);
      if (data && data.length > 0) {
        const phoneEntry = data.find(c => (c.type === 'phone' || c.label?.toLowerCase().includes('call')));
        const whatsappEntry = data.find(c => c.label?.toLowerCase().includes('whatsapp'));
        if (phoneEntry) setPhone(phoneEntry.value.replace(/\s+/g, ''));
        if (whatsappEntry) setWhatsapp(whatsappEntry.value.replace(/\D/g, ''));
      }
    } catch (error) { console.warn('FloatingButtons: Failed to fetch numbers'); }
  };

  const fetchSiteSettings = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, where, limit } = await import('firebase/firestore');
      const db = await getFirestoreDb();
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
        <AnimatePresence>
          {showScrollTop && (
            <m.button 
              whileTap={{ scale: 0.9 }} 
              onClick={scrollToTop} 
              className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shadow-lg border border-slate-200" 
              title="Scroll to Top" 
              aria-label="Scroll to top"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 20 }}
            >
              <ArrowUp className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
            </m.button>
          )}
        </AnimatePresence>
        
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp" className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform"><MessageCircle className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" /></a>
        
        {onlineCourseButton.active && onlineCourseButton.path && (
          <a href={onlineCourseButton.path} target={onlineCourseButton.external ? "_blank" : "_self"} rel={onlineCourseButton.external ? "noopener noreferrer" : ""} title={onlineCourseButton.label || "Online Courses"} className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform"><Globe className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" /></a>
        )}
        
        <a href={`tel:${phone}`} title="Call Now" className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform"><Phone className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" /></a>
        
        <div className="relative group">
          <AnimatePresence>
            {showGreeting && !isChatOpen && (
              <m.div initial={{ opacity: 0, scale: 0.8, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8, x: 20 }} className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 z-[60]">
                <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45" />
                <button aria-label="Close greeting" onClick={(e) => { e.stopPropagation(); setShowGreeting(false); }} className="absolute top-2 right-2 text-slate-700 hover:text-slate-900 p-1"><X size={14} /></button>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1">Hello! 👋</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">I am Sakthi AI chatbot from LasakEdu. How can I help you?</p>
                </div>
              </m.div>
            )}
          </AnimatePresence>
          
          <m.button aria-label="Chat with AI support" whileTap={{ scale: 0.9 }} onClick={() => { setIsChatOpen(true); setShowGreeting(false); }} title="Chat with Sakthi" className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200">
            <img 
              src={chatIcon} 
              alt="Sakthi Chat Icon" 
              width="40" 
              height="40" 
              loading="lazy"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 object-contain" 
            />
          </m.button>
        </div>
      </div>
      
      <AnimatePresence>
        {isChatOpen && (
          <React.Suspense fallback={null}>
            <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </React.Suspense>
        )}
      </AnimatePresence>
    </>
  );
});

export default FloatingButtons;
