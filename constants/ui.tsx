
import React from 'react';
import { Settings, Home, Code, PenTool, Gamepad2, Bot, Star, Users, Megaphone, Briefcase, Globe, CheckCircle } from 'lucide-react';

export const HERO_SLIDES_FALLBACK = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    title: "Master Practical Skills",
    subtitle: "Hands-on training with 100% Placement Support",
    link: "/courses",
    cta: "Start Learning"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    title: "Learn from Experts",
    subtitle: "Industry-aligned training guided by experienced professionals",
    link: "/about",
    cta: "View Accreditations"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop",
    title: "Transform Your Career",
    subtitle: "With Industry-Driven Courses in Engineering & IT",
    link: "/placements",
    cta: "See Success Stories"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    title: "Internship Program",
    subtitle: "Work on Live Projects with LASAK Technologies Pvt Ltd",
    link: "https://docs.google.com/forms/d/e/1FAIpQLScL1mo2i4LF9aineii9xi9V-CVntO8xSbk1Qi_5oU_5mpOnvg/viewform?usp=pp_url",
    cta: "Apply for Internship"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    title: "College Workshops",
    subtitle: "Conduct Interactive Sessions & Workshops in Colleges with LASAK Technologies Pvt Ltd",
    link: "/contact",
    cta: "Apply to Conduct Workshop"
  }
];

export const GOOGLE_REVIEWS_LIST = [
  {
    name: "Sakthi",
    image: "/img/saravana-kumar-r.webp",
    rating: 5,
    text: "I recently completed my internship at LASAK Company and had a great learning experience. The environment is very professional...",
    verified: true
  },
  {
    name: "Vishnu R",
    image: "/img/mr-dharsan-v.webp",
    rating: 5,
    text: "Actually, I had went there for five days training on solidworks, The of teaching was very nice, simple and understandable.",
    verified: true
  },
  {
    name: "King Maker",
    image: "/img/mr-lokkesh-v.webp",
    rating: 5,
    text: "I got a basic idea about solid work, good teaching and excellent place for learning...",
    verified: true
  },
  {
    name: "Priya Darshini",
    image: "/img/ms-chandraleka-k.webp",
    rating: 5,
    text: "One of the best institutes in Coimbatore for Civil CADD. The syllabus is up to date and placement support is genuine.",
    verified: true
  },
  {
    name: "Rahul K",
    image: "/img/mr-surya-m.webp",
    rating: 5,
    text: "Hands down the best place to learn mechanical design software. The faculty is very knowledgeable.",
    verified: true
  }
];

