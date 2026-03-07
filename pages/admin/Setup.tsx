
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, writeBatch, serverTimestamp, getDocs, deleteDoc, setDoc, addDoc } from 'firebase/firestore';
import { COURSES, BLOGS, TESTIMONIALS, PARTNERS, DEMO_VIDEOS, COMPANY_LOGOS } from '../../constants';

// Hero Slides Data (from Home.tsx)
const HERO_SLIDES = [
    {
        id: 1,
        image: "/img/websitebanner1.webp",
        title: "Master Practical Skills",
        subtitle: "Hands-on training with 100% Placement Support",
        link: "/courses",
        cta: "Start Learning"
    },
    {
        id: 2,
        image: "/img/websitebanner2.webp",
        title: "Learn from Experts",
        subtitle: "Industry-aligned training guided by experienced professionals",
        link: "/about",
        cta: "View Accreditations"
    },
    {
        id: 3,
        image: "/img/websitebanner3.webp",
        title: "Transform Your Career",
        subtitle: "With Industry-Driven Courses in Engineering & IT",
        link: "/placements",
        cta: "See Success Stories"
    },
    {
        id: 4,
        image: "/img/banner-6.webp",
        title: "Internship Program",
        subtitle: "Work on Live Projects with LASAK Technologies Pvt Ltd",
        link: "https://docs.google.com/forms/d/e/1FAIpQLScL1mo2i4LF9aineii9xi9V-CVntO8xSbk1Qi_5oU_5mpOnvg/viewform?usp=pp_url",
        cta: "Apply for Internship"
    },
    {
        id: 5,
        image: "/img/websitebanner4.webp",
        title: "College Workshops",
        subtitle: "Conduct Interactive Sessions & Workshops in Colleges with LASAK Technologies Pvt Ltd",
        link: "/contact",
        cta: "Apply to Conduct Workshop"
    }
];

