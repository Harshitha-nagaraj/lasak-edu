import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BLOG_SUMMARIES } from '../constants/blogSummaries';
import { Calendar, User, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { fetchWithCache } from '../lib/cacheUtils';
import { normalizeImagePath } from '../lib/imageUtils';

// Topic-aware fallback: maps blog keywords to relevant existing images on disk
const TOPIC_FALLBACK_MAP: { keywords: string[]; image: string }[] = [
  { keywords: ['full stack', 'fullstack', 'web development', 'mern', 'react', 'node'], image: '/img/it/full-stack-development-171z.webp' },
  { keywords: ['autocad', 'auto cad', 'cad mechanical', 'mechanical drafting'], image: '/img/mech/autocad.webp' },
  { keywords: ['solidworks', 'solid works', 'weldment'], image: '/img/mech/solidworks-408z.webp' },
  { keywords: ['python', 'django', 'flask'], image: '/img/it/python-267z.webp' },
  { keywords: ['data analytics', 'data science', 'analytics', 'ai', 'machine learning'], image: '/img/it/da-013z.webp' },
  { keywords: ['software testing', 'qa', 'automation testing'], image: '/img/it/st-291z.webp' },
  { keywords: ['java', 'spring boot'], image: '/img/it/java-747z.webp' },
  { keywords: ['revit', 'bim'], image: '/img/civil/revit-471z.webp' },
  { keywords: ['civil', 'construction', 'infrastructure'], image: '/img/civil/civil-cad.webp' },
  { keywords: ['digital marketing', 'seo', 'social media'], image: '/img/it/digital-marketing-875z.webp' },
  { keywords: ['workshop', 'seminar', 'orientation', 'career'], image: '/img/collaboration-zones.webp' },
  { keywords: ['placement', 'internship', 'job', 'hired'], image: '/img/design-workshops.webp' },
];

const getTopicFallbackImage = (title: string, category?: string): string => {
  const searchText = `${title} ${category || ''}`.toLowerCase();
  for (const entry of TOPIC_FALLBACK_MAP) {
    if (entry.keywords.some(kw => searchText.includes(kw))) {
      return entry.image;
    }
  }
  // Generic fallback — about page image
  return '/img/about1.webp';
};


const Blog = () => {
  const [blogs, setBlogs] = useState(BLOG_SUMMARIES); // Initialize with fallback data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => fetchBlogs());
    } else {
      setTimeout(fetchBlogs, 1000);
    }
  }, []);

  const fetchBlogs = async () => {
    console.log('🔍 [Blog.tsx] Starting to fetch blogs from Firestore...');
    setLoading(true);
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const db = await getFirestoreDb();
      const { collection, query, orderBy, limit } = await import('firebase/firestore');

      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc'), limit(25));
      const fetchedBlogs = await fetchWithCache(
        'cache_blogs_v3',
        q,
        2 * 60 * 60 * 1000,
        (data: any) => ({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          image: data.image,
          category: data.category,
          date: data.date
        })
      );

      console.log('📊 [Blog.tsx] Query result count:', fetchedBlogs.length);

      // Create a map of fetched blogs by ID or Title for quick lookup
      const fetchedMap = new Map();
      fetchedBlogs.forEach(fb => {
        fetchedMap.set(fb.id, fb);
        if (fb.title) fetchedMap.set(fb.title, fb);
      });

      // Merge Logic:
      // 1. Start with fetched blogs
      // 2. Add static blogs that aren't already in the fetched list
      const mergedBlogs = [...fetchedBlogs];
      
      BLOG_SUMMARIES.forEach(staticBlog => {
        if (!fetchedMap.has(staticBlog.id) && !fetchedMap.has(staticBlog.title)) {
          mergedBlogs.push(staticBlog);
        }
      });

      console.log(`✅ [Blog.tsx] Total blogs after merge: ${mergedBlogs.length}`);
      setBlogs(mergedBlogs);

    } catch (error) {
      console.error('❌ [Blog.tsx] Error fetching blogs:', error);
      // Fallback: stay with static BLOGS (already set as initial state)
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-20">
      <SEO
        title="Blog | LasakEdu Institute – Career & Technical Insights"
        description="Read expert blogs from LasakEdu Institute on IT, Data Analytics, Mechanical, Civil engineering careers, internships and job trends."
        keywords="
  education blogs,
  training institute blog,
  data analytics blog,
  IT career blog,
  engineering career guidance
  "
        url="https://lasakedu.in/blog"
      />

      {/* Hero */}
      <div className="bg-white py-24 px-4 text-center border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-black font-tech mb-4 text-slate-900">Learning Insights</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Perfect for articles about skill development and industry trends.
          </p>
        </motion.div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-16">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, i) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 40px -10px rgba(59,130,246,0.18)",
                  }}
                  className="
            bg-white
            rounded-2xl
            overflow-hidden
            shadow-lg
            border border-slate-200
            flex flex-col
            h-full
            cursor-pointer
            hover:ring-2 hover:ring-blue-400/30
            transition-all
          "
                >
                  {/* Image */}
                  <div className="relative bg-slate-200 h-64 overflow-hidden">
                    <img
                      src={
                        post.image && normalizeImagePath(post.image)
                          ? normalizeImagePath(post.image)
                          : normalizeImagePath(getTopicFallbackImage(post.title, post.category))
                      }
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = '1';
                          target.src = normalizeImagePath(getTopicFallbackImage(post.title, post.category));
                        } else if (!target.dataset.fallback2) {
                          // Last-resort: generic Unsplash image
                          target.dataset.fallback2 = '1';
                          target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60';
                        }
                      }}
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-md">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-600 mb-4 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> Admin
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Read Article (visual only) */}
                    <div className="mt-6 text-sm font-bold text-blue-600 flex items-center gap-1">
                      Read Article <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