export const IMPORTANT_PROGRAM_BLOCKS = [
  {
    id: 'intensive',
    badge: 'Intern while you learn!',
    title: 'Intensive Certification Program',
    description: 'Get an early entry into real workplaces, work alongside experienced professionals, and contribute to real client projects– all while you’re still learning with intensive internship training programs.',
    bgColor: '#c4a000',
    categories: [
      { name: 'Artificial Intelligence', icon: <Bot className="w-6 h-6" /> },
      { name: 'Data Science', icon: <Code className="w-6 h-6" /> },
      { name: 'Data Analytics', icon: <Star className="w-6 h-6" /> },
      { name: 'Business Analytics', icon: <Users className="w-6 h-6" /> },
      { name: 'MERN Stack with UI/UX', icon: <Code className="w-6 h-6" /> },
      { name: 'DevOps', icon: <Settings className="w-6 h-6" /> },
      { name: 'Digital Marketing with AI', icon: <Megaphone className="w-6 h-6" /> }
    ]
  },
  {
    id: 'advanced',
    badge: 'Upskill with a guide!',
    title: 'Advanced Professional Certification Program',
    description: 'Level up your skills and career with job-ready certification programs designed for today’s competitive world.',
    bgColor: '#a81d1d',
    categories: [
      { name: 'Data Engineering', icon: <Settings className="w-6 h-6" /> },
      { name: 'Data Science', icon: <Code className="w-6 h-6" /> },
      { name: 'DevOps', icon: <Settings className="w-6 h-6" /> },
      { name: 'Data Analytics', icon: <Star className="w-6 h-6" /> },
      { name: 'Artificial Intelligence', icon: <Bot className="w-6 h-6" /> },
      { name: 'MERN Stack with UI/UX', icon: <Code className="w-6 h-6" /> },
      { name: 'Digital Marketing with AI', icon: <Megaphone className="w-6 h-6" /> },
      { name: 'Business Analytics', icon: <Users className="w-6 h-6" /> },
      { name: 'Banking & Financial Services', icon: <Briefcase className="w-6 h-6" /> }
    ]
  },
  {
    id: 'mechanical',
    badge: 'Master Core Design!',
    title: 'Mechanical Courses',
    description: 'Master industry-leading tools and technologies for mechanical design, simulation, and analysis.',
    bgColor: '#d84315',
    categories: [
      { name: '3D Printing & Prototyping', icon: <Settings className="w-6 h-6" /> },
      { name: 'ANSA Pre-Processing Course (Mechanical Engineering)', icon: <Settings className="w-6 h-6" /> },
      { name: 'ANSYS Simulation Course (Mechanical Engineering)', icon: <Settings className="w-6 h-6" /> },
      { name: 'AutoCAD Mechanical', icon: <Settings className="w-6 h-6" /> },
      { name: 'Computational Fluid Dynamics (CFD)', icon: <Settings className="w-6 h-6" /> },
      { name: 'Autodesk Inventor Course (Mechanical Engineering)', icon: <Settings className="w-6 h-6" /> },
      { name: 'Wiring Harness Design Course', icon: <Settings className="w-6 h-6" /> },
      { name: 'SolidWorks Masterclass', icon: <Settings className="w-6 h-6" /> },
      { name: 'NX CAD (Unigraphics) Course (Mechanical Engineering)', icon: <Settings className="w-6 h-6" /> }
    ]
  },
  {
    id: 'sap',
    badge: 'Learn world-renowned tech!',
    title: 'Global SAP Certification Programs',
    description: 'Get globally recognized and career-ready with hands-on SAP training and official certification programs.',
    bgColor: '#006699',
    layout: 'sap',
    categories: [
      { 
        name: 'SAP Technical', 
        icon: <Settings className="w-6 h-6" />,
        desc: 'Into tech guts? Jump into ABAP, unravel system architecture, and cook up custom SAP solutions that matter. If code is your happy place, well—welcome home.'
      },
      { 
        name: 'SAP Functional', 
        icon: <Users className="w-6 h-6" />,
        desc: 'Not a coder but love making stuff work better? Mess around with SAP modules like MM, SD, FI. Tweak workflows, smooth out the chaos, and watch businesses run smoother than ever.'
      }
    ]
  },
  {
    id: 'externship',
    badge: 'Learn abroad!',
    title: 'International Externship Program',
    description: 'Kickstart your international career with hybrid externships that give you a real-world experience and industry exposure.',
    bgColor: '#002b45',
    layout: 'externship',
    categories: [
      { 
        name: 'Artificial Intelligence', 
        icon: <Bot className="w-6 h-6" />,
        desc: 'If you wanna mess with the future—here’s your playground.'
      },
      { 
        name: 'Digital Marketing', 
        icon: <Megaphone className="w-6 h-6" />,
        desc: 'Get your hands dirty with real data, play with ads, SEO, all that jazz. No fluff, just straight-up growth tactics.'
      },
      { 
        name: 'Human Resource', 
        icon: <Users className="w-6 h-6" />,
        desc: 'Walk out prepped for whatever office drama comes your way.'
      }
    ]
  },
  {
    id: 'online',
    badge: 'Upskill fast!',
    title: 'Online Professional Certification Program',
    description: 'Learn anytime, anywhere with flexible online professional certification programs designed to build practical skills and boost your career.',
    bgColor: '#4a148c',
    categories: [
      { name: 'MERN Stack Development', icon: <Code className="w-6 h-6" /> },
      { name: 'Front End Development', icon: <Code className="w-6 h-6" /> },
      { name: 'Software Testing', icon: <CheckCircle className="w-6 h-6" /> },
      { name: 'Digital Marketing with AI', icon: <Megaphone className="w-6 h-6" /> },
      { name: 'Banking and Financial Services', icon: <Briefcase className="w-6 h-6" /> },
      { name: 'Business Analytics', icon: <Users className="w-6 h-6" /> },
      { name: 'AWS', icon: <Settings className="w-6 h-6" /> },
      { name: 'Data Science', icon: <Code className="w-6 h-6" /> },
      { name: 'Data Engineering', icon: <Settings className="w-6 h-6" /> },
      { name: 'Data Analytics', icon: <Star className="w-6 h-6" /> },
      { name: 'Linux', icon: <Settings className="w-6 h-6" /> },
      { name: 'Networking', icon: <Globe className="w-6 h-6" /> },
      { name: 'UI/UX', icon: <PenTool className="w-6 h-6" /> },
      { name: 'Artificial Intelligence', icon: <Bot className="w-6 h-6" /> }
    ]
  }
];

