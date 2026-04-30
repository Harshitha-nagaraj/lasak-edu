import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Newspaper, Bell, ExternalLink } from 'lucide-react';
import { fetchWithCache } from '../lib/cacheUtils';
import SEO from '../components/SEO';
import { normalizeImagePath } from '../lib/imageUtils';

// Static news cards — shown immediately as fallback and when no Firestore news exists
const MOCK_NEWS = [
    {
        id: "news-data-analytics-ai",
        title: "🚀 New Data Analytics Course with AI – Launching with a Special Offer!",
        date: "Mar 3, 2026",
        excerpt: "LasakEdu is thrilled to announce our brand-new Data Analytics course powered by cutting-edge AI tools! Master data visualization, machine learning fundamentals, Python for data science, and AI-driven analytics — all taught by industry experts. Enroll now during our limited-time launch offer and kickstart your career in one of the fastest-growing fields. Seats are limited — don't miss out!",
        category: "🎓 New Course Launch",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "news-workshops-online",
        title: "💻 Workshops Going Online – Join Live from Anywhere in India!",
        date: "Mar 3, 2026",
        excerpt: "Exciting news! LasakEdu's hands-on workshops are now going online. Join live interactive sessions led by expert trainers, participate in real-time Q&A, and receive your official certification — all from the comfort of your home. Whether you're in Coimbatore or across India, you can now access our top-quality workshops without any travel. Register today and reserve your spot!",
        category: "📡 Online Workshop",
        image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&auto=format&fit=crop&q=60"
    }
];


const News = () => {
    const [news, setNews] = useState<any[]>(MOCK_NEWS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { getFirestoreDb } = await import('../lib/firebase');
            const { collection, query, orderBy, limit } = await import('firebase/firestore');
            const db = await getFirestoreDb();
            // Fetch from 'news' collection (not 'blogs')
            const newsQ = query(collection(db, 'news'), orderBy('created_at', 'desc'), limit(20));
            const data = await fetchWithCache(
                'cache_news',
                newsQ,
                24 * 60 * 60 * 1000,
                (docData: any) => ({
                    id: docData.id,
                    title: docData.title,
                    excerpt: docData.excerpt,
                    image: docData.image,
                    category: docData.category,
                    date: docData.date
                })
            );

            if (data && data.length > 0) {
                setNews(data);
            }
            // If empty, keep MOCK_NEWS as fallback
        } catch (error) {
            console.error('Error fetching news:', error);
            // Keep MOCK_NEWS on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SEO
                title="News & Updates | LasakEdu Institute – Latest Announcements"
                description="Stay updated with the latest news, announcements, and events from LasakEdu Institute. From placement drives to new course launches."
                keywords="LasakEdu news, training institute updates, placement news, skill development events"
                url="https://lasakedu.in/news"
            />

            {/* Hero Section */}
            <section className="bg-white pt-32 pb-16 px-4 border-b border-slate-200">
                <div className="container mx-auto max-w-6xl">
                    <div
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
                            <Bell size={16} />
                            Stay Informed
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 font-tech tracking-tight">
                            LATEST <span className="text-blue-600">NEWS</span> & UPDATES
                        </h1>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                            Discover the latest happenings, upcoming events, and success stories from the heart of LasakEdu.
                        </p>
                    </div>
                </div>
            </section>

            {/* News Feed */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    {loading && (
                        <div className="flex justify-center py-4">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    {(
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {news.map((item, idx) => (
                                <article
                                    key={item.id}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col md:flex-row h-full"
                                >
                                    {/* Image Section */}
                                    <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative bg-gray-100">
                                        <img
                                            src={normalizeImagePath(item.image) || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60'}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            loading={idx === 0 ? "eager" : "lazy"}
                                            {...(idx === 0 ? { fetchPriority: "high" } : {})}
                                            decoding="async"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/95 text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="w-full md:w-3/5 p-8 flex flex-col">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold mb-3 uppercase tracking-wider">
                                            <Calendar size={14} />
                                            {item.date}
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                            {item.title}
                                        </h2>
                                        <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Load More / Newsletter Call to Action */}
                    <div
                        className="mt-20 p-10 md:p-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl"
                    >
                        {/* Design Elements */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <Newspaper size={64} className="mx-auto mb-8 opacity-40" />
                            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                                NEVER MISS AN UPDATE
                            </h3>
                            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                                Subscribe to our notification list to get the latest announcements delivered straight to your inbox.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-6 py-4 rounded-xl bg-white text-slate-900 font-medium outline-none shadow-inner"
                                />
                                <button className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Feed Links */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="container mx-auto max-w-6xl px-4 text-center">
                    <h4 className="text-slate-600 uppercase tracking-widest font-bold text-sm mb-10">Follow Our Social Feed</h4>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <a 
                            href="https://www.instagram.com/lasak_edu/?next=%2F&hl=en" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-bold text-slate-900 hover:text-pink-600 cursor-pointer transition-colors flex items-center gap-1 group"
                        >
                            Instagram <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                        <a 
                            href="https://www.linkedin.com/company/lasak-edu/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer transition-colors flex items-center gap-1 group"
                        >
                            LinkedIn <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default News;
