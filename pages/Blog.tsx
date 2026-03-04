import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BLOGS } from '../constants';
import { Calendar, User, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { normalizeImagePath } from '../lib/imageUtils';

const Blog = () => {
  const [blogs, setBlogs] = useState(BLOGS); // Initialize with fallback data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    console.log('🔍 [Blog.tsx] Starting to fetch blogs from Firestore...');
    setLoading(true);
    try {
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc')); // Assuming createdAt instead of created_at
      const querySnapshot = await getDocs(q);

      const fetchedBlogs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      console.log('📊 [Blog.tsx] Query result:', {
        dataLength: fetchedBlogs.length,
        firstBlog: fetchedBlogs[0]?.title
      });

      if (fetchedBlogs.length > 0) {
        // Merge with static data
        const mergedBlogs = fetchedBlogs.map(fetched => {
          const staticBlog = BLOGS.find(b => b.id === fetched.id || b.title === fetched.title);
          if (!staticBlog) return fetched;

          return {
            ...staticBlog,
            ...fetched,
            image: fetched.image || staticBlog.image,
            excerpt: fetched.excerpt || staticBlog.excerpt,
            date: fetched.date || staticBlog.date,
            category: fetched.category || staticBlog.category
          };
        });
        console.log(`✅ [Blog.tsx] Setting ${mergedBlogs.length} merged blogs to state`);
        setBlogs(mergedBlogs);
      } else {
        console.log('⚠️  [Blog.tsx] No blogs returned, using fallback data');
      }
    } catch (error) {
      console.error('❌ [Blog.tsx] Error fetching blogs:', error);
      // Try again with 'created_at' if 'createdAt' fails or just use fallback
      try {
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedBlogs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];

        if (fetchedBlogs.length > 0) {
          const mergedBlogs = fetchedBlogs.map(fetched => {
            const staticBlog = BLOGS.find(b => b.id === fetched.id || b.title === fetched.title);
            if (!staticBlog) return fetched;

            return {
              ...staticBlog,
              ...fetched,
              image: fetched.image || staticBlog.image,
              excerpt: fetched.excerpt || staticBlog.excerpt,
              date: fetched.date || staticBlog.date,
              category: fetched.category || staticBlog.category
            };
          });
          setBlogs(mergedBlogs);
        }
      } catch (innerError) {
        console.error('❌ [Blog.tsx] Second attempt failed:', innerError);
      }
    } finally {
      console.log('🏁 [Blog.tsx] Setting loading to false');
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
                  <div className="relative bg-slate-100 h-64 overflow-hidden">
                    <img
                      src={normalizeImagePath(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(post.title)}`;
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
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> Admin
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

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
