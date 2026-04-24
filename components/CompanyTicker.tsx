import React, { useState, useEffect } from 'react';
import { fetchWithCache } from '../lib/cacheUtils';
import { COMPANY_LOGOS } from '../constants/ui';

const cleanPath = (url: string) => {
  if (!url) return url;
  if (url.startsWith('https://') || url.startsWith('http://')) return url;
  let cleaned = url.replace(/\\/g, '/').replace(/^\/?public\//, '/').replace(/\/+/g, '/');
  return cleaned.startsWith('/') ? cleaned : '/' + cleaned;
};

const CompanyTicker = React.memo(() => {
  const [logos, setLogos] = useState<string[]>(COMPANY_LOGOS);
  useEffect(() => { fetchPlacementPartners(); }, []);
  const fetchPlacementPartners = async () => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { collection, query, where, orderBy, limit } = await import('firebase/firestore');
      const db = await getFirestoreDb();
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
                  width="180"
                  height="100"
                  sizes="(max-width: 640px) 120px, 180px"
                  loading="lazy"
                  decoding="async"
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
});

export default CompanyTicker;
