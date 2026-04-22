
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, TrendingUp, ArrowUpRight, Video as VideoIcon, PlaySquare as VideoText } from 'lucide-react';
import { COURSES } from '../../constants/courseDetails';
import { BLOGS } from '../../constants/blogDetails';
import { TESTIMONIALS } from '../../constants/testimonials';
import { useUserRole } from '../../hooks/useUserRole';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-green-500 flex items-center font-medium">
                <ArrowUpRight size={16} /> {trend}
            </span>
            <span className="text-gray-400">vs last month</span>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const { canEdit } = useUserRole();
    const [stats, setStats] = React.useState([
        {
            title: 'Total Courses',
            value: 0,
            icon: BookOpen,
            color: 'bg-blue-500',
            trend: '+0%'
        },
        {
            title: 'Blog Posts',
            value: 0,
            icon: FileText,
            color: 'bg-orange-500',
            trend: '+0 new'
        },
        {
            title: 'Our Achievers',
            value: 0,
            icon: Users,
            color: 'bg-emerald-500',
            trend: '+0'
        },
        {
            title: 'Student Videos',
            value: 0,
            icon: TrendingUp,
            color: 'bg-pink-500',
            trend: '+0'
        },
        {
            title: 'YouTube Feed',
            value: 0,
            icon: VideoText,
            color: 'bg-red-500',
            trend: '+0'
        },
    ]);

    const [recentEnquiries, setRecentEnquiries] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { getFirestoreDb } = await import('../../lib/firebase');
                const { collection, query, orderBy, limit, getDocs, getCountFromServer } = await import('firebase/firestore');
                const db = await getFirestoreDb();

                // Fetch stats using count aggregation
                const courseCount = (await getCountFromServer(collection(db, 'courses'))).data().count;
                const blogCount = (await getCountFromServer(collection(db, 'blogs'))).data().count;
                const testimonialCount = (await getCountFromServer(collection(db, 'testimonials'))).data().count;
                const videoCount = (await getCountFromServer(collection(db, 'video_testimonials'))).data().count;
                const ytCount = (await getCountFromServer(collection(db, 'youtube_videos'))).data().count;

                setStats(prev => [
                    { ...prev[0], value: courseCount || 0 },
                    { ...prev[1], value: blogCount || 0 },
                    { ...prev[2], value: testimonialCount || 0 },
                    { ...prev[3], value: videoCount || 0 },
                    { ...prev[4], value: ytCount || 0 }
                ]);

                // Fetch recent enquiries
                const enquiriesRef = collection(db, 'enquiries');
                const q = query(enquiriesRef, orderBy('created_at', 'desc'), limit(5));
                const querySnapshot = await getDocs(q);

                const enquiryData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setRecentEnquiries(enquiryData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, Admin</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Enquiries Table */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Recent Enquiries</h3>
                            <button
                                onClick={() => navigate('/admin/enquiries')}
                                className="text-blue-600 text-sm font-bold hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentEnquiries.length === 0 ? (
                                <p className="text-gray-400 text-center py-8 italic font-medium">No recent enquiries</p>
                            ) : (
                                recentEnquiries.map((enquiry) => (
                                    <div
                                        key={enquiry.id}
                                        className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                                        onClick={() => navigate('/admin/enquiries')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                {enquiry.full_name?.charAt(0) || 'E'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 flex items-center gap-2">
                                                    {enquiry.full_name}
                                                    {!enquiry.is_read && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                                                </p>
                                                <p className="text-xs text-gray-500">{enquiry.department} • {new Date(enquiry.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={18} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions - Only visible to Admins and Editors */}
                    {canEdit && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate('/admin/courses/new')}
                                    className="p-4 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-all text-left group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span>+ Add New Course</span>
                                        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                                <button
                                    onClick={() => navigate('/admin/blogs/new')}
                                    className="p-4 bg-purple-50 text-purple-600 rounded-xl font-medium hover:bg-purple-100 transition-all text-left group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span>+ Write Blog Post</span>
                                        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                                <button
                                    onClick={() => navigate('/admin/testimonials/new')}
                                    className="p-4 bg-orange-50 text-orange-600 rounded-xl font-medium hover:bg-orange-100 transition-all text-left group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span>+ Add Testimonial</span>
                                        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                                <button
                                    onClick={() => navigate('/admin/seo')}
                                    className="p-4 bg-green-50 text-green-600 rounded-xl font-medium hover:bg-green-100 transition-all text-left group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span>Manage SEO</span>
                                        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
