import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ExternalLink, Globe } from 'lucide-react';
import { fetchWithCache } from '../lib/cacheUtils';

const Footer = React.memo(() => {
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
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, where } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      const qContact = query(collection(db, 'contact_info'), where('active', '==', true));
      const contactData = await fetchWithCache('cache_contact_info', qContact);

      if (contactData && contactData.length > 0) {
        contactData.sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0));
        setSocialLinks(contactData.filter((c: any) => c.type === 'social_media' || c.type === 'social'));

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
  const defaultDepartments = [{ label: 'Mech', path: '/courses/Mechanical' }, { label: 'Civil', path: '/courses/Civil' }, { label: 'IT', path: '/courses/IT' }, { label: 'Arts', path: '/courses/Arts' }, { label: 'Kids', path: '/courses/Kids' }];
  const defaultPolicyLinks = [{ label: 'Privacy Policy', path: '/privacy-policy' }, { label: 'Terms & Conditions', path: '/terms-conditions' }, { label: 'Refund Policy', path: '/refund-policy' }, { label: 'Cancellation Policy', path: '/cancellation-policy' }];

  const displayQuickLinks = quickLinks.length > 0 ? quickLinks : defaultQuickLinks;
  const displayDepartments = departments.length > 0 ? departments : defaultDepartments;
  const displayPolicyLinks = policyLinks.length > 0 ? policyLinks : defaultPolicyLinks;

  const linkClass = "hover:text-white transition-colors relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300";
  const linkExternalClass = "hover:text-white transition-colors flex items-center gap-1 relative w-fit after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 group";

  return (
    <footer className="bg-slate-950 text-slate-200 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
          <div className="space-y-4">
            <img 
              src="/img/lasakedufotter.webp" 
              alt="Lasak Edu" 
              width="200" 
              height="50" 
              sizes="200px"
              loading="lazy" 
              decoding="async" 
              className="h-16 w-auto object-contain mb-2" 
            />
            <p className="text-sm text-slate-200">{footerText.tagline || 'Empowering the next generation of tech leaders with industry-standard training and 100% placement support in Coimbatore.'}</p>
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
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-8 h-1 bg-blue-600 rounded-full"></span>Quick Links</h2>
            <ul className="space-y-2 text-sm">{displayQuickLinks.map((link, i) => (
              <li key={i}>{link.external ? <a href={link.path} target="_blank" rel="noreferrer" className={linkExternalClass}>{link.label} <ExternalLink size={12} className="group-hover:text-blue-500 transition-colors" /></a> : <Link to={link.path} className={linkClass}>{link.label}</Link>}</li>
            ))}</ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-8 h-1 bg-blue-600 rounded-full"></span>Departments</h2>
            <ul className="space-y-2 text-sm">{displayDepartments.map((link, i) => (
              <li key={i}>{link.external ? <a href={link.path} target="_blank" rel="noreferrer" className={linkExternalClass}>{link.label} <ExternalLink size={12} className="group-hover:text-blue-500 transition-colors" /></a> : <Link to={link.path} className={linkClass}>{link.label}</Link>}</li>
            ))}</ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-8 h-1 bg-blue-600 rounded-full"></span>Contact</h2>
            <div className="space-y-3 text-sm">
              {contactText.map((contact: any, idx: number) => {
                if (contact.type === 'address') {
                  return (
                    <div key={contact.id || idx}>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-blue-400 shrink-0" />
                        <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">{contact.label}</span>
                      </div>
                      <p className="text-slate-200 leading-snug whitespace-pre-line pl-5">{contact.value}</p>
                    </div>
                  );
                }
                if (contact.type === 'phone') {
                  return (
                    <div key={contact.id || idx} className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-600 shrink-0" />
                      <a href={`tel:${contact.value.replace(/\s+/g, '')}`} className={`text-slate-200 ${linkClass}`}>{contact.value}</a>
                    </div>
                  );
                }
                if (contact.type === 'email') {
                  return (
                    <div key={contact.id || idx} className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-600 shrink-0" />
                      <a href={`mailto:${contact.value}`} className={`text-slate-200 ${linkClass}`}>{contact.value}</a>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-600">
          {displayPolicyLinks.map((link, i) => (
            <React.Fragment key={i}>{link.external ? <a href={link.path} target="_blank" rel="noreferrer" className={linkExternalClass}>{link.label} <ExternalLink size={12} className="group-hover:text-blue-500 transition-colors" /></a> : <Link to={link.path} className={`text-slate-600 ${linkClass}`}>{link.label}</Link>}</React.Fragment>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-sm text-slate-200"><p>{footerText.copyright || `© ${new Date().getFullYear()} LASAK EDU. All rights reserved.`}</p></div>
      </div>
    </footer>
  );
});

export default Footer;
