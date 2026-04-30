import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { BLOGS } from '../constants/blogDetails';
import SEO from '../components/SEO';
import { normalizeImagePath } from '../lib/imageUtils';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState(BLOGS.find((b) => b.id === id) || null);
  const [loading, setLoading] = useState(!BLOGS.find((b) => b.id === id));

  

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchBlog = async (blogId: string) => {
    try {
      const { getFirestoreDb } = await import('../lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      const db = await getFirestoreDb();
      const blogRef = doc(db, 'blogs', blogId);
      const blogDoc = await getDoc(blogRef);

      if (blogDoc.exists()) {
        const data = { id: blogDoc.id, ...blogDoc.data() } as any;
        const staticBlog = BLOGS.find(b => b.id === data.id || b.title === data.title);

        if (staticBlog) {
          setPost({
            ...staticBlog,
            ...data,
            image: data.image || staticBlog.image,
            content: data.content || staticBlog.content,
            relatedImages: (data.relatedImages && data.relatedImages.length > 0) ? data.relatedImages : staticBlog.relatedImages
          });
        } else {
          setPost(data);
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <SEO
          title="LasakEdu Blog – Detailed Guide & Insights"
          description="Read complete blog details including insights on IT, Mechanical, Civil, Data Analytics, career tips, and professional growth."
          keywords="blog details, LasakEdu blog, tech insights, career tips"
        />
        <div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 z-50"
        />
        <h2 className="text-3xl font-black text-slate-900 mb-4">Article Not Found</h2>
        <p className="text-slate-500 mb-8">
          The blog post you are looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/blog"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO
        title={`${post.title} | LASAK EDU Blog`}
        description={post.excerpt}
        image={post.image}
        keywords={`${post.category}, LASAK EDU Blog, Tech Article, Career Tips`}
      />

      <div className="relative h-[50vh] w-full overflow-hidden">
        {post.image && (
          <img
            src={normalizeImagePath(post.image)}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/1200x800/1e3a8a/ffffff?text=${encodeURIComponent(post.title)}`;
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-slate-900/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-blue-500 z-10">
          <div className="container mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 font-semibold"
            >
              <ArrowLeft size={20} /> Back to Articles
            </Link>

            <span className="inline-block bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 !text-white">
              {post.category}
            </span>

            <h1
              className="text-3xl md:text-5xl font-black font-tech leading-tight mb-4"
            >
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-slate-200">
              <span className="flex items-center gap-2">
                <Calendar size={16} /> {post.date}
              </span>
              <span className="flex items-center gap-2">
                <User size={16} /> By Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="container mx-auto px-4 py-16 max-w-4xl relative">

        {/* Related Images for the blog */}
        {post.relatedImages && post.relatedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {post.relatedImages.map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl shadow-lg bg-slate-50">
                <img
                  src={normalizeImagePath(img)}
                  alt={`Related ${idx + 1}`}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1e3a8a/ffffff?text=Image+${idx + 1}`;
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12"
        >
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold
              prose-headings:text-slate-900
              prose-p:text-slate-600
              prose-img:rounded-xl
              prose-img:shadow-lg
              prose-li:text-slate-600"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => {
                  return (
                    <div className="my-12 p-6 md:p-8 bg-white border-l-4 border-blue-600 rounded-2xl shadow-sm">
                      <h2 className="text-2xl md:text-3xl font-black font-tech text-slate-900 mb-4">
                        {children}
                      </h2>
                    </div>
                  );
                },
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                    {children}
                  </ul>
                ),
                img: ({ src, alt }) => (
                  <div className="my-8 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={normalizeImagePath(src) || ''}
                      alt={alt || ''}
                      loading="lazy"
                      fetchPriority="low"
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/800x600/f1f5f9/64748b?text=${encodeURIComponent(alt || 'Image')}`;
                      }}
                    />
                    {alt && <p className="text-center text-sm text-slate-500 py-3">{alt}</p>}
                  </div>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center gap-3">
          <Tag size={18} className="text-slate-600" />
          <span className="text-slate-600 text-sm">
            Education, Technology, Career Growth
          </span>
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;