export const STUDENT_VIDEOS = [
  { id: 'LXb3EKWsInQ', title: 'Student Success Story - IT' },
  { id: 'ysz5S6PUM-U', title: 'Placement Review - Mechanical' },
  { id: 'bMknfKXIFA8', title: 'React Course Review' },
  { id: '9No-FiEInLA', title: 'Civil CAD Training Experience' },
  { id: 'hF5z6tK5', title: 'Internship Experience' },
  { id: 'jK9s8dL2', title: 'Career Guidance Session' },
];

export const DEFAULT_WORKSHOPS = [
  {
    id: 'ws-1',
    title: 'Full Stack Development (MERN)',
    description: 'Learn to build modern web applications from scratch with industry experts. 100% hands-on training.',
    type: 'live',
    badge_text: 'LIMITED SLOTS',
    icon: 'Zap',
    tags: ['React', 'Node.js', 'Project Based'],
    button_text: 'Register Now',
    active: true
  },
  {
    id: 'ws-2',
    title: 'Advanced SolidWorks Bootcamp',
    description: 'Master 3D modeling and product design. Perfect for Mechanical Engineering students and professionals.',
    type: 'offline',
    badge_text: 'SUNDAY BATCH',
    icon: 'Settings',
    tags: ['Mechanical', 'CAD', 'Certification'],
    button_text: 'Join Workshop',
    active: true
  },
  {
    id: 'ws-3',
    title: 'Early Bird Special Offer',
    description: 'Get up to 20% flat discount on all premium professional courses. Valid for registrations this week only.',
    type: 'offer',
    badge_text: 'FESTIVE OFFER',
    icon: 'Percent',
    tags: ['IT', 'Mech', 'Civil'],
    button_text: 'Claim Discount',
    active: true
  }
];

export const COMPANY_LOGOS: string[] = [
  "/img/stcompany1.webp",
  "/img/stcompany2.webp",
  "/img/stcompany3.webp",
  "/img/stcompany4.webp",
  "/img/lt.webp",
  "/img/kavin.webp",
  "/img/hinduja.webp",
  "/img/caresoft.webp",
  "/img/hirotec.webp",
  "/img/designtech.webp",
  "/img/harita.webp",
  "/img/stcompany1.webp",
  "/img/stcompany2.webp",
  "/img/stcompany3.webp",
  "/img/stcompany4.webp",
];

// Specific Company Lists
export const IT_GIANTS = [
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/googlelogo.jpg",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/98f4652a969c5dd1c29ff94c661f7d51e3a2aeb9/Microsoftlogo.jpg",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/a2a0cbc04401cc7b57c6f07b75ec42dd611a75f3/zohologo.png",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/751d82d902a13278b0333b733061dcbb81622197/Freshworkslogo.png"
];

export const WEB_COMPANIES = [
  "https://logo.clearbit.com/zoho.com",
  "https://logo.clearbit.com/freshworks.com",
  "https://logo.clearbit.com/tcs.com",
  "https://logo.clearbit.com/infosys.com",
  "https://logo.clearbit.com/cognizant.com",
  "https://logo.clearbit.com/hcltech.com",
  "https://logo.clearbit.com/techmahindra.com"
];

export const TESTING_COMPANIES = [
  "https://logo.clearbit.com/accenture.com",
  "https://logo.clearbit.com/capgemini.com",
  "https://logo.clearbit.com/cognizant.com",
  "https://logo.clearbit.com/wipro.com",
  "https://logo.clearbit.com/infosys.com",
  "https://logo.clearbit.com/ibm.com",
  "https://logo.clearbit.com/tcs.com"
];

export const DATA_COMPANIES = [
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Flipkartlogo.png",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Deloittelogo.jpg",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/EYlogo.jpg",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/KPMGlogo.png",
  "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
  "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
];

export const MECH_COMPANIES = [
  "/img/stcompany1.webp",
  "/img/stcompany2.webp",
  "/img/stcompany3.webp",
  "/img/stcompany4.webp",
  "/img/lt.webp",
  "/img/kavin.webp",
  "/img/hinduja.webp",
  "/img/caresoft.webp",
  "/img/hirotec.webp",
  "/img/designtech.webp",
  "/img/harita.webp"
];

export const getCompaniesForCourse = (title: string, category: string): string[] => {
  const t = title.toLowerCase();
  if (t.includes('full stack') || t.includes('java') || t.includes('python')) return IT_GIANTS;
  if (t.includes('web')) return WEB_COMPANIES;
  if (t.includes('testing')) return TESTING_COMPANIES;
  if (t.includes('data') || t.includes('analytics') || t.includes('digital') || t.includes('marketing')) return DATA_COMPANIES;

  if (category === 'Mechanical' || category === 'Civil') return MECH_COMPANIES;

  return COMPANY_LOGOS; // Fallback
};