const Setup = () => {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    const migrateData = async () => {
        setLoading(true);
        setStatus('Starting migration...');

        // Helper to remove duplicates
        const uniqueBy = (arr: any[], key: string) => {
            return [
                ...new Map(
                    arr.map((item) => [item[key], item])
                ).values(),
            ];
        };

        // Guard: must be logged in
        if (!auth.currentUser) {
            setStatus('Error: You must be logged in as admin to run migration.');
            setLoading(false);
            return;
        }

        try {
            // Migrate Courses
            setStatus('Migrating Courses...');
            const coursesData = COURSES.map(c => ({
                title: c.title || '',
                category: c.category || '',
                price: c.price || '',
                old_price: c.oldPrice || '',
                duration: c.duration || '',
                image: c.image || '',
                description: c.description || '',
                modules: c.modules || [],
                companies: c.companies || [],
                tools: c.tools || [],
                show_on_home: c.show_on_home || false,
                slug: c.slug || c.title?.toLowerCase().replace(/\s+/g, '-') || '',
                created_at: serverTimestamp()
            }));

            const uniqueCourses = uniqueBy(coursesData, 'title');
            for (const course of uniqueCourses) {
                const id = course.slug || course.title.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'courses', id), course);
            }

            // Migrate Blogs
            setStatus('Migrating Blogs...');
            const blogsData = BLOGS.map(b => ({
                title: b.title,
                excerpt: b.excerpt,
                content: b.content,
                date: b.date,
                image: b.image,
                category: b.category,
                created_at: serverTimestamp()
            }));
            const uniqueBlogs = uniqueBy(blogsData, 'title');
            for (const blog of uniqueBlogs) {
                const id = blog.title.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'blogs', id), blog);
            }

            // Add new news entries
            const newNewsItems = [
                {
                    title: "New Data Analytics Course with AI – Launching with a Special Offer!",
                    excerpt: "LasakEdu is excited to announce our cutting-edge Data Analytics course powered by AI tools! Enroll now and take advantage of our limited-time introductory offer.",
                    content: "LasakEdu is excited to announce our cutting-edge Data Analytics course powered by AI tools! Enroll now and take advantage of our limited-time introductory offer. Learn data visualization, machine learning basics, and AI-driven analytics from industry experts.",
                    date: "Mar 3, 2026",
                    category: "New Course",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
                    created_at: serverTimestamp()
                },
                {
                    title: "Workshops Now Available Online – Learn From Anywhere!",
                    excerpt: "Great news for our students across India! LasakEdu's popular workshops are now available in an online format. Join live interactive sessions, get mentorship, and receive your certification.",
                    content: "Great news for our students across India! LasakEdu's popular workshops are now available in an online format. Join live interactive sessions, get mentorship, and receive your certification — all from the comfort of your home.",
                    date: "Mar 3, 2026",
                    category: "Workshops",
                    image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&auto=format&fit=crop&q=60",
                    created_at: serverTimestamp()
                }
            ];
            for (const item of newNewsItems) {
                const id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 60);
                await setDoc(doc(db, 'blogs', id), item);
            }

            // Migrate Testimonials
            setStatus('Migrating Testimonials...');
            const testimonialsData = TESTIMONIALS.map(t => ({
                name: t.name,
                role: `${t.role} @ ${t.company}${t.package ? ` (${t.package})` : ''}`,
                content: t.quote,
                image: t.image,
                rating: 5,
                created_at: serverTimestamp()
            }));
            const uniqueTestimonials = uniqueBy(testimonialsData, 'name');
            for (const testimonial of uniqueTestimonials) {
                const id = testimonial.name.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'testimonials', id), testimonial);
            }

            // Migrate Partners
            setStatus('Migrating Partners...');

            // 1. Training Partners (from PARTNERS)
            const trainingPartners = PARTNERS.map((p) => ({
                name: p.alt,
                logo: p.src,
                type: 'training', // Explicitly set type
                created_at: serverTimestamp()
            }));

            // 2. Placement Partners (from COMPANY_LOGOS - URLs only)
            const placementPartners = COMPANY_LOGOS.map((url, index) => ({
                name: `Company ${index + 1}`, // Generate a name since we only have URL
                logo: url,
                type: 'placement',
                created_at: serverTimestamp()
            }));

            // Deduplicate Partners by logo
            const allPartners = [...trainingPartners, ...placementPartners];
            const uniquePartners = uniqueBy(allPartners, 'logo');

            for (const partner of uniquePartners) {
                const id = partner.logo.split('/').pop()?.split('.')[0] || `partner-${Math.random()}`;
                await setDoc(doc(db, 'partners', id), partner);
            }

            // Migrate Hero Slides
            setStatus('Migrating Hero Slides...');
            const heroData = HERO_SLIDES.map((slide, index) => ({
                order_num: index,
                image: slide.image,
                title: slide.title,
                subtitle: slide.subtitle,
                cta_text: slide.cta,
                cta_link: slide.link,
                active: true,
                created_at: serverTimestamp()
            }));
            const uniqueHero = uniqueBy(heroData, 'title');
            for (const slide of uniqueHero) {
                const id = `slide-${slide.order_num}`;
                await setDoc(doc(db, 'hero_slides', id), slide);
            }

            // Migrate Contact Info
            setStatus('Migrating Contact Info...');
            const contactData = [
                { type: 'address', label: 'Main Office', value: '11A, STV Nagar, Peelamedu, Nava India Signal, Coimbatore - 641004', icon: 'MapPin', order_num: 1, created_at: serverTimestamp() },
                { type: 'phone', label: 'Admissions', value: '+91 74187 32525', icon: 'Phone', order_num: 2, created_at: serverTimestamp() },
                { type: 'email', label: 'Support', value: 'info@lasakedu.in', icon: 'Mail', order_num: 3, created_at: serverTimestamp() }
            ];
            for (const contact of contactData) {
                const id = contact.type;
                await setDoc(doc(db, 'contact_info', id), contact);
            }

            // Migrate About Content
            setStatus('Migrating About Content...');
            const aboutData = [
                {
                    section: 'mission',
                    content: {
                        title: 'Our Mission',
                        description: 'To empower individuals with practical, industry-aligned skills that bridge the gap between education and employment.'
                    },
                    order_num: 1,
                    created_at: serverTimestamp()
                },
                {
                    section: 'vision',
                    content: {
                        title: 'Our Vision',
                        description: 'To be the leading Skill Development Center globally, recognized for excellence in technical training and career transformation.'
                    },
                    order_num: 2,
                    created_at: serverTimestamp()
                }
            ];
            for (const about of aboutData) {
                await setDoc(doc(db, 'about_content', about.section), about);
            }

            // Migrate Core Values (New Addition)
            const coreValuesData = {
                section: 'core_values',
                content: {
                    title: 'Our Core Values',
                    items: [
                        { icon: 'CheckCircle', title: 'Quality', text: 'We never compromise on training quality.' },
                        { icon: 'Clock', title: 'Discipline', text: 'We value time and professionalism.' },
                        { icon: 'Heart', title: 'Support', text: 'We support students even after courses.' },
                        { icon: 'Users', title: 'Ethics', text: 'Transparent and honest guidance.' }
                    ]
                },
                order_num: 3,
                created_at: serverTimestamp()
            };
            await setDoc(doc(db, 'about_content', coreValuesData.section), coreValuesData);

            // Migrate Why Choose Us
            const whyChooseUsData = {
                section: 'why_choose_us',
                content: {
                    title: 'Why Choose Us?',
                    subtitle: 'Simple reasons to start your learning journey with us.',
                    items: [
                        { title: 'Practical Learning', desc: 'We focus on hands-on training, not just theory.' },
                        { title: 'Experienced Faculty', desc: 'Learn from trainers who have worked in the industry.' },
                        { title: 'Placement Support', desc: 'We help you prepare for interviews and find jobs.' },
                        { title: 'Affordable Fees', desc: 'Quality education at reasonable prices for everyone.' },
                        { title: 'Updated Syllabus', desc: 'We teach what companies are looking for today.' },
                        { title: 'Personal Attention', desc: 'Small batch sizes to ensure every student learns well.' }
                    ]
                },
                order_num: 4,
                created_at: serverTimestamp()
            };
            await setDoc(doc(db, 'about_content', whyChooseUsData.section), whyChooseUsData);

            // Migrate Site Settings
            setStatus('Migrating Site Settings...');
            const settingsData = [
                {
                    key: 'nav_menu',
                    category: 'navigation',
                    value: {
                        items: [
                            { label: 'Home', path: '/' },
                            { label: 'Workshops', path: '/programs' },
                            {
                                label: 'Courses',
                                path: '/courses',
                                submenu: [
                                    { label: 'CSE / IT', path: '/courses/IT' },
                                    { label: 'Mechanical', path: '/courses/Mechanical' },
                                    { label: 'Civil', path: '/courses/Civil' },
                                    { label: 'Arts', path: '/courses/Arts' },
                                    { label: 'Kids', path: '/courses/Kids' },
                                ]
                            },
                            { label: 'Overseas Education', path: 'https://lasak.edumilestones.com/', external: true },
                            { label: 'About', path: '/about' },
                            { label: 'Contact', path: '/contact' }
                        ]
                    },
                    created_at: serverTimestamp()
                },
                {
                    key: 'footer_text',
                    category: 'footer',
                    value: {
                        copyright: `© ${new Date().getFullYear()} LASAK EDU. All rights reserved.`,
                        tagline: 'Empowering careers through quality education'
                    },
                    created_at: serverTimestamp()
                }
            ];
            for (const setting of settingsData) {
                await setDoc(doc(db, 'site_settings', setting.key), setting);
            }

            // Migrate Video Testimonials
            setStatus('Migrating Video Testimonials...');
            const videoRawData = [
                { video_url: "https://youtube.com/shorts/1fi4stfhFxc?feature=share", order_num: 1, created_at: serverTimestamp() },
                { video_url: "https://youtube.com/shorts/R9YEUvcamTY?feature=share", order_num: 2, created_at: serverTimestamp() },
                { video_url: "https://youtube.com/shorts/I3c4t4_0QYE?feature=share", order_num: 3, created_at: serverTimestamp() },
                { video_url: "https://youtube.com/shorts/4b79hKynNl0?feature=share", order_num: 4, created_at: serverTimestamp() },
                { video_url: "https://youtube.com/shorts/QYwDl90Sgbw?feature=share", order_num: 5, created_at: serverTimestamp() },
                { video_url: "https://youtube.com/shorts/Ieo5f-hb3M8?feature=share", order_num: 6, created_at: serverTimestamp() },
                { video_url: "https://youtube.com/shorts/6PHA749J-ec?feature=share", order_num: 7, created_at: serverTimestamp() },
                { video_url: "https://youtube.com/shorts/Fbw1g-TGemI?feature=share", order_num: 8, created_at: serverTimestamp() },
                { video_url: "https://youtube.com/shorts/kwIZNS4KaDY?feature=share", order_num: 9, created_at: serverTimestamp() },
            ];
            for (const video of videoRawData) {
                const id = video.video_url.split('/').pop()?.split('.')[0] || `video-${Math.random()}`;
                await setDoc(doc(db, 'video_testimonials', id), video);
            }

            // Migrate Youtube Videos
            setStatus('Migrating YouTube Feed...');
            const ytData = DEMO_VIDEOS.map((v, index) => ({
                video_id: v.id,
                order_num: index,
                active: true,
                created_at: serverTimestamp()
            }));
            for (const yt of ytData) {
                await setDoc(doc(db, 'youtube_videos', yt.video_id), yt);
            }

            // Migrate Certificates
            setStatus('Migrating Certificates...');
            const { CERTIFICATES } = await import('../../constants');
            for (const c of CERTIFICATES) {
                const certData = {
                    cert_id: c.certId,
                    student_name: c.studentName,
                    course_name: c.courseName,
                    duration: c.duration,
                    status: c.status,
                    completion_date: c.completionDate || new Date().toISOString().split('T')[0],
                    created_at: serverTimestamp()
                };
                await setDoc(doc(db, 'certificates', c.certId.replace(/\//g, '-')), certData);
            }

            // Migrate Certificate Verification Page Content
            setStatus('Migrating Cert Verification Content...');

            // How it Works
            const howItWorksData = [
                { step_number: 1, icon_name: 'Search', icon_color: 'blue-600', title: 'Find Your ID', description: 'Locate the unique Certificate Identification number at the bottom of your certificate.', order_num: 1, created_at: serverTimestamp() },
                { step_number: 2, icon_name: 'FileText', icon_color: 'purple-600', title: 'Enter Details', description: 'Type the ID carefully into the secure search bar above and click \'Verify Now\'.', order_num: 2, created_at: serverTimestamp() },
                { step_number: 3, icon_name: 'ShieldCheck', icon_color: 'green-600', title: 'Instant Validation', description: 'Our system matches your ID against our secure encrypted database for instant results.', order_num: 3, created_at: serverTimestamp() }
            ];
            for (const step of howItWorksData) {
                await setDoc(doc(db, 'cert_how_it_works', `step-${step.step_number}`), step);
            }

            // Credentials Section
            const credentialsData = {
                heading: 'Locate Your Credentials',
                description: 'Your official LasakEdu certificate contains a unique identification number. Use this number for verification during job applications or higher education processing.',
                bullet_point_1: 'Tamper-proof digital records',
                bullet_point_2: 'Recognized by top placement partners',
                bullet_point_3: 'Instant cloud-based validation',
                image_url: '/img/certificate-mockup.png',
                updated_at: serverTimestamp()
            };
            await setDoc(doc(db, 'cert_credentials_section', 'default'), credentialsData);

            // FAQs
            const faqData = [
                { question: 'Where can I find my Certificate ID?', answer: 'The ID is located at the bottom-right corner of your physical or digital certificate issued by LasakEdu.', order_num: 1, created_at: serverTimestamp() },
                { question: 'What should I do if my ID is not found?', answer: 'Please ensure you have entered the ID exactly as it appears. If it still doesn\'t show up, contact our support team at info@lasakedu.in.', order_num: 2, created_at: serverTimestamp() },
                { question: 'Is this verification valid for life?', answer: 'Yes, once a certificate is issued and recorded in our database, it remains available for verification indefinitely.', order_num: 3, created_at: serverTimestamp() },
                { question: 'Can employers verify multiple certificates at once?', answer: 'Employers can use this portal to verify certificates individually. For bulk verification, HR teams can contact us directly.', order_num: 4, created_at: serverTimestamp() }
            ];
            for (const faq of faqData) {
                const id = faq.question.toLowerCase().replace(/[?]/g, '').replace(/\s+/g, '-');
                await setDoc(doc(db, 'cert_faqs', id), faq);
            }

            // Support Section
            const supportData = {
                heading: 'Still Having Trouble?',
                description: 'Our academic support team is here to help you with any certificate-related issues or verification concerns.',
                button_1_text: 'Contact Support',
                button_1_link: 'mailto:info@lasakedu.in',
                button_2_text: 'Visit Office',
                button_2_link: '/contact',
                updated_at: serverTimestamp()
            };
            await setDoc(doc(db, 'cert_support_section', 'default'), supportData);

            // Migrate Workshops
            setStatus('Migrating Workshops...');
            const workshopsData = [
                {
                    title: 'Full Stack Development Workshop',
                    description: 'Master MERN stack with hands-on projects and industry expert guidance.',
                    type: 'live',
                    badge_text: 'LIVE',
                    icon: 'Zap',
                    button_text: 'Register Now',
                    tags: ['MERN', 'React', 'Node.js', 'Placement'],
                    active: true,
                    order_num: 1,
                    created_at: serverTimestamp()
                },
                {
                    title: 'SolidWorks Masterclass',
                    description: 'Advance your mechanical design skills with our comprehensive SolidWorks training.',
                    type: 'offline',
                    badge_text: 'Offline',
                    icon: 'MapPin',
                    button_text: 'Join Workshop',
                    tags: ['CAD', 'SolidWorks', 'Mechanical'],
                    active: true,
                    order_num: 2,
                    created_at: serverTimestamp()
                },
                {
                    title: 'Special Placement Offer',
                    description: 'Enroll in any 3nd year program and get up to 40% discount on placement training.',
                    type: 'offer',
                    badge_text: 'OFFER',
                    icon: 'Percent',
                    button_text: 'Claim Offer',
                    tags: ['Discount', 'Placement', 'Offers'],
                    active: true,
                    order_num: 3,
                    created_at: serverTimestamp()
                }
            ];
            for (const ws of workshopsData) {
                const id = ws.title.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'workshops', id), ws);
            }

            // Migrate Accreditations
            setStatus('Migrating Accreditations...');
            const { ACCREDITATIONS } = await import('../../constants');
            for (const acc of ACCREDITATIONS) {
                const id = acc.alt.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'accreditations', id), {
                    alt: acc.alt,
                    src: acc.src,
                    order_num: ACCREDITATIONS.indexOf(acc),
                    created_at: serverTimestamp()
                });
            }

            // Migrate Categories
            setStatus('Migrating Categories...');
            const { CATEGORIES } = await import('../../constants');
            for (const cat of CATEGORIES) {
                await setDoc(doc(db, 'categories', cat.id), {
                    name: cat.name,
                    id: cat.id,
                    order_num: CATEGORIES.indexOf(cat),
                    created_at: serverTimestamp()
                });
            }

            // Migrate Policy Contents
            setStatus('Migrating Policy Contents...');
            const policyData = [
                {
                    key: 'terms_conditions_content',
                    label: 'Terms & Conditions',
                    content: `<h2>1. Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h3>2. Provision of Services</h3><p>Lasakedu is entitled to at any time modify, improve or discontinue any of its services at its sole discretion and without notice to you.</p><h3>3. Proprietary Rights</h3><p>You acknowledge and agree that Lasakedu may contain proprietary and confidential information including trademarks, service marks and patents protected by intellectual property laws and international intellectual property treaties.</p>`
                },
                {
                    key: 'refund_policy_content',
                    label: 'Refund Policy',
                    content: `<h2>Refund Policy</h2><p>At Lasakedu, we strive to ensure our students are satisfied with our training programs. However, please note our policy regarding refunds:</p><ul><li>Fees once paid are non-refundable under any circumstances.</li><li>Course transfers may be allowed at the discretion of the management.</li><li>In case of batch cancellation by the institute, a full refund will be processed within 15 working days.</li></ul>`
                },
                {
                    key: 'privacy_policy_content',
                    label: 'Privacy Policy',
                    content: `<h3>1. Information We Collect</h3><p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services.</p><ul><li><strong>Personal Data:</strong> Name, email address, phone number, and mailing address.</li><li><strong>Payment Data:</strong> Handled securely by Razorpay.</li></ul><h3>2. How We Use Your Information</h3><p>To facilitate account creation, manage orders, and deliver services.</p>`
                },
                {
                    key: 'cancellation_policy_content',
                    label: 'Cancellation Policy',
                    content: `<h2>Cancellation Policy</h2><p>Our cancellation policy is designed to be fair to both the students and the institute:</p><ul><li>Enrollment can be cancelled within 24 hours of payment for a partial refund.</li><li>No cancellations are accepted after the course materials have been accessed.</li><li>The institute reserves the right to cancel or reschedule batches.</li></ul>`
                }
            ];
            for (const policy of policyData) {
                await setDoc(doc(db, 'site_settings', policy.key), {
                    key: policy.key,
                    value: { content: policy.content },
                    category: 'policy_content',
                    updated_at: serverTimestamp()
                });
            }

            // Expand About Migration
            setStatus('Expanding About Migration...');
            const expandedAbout = [
                {
                    section: 'intro_hero',
                    content: {
                        title: 'About LASAK EDU',
                        description: "LASAK EDU is a professional training institute located in Coimbatore. We are dedicated to providing high-quality technical education in IT, Mechanical, Civil Engineering, and Arts.\n\nOur purpose is simple: to help students and job seekers gain practical skills needed to get hired. We focus on doing, not just reading — treating students like professionals from day one."
                    },
                    order_num: 0,
                    created_at: serverTimestamp()
                },
                {
                    section: 'mission',
                    content: {
                        title: 'Our Mission',
                        description: 'To provide affordable and effective skill training that enables students to start successful careers. We aim to make every student job-ready by building confidence and technical expertise.',
                        image: '/img/about1.webp'
                    },
                    order_num: 1,
                    created_at: serverTimestamp()
                },
                {
                    section: 'vision',
                    content: {
                        title: 'Our Vision',
                        description: 'To be the most trusted educational institute in Coimbatore, producing skilled professionals who contribute positively to society and industry.',
                        image: '/img/about4.webp'
                    },
                    order_num: 2,
                    created_at: serverTimestamp()
                },
                {
                    section: 'journey',
                    content: {
                        title: 'Our Journey',
                        description: "LASAK EDU (Lasak Overseas Education, and Lasak Technologies) was founded in 2019 by Sharan Gautham Sakthivel, BE, MBA. With over five years of expertise in both education and industry, we specialize in delivering high-quality training in IT and Mechanical Engineering domains.\n\nAt LASAK EDU, we aim to empower students with career-oriented courses and industry-relevant training programs. Our programs are designed to equip learners with the skills and confidence needed to explore opportunities, achieve their career goals, and become valuable resources in the global workforce.",
                        image: '/img/journyabout.webp'
                    },
                    order_num: 5,
                    created_at: serverTimestamp()
                },
                {
                    section: 'teaching_approach',
                    content: {
                        title: 'Our Teaching Approach',
                        description: 'We believe that the best way to learn is by doing.',
                        items: [
                            '80% Practical sessions in labs.',
                            'Real-world project assignments.',
                            'Regular feedback and assessments.',
                            'Workshops by industry experts.'
                        ],
                        image: '/img/about2.webp'
                    },
                    order_num: 6,
                    created_at: serverTimestamp()
                },
                {
                    section: 'infrastructure',
                    content: {
                        title: 'Our Infrastructure',
                        description: 'We provide a comfortable and professional environment for learning.',
                        items: [
                            'Modern Computer Labs with high-speed internet.',
                            'Installed with latest software (Solidworks, Python, etc).',
                            'Clean and spacious classrooms with projectors.',
                            'Discussion rooms for group study.'
                        ],
                        image: '/img/about-1.webp'
                    },
                    order_num: 7,
                    created_at: serverTimestamp()
                },
                {
                    section: 'cta',
                    content: {
                        title: 'Ready to Start Learning?',
                        description: 'Join us to upgrade your skills and build a better future. Visit our institute or contact us for more details.',
                        button_1_text: 'Explore Courses',
                        button_1_link: '/courses',
                        button_2_text: 'Contact Us',
                        button_2_link: '/contact'
                    },
                    order_num: 10,
                    created_at: serverTimestamp()
                }
            ];
            for (const item of expandedAbout) {
                await setDoc(doc(db, 'about_content', item.section), item);
            }

            setStatus('Migration Complete! All data is now in Firestore.');
        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const seedWorkshops = async () => {
        setLoading(true);
        setStatus('Seeding Workshops & Features...');
        try {
            // Seed Workshops
            setStatus('Seeding Workshops...');
            const workshopsData = [
                { title: 'Full Stack Development Workshop', description: 'Master MERN stack with hands-on projects and industry expert guidance.', type: 'live', badge_text: 'LIVE', icon: 'Zap', button_text: 'Register Now', tags: ['MERN', 'React', 'Node.js', 'Placement'], active: true, order_num: 1, created_at: serverTimestamp() },
                { title: 'SolidWorks Masterclass', description: 'Advance your mechanical design skills with our comprehensive SolidWorks training.', type: 'offline', badge_text: 'Offline', icon: 'MapPin', button_text: 'Join Workshop', tags: ['CAD', 'SolidWorks', 'Mechanical'], active: true, order_num: 2, created_at: serverTimestamp() },
                { title: 'Special Placement Offer', description: 'Enroll in any 3nd year program and get up to 40% discount on placement training.', type: 'offer', badge_text: 'OFFER', icon: 'Percent', button_text: 'Claim Offer', tags: ['Discount', 'Placement', 'Offers'], active: true, order_num: 3, created_at: serverTimestamp() }
            ];
            for (const ws of workshopsData) {
                const id = ws.title.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'workshops', id), ws);
            }

            // Seed Program Features
            setStatus('Seeding Program Features...');
            const programFeaturesData = [
                { title: 'Certified Training', description: 'Get certificates recognized by top MNCs and ISO standards.', icon: 'Award', color: 'red', order_num: 1, created_at: serverTimestamp() },
                { title: '100% Placement', description: 'Dedicated placement cell to help you land your dream job.', icon: 'Briefcase', color: 'blue', order_num: 2, created_at: serverTimestamp() },
                { title: 'Real-Time Projects', description: 'Build your portfolio with live industry projects and hands-on experience.', icon: 'Zap', color: 'yellow', order_num: 3, created_at: serverTimestamp() },
                { title: 'Expert Mentorship', description: 'Learn directly from industry professionals with years of experience.', icon: 'BookOpen', color: 'green', order_num: 4, created_at: serverTimestamp() }
            ];
            for (const feat of programFeaturesData) {
                const id = feat.title.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'program_features', id), feat);
            }

            setStatus('Workshops and Features seeded successfully!');
        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const seedEnquiries = async () => {
        setLoading(true);
        setStatus('Seeding demo enquiries...');
        const demoEnquiries = [
            {
                full_name: 'John Doe',
                email: 'john@example.com',
                phone: '+91 98765 43210',
                qualification: 'B.E. Mechanical',
                department: 'Mechanical CADD',
                status: 'Fresher',
                source: 'Google',
                message: 'Looking for course details and placement support.',
                is_read: false
            },
            {
                full_name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+91 87654 32109',
                qualification: 'MCA',
                department: 'Full Stack Development',
                status: 'Working Professional',
                source: 'Instagram',
                message: 'Interested in weekend batches.',
                is_read: true
            }
        ];

        try {
            for (const enquiry of demoEnquiries) {
                await addDoc(collection(db, 'enquiries'), {
                    ...enquiry,
                    created_at: serverTimestamp()
                });
            }
            setStatus('Demo enquiries added successfully! Check your dashboard.');
        } catch (error: any) {
            setStatus(`Error seeding: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">System Setup</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg">
                <h2 className="text-xl font-semibold mb-4">Data Migration & Seeding</h2>
                <p className="text-gray-600 mb-6">
                    Use this tool to upload your hardcoded content to Firestore or add test data to see how the dashboard works.
                </p>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700 whitespace-pre-wrap">
                    {status || 'Ready for action...'}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={migrateData}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Migrate All Site Content'}
                    </button>

                    <button
                        onClick={seedWorkshops}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Seed Workshops & Features'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Setup;
