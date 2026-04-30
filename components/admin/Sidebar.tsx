import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Image, Users, Award, Briefcase, MessageSquare, Settings, LogOut, Shield, Youtube, Menu, X, BookOpen, Layers, Phone, Info, Video, HelpCircle, FileCheck, Globe, PenTool, GraduationCap, Newspaper, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUserRole } from '../../hooks/useUserRole';
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        const { getFirebaseAuth } = await import('../../lib/firebase');
        const { signOut } = await import('firebase/auth');
        const auth = await getFirebaseAuth();
        await signOut(auth);
        navigate('/admin/login');
    };

    const isActive = (path: string) => {
        return location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));
    };

    const { isAdmin, isEditor, email } = useUserRole();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: <MessageSquare size={20} />, label: 'Enquiries', path: '/admin/enquiries' },
        { icon: <BookOpen size={20} />, label: 'Courses', path: '/admin/courses' },
        { icon: <Layers size={20} />, label: 'Course Categories', path: '/admin/categories' },
        { icon: <Briefcase size={20} />, label: 'Partners', path: '/admin/partners' },
        { icon: <Shield size={20} />, label: 'Accreditations', path: '/admin/accreditations' },
        { icon: <FileText size={20} />, label: 'Blogs', path: '/admin/blogs' },
        { icon: <Newspaper size={20} />, label: 'News Updates', path: '/admin/news' },
        { icon: <Award size={20} />, label: 'Testimonials', path: '/admin/testimonials' },
        { icon: <Video size={20} />, label: 'Video Testimonials', path: '/admin/video-testimonials' },
        { icon: <Image size={20} />, label: 'Hero Slides', path: '/admin/hero-slides' },
        { icon: <Youtube size={20} />, label: 'YouTube', path: '/admin/youtube' },
        { icon: <FileCheck size={20} />, label: 'Certificates', path: '/admin/certificates' },
        { icon: <Shield size={20} />, label: 'Cert. Verification Page', path: '/admin/cert-verification-content' },
        { icon: <Layers size={20} />, label: 'Workshops', path: '/admin/workshops' },
        { icon: <PenTool size={20} />, label: 'Features', path: '/admin/features' },
        { icon: <Layers size={20} />, label: 'Program Segments', path: '/admin/program-segments' },
        { icon: <Briefcase size={20} />, label: 'Learning Ecosystem', path: '/admin/learning-ecosystem' },
        { icon: <MessageSquare size={20} />, label: 'Popups', path: '/admin/popup' },
        { icon: <GraduationCap size={20} />, label: 'Scholarships', path: '/admin/scholarships' },
        { icon: <Tag size={20} />, label: 'Coupons', path: '/admin/coupons' },
        { icon: <Briefcase size={20} />, label: 'MOUs', path: '/admin/mous' },
        { icon: <Info size={20} />, label: 'About Content', path: '/admin/about-content' },
        { icon: <HelpCircle size={20} />, label: 'Policy Content', path: '/admin/policy-content' },
        { icon: <Phone size={20} />, label: 'Contact & Social Links', path: '/admin/contact-info' },
        { icon: <Globe size={20} />, label: 'SEO Manager', path: '/admin/seo' },
        { icon: <Menu size={20} />, label: 'Menu Management', path: '/admin/settings' },
        { icon: <Settings size={20} />, label: 'Site Settings', path: '/admin/settings' },
        { icon: <Award size={20} />, label: 'Passports', path: '/admin/passports' },
        { icon: <Users size={20} />, label: 'Users', path: '/admin/users', adminOnly: true },
        { icon: <Shield size={20} />, label: 'Setup', path: '/admin/setup' },
    ];

    return (
        <>
            {/* Toggle Button — always visible, sticks to sidebar edge */}
            <button
                onClick={toggleSidebar}
                aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
                className={`fixed top-5 z-50 flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 ${
                    isOpen ? 'left-[244px]' : 'left-3'
                }`}
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className="fixed md:static inset-y-0 left-0 bg-white border-r border-gray-200 z-40 overflow-hidden flex flex-col h-screen shadow-xl md:shadow-none flex-shrink-0"
            >
                {/* Logo Area */}
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">L</div>
                    <span className="font-bold text-xl text-gray-800 whitespace-nowrap">Admin Panel</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 flex-1 overflow-y-auto p-4">
                    {menuItems.map((item) => {
                        if ((item as any).adminOnly && !isAdmin) return null;

                        return (
                            <button
                                key={item.path + item.label}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                                    }`}
                            >
                                <div className={`flex-shrink-0 transition-transform duration-200 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </div>
                                <span className="font-medium whitespace-nowrap">{item.label}</span>
                                {isActive(item.path) && (
                                    <div
                                        className="ml-auto w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{isAdmin ? 'Administrator' : isEditor ? 'Editor' : 'Viewer'}</h4>
                            <p className="text-xs text-gray-500 truncate">{email || 'Loading...'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