export const ACCREDITATIONS = [
  { src: "/img/iso.webp", alt: "ISO" },
  { src: "/img/iaf.webp", alt: "IAF" },
  { src: "/img/eiaci.webp", alt: "EIACI" },
  { src: "/img/aicte.webp", alt: "AICTE" },
  { src: "/img/lms.webp", alt: "LMS" },
];

export const PARTNERS = [
  { src: "/img/ptccreo.webp", alt: "Creo" },
  { src: "/img/solidworks.webp", alt: "Solidworks" },
  { src: "/img/lt.webp", alt: "L&T" },
  { src: "/img/kavin.webp", alt: "Kavin" },
  { src: "/img/hinduja.webp", alt: "Hinduja" },
  { src: "/img/caresoft.webp", alt: "Caresoft" },
  { src: "/img/hirotec.webp", alt: "Hirotec" },
  { src: "/img/designtech.webp", alt: "Designtech" },
  { src: "/img/harita.webp", alt: "Harita" },
];

export const CATEGORIES = [
  { name: 'Mech', icon: () => <Settings className="w-8 h-8 text-purple-400" />, id: 'Mechanical' },
  { name: 'CSE/IT', icon: () => <Code className="w-8 h-8 text-cyan-400" />, id: 'IT' },
  { name: 'Civil', icon: () => <Home className="w-8 h-8 text-green-400" />, id: 'Civil' },
  { name: 'Arts', icon: () => <PenTool className="w-8 h-8 text-pink-400" />, id: 'Arts' },
  { name: 'Kids', icon: () => <Gamepad2 className="w-8 h-8 text-yellow-400" />, id: 'Kids' },
];

export const DEMO_VIDEOS = [
  { id: 'EnYGuUc6Qlk', thumbnail: `https://img.youtube.com/vi/EnYGuUc6Qlk/mqdefault.jpg` },
  { id: 'h-xIqFdTIyk', thumbnail: `https://img.youtube.com/vi/h-xIqFdTIyk/mqdefault.jpg` },
  { id: 'VQ24NYVFVDE', thumbnail: `https://img.youtube.com/vi/VQ24NYVFVDE/mqdefault.jpg` },
  { id: 's2kJ52y4SCc', thumbnail: `https://img.youtube.com/vi/s2kJ52y4SCc/mqdefault.jpg` },
  { id: 'rcdalyx2Qjw', thumbnail: `https://img.youtube.com/vi/rcdalyx2Qjw/mqdefault.jpg` },
  { id: 'gD6bl4VjG8k', thumbnail: `https://img.youtube.com/vi/gD6bl4VjG8k/mqdefault.jpg` },
  { id: 'SAcspV9dKQI', thumbnail: `https://img.youtube.com/vi/SAcspV9dKQI/mqdefault.jpg` },
  { id: 'TIqaEJvlkUg', thumbnail: `https://img.youtube.com/vi/TIqaEJvlkUg/mqdefault.jpg` },
  { id: 'r7hZgmf3jMY', thumbnail: `https://img.youtube.com/vi/r7hZgmf3jMY/mqdefault.jpg` },
  { id: 'k1Bo5qDZsj0', thumbnail: `https://img.youtube.com/vi/k1Bo5qDZsj0/mqdefault.jpg` },
  { id: 'KAEhbSAsD8c', thumbnail: `https://img.youtube.com/vi/KAEhbSAsD8c/mqdefault.jpg` },
  { id: 'qIMJAT8XQJg', thumbnail: `https://img.youtube.com/vi/qIMJAT8XQJg/mqdefault.jpg` },
  { id: 'vNvXHulHGPw', thumbnail: `https://img.youtube.com/vi/vNvXHulHGPw/mqdefault.jpg` },
  { id: 'O4Z2CSJnDuw', thumbnail: `https://img.youtube.com/vi/O4Z2CSJnDuw/mqdefault.jpg` },
  { id: 'FcWXcn1_8rQ', thumbnail: `https://img.youtube.com/vi/FcWXcn1_8rQ/mqdefault.jpg` },
  { id: '8yS6lRd8zQ0', thumbnail: `https://img.youtube.com/vi/8yS6lRd8zQ0/mqdefault.jpg` },
  { id: 'nI1CX5ipdSE', thumbnail: `https://img.youtube.com/vi/nI1CX5ipdSE/mqdefault.jpg` },
  { id: 'Nxq6E_c5O98', thumbnail: `https://img.youtube.com/vi/Nxq6E_c5O98/mqdefault.jpg` },
  { id: '77Heu2B161Y', thumbnail: `https://img.youtube.com/vi/77Heu2B161Y/mqdefault.jpg` },
  { id: 'd_hvjjG0LlQ', thumbnail: `https://img.youtube.com/vi/d_hvjjG0LlQ/mqdefault.jpg` },
];
