import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BLOGS } from "../constants";
import { Calendar, User, ArrowRight } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { normalizeImagePath } from "../lib/imageUtils";

const BlogAutoScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState(BLOGS); // Initialize with fallback
  const [loading, setLoading] = useState(true);

  // Fetch blogs from Firestore
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const fetchedBlogs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBlogs(fetchedBlogs as any);
        }
      } catch (error) {
        console.error('Error fetching blogs for home page:', error);
        // Keep using fallback BLOGS data
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Auto-scroll effect — runs whenever blogs change (both on load and after fetch)
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let scrollSpeed = 0.8;
    let position = 0;
    let rafId: number;

    const scroll = () => {
      position += scrollSpeed;
      slider.scrollLeft = position;

      if (position >= slider.scrollWidth - slider.clientWidth) {
        position = 0;
      }

      rafId = requestAnimationFrame(scroll);
    };

    rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [blogs]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-black font-tech text-slate-900">
            Latest From Our Blog
          </h2>
          <p className="text-slate-500 mt-3 text-lg">
            Explore insights, workshops, events, and career guidance from LASAK EDU.
          </p>
        </div>

        {/* Small spinner shown above content while fetching — does NOT hide content */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Auto-scroll container — always visible, shows fallback data instantly */}
        <div ref={scrollRef} className="overflow-hidden">
          <div className="flex gap-8 min-w-max">
            {blogs.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="w-[330px] flex-shrink-0 bg-white rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 w-full overflow-hidden rounded-t-2xl bg-white">
                  <img
                    src={normalizeImagePath(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(post.title)}`;
                    }}
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold uppercase mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {post.date || 'Soon'}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} /> Admin
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                    Read Article <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BlogAutoScroll;
