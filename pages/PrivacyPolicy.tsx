import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { getFirestoreDb } = await import('../lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const db = await getFirestoreDb();
        const docRef = doc(db, 'site_settings', 'privacy_policy_content');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data().value?.content || docSnap.data().html_content || '');
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div
          >
            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Legal & Compliance
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Privacy Policy</h1>
            <div className="flex items-center justify-center gap-4 text-slate-500 font-bold text-sm">
              <span>Lasakedu Institution</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : content ? (
              <div
                className="prose prose-slate max-w-none
                            [&_h3]:text-xl [&_h3]:font-black [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-slate-900
                            [&_p]:mb-4 [&_p]:text-slate-600 [&_p]:leading-relaxed
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:mb-6
                            [&_li]:text-slate-600 [&_li]:font-medium
                            [&_strong]:text-slate-900 [&_strong]:font-black"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-center text-gray-500 italic">Content not available.</p>
            )}
          </div>

          {/* Static Contact Info Section remains same as per design */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black mb-4">Questions?</h2>
                <p className="text-slate-600 font-medium">If you have any questions regarding this Privacy Policy, please reach out to our legal team.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover/item:bg-white/20 transition-colors">
                    <Mail className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-black uppercase tracking-widest">Email Us</p>
                    <p className="font-bold">info@lasakedu.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover/item:bg-white/20 transition-colors">
                    <Phone className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-black uppercase tracking-widest">Call Us</p>
                    <p className="font-bold">+91 74187 32525</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover/item:bg-white/20 transition-colors shrink-0">
                    <MapPin className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-black uppercase tracking-widest">Visit Us</p>
                    <p className="font-bold text-sm leading-relaxed">
                      11A, STV Nagar, Peelamedu,<br />
                      Nava India Signal, Coimbatore - 641004
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
