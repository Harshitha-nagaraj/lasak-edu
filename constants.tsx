
import React from 'react';
import { Course, StudentStory, BlogPost, CertificateData } from './types';
import { Code, Box, Home, PenTool, Gamepad2, Settings, Monitor, PenLine, Smartphone, Globe } from 'lucide-react';

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
  { name: 'IT & Software', icon: <Code className="w-8 h-8 text-cyan-400" />, id: 'IT' },
  { name: 'Mechanical', icon: <Settings className="w-8 h-8 text-purple-400" />, id: 'Mechanical' },
  { name: 'Civil & Arch', icon: <Home className="w-8 h-8 text-green-400" />, id: 'Civil' },
  { name: 'Arts & Media', icon: <PenTool className="w-8 h-8 text-pink-400" />, id: 'Arts' },
  { name: 'Kids Zone', icon: <Gamepad2 className="w-8 h-8 text-yellow-400" />, id: 'Kids' },
];

export const COURSES: Course[] = [
  // --- MECHANICAL COURSES ---
  {
    id: 'mech1',
    title: 'AutoCAD Mechanical',
    slug: "autocad-mechanical",
    category: 'Mechanical',
    oldPrice: '₹9,000',
    price: '₹5,999',
    duration: '1 – 1.5 Months',
    image: '/img/mech/autocad.webp',
    description: 'Master AutoCAD Mechanical and accelerate your career growth with expert-led training.',
    tagline: 'Master AutoCAD Mechanical and accelerate your career growth with expert-led training.',
    introduction: "AutoCAD Mechanical is a specialized CAD software designed for mechanical engineering and manufacturing industries. It provides advanced tools for creating precise mechanical drawings, standard parts, annotations, and documentation.\n\nThis course offers complete hands-on training in 2D drafting, mechanical detailing, dimensioning standards, and industry workflows used in real-world design projects.",
    long_description: "**Industries hiring include:**\n🏭 Manufacturing Companies\n🏗 Fabrication Industries\n🚗 Automotive Firms\n🚜 Heavy Machinery Sectors\n🛠 Product Development Companies",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Introduction to AutoCAD - Mastering Interface, Workspace Navigation & Drawing Setup",
      "Drafting & Precision - Master 2D Drawing Tools, Advanced Modify Commands & Precision Drafting",
      "Layers & Documentation - Professional Layer Management, Annotation Scales & Geometric Dimensions",
      "Drawing Accuracy & Control",
      "Blocks & Attributes",
      "Hatching & Gradients",
      "Layouts & Plotting",
      "Advanced Drafting Tools",
      "3D Basics (Optional)",
      "Industry-Specific Practices",
      "Project Work"
    ],
    skills_gained: [
      "2D Drafting & Mechanical Drawing",
      "Layer Management & Templates",
      "Mechanical Symbols & Standard Parts Library",
      "Dimensioning & Tolerancing",
      "GD&T (Geometric Dimensioning & Tolerancing)",
      "Bill of Materials (BOM) Creation",
      "Assembly Drawings",
      "Manufacturing Documentation",
      "Plotting & Printing Setup"
    ],
    tools: [
      "Drawing Tools",
      "Modify Tools",
      "Annotation Tools",
      "Layer & Management Tools",
      "Output & Layout Tools",
      "Advanced Tools"
    ],
    features: [
      "Industry-Expert Trainers",
      "Practical, Hands-on Training",
      "Real-Time Project-Based Learning",
      "Interview Preparation Support",
      "Resume Building Assistance",
      "Placement Guidance"
    ],
    eligibility: [
      "Mechanical Engineering Students",
      "Diploma Holders",
      "ITI Students",
      "Fresh Graduates",
      "Working Professionals in Manufacturing",
      "Anyone interested in Mechanical Drafting"
    ],
    career_opportunities: [
      { role: "Mechanical Draftsman", description: "Create technical drawings and plans." },
      { role: "CAD Engineer", description: "Design precision mechanical parts." },
      { role: "Design Engineer", description: "Develop concepts for new products." },
      { role: "Production Drawing Engineer", description: "Prepare drawings for manufacturing." },
      { role: "Manufacturing Design Executive", description: "Oversee design processes in manufacturing." }
    ],
    faqs: [
      {
        question: "Is prior CAD knowledge required?",
        answer: "No, we start from the basics and gradually move to advanced features."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, it is beginner-friendly and also helpful for professionals upgrading their drafting skills."
      },
      {
        question: "Will I get practical drawing experience?",
        answer: "Yes, the course includes real-world drawing practice and project work."
      },
      {
        question: "Is placement assistance provided?",
        answer: "Yes, we offer interview preparation and placement support."
      }
    ],
    seo: {
      title: "AutoCAD Mechanical Course in Coimbatore | Lasak Edu",
      description: "Learn AutoCAD Mechanical from experts in Coimbatore at Lasak Edu. Master 2D drafting, GD&T, and manufacturing documentation with 100% placement support.",
      keywords: "AutoCAD Mechanical Course in Coimbatore, CAD Drafting Training, Mechanical Drawing, Lasak Edu, Manufacturing Design"
    },
    companies: [
      {
        name: "L&T",
        logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/main/L%26Tlogo.png"
      },
      {
        name: "Bosch",
        logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/main/Boschlogo.png"
      },
      {
        name: "Tata Motors",
        logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/main/TataMotorslogo.png"
      },
      {
        name: "Mahindra",
        logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/main/Mahindralogo.png"
      },
      {
        name: "Ashok Leyland",
        logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/main/AshokLeylandlogo.png"
      },
      {
        name: "TVS Motors",
        logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/main/TVSlogo.png"
      }
    ]
  },
  {
    id: 'mech2',
    title: 'SolidWorks Masterclass',
    slug: "solidworks-masterclass",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1.5 – 2 Months',
    image: '/img/mech/solidworks-408z.webp',
    description: 'Master SolidWorks and accelerate your career growth with expert-led training.',
    tagline: 'Master SolidWorks and accelerate your career growth with expert-led training.',
    introduction: "The SolidWorks Masterclass is a comprehensive, industry-focused training program designed to help you become proficient in 3D modeling, assembly design, and product development. SolidWorks is widely used in automotive, aerospace, manufacturing, and product design industries.\n\nThis course covers everything from basic sketching to advanced modeling techniques, ensuring you gain practical, real-world experience through live projects and hands-on exercises.",
    long_description: "**Industries hiring include:**\n🚗 Automotive Companies\n🏭 Manufacturing Industries\n🏗 Heavy Machinery Firms\n🛠 Product Development Companies",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Sketching & Modeling - Convert Complex 2D Sketches into Industry-Standard 3D Part Designs",
      "Assembly Design - Mastering Mechanical Mates, Exploded Views & Motion Study Simulations",
      "Manufacturing Documentation - Generate Professional 2D Sheets, Section Views & Bill of Materials (BOM)",
      "Sheet Metal Design",
      "Surface Modeling",
      "Weldments & Structural Design",
      "GD&T (Geometric Dimensioning & Tolerancing)",
      "Rendering & Basic Simulation",
      "Real-Time Industrial Projects"
    ],
    skills_gained: [
      "2D Sketching & Feature-Based 3D Modeling",
      "Advanced Part Modeling Techniques",
      "Assembly Design & Mates",
      "Sheet Metal Design",
      "Surface Modeling",
      "Weldments & Structural Design",
      "2D Drafting & Detailing",
      "GD&T (Geometric Dimensioning & Tolerancing)",
      "BOM (Bill of Materials) Generation",
      "Rendering & Basic Simulation"
    ],
    tools: [
      "SolidWorks",
      "SolidWorks Simulation",
      "AutoCAD",
      "3DEXPERIENCE",
      "Rendering Tools"
    ],
    features: [
      "Expert Trainers with Industry Experience",
      "Real-Time Project-Based Learning",
      "Practical Hands-on Sessions",
      "Interview Preparation Support",
      "Resume Building Guidance",
      "Placement Assistance"
    ],
    eligibility: [
      "Mechanical Engineering Students",
      "Diploma Holders",
      "Fresh Graduates",
      "Working Professionals",
      "Anyone interested in Product & Mechanical Design"
    ],
    career_opportunities: [
      { role: "Mechanical Design Engineer", description: "Design mechanical systems and machinery." },
      { role: "CAD Engineer", description: "Create detailed 3D models and manufacturing drawings." },
      { role: "Product Design Engineer", description: "Develop innovative products from concept to reality." },
      { role: "SolidWorks Designer", description: "Specialize in SolidWorks for various industries." },
      { role: "Tool Design Engineer", description: "Design tools, jigs, and fixtures." }
    ],
    faqs: [
      {
        question: "Is prior CAD knowledge required?",
        answer: "No, the course starts from fundamentals and progresses to advanced concepts."
      },
      {
        question: "Will I get practical project experience?",
        answer: "Yes, the masterclass includes live projects to build real industry experience."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, it is beginner-friendly and also beneficial for professionals upgrading their skills."
      },
      {
        question: "Do you provide placement assistance?",
        answer: "Yes, we provide interview preparation and placement support."
      }
    ],
    seo: {
      title: "SolidWorks Masterclass Course in Coimbatore | Lasak Edu",
      description: "Join the best SolidWorks Masterclass in Coimbatore at Lasak Edu. Learn 3D modeling, assembly, and simulation from industry experts with placement support.",
      keywords: "SolidWorks Masterclass Course in Coimbatore, SolidWorks Training, CAD Course Coimbatore, Lasak Edu, Product Design"
    },
    companies: [
      { name: "Tata", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/tata.jpeg" },
      { name: "TVS", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/tvs.jpeg" },
      { name: "Siemens", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/siemens.jpeg" },
      { name: "Kirloskar", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/kirloskar.jpeg" },
      { name: "Kavin", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/kavin.jpeg" },
      { name: "Honeywell", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/honewell.jpeg" },
      { name: "GE", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/ge.jpeg" },
      { name: "Dassault", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/dassault.jpeg" },
      { name: "Bosch", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/bosch.jpeg" },
      { name: "Bajaj", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/bajaj.jpeg" },
      { name: "Adobe", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/81fe637f03e11f7c51010552edff4520cac38597/Adobelogo.png" }
    ]
  },
  {
    id: 'mech3',
    title: 'Creo Parametric Course',
    slug: "creo-parametric",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1.5 – 2 Months',
    image: '/img/mech/creo-688z.webp',
    description: 'Master Creo Parametric and accelerate your career growth with expert-led training.',
    tagline: 'Master Creo Parametric and accelerate your career growth with expert-led training.',
    introduction: "Creo Parametric is a powerful 3D CAD software widely used in mechanical product design, manufacturing, and engineering industries. This course provides complete hands-on training in part modeling, assembly design, detailing, and real-time industrial projects.\n\nYou will learn industry-standard design workflows used in automotive, aerospace, and manufacturing sectors to create high-quality 3D models and production-ready drawings.",
    long_description: "**Industries hiring include:**\n🚗 Automotive Companies\n🏭 Manufacturing Firms\n🏗 Heavy Machinery Industries\n🛠 Product Development Companies",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Parametric Design - Master 3D Modeling using Sketcher Tools, Advanced Protrusions & Revolves",
      "Intelligent Assembly - Complex Constraint Management, Bottom-up & Top-down Assembly Workflows",
      "Production Detailing - Create ANSI/ISO Standard Drawings with Advanced GD&T & Detailing Tools",
      "Sheet Metal Design",
      "Surface Modeling Basics",
      "Mechanism & Motion Analysis",
      "BOM Creation & Documentation",
      "Real-Time Industrial Projects"
    ],
    skills_gained: [
      "Sketching and 3D Part Modeling",
      "Advanced Feature Creation",
      "Assembly Modeling",
      "Sheet Metal Design",
      "Surface Modeling Basics",
      "Mechanism & Motion Analysis",
      "2D Drafting and Detailing",
      "GD&T (Geometric Dimensioning & Tolerancing)",
      "BOM Creation and Documentation"
    ],
    tools: [
      "Sketcher",
      "Part Modeling",
      "Assembly Design",
      "Sheet Metal",
      "Surface Modeling",
      "Drawing & Detailing",
      "Mechanism Design"
    ],
    features: [
      "Industry-Expert Trainers",
      "Real-Time Project-Based Learning",
      "Hands-on Practical Sessions",
      "Interview Preparation Support",
      "Resume Building Assistance",
      "Placement Guidance"
    ],
    eligibility: [
      "Mechanical Engineering Students",
      "Diploma Holders",
      "Fresh Graduates",
      "Working Professionals",
      "Anyone interested in Product & Mechanical Design"
    ],
    career_opportunities: [
      { role: "Design Engineer", description: "Design complex mechanical systems and components." },
      { role: "CAD Engineer", description: "Create detailed 2D and 3D models for manufacturing." },
      { role: "Mechanical Design Engineer", description: "Focus on mechanical systems and machinery design." },
      { role: "Product Design Engineer", description: "Develop new products from concept to final design." },
      { role: "Tool Design Engineer", description: "Design tools, dies, and molds." }
    ],
    faqs: [
      {
        question: "Do I need prior CAD knowledge?",
        answer: "No. We start from basic concepts and gradually move to advanced topics."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, this course is beginner-friendly and also beneficial for professionals."
      },
      {
        question: "Will I work on real-time projects?",
        answer: "Yes, project-based training is included to build practical experience."
      },
      {
        question: "Is placement assistance available?",
        answer: "Yes, we provide interview preparation and placement support."
      }
    ],
    seo: {
      title: "Creo Parametric Course in Coimbatore | Lasak Edu",
      description: "Learn Creo Parametric from industry experts in Coimbatore at Lasak Edu. Master 3D modeling, assembly, and drafting with full practical placement support sessions.",
      keywords: "Creo Parametric Course in Coimbatore, CAD Training, Lasak Edu, Creo Coaching Coimbatore, Product Design"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  {
    id: 'mech4',
    title: 'CATIA V5 Course (Mechanical Engineering)',
    slug: "catia-v5",
    category: 'Mechanical',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '1.5 – 3 Months',
    image: '/img/mech/catia-118z.webp',
    description: 'Master CATIA V5 and accelerate your career growth with expert-led training.',
    tagline: 'Master CATIA V5 and accelerate your career growth with expert-led training.',
    introduction: "Our CATIA V5 Course is designed for Mechanical Engineering students and professionals who want to build strong skills in product design and 3D modeling.\n\nCATIA V5 is one of the most widely used CAD software tools in automotive, aerospace, and manufacturing industries. It is used for designing complex mechanical components, assemblies, and industrial products.\n\nThis course provides hands-on training in part modeling, assembly design, drafting, and surface modeling. The focus is on real-time industrial design practices to help you become job-ready.\n\nBy the end of this course, you will be able to design mechanical components and generate production-ready drawings confidently.",
    long_description: "**Industries hiring CATIA professionals:**\n🚗 Automotive Industry\n✈ Aerospace Industry\n🏭 Manufacturing Companies\n🔩 Heavy Machinery Industry\n\n**Average Fresher Salary in India:** ₹2.5 – ₹5 LPA\nWith Experience: ₹6 – ₹15 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Sketcher & Parts - Design Complex 3D Mechanical Geometries with Precision Modeling Tools",
      "Systems Assembly - Master Product Structure, Assembly Constraints & Kinematics Simulations",
      "Advanced Surfacing - Generative Shape Design (GSD) for Complex Class-A Surface Modeling",
      "Drafting & 2D Drawing Creation",
      "Sheet Metal Design (Basic)",
      "Dimensioning & Tolerancing",
      "Design Modification & Optimization",
      "Real-Time Industrial Design Projects"
    ],
    skills_gained: [
      "Introduction to CAD Concepts",
      "CATIA V5 Interface & Workbench",
      "Sketcher Workbench",
      "Part Design (3D Modeling)",
      "Assembly Design",
      "Drafting & 2D Drawing Creation",
      "Surface Modeling Basics",
      "Sheet Metal Design (Basic)",
      "Dimensioning & Tolerancing",
      "Design Modification & Optimization"
    ],
    tools: [
      "Sketcher",
      "Part Design",
      "Assembly Design",
      "Generative Shape Design (GSD)",
      "Wireframe & Surface",
      "Sheet Metal Design",
      "Drafting & Detailing",
      "DMU Kinematics",
      "Real-Time Rendering"
    ],
    features: [
      "Industry-Oriented Curriculum",
      "100% Practical Training",
      "Real-Time Industrial Design Projects",
      "Experienced Mechanical Trainers",
      "Lab-Based CAD Practice",
      "Placement Assistance",
      "Resume & Interview Preparation",
      "Certification After Completion"
    ],
    eligibility: [
      "B.E / B.Tech Mechanical Students",
      "Diploma Mechanical Students",
      "M.E Mechanical Students",
      "Working Mechanical Professionals",
      "Freshers looking for core design jobs"
    ],
    career_opportunities: [
      { role: "Design Engineer", description: "Design complex mechanical systems and components." },
      { role: "CAD Engineer", description: "Create detailed 2D and 3D models for manufacturing." },
      { role: "Product Design Engineer", description: "Develop new products from concept to final design." },
      { role: "Mechanical Design Engineer", description: "Focus on mechanical systems and machinery design." },
      { role: "Automotive Design Engineer", description: "Specialize in vehicle components and systems design." },
      { role: "Aerospace Design Engineer", description: "Design aircraft components and structures." }
    ],
    faqs: [
      {
        question: "What is CATIA V5 used for?",
        answer: "CATIA V5 is used for 3D product design, modeling, assembly design, and drafting in engineering industries."
      },
      {
        question: "Is CATIA V5 good for mechanical engineers?",
        answer: "Yes. It is one of the most demanded CAD tools in automotive and aerospace industries."
      },
      {
        question: "Do I need prior CAD knowledge?",
        answer: "Basic mechanical drawing knowledge is helpful, but we teach from fundamentals."
      },
      {
        question: "Will I get placement support?",
        answer: "Yes. We provide resume building, interview guidance, and placement assistance."
      },
      {
        question: "Is this course suitable for diploma students?",
        answer: "Yes. Diploma and degree mechanical students can join."
      },
      {
        question: "Will I work on real projects?",
        answer: "Yes. You will practice with real industrial design models."
      }
    ],
    seo: {
      title: "CATIA V5 Course in Coimbatore | Lasak Edu",
      description: "Master CATIA V5 with expert training in Coimbatore at Lasak Edu. Learn 3D modeling, assembly, and drafting from scratch with real projects and placement support.",
      keywords: "CATIA V5 Course in Coimbatore, CAD Training, Lasak Edu, CATIA Coaching Coimbatore, Product Design"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  {
    id: 'mech5',
    title: 'ANSYS Simulation Course (Mechanical Engineering)',
    slug: "ansys-simulation",
    category: 'Mechanical',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '2 – 3 Months',
    image: '/img/mech/ansys-670z.webp',
    description: 'Master ANSYS Simulation and accelerate your career growth with expert-led training.',
    tagline: 'Master ANSYS Simulation and accelerate your career growth with expert-led training.',
    introduction: "Our ANSYS Simulation Course is designed for Mechanical Engineering students and professionals who want to build expertise in Computer-Aided Engineering (CAE) and Finite Element Analysis (FEA).\n\nANSYS is one of the most powerful and widely used simulation software tools in industries like automotive, aerospace, manufacturing, and energy. This course focuses on structural analysis, thermal analysis, and simulation techniques used in real-world engineering applications.\n\nThrough practical training and real-time projects, you will learn how to analyze mechanical components, predict performance, and improve product design using simulation tools.\n\nBy the end of the course, you will confidently perform engineering simulations and solve complex mechanical problems.",
    long_description: "**Industries hiring ANSYS professionals:**\n🚗 Automotive Companies\n✈ Aerospace Industry\n🏭 Manufacturing Firms\n⚙ Heavy Equipment Industries\n🔋 Energy & Power Sector\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹8 – ₹18 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "FEA Fundamentals - Master Static Structural analysis, Stress Analysis & Thermal Simulations",
      "Advanced Meshing - Professional Mesh Generation, Quality Metrics & Sizing Control Strategies",
      "Workflow Setup - Define Realistic Loads, Complex Boundary Conditions & Solver Optimizations",
      "Static Structural Analysis",
      "Modal & Dynamic Analysis",
      "Transient Structural Analysis",
      "Fatigue Analysis",
      "Steady-State & Transient Thermal Analysis",
      "Thermo-Structural Coupling",
      "Explicit Dynamics",
      "Optimization & Design Validation",
      "Post-Processing & Reporting",
      "Industry-Based Project"
    ],
    skills_gained: [
      "Introduction to CAE & FEA Concepts",
      "ANSYS Interface & Workbench",
      "Geometry Import & Cleanup",
      "Meshing Techniques",
      "Structural Analysis (Static & Dynamic)",
      "Thermal Analysis",
      "Boundary Conditions & Load Application",
      "Material Properties Assignment",
      "Result Interpretation & Reporting",
      "Model Validation & Optimization"
    ],
    tools: [
      "ANSYS Workbench",
      "Static Structural",
      "Thermal Analysis",
      "DesignModeler / SpaceClaim",
      "ANSYS Mechanical"
    ],
    features: [
      "Industry-Focused Curriculum",
      "100% Practical Training",
      "Real-Time Engineering Case Studies",
      "Experienced Mechanical Trainers",
      "Lab-Based Simulation Practice",
      "Placement Assistance",
      "Resume & Interview Preparation",
      "Certification After Completion"
    ],
    eligibility: [
      "B.E / B.Tech Mechanical Students",
      "Diploma Mechanical Students",
      "M.E Mechanical Students",
      "Working Mechanical Engineers",
      "Freshers looking for core engineering jobs"
    ],
    career_opportunities: [
      { role: "CAE Engineer", description: "Simulate and analyze product performance under various conditions." },
      { role: "Simulation Engineer", description: "Develop and test virtual prototypes to improve designs." },
      { role: "FEA Analyst", description: "Perform finite element analysis to solve structural problems." },
      { role: "Design & Analysis Engineer", description: "Integrated role focusing on both CAD design and CAE analysis." },
      { role: "Structural Engineer", description: "Ensure the structural integrity and safety of mechanical systems." },
      { role: "Thermal Analysis Engineer", description: "Specialize in heat transfer and thermal management simulations." }
    ],
    faqs: [
      {
        question: "What is ANSYS used for?",
        answer: "ANSYS is used for engineering simulation, structural analysis, thermal analysis, and product performance testing."
      },
      {
        question: "Is ANSYS good for mechanical engineers?",
        answer: "Yes. It is one of the most demanded CAE tools in the automotive and aerospace industries."
      },
      {
        question: "Do I need prior software knowledge?",
        answer: "Basic mechanical knowledge is enough. We start from fundamentals."
      },
      {
        question: "Will I get placement support?",
        answer: "Yes. We provide resume building, interview guidance, and placement assistance."
      },
      {
        question: "Is this course suitable for diploma students?",
        answer: "Yes. Diploma and degree mechanical students can join."
      },
      {
        question: "Will I work on real projects?",
        answer: "Yes. You will practice with real engineering models and case studies."
      }
    ],
    seo: {
      title: "ANSYS Simulation Course in Coimbatore | Lasak Edu",
      description: "Become an ANSYS expert in Coimbatore at Lasak Edu. Master FEA, structural, and thermal analysis through practical projects and comprehensive placement assistance.",
      keywords: "ANSYS Course in Coimbatore, FEA Training, CAE Simulation, Lasak Edu, Mechanical Engineering Courses"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  {
    id: 'mech6',
    title: 'HyperMesh Course (Mechanical Engineering)',
    slug: "hypermesh",
    category: 'Mechanical',
    oldPrice: '₹40,000',
    price: '₹19,999',
    duration: '1.5 – 3 Months',
    image: '/img/mech/hypermesh-631z.webp',
    description: 'Master HyperMesh and accelerate your career growth with expert-led training.',
    tagline: 'Master HyperMesh and accelerate your career growth with expert-led training.',
    introduction: "Our HyperMesh Course is specially designed for Mechanical Engineering students and professionals who want to build a strong career in CAE (Computer-Aided Engineering) and Finite Element Analysis (FEA).\n\nHyperMesh is one of the most widely used pre-processing tools in the automotive and aerospace industries for simulation and analysis. In this course, you will learn how to create high-quality meshes, apply loads and boundary conditions, and prepare models for structural analysis.\n\nThe training is completely practical and industry-oriented, focusing on real-time engineering problems and projects.\n\nBy the end of the course, you will be able to confidently work on CAE projects in leading core companies.",
    long_description: "**Industries hiring HyperMesh professionals:**\n🚗 Automotive Industry\n✈ Aerospace Industry\n🏭 Manufacturing Companies\n🔩 Heavy Machinery Companies\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹8 – ₹15 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Geometry Cleanup - Master Topology Repair, Complex Surface Clean-up & Mid-surface Extraction",
      "Elements Meshing - Professional 1D, 2D Shell & 3D Tet/Hex Meshing for Complex Geometries",
      "Quality Control - Master Jacobian, Warpage & Aspect Ratio Checks for Simulation Accuracy",
      "Meshing Fundamentals",
      "Mid-Surface Extraction",
      "Material, Properties & Loads",
      "Solver Interface & Model Setup",
      "Post-Processing & Results",
      "Industry Cases & Projects"
    ],
    skills_gained: [
      "Introduction to CAE & FEA Concepts",
      "Geometry Cleanup Techniques",
      "1D, 2D, and 3D Meshing",
      "Quality Criteria & Element Checks",
      "Mid-Surface Extraction",
      "Model Setup for Structural Analysis",
      "Load & Boundary Condition Application",
      "Rigid Elements & Connectors",
      "Shell & Solid Meshing",
      "Model Validation Techniques"
    ],
    tools: [
      "HyperMesh",
      "Geometry Setup",
      "Meshing"
    ],
    features: [
      "Industry-Oriented Curriculum",
      "100% Practical Training",
      "Real-Time Engineering Projects",
      "Experienced Mechanical Trainers",
      "Lab-Based Learning",
      "Placement Assistance",
      "Resume & Interview Preparation",
      "Certification After Completion"
    ],
    eligibility: [
      "B.E / B.Tech Mechanical Students",
      "Diploma Mechanical Students",
      "M.E Mechanical Students",
      "Working Mechanical Professionals",
      "Freshers looking for core jobs"
    ],
    career_opportunities: [
      { role: "CAE Engineer", description: "Perform complex engineering simulations." },
      { role: "FEA Engineer", description: "Analyze structural integrity using finite element methods." },
      { role: "Design & Analysis Engineer", description: "Combine design and analysis for optimal product development." },
      { role: "Simulation Engineer", description: "Create virtual models to test real-world scenarios." },
      { role: "Automotive CAE Engineer", description: "Specialize in vehicle safety and performance simulation." },
      { role: "Structural Analysis Engineer", description: "Ensure structural stability of components." }
    ],
    faqs: [
      {
        question: "What is HyperMesh used for?",
        answer: "HyperMesh is used for pre-processing in Finite Element Analysis (FEA), mainly for meshing and model preparation."
      },
      {
        question: "Is HyperMesh good for mechanical engineers?",
        answer: "Yes. It is highly demanded in automotive and aerospace industries."
      },
      {
        question: "Do I need prior software knowledge?",
        answer: "Basic mechanical knowledge is enough. We teach from fundamentals."
      },
      {
        question: "Will I get placement support?",
        answer: "Yes. We provide resume building, interview guidance, and placement assistance."
      },
      {
        question: "Is this course suitable for diploma students?",
        answer: "Yes. Diploma and degree mechanical students can join."
      },
      {
        question: "Will I work on real projects?",
        answer: "Yes. You will practice with real engineering models and case studies."
      }
    ],
    seo: {
      title: "HyperMesh Course in Coimbatore | Lasak Edu",
      description: "Master HyperMesh with our expert-led course in Coimbatore at Lasak Edu. Gain expertise in FEA, meshing, and structural analysis with complete placement support.",
      keywords: "HyperMesh Course in Coimbatore, FEA Training, CAE Course, Lasak Edu, Mechanical Engineering Courses"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  {
    id: 'mech7',
    title: 'ANSA Pre-Processing Course (Mechanical Engineering)',
    slug: "ansa-pre-processing",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1.5 – 3 Months',
    image: '/img/mech/ansa-062z.webp',
    description: 'Master ANSA Pre-Processing and accelerate your career growth with expert-led training.',
    tagline: 'Master ANSA Pre-Processing and accelerate your career growth with expert-led training.',
    introduction: "Our ANSA Pre-Processing Course is designed for Mechanical Engineering students and professionals who want to build a strong career in CAE (Computer-Aided Engineering) and Finite Element Analysis (FEA).\n\nANSA is a powerful pre-processing software widely used in automotive and aerospace industries for model preparation, meshing, and simulation setup. It helps engineers create high-quality finite element models before analysis.\n\nThis course provides hands-on training in geometry cleanup, 2D and 3D meshing, model setup, and quality checks. The training is practical and industry-oriented, focusing on real-time engineering case studies.\n\nBy the end of the course, you will be able to prepare complete CAE models ready for simulation.",
    long_description: "**Industries hiring ANSA professionals:**\n🚗 Automotive Industry\n✈ Aerospace Industry\n🏭 Manufacturing Companies\n🔩 Heavy Engineering Firms\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹8 – ₹16 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Topology Handling - Master Advanced Geometry Cleanup, Surface Repair & Shell Modeling Setup",
      "Advanced Meshing - Industrial Shell & Solid Meshing Workflows with Batch Meshing Automation",
      "Model Assembly - Standardize Mechanical Connections, Spot Welds, Bolts & Rigid Elements",
      "Mid-Surface Extraction",
      "1D, 2D & 3D Meshing",
      "Shell & Solid Meshing Techniques",
      "Quality Criteria & Element Checks",
      "Connections & Rigid Elements",
      "Model Setup for Structural Analysis",
      "Model Validation & Optimization"
    ],
    skills_gained: [
      "Introduction to CAE & FEA Concepts",
      "ANSA Interface & Workflow",
      "Geometry Cleanup & Topology",
      "Mid-Surface Extraction",
      "1D, 2D & 3D Meshing",
      "Shell & Solid Meshing Techniques",
      "Quality Criteria & Element Checks",
      "Connections & Rigid Elements",
      "Model Setup for Structural Analysis",
      "Model Validation & Optimization"
    ],
    tools: [
      "Geometry Cleanup",
      "Topo Module",
      "Mesh Module",
      "Deck Module (Solver Setup)",
      "Morphing Tool"
    ],
    features: [
      "Industry-Oriented Curriculum",
      "100% Practical Training",
      "Real-Time Engineering Projects",
      "Experienced Mechanical Trainers",
      "Lab-Based Simulation Practice",
      "Placement Assistance",
      "Resume & Interview Preparation",
      "Certification After Completion"
    ],
    eligibility: [
      "B.E / B.Tech Mechanical Students",
      "Diploma Mechanical Students",
      "M.E Mechanical Students",
      "Working Mechanical Engineers",
      "Freshers looking for core CAE jobs"
    ],
    career_opportunities: [
      { role: "CAE Engineer", description: "Prepare models for analysis and simulation." },
      { role: "FEA Engineer", description: "Perform finite element analysis on mechanical components." },
      { role: "Pre-Processing Engineer", description: "Specialized role in cleaning and meshing geometry." },
      { role: "Automotive CAE Engineer", description: "Focus on automotive subsystems and full-vehicle models." },
      { role: "Simulation Engineer", description: "Run and validate simulations for product development." },
      { role: "Structural Analysis Engineer", description: "Analyze structural integrity and durability." }
    ],
    faqs: [
      {
        question: "What is ANSA used for?",
        answer: "ANSA is used for pre-processing in Finite Element Analysis, including geometry cleanup, meshing, and model preparation."
      },
      {
        question: "Is ANSA good for mechanical engineers?",
        answer: "Yes. It is highly demanded in automotive and aerospace industries for CAE roles."
      },
      {
        question: "Do I need prior software knowledge?",
        answer: "Basic mechanical knowledge is enough. We teach from fundamentals."
      },
      {
        question: "Will I get placement support?",
        answer: "Yes. We provide resume building, interview guidance, and placement assistance."
      },
      {
        question: "Is this course suitable for diploma students?",
        answer: "Yes. Diploma and degree mechanical students can join."
      },
      {
        question: "Will I work on real projects?",
        answer: "Yes. You will practice with real engineering models and industry case studies."
      }
    ],
    seo: {
      title: "ANSA Course in Coimbatore | Lasak Edu",
      description: "Learn ANSA Pre-Processing from industry experts in Coimbatore at Lasak Edu. Master geometry cleanup, meshing, and model setup with full placement support today.",
      keywords: "ANSA Course in Coimbatore, CAE Training, FEA Pre-Processing, Lasak Edu, Mechanical Engineering Courses"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  {
    id: 'mech8',
    title: 'Computational Fluid Dynamics (CFD)',
    slug: "computational-fluid-dynamics",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹11,999',
    duration: '2 – 3 Months',
    image: '/img/mech/cfd-486z.webp',
    description: 'Master Computational Fluid Dynamics (CFD) and accelerate your career growth with expert-led training.',
    tagline: 'Master Computational Fluid Dynamics (CFD) and accelerate your career growth with expert-led training.',
    introduction: "Computational Fluid Dynamics (CFD) is a powerful simulation technique used to analyze fluid flow, heat transfer, and related physical phenomena. This course provides in-depth training in CFD theory and hands-on practice using industry-standard tools like ANSYS Fluent and ANSYS CFX.\n\nYou will learn how to simulate real-world engineering problems such as airflow over vehicles, heat exchangers, pipe flow, and thermal analysis through project-based learning.",
    long_description: "**Industries hiring include:**\n🚗 Automotive\n✈ Aerospace\n⚡ Energy\n❄ HVAC\n🏭 Manufacturing\n🔬 Research & Development",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Fluid Dynamics Fundamentals - Mastering Flow Physics, Governing Equations & Navier-Stokes Solver Theory",
      "Advanced Meshing for CFD - Professional Boundary Layer Gridding & High-Fidelity Volume Mesh Generation",
      "Solver Setting & Physics - Industry-Standard Turbulence Models & Complex Boundary Condition Physics",
      "Thermal Analysis Mastery - High-Performance Heat Transfer & Multiphase Flow Simulation Workflows",
      "Numerical Validation - Post-Processing Analysis, Result Interpretation & Industry-Standard Reporting",
    ],
    skills_gained: [
      "Fundamentals of Fluid Mechanics",
      "Governing Equations of CFD",
      "Meshing Techniques",
      "Boundary Conditions Setup",
      "Steady & Transient Analysis",
      "Turbulence Modeling",
      "Heat Transfer & Multiphase Flow",
      "Post-Processing & Result Interpretation",
      "Report Preparation & Documentation"
    ],
    tools: [
      "ANSYS Fluent",
      "ANSYS CFX",
      "OpenFOAM",
      "ParaView",
      "Mesh Generation Tools"
    ],
    features: [
      "Industry-Expert Trainers",
      "Strong Theoretical Foundation + Practical Implementation",
      "Real-Time Industrial Case Studies",
      "Hands-on Software Training",
      "Interview Preparation Support",
      "Placement Assistance"
    ],
    eligibility: [
      "Mechanical Engineering Students",
      "Aerospace Engineering Students",
      "Diploma Holders",
      "Fresh Graduates",
      "Working Professionals in Design & Simulation",
      "Anyone interested in Simulation and Fluid Analysis"
    ],
    career_opportunities: [
      { role: "CFD Engineer", description: "Simulate fluid flow and thermal behavior of products." },
      { role: "Simulation Engineer", description: "Develop virtual prototypes for testing and validation." },
      { role: "Thermal Design Engineer", description: "Optimize thermal management systems." },
      { role: "Aerodynamics Engineer", description: "Analyze aerodynamic performance of vehicles and aircraft." },
      { role: "CAE Analyst", description: "Perform computer-aided engineering analyses." }
    ],
    faqs: [
      {
        question: "Is prior knowledge of fluid mechanics required?",
        answer: "Basic understanding is helpful, but we cover essential concepts from the beginning."
      },
      {
        question: "Will I work on real-world simulations?",
        answer: "Yes, the course includes industrial case studies and project-based learning."
      },
      {
        question: "Is software training included?",
        answer: "Yes, complete hands-on training in ANSYS tools is provided."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, beginners with basic engineering knowledge can join."
      }
    ],
    seo: {
      title: "CFD Course in Coimbatore | Lasak Edu",
      description: "Master Computational Fluid Dynamics (CFD) in Coimbatore at Lasak Edu. Learn ANSYS Fluent, CFX, and turbulence modeling with dedicated career placement support.",
      keywords: "CFD Course in Coimbatore, Computational Fluid Dynamics, Lasak Edu, CFD Coaching Coimbatore, Thermal Analysis"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },

  {
    id: 'mech9',
    title: 'NX CAD (Unigraphics) Course (Mechanical Engineering)',
    slug: "nx-cad-unigraphics",
    category: 'Mechanical',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '2 – 3 Months',
    image: '/img/mech/nxcad-582z.webp',
    description: 'Master NX CAD (Unigraphics) and accelerate your career growth with expert-led training.',
    tagline: 'Master NX CAD (Unigraphics) and accelerate your career growth with expert-led training.',
    introduction: "Our NX CAD (Unigraphics) Course is designed for Mechanical Engineering students and professionals who want to build strong expertise in advanced product design and 3D modeling.\n\nNX CAD (formerly known as Unigraphics) is a powerful CAD/CAM/CAE software widely used in automotive, aerospace, tool design, and manufacturing industries. It is known for its advanced modeling capabilities and precision engineering design tools.\n\nThis course provides hands-on training in part modeling, assembly design, drafting, surface modeling, and basic manufacturing concepts. The focus is on practical learning with real-time industrial design examples.\n\nBy the end of this course, you will be able to create complex mechanical components and assemblies with industry-level standards.",
    long_description: "**Industries hiring NX CAD professionals:**\n🚗 Automotive Companies\n✈ Aerospace Industry\n🏭 Manufacturing Firms\n🛠 Tool & Die Industry\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹7 – ₹18 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "NX Mastering - Professional Interface Navigation, Complex Sketch Constraints & WCS Management",
      "Advanced Part Design - Master Solid, Surface & Powerful Synchronous Modeling Techniques",
      "Industrial Assembly - Large Assembly Management, Product Structure & Interference Analysis",
      "Production Drafting - Professional Detailing, GD&T Integration & Master Model Documentation",
      "Design Optimization - Complex Surface Modeling, Sheet Metal Design & Manufacturing Validation",
    ],
    skills_gained: [
      "Introduction to CAD & Product Design Concepts",
      "NX CAD Interface & Navigation",
      "Sketching & Constraint Techniques",
      "3D Part Modeling",
      "Assembly Design",
      "Drafting & Detailing",
      "Surface Modeling",
      "Sheet Metal Design Basics",
      "GD&T (Geometric Dimensioning & Tolerancing)",
      "Design Modifications & Optimization"
    ],
    tools: [
      "Sketcher",
      "Part Modeling",
      "Surface Modeling",
      "Assembly Design",
      "Drafting",
      "Sheet Metal",
      "Synchronous Modeling",
      "NX CAM Basics"
    ],
    features: [
      "Industry-Oriented Curriculum",
      "100% Practical Training",
      "Real-Time Industrial Projects",
      "Experienced Mechanical Trainers",
      "Lab-Based CAD Practice",
      "Placement Assistance",
      "Resume & Interview Preparation",
      "Certification After Completion"
    ],
    eligibility: [
      "B.E / B.Tech Mechanical Students",
      "Diploma Mechanical Students",
      "M.E Mechanical Students",
      "Working Mechanical Professionals",
      "Freshers seeking core design jobs"
    ],
    career_opportunities: [
      { role: "Design Engineer", description: "Design complex mechanical systems and components." },
      { role: "CAD Engineer", description: "Create detailed 2D and 3D models for manufacturing." },
      { role: "Product Design Engineer", description: "Develop new products from concept to final design." },
      { role: "Tool Design Engineer", description: "Design tools, dies, and molds for manufacturing." },
      { role: "Automotive Design Engineer", description: "Specialize in vehicle components and systems design." },
      { role: "Aerospace Design Engineer", description: "Design aircraft components and structures." }
    ],
    faqs: [
      {
        question: "What is NX CAD (Unigraphics) used for?",
        answer: "NX CAD is used for 3D product design, assembly modeling, drafting, and advanced mechanical engineering design."
      },
      {
        question: "Is NX CAD good for mechanical engineers?",
        answer: "Yes. It is widely used in automotive, aerospace, and manufacturing industries."
      },
      {
        question: "Do I need prior CAD knowledge?",
        answer: "Basic mechanical drawing knowledge is helpful, but we teach from fundamentals."
      },
      {
        question: "Will I get placement support?",
        answer: "Yes. We provide resume building, interview preparation, and placement assistance."
      },
      {
        question: "Is this course suitable for diploma students?",
        answer: "Yes. Diploma and degree mechanical students can join."
      },
      {
        question: "Will I work on real projects?",
        answer: "Yes. You will practice with real industrial design case studies."
      }
    ],
    seo: {
      title: "NX CAD Course in Coimbatore | Lasak Edu",
      description: "Learn NX CAD (Unigraphics) from industry experts in Coimbatore at Lasak Edu. Master 3D modeling, assembly, and drafting with guaranteed placement support help.",
      keywords: "NX CAD Course in Coimbatore, Unigraphics Training, Lasak Edu, Mechanical Design Training, Product Design"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  {
    id: 'mech10',
    title: 'Autodesk Inventor Course (Mechanical Engineering)',
    slug: "autodesk-inventor",
    category: 'Mechanical',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '1.5 – 3 Months',
    image: '/img/mech/autodesk-inventor-783z.webp',
    description: 'Master Autodesk Inventor and accelerate your career growth with expert-led training.',
    tagline: 'Master Autodesk Inventor and accelerate your career growth with expert-led training.',
    introduction: "Our Autodesk Inventor Course is designed for Mechanical Engineering students and professionals who want to develop strong skills in 3D mechanical design, product modeling, and engineering drafting.\n\nAutodesk Inventor is a powerful 3D CAD software widely used in manufacturing, product design, machinery design, and industrial engineering. It allows engineers to create accurate digital prototypes, simulate product performance, and generate production-ready drawings.\n\nThis course focuses on practical training with real-time industrial examples, helping students understand how to design mechanical components and assemblies professionally.\n\nBy the end of this course, you will be able to design complete mechanical products and generate detailed technical drawings confidently.",
    long_description: "**Industries hiring Autodesk Inventor professionals:**\n🏭 Manufacturing Companies\n🚗 Automotive Industry\n🛠 Machinery & Equipment Industry\n🏗 Industrial Product Companies\n\n**Average Fresher Salary in India:** ₹2.5 – ₹5 LPA\nWith Experience: ₹6 – ₹14 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Inventor Foundations - Master Sketch Blocks, Multi-body Solids & Parametric Part Design",
      "Advanced Assembly Design - Professional Interface Checking, Bill of Materials (BOM) & Motion Study",
      "Design Accelerators - Master Intelligent Shafts, Gears, Springs & Bolted Connection Generators",
      "Visual Simulation - Exploded Views, High-End Presentations & Dynamic Mechanism Animations",
      "Industrial Documentation - Master 2D Drafting, Sheet Metal Design & Weldment Design Workflows",
    ],
    skills_gained: [
      "Introduction to CAD & 3D Modeling Concepts",
      "Autodesk Inventor Interface & Tools",
      "Sketching & Parametric Modeling",
      "3D Part Modeling",
      "Assembly Design",
      "Exploded Views & Presentation",
      "Drafting & 2D Drawing Creation",
      "Sheet Metal Design",
      "Weldment Design Basics",
      "Design Modification & Optimization"
    ],
    tools: [
      "Sketcher",
      "Part Modeling",
      "Assembly Tools",
      "Drafting",
      "Sheet Metal Module",
      "Frame Generator",
      "Weldment Tools",
      "Surface Modeling",
      "iLogic (Design Automation)"
    ],
    features: [
      "Industry-Oriented Curriculum",
      "100% Practical Training",
      "Real-Time Industrial Design Projects",
      "Experienced Mechanical Trainers",
      "Lab-Based CAD Practice",
      "Placement Assistance",
      "Resume & Interview Preparation",
      "Certification After Completion"
    ],
    eligibility: [
      "B.E / B.Tech Mechanical Students",
      "Diploma Mechanical Students",
      "M.E Mechanical Students",
      "Working Mechanical Professionals",
      "Freshers looking for core design jobs"
    ],
    career_opportunities: [
      { role: "Design Engineer", description: "Design complex mechanical systems and components." },
      { role: "CAD Engineer", description: "Create detailed 2D and 3D models for manufacturing." },
      { role: "Mechanical Design Engineer", description: "Focus on mechanical systems and machinery design." },
      { role: "Product Development Engineer", description: "Develop new products from concept to final design." },
      { role: "Manufacturing Design Engineer", description: "Design tools and processes for manufacturing." },
      { role: "Tool Design Engineer", description: "Design tools, dies, and molds." }
    ],
    faqs: [
      {
        question: "What is Autodesk Inventor used for?",
        answer: "Autodesk Inventor is used for 3D mechanical design, product modeling, assembly design, and drafting."
      },
      {
        question: "Is Autodesk Inventor good for mechanical engineers?",
        answer: "Yes. It is widely used in manufacturing and product design industries."
      },
      {
        question: "Do I need prior CAD knowledge?",
        answer: "Basic mechanical drawing knowledge is helpful, but we teach from fundamentals."
      },
      {
        question: "Will I get placement support?",
        answer: "Yes. We provide resume building, interview preparation, and placement assistance."
      },
      {
        question: "Is this course suitable for diploma students?",
        answer: "Yes. Diploma and degree mechanical students can join."
      },
      {
        question: "Will I work on real projects?",
        answer: "Yes. You will practice with real industrial design case studies."
      }
    ],
    seo: {
      title: "Autodesk Inventor Course in Coimbatore | Lasak Edu",
      description: "Learn Autodesk Inventor from industry experts in Coimbatore at Lasak Edu. Master 3D modeling, assembly, and drafting with full placement support and training.",
      keywords: "Autodesk Inventor Course in Coimbatore, CAD Training, Lasak Edu, Inventor Coaching Coimbatore, Product Design"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  {
    id: 'mech11',
    title: 'Wiring Harness Design Course',
    slug: "wiring-harness-design",
    category: 'Mechanical',
    oldPrice: '₹35,000',
    price: '₹19,999',
    duration: '1.5 – 2 Months',
    image: '/img/mech/wiring-harness-catia-256z.webp',
    description: 'Master Wiring Harness Design and accelerate your career growth with expert-led training.',
    tagline: 'Master Wiring Harness Design and accelerate your career growth with expert-led training.',
    introduction: "Wiring Harness Design plays a critical role in industries like automotive, aerospace, and heavy machinery. This course provides comprehensive training on designing, routing, and documenting electrical harness systems using industry-standard tools such as CATIA V5 Electrical Workbench and AutoCAD Electrical.\n\nYou will gain hands-on experience in creating harness layouts, selecting connectors, preparing 2D drawings, and generating manufacturing documentation through real-time industry projects.",
    long_description: "**Industries hiring include:**\n🚗 Automotive OEMs\n⚡ EV Companies\n✈ Aerospace Firms\n🏭 Electrical Manufacturing Industries\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹8 – ₹15 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Electrical Distribution - Master Circuit Fundamentals, Component Selection & Electrical Schematics",
      "Harness Architecture - Professional Routing, Branching, Bundling & Wire Harness Packaging",
      "Digital Prototyping - Master CATIA V5 Electrical Workbench for 3D Harness Assembly Design",
      "Manufacturing Documentation - Connector Selection, Flattening & Precision 2D Formboard Drawings",
      "Production Standards - Master BOM Preparation, Industry Standards & Quality Documentation",
    ],
    skills_gained: [
      "Electrical Wiring Fundamentals",
      "Reading & Interpreting Electrical Schematics",
      "Harness Routing & Packaging Techniques",
      "Connector & Terminal Selection",
      "Creating 3D Harness Assemblies",
      "Harness Flattening & 2D Drawing Generation",
      "BOM (Bill of Materials) Preparation",
      "Industry Standards & Documentation"
    ],
    tools: [
      "CATIA V5 Electrical Workbench",
      "AutoCAD Electrical",
      "Harness Layout Tools",
      "Connector Selection Tools",
      "BOM Generation Tools"
    ],
    features: [
      "Expert Trainers with Real Industry Experience",
      "Hands-on Practical Sessions",
      "Live Project-Based Training",
      "Interview Preparation Support",
      "Resume Building Assistance",
      "Placement Guidance"
    ],
    eligibility: [
      "Mechanical Engineering Students",
      "Electrical & Electronics Engineering Students",
      "Diploma Holders",
      "Fresh Graduates",
      "Working Professionals (Mechanical/Electrical)",
      "Anyone interested in Automotive Electrical Systems"
    ],
    career_opportunities: [
      { role: "Wiring Harness Design Engineer", description: "Design and validate electrical wiring systems." },
      { role: "Electrical Design Engineer", description: "Develop electrical schematics and layouts." },
      { role: "Automotive Electrical Engineer", description: "Focus on vehicle electrical distribution systems." },
      { role: "Electrical CAD Designer", description: "Create 2D/3D electrical models and drawings." },
      { role: "Harness Packaging Engineer", description: "Ensure proper routing and packaging of harnesses." }
    ],
    faqs: [
      {
        question: "Do I need prior electrical knowledge?",
        answer: "Basic knowledge of electrical concepts is helpful but not mandatory. We cover fundamentals from the beginning."
      },
      {
        question: "Is software training included?",
        answer: "Yes, complete hands-on training in CATIA Electrical and related tools is included."
      },
      {
        question: "Will I get placement assistance?",
        answer: "Yes, we provide interview preparation and placement support."
      },
      {
        question: "Is this course suitable for mechanical students?",
        answer: "Yes, especially for those interested in automotive and electrical system design."
      }
    ],
    seo: {
      title: "Wiring Harness Design Course in Coimbatore | Lasak Edu",
      description: "Master Wiring Harness Design with expert training in Coimbatore at Lasak Edu. Learn CATIA Electrical, routing, and packaging with full placement support help.",
      keywords: "Wiring Harness Design Course in Coimbatore, Automotive Electrical Training, Lasak Edu, Harness Packaging, Electrical CAD Course"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  {

    id: 'mech12',
    title: '3D Printing & Prototyping',
    slug: "3d-printing-prototyping",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1 – 1.5 Months',
    image: '/img/mech/3d-399z.webp',
    description: 'Master 3D Printing & Prototyping and accelerate your career growth with expert-led training.',
    tagline: 'Master 3D Printing & Prototyping and accelerate your career growth with expert-led training.',
    introduction: "3D Printing & Prototyping is transforming product development across industries such as automotive, aerospace, medical, architecture, and consumer products. This course provides practical training on additive manufacturing technologies, design for 3D printing, material selection, and rapid prototyping workflows.\n\nYou will learn how to convert 3D models into physical prototypes using industry tools and real-time project practice.",
    long_description: "**Industries hiring include:**\n🏭 Manufacturing Companies\n🛠 Product Design Firms\n🔬 R&D Centers\n🚀 Startups & Innovation Labs",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Additive Manufacturing - Master FDM, SLA & SLS Technologies for Professional Plastic Prototyping",
      "Design for 3D Printing - Master DfAM Rules, Topology Optimization & Structural Support Strategies",
      "Slicing Excellence - Professional Cura/Prusa Setup, Layer Control & G-Code Optimization",
      "Post-Processing Art - Professional Material Handling, Surface Finishing & Prototype Assembly",
      "Product Iteration - Master Testing, Validation & Industry-Standard Prototyping Workflows",
    ],
    skills_gained: [
      "Fundamentals of Additive Manufacturing",
      "Types of 3D Printing Technologies",
      "Design for 3D Printing (DFAM)",
      "3D Model Preparation & STL Export",
      "Slicing Software Usage",
      "Printer Setup & Calibration",
      "Material Selection",
      "Post-Processing Techniques",
      "Prototype Testing & Product Iteration"
    ],
    tools: [
      "Autodesk Fusion 360",
      "Tinkercad",
      "Ultimaker Cura",
      "PrusaSlicer",
      "FDM Printers",
      "SLA Printers",
      "Post-Processing Tools"
    ],
    features: [
      "Hands-on Training with Real 3D Printers",
      "Project-Based Practical Sessions",
      "Industry-Relevant Curriculum",
      "Expert Mentorship",
      "Interview Preparation Support",
      "Placement Assistance"
    ],
    eligibility: [
      "Mechanical Engineering Students",
      "Diploma Holders",
      "Product Design Enthusiasts",
      "Entrepreneurs & Startup Founders",
      "Working Professionals",
      "Anyone interested in Modern Manufacturing Technologies"
    ],
    career_opportunities: [
      { role: "3D Printing Technician", description: "Operate and maintain 3D printing equipment." },
      { role: "Rapid Prototyping Engineer", description: "Develop physical prototypes for testing and validation." },
      { role: "Additive Manufacturing Engineer", description: "Optimize manufacturing processes using 3D printing." },
      { role: "Product Development Engineer", description: "Design and refine new products." },
      { role: "Prototype Designer", description: "Create functional models for design reviews." }
    ],
    faqs: [
      {
        question: "Do I need prior CAD knowledge?",
        answer: "Basic CAD knowledge is helpful but not mandatory."
      },
      {
        question: "Will I get hands-on experience with a 3D printer?",
        answer: "Yes, practical sessions include real printer operation and material handling."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, we start from fundamentals and move to advanced prototyping concepts."
      },
      {
        question: "Can this help me start my own 3D printing business?",
        answer: "Yes, the course also covers practical insights for starting small-scale 3D printing services."
      }
    ],
    seo: {
      title: "3D Printing & Prototyping Course in Coimbatore | Lasak Edu",
      description: "Master 3D Printing & Prototyping in Coimbatore at Lasak Edu. Learn FDM, SLA, Slicing, and DfAM from experts with hands-on training and placement support help.",
      keywords: "3D Printing Course in Coimbatore, Prototyping Training, Lasak Edu, 3D Printer Course Coimbatore, Product Design"
    },
    companies: [
      { name: "Tata", logo: "https://example.com/tata.png" },
      { name: "Bosch", logo: "https://example.com/bosch.png" },
      { name: "Siemens", logo: "https://example.com/siemens.png" },
    ]
  },
  // --- IT COURSES ---
  {
    id: 'it1',
    title: 'Full Stack Development Course – Build Complete Web Applications',
    slug: "full-stack-development",
    category: 'IT',
    oldPrice: '₹60,000',
    price: '₹34,999',
    duration: "4 – 6 Months",
    image: '/img/it/full-stack-development-171z.webp',
    description: 'Master Front-End, Back-End, Databases, and Deployment with React & Node.js.',
    seo: {
      title: "Full Stack Development Course in Coimbatore | Lasak Edu",
      description: "Join our Full Stack Development Course in Coimbatore at Lasak Edu. Master MERN Stack, React, and Node.js with real-time projects and full job placement support.",
      keywords: "Full Stack Development Course in Coimbatore, MERN Stack Training, Full Stack Developer Course, Web Development Training Coimbatore, Lasak Edu, React JS, Node.js, Placement Assistance"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Full Stack Development Course – Build Complete Web Applications",
    introduction: "Our Full Stack Development Course is designed to make you a complete web developer capable of building both front-end and back-end applications. This course covers everything from designing user interfaces to managing servers and databases.\n\nYou will learn how to create responsive websites, develop REST APIs, connect databases, implement authentication systems, and deploy applications to live servers.",
    long_description: "By the end of the course, you will be able to build complete full-stack web applications independently. The training is fully practical and project-based, ensuring you gain real-world development experience.\n\n**Average Salary in India:**\n• Freshers: ₹3 – ₹6 LPA\n• Experienced: ₹8 – ₹18 LPA+\n\n**Career Paths:**\n• Full Stack Developer\n• Front-End Developer\n• Back-End Developer\n• React Developer\n• Node.js Developer",
    skills_gained: [
      "Front-End Development (HTML, CSS, JavaScript)",
      "Responsive Web Design",
      "React JS for Modern UI Development",
      "Back-End Development using Node.js & Express",
      "REST API Development",
      "Database Management (MongoDB / MySQL)",
      "Authentication & Authorization",
      "CRUD Operations",
      "Version Control using Git & GitHub",
      "Deployment of Web Applications"
    ],
    modules: [
      "Frontend Development - HTML5, CSS3, JavaScript (ES6+)",
      "React JS - Components, Hooks, State Management (Redux/Context API)",
      "Backend Development - Node.js Architecture, Express.js Framework",
      "Database Management - MongoDB (NoSQL), MySQL (SQL), Mongoose ODM",
      "API Development - RESTful APIs, Postman Testing, Authentication (JWT)",
      "Version Control - Git commands, GitHub collaboration",
      "Deployment - Hosting on Vercel, Netlify, Render, AWS Basics",
      "Real-Time Projects - E-commerce App, Social Media Dashboard, CMS"
    ],
    tools: ["VS Code", "Git", "GitHub", "Postman", "Docker", "MongoDB Compass", "Firebase", "Vercel", "Netlify", "React Developer Tools"],
    eligibility: [
      "B.E / B.Tech / BCA / MCA Students",
      "Degree Students",
      "Working Professionals",
      "Career Switchers",
      "Beginners (No Prior Coding Knowledge Required)"
    ],
    career_opportunities: [
      { role: "Full Stack Developer", description: "Handle both client-side and server-side development." },
      { role: "Front-End Developer", description: "Specialize in building interactive user interfaces." },
      { role: "Back-End Developer", description: "Focus on server logic, databases, and APIs." },
      { role: "Web Application Developer", description: "Build complex web-based software solutions." },
      { role: "Software Developer", description: "Develop and maintain software systems." },
      { role: "React Developer", description: "Specialized role focusing on React.js ecosystem." },
      { role: "Node.js Developer", description: "Specialized role focusing on server-side JavaScript." }
    ],
    faqs: [
      {
        question: "1. Is this course beginner-friendly?",
        answer: "Yes. We start from basic HTML and move step-by-step to advanced full stack concepts."
      },
      {
        question: "2. Is this a MERN stack course?",
        answer: "Yes. It includes MongoDB, Express, React, and Node.js, which is the most popular stack."
      },
      {
        question: "3. Will I build real projects?",
        answer: "Yes. You will build multiple full stack real-time projects including an e-commerce platform."
      },
      {
        question: "4. Do you provide placement support?",
        answer: "Yes. We provide resume building, mock interviews, and placement assistance."
      },
      {
        question: "5. Do I need coding experience?",
        answer: "No prior experience is required. Basic computer knowledge is enough."
      },
      {
        question: "6. Will I get certification?",
        answer: "Yes. You will receive a Full Stack Development certification after course completion."
      }
    ],
    features: [
      "Industry-Based Curriculum",
      "100% Practical Training",
      "Real-Time Live Projects",
      "Modern Tech Stack (React + Node)",
      "Internship & Placement Assistance",
      "Resume & Interview Preparation",
      "Flexible Batch Timings",
      "Certification After Completion"
    ],
    companies: [
      { name: "Google", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/googlelogo.jpg" },
      { name: "Microsoft", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/98f4652a969c5dd1c29ff94c661f7d51e3a2aeb9/Microsoftlogo.jpg" },
      { name: "Amazon", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
      { name: "TCS", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg" },
      { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
      { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
      { name: "Zoho", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/a2a0cbc04401cc7b57c6f07b75ec42dd611a75f3/zohologo.png" },
      { name: "Freshworks", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/751d82d902a13278b0333b733061dcbb81622197/Freshworkslogo.png" }
    ]
  },
  {
    id: 'it2',
    title: 'Web Development Course – Become a Full Stack Developer',
    slug: "web-development",
    category: 'IT',
    oldPrice: '₹34,999',
    price: '₹13,999',
    duration: "3 – 4 Months",
    image: '/img/it/web-development-387z.webp',
    description: 'Our Web Development Course is designed to help you become a professional Full Stack Web Developer. Learn to design, develop, and deploy modern websites.',
    seo: {
      title: "Web Development Course in Coimbatore | Lasak Edu",
      description: "Learn Web Development in Coimbatore at Lasak Edu. Master HTML, CSS, JavaScript, React, and Node.js. Best Full Stack Web Development training with placement.",
      keywords: "Web Development Course in Coimbatore, Front End Development, Back End Development, Full Stack Web Developer, Lasak Edu, HTML, CSS, JavaScript"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Web Development Course – Become a Full Stack Developer",
    introduction: "Our Web Development Course is designed to help you become a professional Full Stack Web Developer. In this course, you will learn how to design, develop, and deploy modern websites and web applications using the latest technologies.\n\nWe start from the basics of HTML and CSS, then move to JavaScript, React, Node.js, and databases. The course is fully practical and project-based, ensuring that you gain real-world experience.",
    long_description: "By the end of the course, you will be able to build dynamic, responsive, and fully functional web applications independently. Web Development offers excellent career opportunities in India and globally.\n\n**Average Salary in India:**\n• Freshers: ₹3 – ₹6 LPA\n• Experienced: ₹8 – ₹15 LPA+\n\n**Career Paths:**\n• Front-End & Back-End Development\n• Full Stack Web Applications\n• Remote Freelancing & Startups",
    skills_gained: [
      "Responsive Web Design (HTML & CSS)",
      "Interactive Pages (JavaScript)",
      "Modern UI (React JS)",
      "REST APIs (Node.js & Express)",
      "Database Management (MongoDB / MySQL)",
      "Authentication & Authorization"
    ],
    modules: [
      "HTML & CSS - Responsive layouts, Flexbox, Grid, CSS animations",
      "JavaScript - ES6+, DOM manipulation, Async/Await, API calls",
      "React JS - Components, Hooks, State management, Routing",
      "Node.js & Express - Server setup, RESTful APIs, Middleware",
      "Databases - MongoDB models, MySQL queries, Data persistence",
      "Authentication - JWT, Session management, Secure routes",
      "Deployment - Hosting on Vercel/Netlify/Heroku, CI/CD basics",
      "Real-Time Full Stack Projects & Performance Optimization"
    ],
    tools: ["VS Code", "Chrome DevTools", "GitHub", "Postman", "npm/yarn", "MongoDB Atlas", "Vercel", "Netlify", "Docker"],
    eligibility: [
      "B.E / B.Tech / BCA / MCA Students",
      "Degree Students (Any stream)",
      "Working Professionals",
      "Career Switchers",
      "Beginners with no coding knowledge (We teach from basics)"
    ],
    career_opportunities: [
      { role: "Front-End Developer", description: "Build and optimize visible parts of web applications." },
      { role: "Back-End Developer", description: "Create and manage server-side logic and database integration." },
      { role: "Full Stack Developer", description: "Handle both frontend and backend development independently." },
      { role: "Web Application Developer", description: "Develop complex business applications for web browsers." },
      { role: "UI Developer", description: "Implement high-fidelity designs into functional web interfaces." },
      { role: "Freelance Developer", description: "Work independently for global clients and startups." }
    ],
    faqs: [
      {
        question: "1. Do I need prior coding knowledge?",
        answer: "No. This course starts from basics and is beginner-friendly. We guide you through every step of the journey."
      },
      {
        question: "2. Will I get a certificate?",
        answer: "Yes, you will receive a professional Web Development certification after successful completion of the course and projects."
      },
      {
        question: "3. Is this a full stack course?",
        answer: "Yes. It covers both front-end (HTML, CSS, React) and back-end (Node.js, Express, MongoDB) development."
      },
      {
        question: "4. Will you provide placement assistance?",
        answer: "Yes, we provide comprehensive resume building, interview preparation, and placement support to make you job-ready."
      },
      {
        question: "5. Can I build real projects during the course?",
        answer: "Yes. You will work on multiple live real-time projects to build a strong professional portfolio."
      },
      {
        question: "6. What technologies are covered?",
        answer: "The curriculum covers HTML, CSS, JavaScript, React JS, Node.js, Express, MongoDB, and modern deployment tools."
      }
    ],
    features: [
      "Industry-Oriented Curriculum",
      "100% Practical Training",
      "Real-Time Live Projects",
      "Experienced Trainers",
      "Placement Assistance",
      "Internship Support",
      "Flexible Timings",
      "Certification After Completion"
    ],
    companies: [
      { name: "Zoho", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/a2a0cbc04401cc7b57c6f07b75ec42dd611a75f3/zohologo.png" },
      { name: "Freshworks", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/751d82d902a13278b0333b733061dcbb81622197/Freshworkslogo.png" },
      { name: "TCS", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
      { name: "Cognizant", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/79f6eecc6f373ce51f67403aaf721f59b56f2ce7/Cognizant%20logo.jpeg" },
      { name: "HCL", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/902028abf9255f402c63c7c0f5e72f32668fc6c9/HCLlogo.png" },
      { name: "Tech Mahindra", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/902028abf9255f402c63c7c0f5e72f32668fc6c9/Tech%20Mahindralogo.png" }
    ]
  },
  {
    id: 'it3',
    title: 'Software Testing Course – Become a QA Expert',
    slug: "software-testing",
    category: 'IT',
    oldPrice: '₹34,999',
    price: '₹13,999',
    duration: "3 – 4 Months",
    image: '/img/it/st-291z.webp',
    description: 'Master Manual and Automation Testing (Selenium) with real-time projects and placement support.',
    seo: {
      title: "Software Testing Course in Coimbatore | Lasak Edu",
      description: "Best Software Testing Course in Coimbatore at Lasak Edu. Learn Manual Testing, Selenium Automation, API Testing, and QA tools with 100% placement assistance.",
      keywords: "Software Testing Course in Coimbatore, Selenium Automation Training, QA Training Coimbatore, Manual Testing Course, Software Testing Institute, Lasak Edu, API Testing"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Software Testing Course – Become a QA Expert",
    introduction: "Our Software Testing Course is designed to help you become a skilled Quality Assurance (QA) professional. In this course, you will learn how to test software applications to ensure they are bug-free, secure, and high-performing.\n\nWe cover both Manual Testing and Automation Testing, including real-time projects and industry-standard tools. The course focuses on practical knowledge so you can confidently work on live projects in IT companies.",
    long_description: "By the end of the course, you will understand the complete Software Testing Life Cycle (STLC) and be ready to work as a QA Engineer. Software Testing is one of the most stable and in-demand IT careers.\n\n**Average Salary in India:**\n• Freshers: ₹2.5 – ₹5 LPA\n• Experienced: ₹6 – ₹12 LPA+\n\n**Career Paths:**\n• Software Tester\n• QA Engineer\n• Automation Tester\n• Test Analyst",
    skills_gained: [
      "Software Testing Life Cycle (STLC)",
      "Manual Testing Concepts",
      "Test Case Writing & Execution",
      "Bug Reporting & Defect Tracking",
      "Functional & Non-Functional Testing",
      "Regression & Smoke Testing",
      "API Testing Basics",
      "Automation Testing with Selenium",
      "Basic SQL for Testing",
      "Agile & Scrum Methodology"
    ],
    modules: [
      "Introduction to Software Testing - Types, Methods, Principles",
      "Software Testing Life Cycle (STLC) - Requirements to Closure",
      "Test Case Design - Writing effective test scenarios",
      "Defect Management - Bug Life Cycle, Jira, Bugzilla",
      "API Testing - Postman, REST API Basics",
      "Database Testing - SQL Queries for Validation",
      "Automation Testing (Selenium) - Java Basics, WebDriver, Locators",
      "Frameworks - TestNG, Cucumber (BDD), Page Object Model",
      "Mobile Testing Basics (Appium Overview)",
      "Real-Time Project Work"
    ],
    tools: ["Selenium", "Postman", "JIRA", "TestNG", "Cucumber", "Appium", "JMeter", "SoapUI", "MySQL"],
    eligibility: [
      "B.E / B.Tech / BCA / MCA Students",
      "Degree Students (Any Stream)",
      "Freshers",
      "Working Professionals",
      "Career Switchers",
      "Beginners (No Coding Knowledge Required for Manual Testing)"
    ],
    career_opportunities: [
      { role: "Software Tester", description: "Execute test cases to identify bugs." },
      { role: "QA Engineer", description: "Ensure the quality of software products through testing." },
      { role: "Automation Tester", description: "Write scripts to automate testing processes." },
      { role: "Test Analyst", description: "Analyze requirements and design test strategies." },
      { role: "Quality Assurance Analyst", description: "Monitor and improve the software development process." },
      { role: "Selenium Automation Engineer", description: "Specialize in automated web testing using Selenium." }
    ],
    faqs: [
      {
        question: "1. Do I need programming knowledge?",
        answer: "No. Programming is not required for Manual Testing. Basic coding is helpful for Automation Testing, which we teach from scratch."
      },
      {
        question: "2. Will I learn Automation Testing?",
        answer: "Yes. We cover Selenium Automation along with Manual Testing to make you a complete QA professional."
      },
      {
        question: "3. Is Software Testing a good career?",
        answer: "Yes. It offers stable job opportunities, good salary growth, and is less coding-intensive than development."
      },
      {
        question: "4. Will I get placement support?",
        answer: "Yes. We provide resume preparation, mock interviews, and placement assistance."
      },
      {
        question: "5. What tools will I learn?",
        answer: "You will learn industry-standard tools like Selenium, Jira (for bug tracking), Postman, and basic SQL."
      },
      {
        question: "6. Is this course beginner-friendly?",
        answer: "Yes. We start from basic concepts and move to advanced topics, making it suitable for everyone."
      }
    ],
    features: [
      "Industry-Oriented Curriculum",
      "Manual + Automation Training",
      "Real-Time Project Practice",
      "Hands-On Selenium Training",
      "Placement Assistance",
      "Resume & Interview Preparation",
      "Flexible Batch Timings",
      "Certification After Completion"
    ],
    companies: [
      { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
      { name: "Capgemini", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/5388718543e52742afd62cda1f08add771c79e8d/Capgeminilogo.png" },
      { name: "Cognizant", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/79f6eecc6f373ce51f67403aaf721f59b56f2ce7/Cognizant%20logo.jpeg" },
      { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
      { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
      { name: "TCS", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg" }
    ]
  },
  {
    id: 'it4',
    title: 'Data Analytics Course – Turn Data into Powerful Insights',
    slug: "data-analytics",
    category: 'IT',
    oldPrice: '₹29,999',
    price: '₹10,999',
    duration: "3 to 4 Months",
    image: '/img/it/da-013z.webp',
    description: 'Learn to collect, analyze, interpret, and visualize data using industry-standard tools like Excel, SQL, Power BI, and Python.',
    seo: {
      title: "Data Analytics Course in Coimbatore | Lasak Edu",
      description: "Master Data Analytics in Coimbatore at Lasak Edu. Learn Excel, SQL, Power BI, and Python. Best Data Analytics training with real-time projects and placement.",
      keywords: "Data Analytics Course in Coimbatore, Data Analyst Training, Power BI Course, SQL Training Coimbatore, Lasak Edu, Python for Data Analysis"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Data Analytics Course – Turn Data into Powerful Insights",
    introduction: "In today’s digital world, data is one of the most valuable assets for businesses. Companies use data analytics to make smart decisions, improve performance, increase profits, and understand customer behavior.\n\nOur Data Analytics Course is designed to help students learn how to collect, analyze, interpret, and visualize data using industry-standard tools like Excel, SQL, Power BI, and Python.\n\nThis course focuses on practical implementation and real-time business case studies. Students will learn how to transform raw data into meaningful insights and reports that help organizations grow.",
    long_description: "Data Analytics is one of the highest-demand career fields in India and globally. Every business depends on data-driven decisions to optimize their operations and maximize growth.\n\n**Average Salary in India:**\n• Freshers: ₹18,000 – ₹30,000 per month\n• Experienced: ₹40,000 – ₹80,000+ per month\n• Senior Data Analysts: ₹6–12 LPA\n\n**Industries Hiring Data Professionals:**\n• IT & Tech Companies\n• Banking & Finance\n• E-commerce & Retail\n• Healthcare & Marketing",
    skills_gained: [
      "Microsoft Excel for Data Analysis",
      "SQL (Structured Query Language)",
      "Power BI Dashboard Development",
      "Python for Data Analytics",
      "Business Analytics & Reporting"
    ],
    modules: [
      "Microsoft Excel - Advanced formulas, Pivot Tables, Data cleaning, Charts & Dashboards",
      "SQL - Database concepts, Joins, Subqueries, Aggregate Functions, Data management",
      "Power BI - Data modeling, Interactive dashboards, DAX basics, Visualization techniques",
      "Python for Data Analytics - Pandas, Matplotlib, Data cleaning & transformation",
      "Business Analytics - KPI tracking, Sales analysis, Financial data, Customer behavior",
      "Report Presentation & Professional Communication skills"
    ],
    tools: ["Excel", "SQL Server", "MySQL", "Python", "Pandas", "Power BI", "Tableau", "GitHub", "Jupyter Notebook"],
    eligibility: [
      "10th / 12th pass students",
      "Commerce & Management students",
      "Engineering students",
      "MBA students",
      "Working professionals",
      "Non-technical background students (No coding knowledge required)"
    ],
    career_opportunities: [
      { role: "Data Analyst", description: "Collect and interpret data to provide actionable business insights." },
      { role: "Business Analyst", description: "Analyze business processes and suggest data-driven solutions." },
      { role: "MIS Executive", description: "Manage management information systems and generate reports." },
      { role: "Reporting Analyst", description: "Create and maintain complex reports for various departments." },
      { role: "Power BI Developer", description: "Design and develop interactive dashboards and visualizations." },
      { role: "Junior Data Scientist", description: "Assist in building predictive models and advanced analytics." }
    ],
    faqs: [
      {
        question: "1. Do I need programming knowledge for Data Analytics?",
        answer: "No. Basic Excel knowledge is enough to start. Python is taught from basics if included in the curriculum."
      },
      {
        question: "2. Is this course suitable for non-IT students?",
        answer: "Yes. Even commerce and management students can join this course and build a successful career in data."
      },
      {
        question: "3. Will I work on real-time projects?",
        answer: "Yes. Students work on real business case studies and dashboard development projects."
      },
      {
        question: "4. Is certification provided?",
        answer: "Yes. You will receive a course completion certificate after successfully completing the training."
      },
      {
        question: "5. Is placement assistance available?",
        answer: "Yes. We provide resume building, interview guidance, and placement support."
      },
      {
        question: "6. Can I move to Data Science after this?",
        answer: "Yes. Data Analytics provides the foundation for entering the field of Data Science and Machine Learning."
      }
    ],
    features: [
      "Beginner-Friendly Curriculum",
      "Industry-Oriented Training",
      "Real-Time Case Studies",
      "Practical Projects",
      "Dashboard Development Practice",
      "Resume & Interview Preparation",
      "Certification After Completion",
      "Placement Assistance"
    ],
    companies: [
      { name: "Amazon", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg" },
      { name: "Flipkart", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Flipkartlogo.png" },
      { name: "Deloitte", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Deloittelogo.jpg" },
      { name: "EY", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/EYlogo.jpg" },
      { name: "KPMG", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/KPMGlogo.png" },
      { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
      { name: "TCS", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" }
    ]
  },

  {
    id: 'it5',
    title: 'Java Programming Course | Beginner to Advanced Training',
    slug: "java-programming",
    category: 'IT',
    oldPrice: '₹29,999',
    price: '₹11,999',
    duration: "210 Hours",
    image: '/img/it/java-747z.webp',
    description: 'Build a strong career in software development with our comprehensive Java Programming Course. Learn from basics to advanced Core Java with practical training and projects.',
    seo: {
      title: "Java Programming Course in Coimbatore | Lasak Edu",
      description: "Join our Java Programming Course in Coimbatore at Lasak Edu. Master Core Java, OOP, and software development with 100% practical training and placement support.",
      keywords: "Java Programming Course in Coimbatore, Core Java Training, Software Development, Lasak Edu, Java Coaching Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Build a Strong Career in Software Development – Master Core Java with Practical Training",
    introduction: "Java is one of the most powerful and widely used programming languages in the world. It is used to develop web applications, desktop applications, enterprise software, Android applications, and large-scale business systems.\n\nOur Java Programming Course is designed to help students learn programming fundamentals and master Core Java concepts with practical implementation. This course focuses on logical thinking, object-oriented programming (OOP), and real-time coding practice.",
    long_description: "Java is highly demanded in IT companies because it is secure, platform-independent, and widely used in enterprise-level applications. Learning Java opens doors to career opportunities in software development, backend development, and full stack development.\n\n**Average Salary in India:**\n• Freshers: ₹15,000 – ₹25,000 per month\n• Experienced: ₹30,000 – ₹70,000+ per month",
    skills_gained: [
      "Java Fundamentals",
      "Object-Oriented Programming (OOP)",
      "Arrays & Collections Framework",
      "Exception Handling",
      "File Handling & Data Processing"
    ],
    modules: [
      "Java Fundamentals - Variables, Data Types, Control Flow, Loops",
      "Object-Oriented Programming (OOP) - Classes, Inheritance, Polymorphism",
      "Arrays & Collections - ArrayList, HashMap, LinkedList, Collection Framework",
      "Exception Handling - Try-Catch Blocks, Custom Exceptions, Error Handling",
      "File Handling - Reading/Writing Files, BufferedReader, FileWriter",
      "Practical Mini Projects - Student Management, Banking, Billing Apps"
    ],
    tools: ["IntelliJ IDEA", "Eclipse", "Spring Boot", "Hibernate", "Maven", "Gradle", "MySQL", "Postman"],
    eligibility: [
      "10th / 12th pass students",
      "Diploma students",
      "Engineering students",
      "Non-IT background students",
      "Final-year students",
      "Job seekers"
    ],
    career_opportunities: [
      { role: "Java Developer", description: "Design and implement Java-based applications and system logic." },
      { role: "Software Developer", description: "Develop and test software solutions using modern frameworks." },
      { role: "Backend Developer", description: "Build scalable server-side systems and API integrations." },
      { role: "Application Developer", description: "Create and maintain desktop or mobile applications." },
      { role: "Junior Programmer", description: "Support development teams by writing and debugging code." }
    ],
    faqs: [
      {
        question: "1. Is Java difficult to learn?",
        answer: "No. With proper guidance and practice, Java is easy to understand, especially with structured training."
      },
      {
        question: "2. Do I need coding knowledge before joining?",
        answer: "No. We start from basics and gradually move to advanced concepts."
      },
      {
        question: "3. Is this course useful for getting a job?",
        answer: "Yes. Java is one of the most in-demand programming languages in IT companies."
      },
      {
        question: "4. Will I get a certificate?",
        answer: "Yes. Students receive a course completion certificate after successful completion."
      },
      {
        question: "5. Is placement support provided?",
        answer: "Yes. We provide resume building, interview preparation, and placement assistance."
      },
      {
        question: "6. Can I move to Full Stack Development after Java?",
        answer: "Yes. After Core Java, you can continue with Advanced Java, Spring Boot, and Full Stack Development."
      }
    ],
    features: [
      "Beginner-Friendly Training",
      "Step-by-Step Learning",
      "Practical Coding Sessions",
      "Real-Time Mini Projects",
      "Resume Preparation",
      "Interview Training",
      "Certification",
      "Placement Assistance"
    ],
    companies: [
      { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
      { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
      { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
      { name: "TCS", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg" },
      { name: "Capgemini", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/5388718543e52742afd62cda1f08add771c79e8d/Capgeminilogo.png" },
      { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" }
    ]
  },
  {
    id: 'it6',
    title: 'Python Programming | Beginner to Advanced Training',
    slug: "python-programming",
    category: 'IT',
    oldPrice: '₹27,999',
    price: '₹10,999',
    duration: "180 Hours",
    image: '/img/it/python-267z.webp',
    description: 'Learn Python Programming from basics to advanced with practical training, real-time projects, and placement assistance. Join the best Python course in coimbatore and start your career as a Python Developer today.',
    seo: {
      title: "Python Programming Course in Coimbatore | Lasak Edu",
      description: "Python Programming Course in Coimbatore at Lasak Edu. Learn Python from scratch to advanced level with real-world projects and dedicated placement support help.",
      keywords: "Python Programming Course in Coimbatore, Python Developer Training, Lasak Edu, Python Coaching Coimbatore, Web Development"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Master Python Programming from basics to advanced with practical training, real-time projects, and placement assistance.",
    introduction: "Python is one of the most popular and fastest-growing programming languages in the world. It is widely used in software development, web development, data science, artificial intelligence, automation, and machine learning. Because of its simple syntax and powerful capabilities, Python is the first choice for beginners and professionals alike.\n\nOur Python Programming Course is designed to provide a strong foundation in programming concepts while focusing on real-time practical implementation. This course helps students develop logical thinking, coding skills, and problem-solving ability required in the IT industry.",
    long_description: "Python is one of the most popular and fastest-growing programming languages in the world. It is widely used in software development, web development, data science, artificial intelligence, automation, and machine learning. Because of its simple syntax and powerful capabilities, Python is the first choice for beginners and professionals alike.\n\nOur Python Programming Course is designed to provide a strong foundation in programming concepts while focusing on real-time practical implementation. This course helps students develop logical thinking, coding skills, and problem-solving ability required in the IT industry.\n\n**Average Salary in India:**\n• Freshers: ₹15,000 – ₹25,000 per month\n• 2–3 Years Experience: ₹30,000 – ₹60,000+ per month\n• Experienced Developers: ₹8 LPA and above",
    skills_gained: [
      "Python Fundamentals",
      "Conditional Statements & Loops",
      "Functions & Modules",
      "Object-Oriented Programming (OOP)",
      "File Handling & Exception Handling"
    ],
    modules: [
      "Python Fundamentals - Variables, Data Types, Operators, Input/Output",
      "Conditional Statements & Loops - If-Else, For/While Loops, Control Flow",
      "Functions & Modules - Lambda Functions, Built-in & Custom Modules",
      "Object-Oriented Programming (OOP) - Classes, Inheritance, Encapsulation",
      "File Handling & Exception Handling - CRUD operations, Error handling",
      "Real-Time Mini Projects - Calculator, Management System, Automation Scripts"
    ],
    tools: ["PyCharm", "VS Code", "Jupyter Notebook", "NumPy", "Pandas", "Flask", "Django", "Git"],
    eligibility: [
      "10th / 12th pass students",
      "Diploma students",
      "Engineering students",
      "Non-IT background students",
      "Final-year students",
      "Job seekers",
      "Working professionals"
    ],
    career_opportunities: [
      { role: "Python Developer", description: "Build and maintain various software applications and tools." },
      { role: "Junior Software Developer", description: "Assist in developing and testing code for new applications." },
      { role: "Backend Developer", description: "Design and implement the server-side logic of web applications." },
      { role: "Automation Engineer", description: "Create and implement automated testing and processing scripts." },
      { role: "Technical Support Engineer", description: "Provide technical assistance and support for Python-based applications." },
      { role: "Data Science Aspirant", description: "Use Python as a foundation for transitioning into Data Science and ML." }
    ],
    faqs: [
      {
        question: "1. Is Python easy to learn for beginners?",
        answer: "Yes. Python is one of the easiest programming languages due to its simple syntax and readability."
      },
      {
        question: "2. Do I need mathematics knowledge to learn Python?",
        answer: "Basic logical thinking is sufficient. Advanced mathematics is not required."
      },
      {
        question: "3. Is practical training included?",
        answer: "Yes. This course includes daily coding practice and real-time mini projects."
      },
      {
        question: "4. Will I receive a certificate?",
        answer: "Yes. Students receive a course completion certificate after successfully finishing the program."
      },
      {
        question: "5. Is placement assistance available?",
        answer: "Yes. We provide resume preparation, interview guidance, and placement assistance support."
      },
      {
        question: "6. Can I move to Full Stack Development after this?",
        answer: "Yes. Python Programming is the foundation for Python Full Stack Development and advanced technologies."
      }
    ],
    features: [
      "Beginner-Friendly Curriculum",
      "Step-by-Step Learning Approach",
      "Practical Coding Sessions",
      "Real-Time Mini Projects",
      "Interview Preparation",
      "Resume Building Support",
      "Certification After Completion",
      "Placement Assistance"
    ],
    companies: [
      { name: "Amazon", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg" },
      { name: "Flipkart", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Flipkartlogo.png" },
      { name: "Deloitte", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Deloittelogo.jpg" },
      { name: "EY", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/EYlogo.jpg" },
      { name: "KPMG", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/KPMGlogo.png" },
      { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
      { name: "TCS", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" }
    ]
  },
  {
    id: 'it7',
    title: 'Digital Marketing (Adv) | Master Digital Marketing Excellence',
    slug: "digital-marketing-adv",
    category: 'IT',
    oldPrice: '₹29,999',
    price: '₹10,999',
    duration: "210 Hours",
    image: '/img/it/digital-marketing-875z.webp',
    description: 'Master SEO, SEM, and Social Media Marketing strategies to grow brands and increase sales.',
    seo: {
      title: "Digital Marketing Course in Coimbatore | Lasak Edu",
      description: "Master SEO, SEM, and Social Media Marketing in Coimbatore at Lasak Edu. Learn to grow brands and increase sales with 100% practical digital marketing training.",
      keywords: "Digital Marketing Course in Coimbatore, SEO Training, SEM Course, SMM Training, Lasak Edu, Online Marketing"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Master SEO, SEM & Social Media Marketing – Grow Your Brand Digitally",
    introduction: "Our Digital Marketing Course is designed to provide practical, industry-focused training in SEO, SEM, Social Media Marketing, and complete online marketing strategies. This course helps students, entrepreneurs, and job seekers gain real-world skills to succeed in the digital industry.",
    long_description: "Digital Marketing is one of the fastest-growing career fields in today’s digital world. Every business — from small startups to multinational companies — depends on online marketing to grow their brand, attract customers, and increase sales. This course focuses on practical implementation, live projects, and real-time campaign management so that students gain hands-on experience.\n\nAverage Salary in India:\n• Freshers: ₹15,000 – ₹25,000 per month\n• Experienced: ₹30,000 – ₹60,000+ per month\n• Freelancers: Unlimited earning potential",
    skills_gained: [
      "Search Engine Optimization (SEO)",
      "Search Engine Marketing (SEM)",
      "Social Media Marketing (SMM)",
      "Analytics & Performance Tracking",
      "Lead Generation & Sales Funnel"
    ],
    modules: [
      "Search Engine Optimization (SEO) - Keywords, On-page, Technical, Off-page",
      "Search Engine Marketing (SEM) - Google Ads, Search, Display, Video Ads",
      "Social Media Marketing (SMM) - Instagram, Facebook, LinkedIn Ads",
      "Analytics & Performance Tracking - Google Analytics, Reporting",
      "Lead Generation & Sales Funnel - Landing Pages, Email, WhatsApp Marketing",
      "Brand Presence & Content Creation Strategy",
      "Analyze & Optimize Campaigns Using Data",
      "Real-time Campaign Management & Live Projects"
    ],
    tools: ["Google Ads", "Google Analytics", "Meta Ads Manager", "SEMrush", "Ahrefs", "Canva", "Mailchimp", "HubSpot", "Google Search Console"],
    eligibility: [
      "10th / 12th pass students",
      "Degree students",
      "Business owners",
      "Freelancers",
      "Job seekers",
      "Anyone interested in online marketing"
    ],
    career_opportunities: [
      { role: "Digital Marketing Executive", description: "Manage overall digital marketing activities for a brand." },
      { role: "SEO Analyst", description: "Optimize website ranking and visibility on search engines." },
      { role: "Social Media Manager", description: "Build and manage brand presence across social platforms." },
      { role: "Google Ads Specialist", description: "Run and optimize paid search and display campaigns." },
      { role: "Content Marketer", description: "Create and distribute valuable content to attract audiences." },
      { role: "Performance Marketer", description: "Drive high-ROI marketing campaigns using data." },
      { role: "Freelance Digital Marketer", description: "Work independently for multiple clients globally." }
    ],
    faqs: [
      {
        question: "Do I need prior knowledge to join this Digital Marketing course?",
        answer: "No. This course is designed for beginners as well as professionals. We start from the fundamentals and gradually move to advanced strategies."
      },
      {
        question: "Is this course suitable for non-technical students?",
        answer: "Yes. Digital Marketing does not require coding knowledge. Anyone with basic computer skills can learn and succeed in this field."
      },
      {
        question: "Will I get a certificate after completion?",
        answer: "Yes. Students will receive a course completion certificate from the institute after successfully completing the training and projects."
      },
      {
        question: "Does the course include practical training?",
        answer: "Yes. The course focuses on real-time projects, live campaign creation, SEO practice, and hands-on advertising experience."
      },
      {
        question: "Will I learn Google Ads and Social Media Ads?",
        answer: "Yes. You will learn how to create, manage, and optimize campaigns using Google Ads, Facebook Ads, Instagram Ads, and other platforms."
      },
      {
        question: "Is placement assistance provided?",
        answer: "Yes. We provide resume building support, interview preparation, and placement assistance. Final job selection depends on student performance."
      },
      {
        question: "What are the career opportunities after this course?",
        answer: "After completing the course, you can work as an SEO Analyst, Digital Marketing Executive, Social Media Manager, Google Ads Specialist, or Freelancer."
      },
      {
        question: "Can I start freelancing after this course?",
        answer: "Yes. This course equips you with practical skills that allow you to work as a freelance digital marketer and manage clients independently."
      },
      {
        question: "What is the duration of the course?",
        answer: "The course duration typically ranges from 2 to 4 months, depending on the batch schedule."
      },
      {
        question: "Is this course useful for business owners?",
        answer: "Absolutely. Business owners can use digital marketing strategies to generate leads, increase brand awareness, and grow online sales."
      }
    ],
    companies: [
      { name: "Amazon", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg" },
      { name: "Flipkart", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Flipkartlogo.png" },
      { name: "Swiggy", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/c1d6dc78156d44739cf01f3701ac999bfee820e6/Swiggylogo.webp" },
      { name: "Zomato", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/c1d6dc78156d44739cf01f3701ac999bfee820e6/Zomatologo.png" },
      { name: "Byju’s", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/c1d6dc78156d44739cf01f3701ac999bfee820e6/Byju%E2%80%99slogo.jpg" },
      { name: "Myntra", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/c1d6dc78156d44739cf01f3701ac999bfee820e6/Myntralogo.png" },
      { name: "Paytm", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/c1d6dc78156d44739cf01f3701ac999bfee820e6/Paytmlogo.jpg" }
    ]
  },

  {
    id: 'it8',
    title: 'UI/UX Design Course – Master Digital Product Design',
    slug: "ui-ux-design",
    category: 'IT',
    oldPrice: '₹34,999',
    price: '₹13,999',
    duration: "2 – 3 Months",
    image: '/img/it/ui-514z.webp',
    description: 'Master UI/UX Design from research to prototype with practical training and real-time projects.',
    seo: {
      title: "UI/UX Design Course in Coimbatore | Lasak Edu",
      description: "Join the best UI/UX Design Course in Coimbatore at Lasak Edu. Learn User Research, Wireframing, Prototyping, Figma, and Adobe XD with 100% practical training.",
      keywords: "UI/UX Design Course in Coimbatore, UI UX Training, Figma Course, User Experience Design, Product Design Course, Lasak Edu, Wireframing"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Master UI/UX Design from research to prototype with practical training and real-time projects.",
    introduction: "Our UI/UX Design Course is designed to help you become a professional User Interface (UI) and User Experience (UX) Designer. In this course, you will learn how to design visually appealing, user-friendly, and interactive digital products such as websites and mobile applications.\n\nWe cover design principles, user research, wireframing, prototyping, and real-time project implementation using industry-standard tools. This course focuses on practical learning, ensuring you build a strong portfolio.",
    long_description: "By the end of the course, you will be able to design complete user experiences from research to final prototype. UI/UX Design is one of the fastest-growing creative tech careers.\n\n**Average Salary in India:**\n• Freshers: ₹3 – ₹6 LPA\n• Experienced: ₹8 – ₹18 LPA+\n\n**Career Paths:**\n• UI/UX Designer\n• Product Designer\n• Interaction Designer\n• UX Researcher",
    skills_gained: [
      "UI Design Principles & Color Theory",
      "Typography & Layout Design",
      "Wireframing & Prototyping",
      "User Research & Persona Creation",
      "User Journey Mapping",
      "Usability Testing",
      "Design Thinking Process",
      "Mobile App & Website Design",
      "Creating Interactive Prototypes",
      "Portfolio Creation"
    ],
    modules: [
      "Introduction to UI/UX - Differences, Roles, Design Thinking",
      "User Research - Methods, Personas, Empathy Maps, User Journeys",
      "Information Architecture & Wireframing - Sitemaps, Low-fidelity Sketches",
      "Visual Design Principles - Color Theory, Typography, Grids, Layouts",
      "Prototyping & Interaction Design - High-fidelity Mockups, Animations",
      "Tools Mastery - Figma, Adobe XD (Deep Dive)",
      "Usability Testing - Heuristic Evaluation, User Testing",
      "Portfolio Building & Career Guidance"
    ],
    tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Zeplin", "Canva", "Miro", "FigJam"],
    eligibility: [
      "Degree Students (Any Stream)",
      "B.E / B.Tech / BCA / MCA Students",
      "Working Professionals",
      "Career Switchers",
      "Creative Individuals",
      "Beginners (No Coding Required)"
    ],
    career_opportunities: [
      { role: "UI Designer", description: "Design the visual look and feel of digital products." },
      { role: "UX Designer", description: "Focus on the user journey and experience structure." },
      { role: "Product Designer", description: " oversee the entire product design process from concept to launch." },
      { role: "Interaction Designer", description: "Design the interactive elements and animations of a product." },
      { role: "Visual Designer", description: "Create compelling visual assets and layouts." },
      { role: "UX Researcher", description: "Conduct research to understand user needs and behaviors." },
      { role: "Freelance Designer", description: "Work independently on design projects for various clients." }
    ],
    faqs: [
      {
        question: "1. Do I need coding knowledge?",
        answer: "No. UI/UX design does not require coding knowledge. It focuses on design logic, aesthetics, and user empathy."
      },
      {
        question: "2. Will I build a portfolio?",
        answer: "Yes. You will work on multiple real-time projects and case studies to build a professional portfolio, which is essential for getting hired."
      },
      {
        question: "3. What tools will I learn?",
        answer: "You will master industry-standard tools like Figma and Adobe XD, along with supporting tools for research and prototyping."
      },
      {
        question: "4. Is this course beginner-friendly?",
        answer: "Yes. We start from basic design concepts and principles, making it suitable for complete beginners."
      },
      {
        question: "5. Will I get placement support?",
        answer: "Yes. We provide resume guidance, portfolio review, interview preparation, and placement assistance."
      },
      {
        question: "6. Can I work as a freelancer after this course?",
        answer: "Yes. Many UI/UX designers earn a good income through freelance platforms and remote work opportunities."
      }
    ],
    features: [
      "Industry-Oriented Curriculum",
      "100% Practical Training",
      "Real-Time Design Projects",
      "Portfolio Development Support",
      "Internship & Placement Assistance",
      "Experienced Mentors",
      "Flexible Batch Timings",
      "Certification After Completion"
    ],
    companies: [
      { name: "Google", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/googlelogo.jpg" },
      { name: "Microsoft", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/98f4652a969c5dd1c29ff94c661f7d51e3a2aeb9/Microsoftlogo.jpg" },
      { name: "Zoho", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/a2a0cbc04401cc7b57c6f07b75ec42dd611a75f3/zohologo.png" },
      { name: "Freshworks", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/751d82d902a13278b0333b733061dcbb81622197/Freshworkslogo.png" },
      { name: "Adobe", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/345f202e97f5006c0cf08091c2bf313a586c17b6/Adobelogo.png" },
      { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
      { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" }
    ]
  },
  {
    id: 'it9',
    title: 'Full Stack Development with Python – Django & Flask',
    slug: "full-stack-python",
    category: 'IT',
    oldPrice: '₹55,000',
    price: '₹29,999',
    duration: "4 – 6 Months",
    image: '/img/it/python-267z.webp',
    description: 'Master Full Stack Web Development using Python, Django, Flask, REST APIs, PostgreSQL, and modern deployment tools.',
    seo: {
      title: "Full Stack Python Course in Coimbatore | Lasak Edu",
      description: "Join our Full Stack Python Development Course in Coimbatore at Lasak Edu. Master Django, Flask, REST APIs, and PostgreSQL with real-time projects and placement support.",
      keywords: "Full Stack Python Course in Coimbatore, Django Training, Flask Course, Python Web Development, Lasak Edu, Python Full Stack Developer, Placement Assistance"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: "Full Stack Development with Python – Build Powerful Web Applications with Django & Flask",
    introduction: "Our Full Stack Python Development Course is designed to make you a complete web developer using the Python ecosystem. Python is the most popular programming language in the world, and this course teaches you how to build full-stack web applications from scratch using Python, Django, and Flask.\n\nYou will learn everything from front-end development (HTML, CSS, JavaScript) to back-end development with Django and Flask frameworks, REST API development, database management with PostgreSQL and SQLite, authentication, and cloud deployment.\n\nThis course is 100% practical and project-based, ensuring you gain hands-on experience building real-world applications.",
    long_description: "By the end of the course, you will be able to build complete, production-ready web applications using Python independently. Full Stack Python developers are among the most in-demand professionals in the tech industry.\n\n**Average Salary in India:**\n• Freshers: ₹3.5 – ₹7 LPA\n• Experienced: ₹10 – ₹20 LPA+\n\n**Career Paths:**\n• Full Stack Python Developer\n• Django Developer\n• Flask Developer\n• Backend Developer (Python)\n• API Developer\n• DevOps Engineer",
    skills_gained: [
      "Python Programming (Core & Advanced)",
      "Front-End Development (HTML5, CSS3, JavaScript, Bootstrap)",
      "Django Framework – Models, Views, Templates, ORM",
      "Flask Framework – Lightweight API Development",
      "REST API Development & Integration",
      "Database Management (PostgreSQL, SQLite, MySQL)",
      "Authentication & Authorization (JWT, Session-based)",
      "Version Control with Git & GitHub",
      "Cloud Deployment (AWS, Heroku, Railway)",
      "Testing & Debugging"
    ],
    modules: [
      "Python Core – Variables, Data Structures, OOP, File Handling, Exception Handling",
      "Frontend Development – HTML5, CSS3, JavaScript (ES6+), Bootstrap, Responsive Design",
      "Django Framework – MVT Architecture, Models, Views, Templates, Django ORM, Admin Panel",
      "Flask Framework – Routing, Jinja2 Templates, Flask-RESTful, Blueprints",
      "REST API Development – Django REST Framework (DRF), Serializers, ViewSets, Postman Testing",
      "Database Management – PostgreSQL, SQLite, MySQL, Database Design & Migrations",
      "Authentication – User Login/Signup, JWT Tokens, OAuth, Session Management",
      "Deployment – Docker Basics, Heroku, AWS EC2, Railway, CI/CD Pipelines",
      "Real-Time Projects – E-commerce Platform, Blog CMS, Task Management App, REST API Backend"
    ],
    tools: ["VS Code", "PyCharm", "Git", "GitHub", "Postman", "Docker", "PostgreSQL", "pgAdmin", "Django Admin", "Heroku", "AWS", "Jupyter Notebook"],
    eligibility: [
      "B.E / B.Tech / BCA / MCA Students",
      "Degree Students (Any Stream)",
      "Working Professionals",
      "Career Switchers",
      "Freshers & Job Seekers",
      "Beginners (No Prior Coding Knowledge Required)"
    ],
    career_opportunities: [
      { role: "Full Stack Python Developer", description: "Build complete web applications using Python, Django, and modern front-end technologies." },
      { role: "Django Developer", description: "Specialize in building scalable web applications using the Django framework." },
      { role: "Flask Developer", description: "Develop lightweight APIs and microservices using Flask." },
      { role: "Backend Developer (Python)", description: "Focus on server-side logic, databases, and API development." },
      { role: "API Developer", description: "Design and build RESTful APIs for web and mobile applications." },
      { role: "Software Developer", description: "Develop and maintain full-stack software systems." },
      { role: "DevOps Engineer", description: "Manage deployment pipelines, Docker containers, and cloud infrastructure." }
    ],
    faqs: [
      {
        question: "1. Is this course beginner-friendly?",
        answer: "Yes. We start from Python basics and move step-by-step to advanced full stack concepts. No prior coding knowledge is required."
      },
      {
        question: "2. What is the difference between this and the MERN Stack course?",
        answer: "This course uses Python (Django/Flask) for backend instead of Node.js. Python is easier to learn and is widely used in data science, AI, and web development."
      },
      {
        question: "3. Will I build real projects?",
        answer: "Yes. You will build multiple full stack projects including an e-commerce platform, blog CMS, and REST API backend."
      },
      {
        question: "4. Do you provide placement support?",
        answer: "Yes. We provide resume building, mock interviews, portfolio development, and placement assistance."
      },
      {
        question: "5. Which framework is better – Django or Flask?",
        answer: "Both are excellent. Django is great for large applications with built-in features. Flask is lightweight and ideal for APIs and microservices. We teach both."
      },
      {
        question: "6. Will I get certification?",
        answer: "Yes. You will receive a Full Stack Python Development certification after course completion."
      }
    ],
    features: [
      "Industry-Based Curriculum",
      "100% Practical Training",
      "Real-Time Live Projects",
      "Python + Django + Flask Stack",
      "REST API Development with DRF",
      "Internship & Placement Assistance",
      "Resume & Interview Preparation",
      "Portfolio Development Support",
      "Flexible Batch Timings",
      "Certification After Completion"
    ],
    companies: [
      { name: "Google", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/googlelogo.jpg" },
      { name: "Microsoft", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/98f4652a969c5dd1c29ff94c661f7d51e3a2aeb9/Microsoftlogo.jpg" },
      { name: "Amazon", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
      { name: "TCS", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/37febaa52721ea88fd282d9dcd63e15302d57695/tcslogo.jpg" },
      { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
      { name: "Zoho", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/a2a0cbc04401cc7b57c6f07b75ec42dd611a75f3/zohologo.png" },
      { name: "Freshworks", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/751d82d902a13278b0333b733061dcbb81622197/Freshworkslogo.png" }
    ]
  },


  // --- CIVIL COURSES ---

  {
    id: 'civil1',
    title: 'Civil CAD',
    slug: "civil-cad",
    category: 'Civil',
    oldPrice: '₹10,000',
    price: '₹6,499',
    duration: '1.5 to 2 Months',
    image: '/img/civil/civil-cad.webp',
    description: 'Master Civil CAD and accelerate your career growth with expert-led training.',
    tagline: 'Master Civil CAD and accelerate your career growth with expert-led training.',
    introduction: "Civil CAD is essential for civil engineers involved in drafting, planning, and infrastructure design. This course provides complete hands-on training in 2D drafting, layout planning, structural drawings, and project documentation using industry-standard tools like AutoCAD.\n\nYou will learn how to prepare detailed construction drawings used in residential, commercial, and infrastructure projects.",
    long_description: "**Industries hiring include:**\n🏗 Construction Companies\n🏢 Infrastructure Firms\n🏛 Architectural Consultancies\n🏘 Real Estate Developers\n\n**Average Fresher Salary in India:** ₹2 – ₹4 LPA\nWith Experience: ₹5 – ₹10 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "CAD Mastery - Advanced Interface Navigation, Industry Commands & Productivity Workflows",
      "Architectural Planning - Create Professional Floor Plans, Detailed Elevations & Building Sections",
      "Structural Detail - Precision Drafting for Beams, Columns, Footings & Reinforcement Details",
      "Road Design & Layout",
      "Water Supply & Drainage",
      "Surveying & Contours",
      "AutoCAD Civil 3D",
      "3D Building Modeling (Intro)",
      "Project Work"
    ],
    skills_gained: [
      "AutoCAD Interface & Drawing Tools",
      "2D Drafting & Dimensioning",
      "Floor Plan Creation",
      "Elevation & Section Drawings",
      "Structural Drawings (Beam, Column, Footing)",
      "Layout & Plotting Techniques",
      "Layer Management",
      "Blocks & Templates Creation",
      "Construction Documentation Standards"
    ],
    tools: [
      "AutoCAD",
      "AutoCAD Civil 3D",
      "Layer Management Tools",
      "Blocks & Templates"
    ],
    features: [
      "Industry-expert trainers",
      "Real-time project-based training",
      "Practical hands-on sessions",
      "Portfolio development support",
      "Interview preparation guidance",
      "Placement assistance",
      "Certification After Completion"
    ],
    eligibility: [
      "Civil Engineering students",
      "Diploma holders (Civil)",
      "Fresh graduates",
      "Site engineers",
      "Construction professionals",
      "Anyone interested in civil drafting"
    ],
    career_opportunities: [
      { role: "Civil CAD Draftsman", description: "Create detailed construction drawings and documentation." },
      { role: "Site Design Engineer", description: "Design site layouts and infrastructure plans." },
      { role: "Structural Draftsman", description: "Prepare structural drawings for buildings and projects." },
      { role: "Planning Engineer", description: "Develop planning layouts and project designs." },
      { role: "Construction Documentation Executive", description: "Manage construction documentation and drawing sets." }
    ],
    faqs: [
      {
        question: "Is prior CAD knowledge required?",
        answer: "No, we start from the basics and gradually move to advanced drafting techniques."
      },
      {
        question: "Will I work on real construction drawings?",
        answer: "Yes, the course includes practical drawing exercises based on real-world projects."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, it is beginner-friendly and structured step-by-step."
      },
      {
        question: "Do you provide placement assistance?",
        answer: "Yes, we offer interview preparation and placement support."
      }
    ],
    seo: {
      title: "Civil CAD Course in Coimbatore | Lasak Edu",
      description: "Master Civil CAD with hands-on AutoCAD training in Coimbatore at Lasak Edu. Learn 2D drafting, structural drawings, and drafting with full placement support.",
      keywords: "Civil CAD Course, AutoCAD for Civil Engineering, Civil Drafting Training, Construction Drawings, CAD Training Coimbatore, Lasak Edu"
    },
    companies: [
      { name: "L&T", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Larsen_%26_Toubro_logo.svg" },
      { name: "Shapoorji Pallonji", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Shapoorji_Pallonji_Group_logo.png" },
      { name: "Tata Projects", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tata_Projects_logo.svg" },
      { name: "Sobha", logo: "https://upload.wikimedia.org/wikipedia/commons/3/35/Sobha_Logo.svg" },
      { name: "DLF", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/DLF_logo.svg" }
    ]
  },
  {
    id: 'civil2',
    title: 'Revit Architecture',
    slug: "revit-architecture",
    category: 'Civil',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1.5 to 2 Months',
    image: '/img/civil/revit-471z.webp',
    description: 'Master Revit Architecture and accelerate your career growth with expert-led training.',
    tagline: 'Master Revit Architecture and accelerate your career growth with expert-led training.',
    introduction: "Autodesk Revit (Revit Architecture) is a leading BIM (Building Information Modeling) software widely used in architectural design and construction industries. It enables professionals to create intelligent 3D building models with accurate project data and documentation.\n\nThis course provides complete hands-on training in architectural modeling, drafting, visualization, and project coordination using real-time building projects.",
    long_description: "**Industries hiring include:**\n🏛 Architectural Firms\n🏗 Construction Companies\n🏘 Real Estate Developers\n🏢 Infrastructure Firms\n🌍 International BIM Consultancy Companies\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹7 – ₹15 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "BIM Foundations - Master Revit Interface, Project Browser & Building Information Modeling",
      "Building Components - Design Complex Walls, Adaptive Floors, Roofs & Parametric Families",
      "Smart Documentation - Generate Dynamic Schedules, Construction Sheets & Project Coordination",
      "View Creation & Control",
      "Architectural Modeling",
      "Families & Components",
      "Revit Structure",
      "Revit MEP (Basics)",
      "Schedules & Quantification",
      "Sheets, Annotations & Printing",
      "Coordination & Clash Detection",
      "Worksharing & Collaboration",
      "Visualization & Rendering",
      "Industry Project"
    ],
    skills_gained: [
      "Revit Interface & Project Setup",
      "Architectural 3D Modeling",
      "Creating Walls, Doors, Windows & Roofs",
      "Floor Plans, Elevations & Sections",
      "Family Creation & Custom Components",
      "Annotation & Dimensioning",
      "Schedules & Quantity Take-off",
      "Sheet Creation & Construction Documentation",
      "Basic Rendering & Visualization"
    ],
    tools: [
      "Revit Core Tools",
      "AutoCAD",
      "Navisworks",
      "Dynamo",
      "Enscape / Lumion / Twinmotion"
    ],
    features: [
      "Industry-expert trainers",
      "Real-time building project practice",
      "Hands-on BIM workflow training",
      "Portfolio development support",
      "Interview preparation assistance",
      "Placement guidance",
      "Certification After Completion"
    ],
    eligibility: [
      "Civil Engineering students",
      "Architecture students",
      "Diploma holders (Civil/Architecture)",
      "Construction professionals",
      "Fresh graduates",
      "Anyone interested in BIM and architectural design"
    ],
    career_opportunities: [
      { role: "Revit Architect", description: "Design architectural models and generate construction documentation." },
      { role: "BIM Modeler", description: "Create detailed 3D building models using BIM software." },
      { role: "Architectural Designer", description: "Develop architectural designs and visualizations." },
      { role: "BIM Coordinator", description: "Coordinate BIM models and manage project workflows." },
      { role: "Architectural Draftsman", description: "Prepare architectural drawings and documentation." }
    ],
    faqs: [
      {
        question: "Is prior CAD knowledge required?",
        answer: "Basic AutoCAD knowledge is helpful but not mandatory."
      },
      {
        question: "Will I work on real building projects?",
        answer: "Yes, the course includes complete building modeling projects."
      },
      {
        question: "Is this course beginner-friendly?",
        answer: "Yes, we start from fundamentals and move to advanced architectural modeling."
      },
      {
        question: "Do you provide placement assistance?",
        answer: "Yes, we offer interview preparation and placement support."
      }
    ],
    seo: {
      title: "Revit Architecture Course in Coimbatore | Lasak Edu",
      description: "Master Revit Architecture and BIM in Coimbatore at Lasak Edu. Learn 3D architectural modeling, family creation, and documents with placement support help.",
      keywords: "Revit Architecture Course, BIM Training, Architectural Modeling, Revit BIM, Autodesk Revit Training Coimbatore, Lasak Edu"
    },
    companies: [
      { name: "L&T", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Larsen_%26_Toubro_logo.svg" },
      { name: "Shapoorji Pallonji", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Shapoorji_Pallonji_Group_logo.png" },
      { name: "Tata Projects", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tata_Projects_logo.svg" }
    ]
  },
  {
    id: 'civil3',
    title: 'SketchUp for Civil Engineering',
    slug: "sketchup",
    category: 'Civil',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1 to 1.5 Months',
    image: '/img/civil/sketchup-430z.webp',
    description: 'Master SketchUp and accelerate your career growth with expert-led training.',
    tagline: 'Master SketchUp and accelerate your career growth with expert-led training.',
    introduction: "SketchUp is a powerful and user-friendly 3D modeling software widely used in civil engineering, architecture, construction planning, and interior design.\n\nThis course is specially designed for civil engineering students and professionals to create 3D building models, site layouts, elevations, and presentation-ready designs.\n\nYou will gain hands-on experience in modeling residential and commercial projects with real-time practical exercises.",
    long_description: "**Industries hiring include:**\n🏗 Construction Companies\n🏛 Architectural Firms\n🏠 Interior Design Studios\n🏘 Real Estate Developers\n\n**Average Fresher Salary in India:** ₹2.5 – ₹5 LPA\nWith Experience: ₹6 – ₹12 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "3D Modeling - Master Core Tools, Push/Pull Techniques & Efficient Group Management",
      "Visual Design - Realistic Texturing, Shadow Studies & Advanced Architectural Visualizations",
      "Advanced Output - Master Productivity Plugins, Layout Presentations & High-End Look Sets",
      "Architectural Modeling",
      "Lighting, Shadows & Scenes",
      "Components & 3D Warehouse",
      "Layout & Documentation (SketchUp Pro)",
      "Plugins & Extensions",
      "Visualization & Rendering (Optional / Add-on)",
      "Industry Applications & Projects"
    ],
    skills_gained: [
      "SketchUp Interface & Tools",
      "2D to 3D Modeling Techniques",
      "Building Floor Plan Modeling",
      "Elevation & Section Creation",
      "Site Layout & Landscape Modeling",
      "Material & Texture Application",
      "Component & Group Management",
      "Scene Creation & Presentation Setup",
      "Basic Rendering Concepts"
    ],
    tools: [
      "SketchUp Free",
      "SketchUp Pro",
      "Layout",
      "V-Ray / Enscape / Lumion",
      "SketchUp STL",
      "Extension Warehouse Tools"
    ],
    features: [
      "Beginner-friendly training",
      "Practical real-time project modeling",
      "Industry-focused curriculum",
      "Expert trainer guidance",
      "Portfolio development support",
      "Placement assistance",
      "Certification After Completion"
    ],
    eligibility: [
      "Civil Engineering students",
      "Diploma holders (Civil)",
      "Architecture students",
      "Interior design students",
      "Construction professionals",
      "Anyone interested in 3D building design"
    ],
    career_opportunities: [
      { role: "Civil 3D Modeler", description: "Create 3D models for civil engineering projects." },
      { role: "Architectural Modeler", description: "Develop architectural visualizations and presentations." },
      { role: "Site Planning Designer", description: "Design site layouts and landscape plans." },
      { role: "Interior & Exterior Designer", description: "Model interior and exterior design concepts." },
      { role: "Construction Planning Assistant", description: "Support construction planning with 3D models." }
    ],
    faqs: [
      {
        question: "Is prior software knowledge required?",
        answer: "No, the course starts from basics and moves to advanced modeling techniques."
      },
      {
        question: "Will I work on real building projects?",
        answer: "Yes, you will create complete building models as part of practical training."
      },
      {
        question: "Is SketchUp useful for civil engineers?",
        answer: "Yes, it is widely used for 3D visualization and presentation in construction projects."
      },
      {
        question: "Is placement support available?",
        answer: "Yes, we provide interview preparation and placement guidance."
      }
    ],
    seo: {
      title: "SketchUp Course for Civil Engineering in Coimbatore | Lasak Edu",
      description: "Learn SketchUp for civil engineering in Coimbatore at Lasak Edu. Master 3D building modeling, site layouts, and visualization with full placement support help.",
      keywords: "SketchUp Course, Civil Engineering 3D Modeling, Architectural Modeling, Construction Planning, SketchUp Training Coimbatore, Lasak Edu"
    },
    companies: [
      { name: "L&T", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Larsen_%26_Toubro_logo.svg" },
      { name: "Shapoorji Pallonji", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Shapoorji_Pallonji_Group_logo.png" },
      { name: "Tata Projects", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tata_Projects_logo.svg" }
    ]

  },
  {
    id: 'civil4',
    title: 'STAAD.Pro',
    slug: "staad-pro",
    category: 'Civil',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '2 to 3 Months',
    image: '/img/civil/staadpro-216z.webp',
    description: 'Master STAAD.Pro and accelerate your career growth with expert-led training.',
    tagline: 'Master STAAD.Pro and accelerate your career growth with expert-led training.',
    introduction: "STAAD.Pro is one of the most widely used structural analysis and design software tools in civil and structural engineering. It is used for analyzing and designing buildings, bridges, towers, industrial structures, and other infrastructure projects.\n\nThis course provides comprehensive training in structural modeling, load application, analysis, and design according to industry standards. You will gain practical experience by working on real-time structural projects.",
    long_description: "**Industries hiring include:**\n🏗 Construction Companies\n🏢 Structural Consultancy Firms\n🏗 Infrastructure Developers\n🌍 EPC Companies\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹7 – ₹15 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Structural Modeling - Master Analytical Modeling, Beam/Column Geometry & Support Conditions",
      "Load Simulation - Apply Realistic Dead, Live, Wind & Seismic Loads as per Global Standards",
      "Design Optimization - RCC & Steel Design as per IS Codes with Member Verification Layouts",
      "Material Properties",
      "Section Properties",
      "Support & Boundary Conditions",
      "Load Definition & Load Cases",
      "Structural Analysis",
      "RCC Design (As per IS Codes)",
      "Steel Design (As per IS Codes)",
      "Post-Processing & Reports",
      "Advanced Applications",
      "Project Work"
    ],
    skills_gained: [
      "Introduction to Structural Analysis Concepts",
      "Modeling of RCC & Steel Structures",
      "Load Calculation & Load Combinations",
      "Wind & Seismic Analysis",
      "Beam, Column & Slab Design",
      "Foundation Modeling Basics",
      "Structural Detailing Concepts",
      "Design as per IS Codes",
      "Report Generation & Documentation"
    ],
    tools: [
      "STAAD.Pro",
      "STAAD Foundation Advanced",
      "Bentley Structural Modeler",
      "AutoCAD",
      "IS Code Libraries"
    ],
    features: [
      "Industry-expert trainers",
      "Real-time structural project practice",
      "Practical hands-on analysis training",
      "Code-based design approach",
      "Interview preparation support",
      "Placement assistance",
      "Certification After Completion"
    ],
    eligibility: [
      "Civil Engineering students",
      "Structural Engineering students",
      "Diploma holders (Civil)",
      "Site engineers",
      "Working professionals in structural design"
    ],
    career_opportunities: [
      { role: "Structural Design Engineer", description: "Design and analyze structural systems for buildings and infrastructure." },
      { role: "Structural Analyst", description: "Perform structural analysis and verification of designs." },
      { role: "Civil Design Engineer", description: "Execute civil and structural design projects." },
      { role: "RCC Design Engineer", description: "Specialize in reinforced concrete structure design." },
      { role: "Steel Structure Design Engineer", description: "Focus on steel structure design and detailing." }
    ],
    faqs: [
      {
        question: "Is prior structural knowledge required?",
        answer: "Basic understanding of structural concepts is helpful, but fundamentals are covered in the course."
      },
      {
        question: "Will I work on real building models?",
        answer: "Yes, you will analyze and design real-time structural models."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, especially for civil students who want to specialize in structural design."
      },
      {
        question: "Do you provide placement assistance?",
        answer: "Yes, we provide interview preparation and placement support."
      }
    ],
    seo: {
      title: "STAAD.Pro Course in Coimbatore | Lasak Edu",
      description: "Master STAAD.Pro for structural analysis and design in Coimbatore at Lasak Edu. Learn RCC/Steel design, load analysis, and IS standards with placement support.",
      keywords: "STAAD.Pro Course, Structural Analysis Training, RCC Design, Steel Design, Civil Engineering Course, STAAD.Pro Training Coimbatore, Lasak Edu"
    },
    companies: [
      { name: "L&T", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Larsen_%26_Toubro_logo.svg" },
      { name: "Shapoorji Pallonji", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Shapoorji_Pallonji_Group_logo.png" },
      { name: "Tata Projects", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tata_Projects_logo.svg" }
    ]
  },
  {
    id: 'civil5',
    title: 'BIM Professional',
    slug: "bim-professional",
    category: 'Civil',
    oldPrice: '₹50,000',
    price: '₹34,999',
    duration: '2 to 3 Months',
    image: '/img/civil/bim-240z.webp',
    description: 'Master Building Information Modeling (BIM) and accelerate your career growth with expert-led training.',
    tagline: 'Master Building Information Modeling (BIM) and accelerate your career growth with expert-led training.',
    introduction: "Building Information Modeling (BIM) is revolutionizing the construction and infrastructure industry by enabling intelligent 3D modeling, coordination, and project management.\n\nThis BIM Professional course provides in-depth training using industry-standard tools like Autodesk Revit, Navisworks, and AutoCAD.\n\nYou will learn how to create detailed 3D building models, manage project data, perform clash detection, and generate accurate construction documentation.",
    long_description: "**Industries hiring include:**\n🏗 Construction Companies\n🏛 Architectural Firms\n🏗 Infrastructure Developers\n🌍 International EPC Companies\n\n**Average Fresher Salary in India:** ₹3.5 – ₹7 LPA\nWith Experience: ₹8 – ₹18 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "BIM Architecture - Master Revit Building Design, Space Planning & Intelligent 3D Modeling",
      "Integrated Structure - Structural Elements, MEP System Design & Collaborative Modeling Workflows",
      "Coordination Mastery - Professional Clash Detection using Navisworks & 4D/5D BIM Simulation",
      "Quantification & Scheduling - Dynamic Bill of Quantities (BOQ), Cost Estimation & Project Tracking",
      "BIM Deliverables - Professional Construction Documentation, BIM Standards & Multi-User Collaboration",
    ],
    skills_gained: [
      "BIM Fundamentals & Workflow",
      "3D Architectural Modeling",
      "Structural & MEP Modeling Basics",
      "Family Creation in Revit",
      "Project Coordination",
      "Clash Detection using Navisworks",
      "Quantity Take-off & BOQ Preparation",
      "Construction Documentation",
      "BIM Standards & Industry Practices"
    ],
    tools: [
      "Autodesk Revit (Architecture, Structure, MEP)",
      "Navisworks Manage",
      "AutoCAD",
      "BIM 360 / Autodesk Construction Cloud",
      "Dynamo (Basics)",
      "Primavera / MS Project"
    ],
    features: [
      "Industry-expert trainers",
      "Real-time project-based training",
      "Practical hands-on modeling",
      "Portfolio development support",
      "Interview preparation assistance",
      "Placement guidance",
      "Certification After Completion"
    ],
    eligibility: [
      "Civil Engineering students",
      "Architecture students",
      "Diploma holders (Civil)",
      "MEP professionals",
      "Site engineers",
      "Construction professionals"
    ],
    career_opportunities: [
      { role: "BIM Engineer", description: "Manage BIM workflows and coordinate building information models." },
      { role: "BIM Modeler", description: "Create detailed 3D models for architectural and structural projects." },
      { role: "Revit Architect", description: "Design architectural models and generate construction documentation." },
      { role: "BIM Coordinator", description: "Coordinate multi-disciplinary BIM models and perform clash detection." },
      { role: "MEP BIM Engineer", description: "Specialize in mechanical, electrical, and plumbing BIM modeling." }
    ],
    faqs: [
      {
        question: "Is prior software knowledge required?",
        answer: "Basic knowledge of AutoCAD is helpful but not mandatory."
      },
      {
        question: "Is BIM in demand?",
        answer: "Yes, BIM professionals are highly in demand in both domestic and international construction projects."
      },
      {
        question: "Will I work on real building models?",
        answer: "Yes, you will create complete building models as part of practical training."
      },
      {
        question: "Is placement support available?",
        answer: "Yes, we provide interview preparation and placement assistance."
      }
    ],
    seo: {
      title: "BIM Professional Course in Coimbatore | Lasak Edu",
      description: "Master Building Information Modeling (BIM) with Revit and Navisworks in Coimbatore at Lasak Edu. Learn 3D modeling and coordination with full placement support.",
      keywords: "BIM Course, Revit Training, Navisworks, BIM Coordinator Course, Building Information Modeling, BIM Training Coimbatore, Lasak Edu"
    },
    companies: [
      { name: "L&T", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Larsen_%26_Toubro_logo.svg" },
      { name: "Shapoorji Pallonji", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Shapoorji_Pallonji_Group_logo.png" },
      { name: "Tata Projects", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tata_Projects_logo.svg" }
    ]
  },

  // --- ARTS & MEDIA COURSES ---
  {
    id: 'arts1',
    title: 'Graphic Design',
    slug: 'graphic-design',
    category: 'Arts',
    oldPrice: '₹18,000',
    price: '₹9,999',
    duration: '1.5 – 2 Months',
    image: '/img/arts/digital-marketing-840z.webp',
    description: 'Master Graphic Design using Photoshop, Illustrator and CorelDRAW.',
    tagline: 'Master Graphic Design and build a creative career with expert-led training.',
    introduction: "Our Graphic Design course is designed for aspiring designers who want to master industry-standard tools like Adobe Photoshop, Illustrator, and CorelDRAW. Learn the art of visual communication and brand identity.\n\nFrom logo design to professional layouts, this course covers everything you need to become a successful graphic designer in today's digital world.",
    skills_gained: [
      "Adobe Photoshop Mastery",
      "Adobe Illustrator Vector Design",
      "CorelDRAW for Professional Layouts",
      "Logo & Brand Identity Design",
      "Typography & Layout Principles",
      "Print & Digital Asset Creation",
      "Photo Retouching & Compositing",
      "Social Media Graphic Design"
    ],
    modules: ['Design Principles', 'Photoshop', 'Illustrator', 'CorelDRAW', 'Typography', 'Logo & Brand Design', 'Real Projects'],
    tools: ["Adobe Photoshop", "Adobe Illustrator", "CorelDRAW", "Canva", "InDesign"],
    features: ["Expert Trainers", "100% Practical Training", "Real-Time Projects", "Placement Assistance"],
    eligibility: ["Students", "Freshers", "Working Professionals", "Anyone interested in Design"],
    career_opportunities: [
      { role: "Graphic Designer", description: "Create visual concepts to communicate ideas." },
      { role: "UI Designer", description: "Design user interfaces for web and mobile apps." },
      { role: "Brand Identity Designer", description: "Develop visual identities for companies." },
      { role: "Print Production Artist", description: "Prepare designs for print media." }
    ],
    faqs: [
      { question: "Do I need drawing skills?", answer: "No, drawing skills are not mandatory, but creativity is key." },
      { question: "Which tools will I learn?", answer: "You will master Photoshop, Illustrator, and CorelDRAW." }
    ],
    companies: [
      { name: "Amazon", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg" },
      { name: "Zoho", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/a2a0cbc04401cc7b57c6f07b75ec42dd611a75f3/zohologo.png" }
    ],
    seo: {
      title: "Graphic Design Course in Coimbatore | Lasak Edu",
      description: "Learn Graphic Design in Coimbatore at Lasak Edu. Master Photoshop, Illustrator, and CorelDRAW with real-time projects and placement support.",
      keywords: "Graphic Design Course, Photoshop Training, Illustrator Course, Lasak Edu, Design Institute Coimbatore"
    }
  },
  {
    id: 'arts2',
    title: 'Video Editing',
    slug: 'video-editing',
    category: 'Arts',
    oldPrice: '₹18,000',
    price: '₹9,999',
    duration: '1.5 – 2 Months',
    image: '/img/arts/ms-office-specialist-640z.webp',
    description: 'Master Video Editing with Premiere Pro and After Effects.',
    tagline: 'Master Video Editing and Motion Graphics with expert-led training.',
    introduction: "Our Video Editing course provides hands-on training in professional video production using Adobe Premiere Pro and After Effects. Learn to create high-quality content for YouTube, social media, and film.\n\nFrom basic cuts to advanced motion graphics and color grading, you will gain the skills needed to excel in the rapidly growing video industry.",
    skills_gained: [
      "Professional Video Editing (Premiere Pro)",
      "Motion Graphics & Effects (After Effects)",
      "Color Grading & Correction",
      "Audio Enhancement & Syncing",
      "Video Storytelling & Pacing",
      "YouTube & Social Media Content Creation",
      "Green Screen & Chroma Keying",
      "Video Exporting & Formatting"
    ],
    modules: ['Editing Basics', 'Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics', 'YouTube Production'],
    tools: ["Adobe Premiere Pro", "Adobe After Effects", "Audition", "DaVinci Resolve Basics"],
    features: ["Industry-Expert Mentors", "Practical Lab Sessions", "Real-Time Projects", "Placement Support"],
    eligibility: ["Content Creators", "Students", "Aspiring Film Makers", "Social Media Enthusiasts"],
    career_opportunities: [
      { role: "Video Editor", description: "Assemble recorded footage into a finished product." },
      { role: "Motion Graphics Artist", description: "Create animated graphics and visual effects." },
      { role: "Content Creator", description: "Produce engaging video content for various platforms." },
      { role: "Post-Production Specialist", description: "Oversee the final stages of video production." }
    ],
    faqs: [
      { question: "Is this course for beginners?", answer: "Yes, we teach from the very basics of video editing." },
      { question: "Will I learn motion graphics?", answer: "Yes, the course includes After Effects for motion graphics." }
    ],
    companies: [
      { name: "Flipkart", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Flipkartlogo.png" },
      { name: "Freshworks", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/751d82d902a13278b0333b733061dcbb81622197/Freshworkslogo.png" }
    ],
    seo: {
      title: "Video Editing Course in Coimbatore | Lasak Edu",
      description: "Learn Video Editing in Coimbatore at Lasak Edu. Master Premiere Pro and After Effects with hands-on projects and career placement help.",
      keywords: "Video Editing Course, Premiere Pro Training, After Effects Course, Lasak Edu, Media Training Coimbatore"
    }
  },
  {
    id: 'arts3',
    title: 'Digital Marketing (Media)',
    slug: "digital-marketing-media",
    category: 'Arts',
    oldPrice: '₹29,999',
    price: '₹11,999',
    duration: '90 Days',
    image: '/img/arts/digital-marketing-840z.webp',
    description: 'Focus on branding, content strategy and online presence.',
    tagline: 'Master Digital Media Marketing and build a strong online presence.',
    introduction: "Our Digital Marketing (Media) course is specifically tailored for those who want to master branding, social media strategy, and content creation. Learn how to grow reach and engagement for brands on platforms like Facebook, Instagram, and YouTube.",
    skills_gained: [
      "Social Media Branding & Strategy",
      "Facebook & Instagram Ad Management",
      "YouTube Marketing & Analytics",
      "Content Strategy & Planning",
      "Online Reputation Management",
      "Engagement & Growth Hacking"
    ],
    modules: ["Social Media Marketing", "Facebook & Instagram Ads", "YouTube Marketing", "Content Strategy"],
    tools: ["Meta Ads Manager", "Canva", "Hootsuite", "Buffer", "Google Analytics", "CapCut"],
    companies: [
      { name: "Amazon", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/ab9b04edfd0ada8f704d74c753d2c4897fae54b5/Amazonlogo.jpg" },
      { name: "Flipkart", logo: "https://raw.githubusercontent.com/BrindhaAnand/companylogos/2b88affb35221185e9345ac022285ff4737a77b5/Flipkartlogo.png" }
    ],
    seo: {
      title: "Digital Marketing (Media) Course in Coimbatore | Lasak Edu",
      description: "Master digital marketing for media in Coimbatore. Learn strategy, branding, and ads with Lasak Edu's expert-led training.",
      keywords: "Digital Marketing Media, Social Media Course, Branding Training, Lasak Edu"
    }
  },
  {
    id: 'arts4',
    title: 'MS Office',
    slug: "ms-office",
    category: 'Arts',
    oldPrice: '₹12,000',
    price: '₹5,999',
    duration: '1 to 1.5 Months',
    image: '/img/arts/ms-office-specialist-640z.webp',
    description: 'Master MS Office and build essential computer skills for academic and professional success.',
    tagline: 'Master MS Office and build essential computer skills for academic and professional success.',
    introduction: "This course provides complete training in Microsoft Word, Excel, PowerPoint, and Outlook. Learn essential computer skills that are required in every professional environment.",
    long_description: "**Industries hiring include:**\n🏢 Corporate Offices\n🏪 Retail & Trading\n🏥 Healthcare & Hospitals\n🏫 Educational Institutions\n💼 Every Industry Sector\n\n**Average Fresher Salary in India:** ₹1.8 – ₹3.5 LPA\nWith Experience: ₹3.5 – ₹6 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Microsoft Word - Master Professional Document Formatting, Business Reports & Advanced Mail Merge",
      "Microsoft Excel - Master Complex Formulas, Financial Functions, Interactive Charts & Pivot Tables",
      "Microsoft PowerPoint - Professional Slide Design, Dynamic Animations & Impactful Presentations",
      "Microsoft Outlook - Expert Email Management, Calendar Scheduling & Business Communication",
      "Smart Reporting - Master MIS Reporting, Data Visualization & Professional Office Automation",
    ],
    skills_gained: [
      "Document Formatting & Resume Creation",
      "Excel Formulas (SUM, IF, VLOOKUP, HLOOKUP)",
      "Charts, Graphs & Pivot Tables",
      "Conditional Formatting & Data Validation",
      "PowerPoint Slide Design & Animations",
      "Presentation Skills",
      "Email Management & Calendar Scheduling",
      "Basic MIS Reporting"
    ],
    tools: [
      "MS Word",
      "MS Excel",
      "MS PowerPoint",
      "Outlook",
      "Google Workspace"
    ],
    features: [
      "Hands-on practical training",
      "Real-world document examples",
      "Assignment-based learning",
      "Interview preparation support",
      "Certificate of completion",
      "Lifetime software practice access"
    ],
    eligibility: [
      "Students (Any stream)",
      "Fresh graduates",
      "Working professionals",
      "Housewives returning to work",
      "Anyone wanting to learn computer basics",
      "No prior computer knowledge required"
    ],
    career_opportunities: [
      { role: "Office Executive", description: "Manage office administration and documentation." },
      { role: "Data Entry Operator", description: "Handle data entry and record maintenance." },
      { role: "MIS Executive", description: "Prepare reports and manage information systems." },
      { role: "Administrative Assistant", description: "Support administrative tasks and correspondence." },
      { role: "Computer Operator", description: "Operate computer systems for data processing." },
      { role: "Front Office Executive", description: "Manage reception and front office operations." }
    ],
    faqs: [
      {
        question: "Do I need prior computer knowledge?",
        answer: "No, this course is designed for complete beginners. We start from the basics."
      },
      {
        question: "Will I get hands-on practice?",
        answer: "Yes, the course is 100% practical with assignments and real-world examples."
      },
      {
        question: "Is this course suitable for students?",
        answer: "Yes, it is ideal for students, fresh graduates, and working professionals."
      },
      {
        question: "Will I receive a certificate?",
        answer: "Yes, you will receive a course completion certificate."
      }
    ],
    seo: {
      title: "MS Office Course in Coimbatore | Lasak Edu",
      description: "Master MS Office with hands-on training in Word, Excel, and PowerPoint at Lasak Edu in Coimbatore. Gain essential skills with full career placement support help.",
      keywords: "MS Office Course, Excel Training, Word PowerPoint, Computer Course, MS Office Training Coimbatore, Lasak Edu"
    },
    companies: [
      { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Tata_Consultancy_Services_Logo.svg" },
      { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" }
    ]
  },
  {
    id: 'arts5',
    title: 'Tally with GST',
    slug: "tally-with-gst",
    category: 'Arts',
    oldPrice: '₹15,000',
    price: '₹5,999',
    duration: '1.5 to 2 Months',
    image: '/img/arts/tally-with-gst-448z.webp',
    description: 'Master Tally with GST and accelerate your career growth with expert-led training.',
    tagline: 'Master Tally with GST and accelerate your career growth with expert-led training.',
    introduction: "TallyPrime with GST is a complete accounting and taxation course designed to make you job-ready. This course covers practical accounting concepts, GST compliance, inventory management, payroll processing, and financial reporting with real-time examples.",
    long_description: "**Industries hiring include:**\n💼 Accounting Firms\n🏢 Corporate Finance Departments\n🏪 Retail & Trading Companies\n📊 Tax Consultancies\n🏭 Manufacturing Companies\n\n**Average Fresher Salary in India:** ₹2 – ₹4 LPA\nWith Experience: ₹4 – ₹8 LPA+",
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Accounting Foundations - Master Golden Rules, Double Entry System & Professional Journal Entries",
      "TallyPrime Mastery - Professional Company Creation, Complex Ledger Design & Inventory Management",
      "GST Compliance - Master GST Registration, Smart Invoicing, ITC & GSTR Return Filing Workflows",
      "Digital Banking - Master Bank Reconciliation (BRS), Payroll Processing & PF/ESI Management",
      "Financial Analytics - Generate Professional P&L, Balance Sheets & Intelligent Financial Reporting",
    ],
    skills_gained: [
      "Basics of Accounting & Golden Rules",
      "Company Creation & Ledger Management",
      "Voucher Entry (Payment, Receipt, Sales, Purchase)",
      "GST Setup & Invoicing",
      "Input Tax Credit (ITC) & GST Returns",
      "Inventory & Godown Management",
      "Payroll & Salary Processing",
      "Bank Reconciliation Statement (BRS)",
      "Profit & Loss Account & Balance Sheet"
    ],
    tools: [
      "TallyPrime",
      "GST Portal",
      "Busy Accounting",
      "Zoho Books",
      "Excel"
    ],
    features: [
      "Industry-expert trainers",
      "Real-time accounting practice",
      "Practical GST compliance training",
      "Hands-on Tally software training",
      "Interview preparation support",
      "Placement assistance",
      "Certification After Completion"
    ],
    eligibility: [
      "Commerce students (B.Com, M.Com)",
      "Accounting graduates",
      "MBA Finance students",
      "Working professionals in accounts",
      "Fresh graduates",
      "Anyone interested in accounting and GST"
    ],
    career_opportunities: [
      { role: "Accountant", description: "Manage financial records and prepare accounts." },
      { role: "GST Executive", description: "Handle GST compliance and return filing." },
      { role: "Accounts Assistant", description: "Support accounting operations and data entry." },
      { role: "Billing Executive", description: "Process invoices and billing documentation." },
      { role: "Junior Accountant", description: "Assist in bookkeeping and financial reporting." },
      { role: "Tax Assistant", description: "Support tax preparation and compliance work." }
    ],
    faqs: [
      {
        question: "Is prior accounting knowledge required?",
        answer: "No, we start from accounting basics and cover fundamentals before moving to Tally and GST."
      },
      {
        question: "Will I learn GST return filing?",
        answer: "Yes, you will learn GSTR-1, GSTR-3B, and e-way bill concepts in practical sessions."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, it is designed for beginners with step-by-step practical training."
      },
      {
        question: "Do you provide placement assistance?",
        answer: "Yes, we offer interview preparation and placement support."
      }
    ],
    seo: {
      title: "Tally with GST Course in Coimbatore | Lasak Edu",
      description: "Master Tally with GST in Coimbatore at Lasak Edu. Learn accounting, GST compliance, inventory, and payroll with practical training and full placement support.",
      keywords: "Tally Course, TallyPrime, GST Training, Accounting Course, Tally with GST Coimbatore, Lasak Edu"
    },
    companies: [
      { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg" },
      { name: "KPMG", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/KPMG_logo.svg" },
      { name: "EY", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/EY_logo_2019.svg" }
    ]

  },

  // --- KIDS COURSES ---
  {
    id: 'kid1',
    title: 'Robotics for Kids',
    slug: "robotics-for-kids",
    category: 'Kids',
    price: '₹1',
    duration: '1 to 2 Months',
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=600',
    description: 'Fun robotics program for kids to learn coding, electronics, and build real robots!',
    tagline: 'Master Robotics for Kids and build the future with expert-led training.',
    introduction: "Robotics for Kids is a fun and interactive program designed to introduce children to the exciting world of robotics, coding, and automation. This course helps students develop logical thinking, creativity, and problem-solving skills through hands-on learning.\n\nStudents will build and program real robots using beginner-friendly platforms like Scratch and hardware such as Arduino IDE (basic level introduction).\n\nThe training is designed in a simple, engaging way so kids can learn technology while having fun.",
    long_description: "**Benefits for your child:**\n🧠 Improves creativity & innovation\n📚 Enhances STEM knowledge\n💪 Builds confidence in technology\n🎯 Develops analytical thinking\n🤝 Encourages teamwork\n\n**Perfect for kids aged 8-16 years interested in science, technology, and building things!**",
    isFree: false,
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Robotics 101 - Master Fun Robotics & Industrial Automation Basics through Hands-on Play",
      "Sensor Tech - Master Interactive Sensors, Motor Control & Smart Wiring Fundamentals",
      "Digital Logic - Master Block-Based Coding using Scratch & Visual Programming Logic",
      "Robot Engineering - Master Assembly, Design Thinking & Real-World Mechanical Wiring",
      "AI Projects - Design Obstacle Avoidance Robots & Smart Line Following Technology",
    ],
    skills_gained: [
      "Basics of Robotics & Automation",
      "Introduction to Sensors & Motors",
      "Block-Based Coding (Scratch)",
      "Basic Electronics Concepts",
      "Robot Assembly & Wiring",
      "Obstacle Avoidance Robot",
      "Line Following Robot",
      "Logical Thinking & Problem Solving",
      "Teamwork & Project Presentation Skills"
    ],
    tools: [
      "Arduino",
      "Scratch",
      "Micro:bit",
      "LEGO Spike",
      "mBlock"
    ],
    features: [
      "Hands-on practical sessions",
      "Kid-friendly teaching approach",
      "Project-based learning",
      "Safe and supervised lab environment",
      "Certified trainers",
      "Participation certificate"
    ],
    eligibility: [
      "Kids aged 8 to 16 years",
      "School students interested in science & technology",
      "Beginners with no prior coding knowledge"
    ],
    faqs: [
      {
        question: "Does my child need coding experience?",
        answer: "No, the course starts from scratch and is beginner-friendly."
      },
      {
        question: "Is robotics safe for kids?",
        answer: "Yes, all components used are safe and supervised by trainers."
      },
      {
        question: "Will kids build real robots?",
        answer: "Yes, students will build and program simple robots during the course."
      },
      {
        question: "Is this useful for future careers?",
        answer: "Yes, robotics builds a strong foundation for future careers in engineering, AI, and technology."
      }
    ],
    seo: {
      title: "Robotics for Kids Course in Coimbatore | Lasak Edu",
      description: "Fun robotics program for kids aged 8-16 in Coimbatore at Lasak Edu. Learn coding, build robots, and develop STEM skills with hands-on projects and expert help.",
      keywords: "Robotics for Kids, Kids Coding, Arduino for Kids, STEM Education, Robotics Course Coimbatore, Lasak Edu"
    }
  },
  {
    id: 'kid2',
    title: 'Scratch Coding',
    slug: "scratch-coding",
    category: 'Kids',
    price: 'Starts @ ₹4,000',
    duration: '1 Month',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    description: 'Learn coding through fun games and animations using block-based programming!',
    tagline: 'Master Scratch Coding and accelerate your creative tech journey with expert-led training.',
    introduction: "Scratch is a beginner-friendly, block-based programming platform developed by MIT Media Lab. It helps kids learn coding in a fun and visual way without writing complex code.\n\nThis course introduces children to the fundamentals of programming through games, animations, and interactive stories, helping them build logical thinking and creativity.",
    long_description: "**Benefits of Learning Scratch:**\n🧠 Develops computational thinking\n🎨 Improves creativity and imagination\n🎯 Enhances problem-solving skills\n💪 Builds confidence in coding\n🚀 Strong foundation for Python, Java, and other languages\n\n**Perfect for kids aged 7-15 years who want to start their coding journey!**",
    isFree: false,
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    modules: [
      "Coding Basics - Master Computer Programming Fundamentals through Fun Logic & Game Design",
      "Visual Logic - Master Smart Blocks, Commands & Dynamic Sprite Interaction Techniques",
      "Creative Storytelling - Master Digital Animation, Interactive Stories & Creative Coding Arts",
      "Game Mastery - Master High-Performance Game Design, Levels & Score Optimization",
      "Advanced Logic - Master Complex Loops, Smart Conditions & Intelligent Variables",
    ],
    skills_gained: [
      "Basics of Programming Concepts",
      "Understanding Blocks & Commands",
      "Creating Animations",
      "Designing Interactive Games",
      "Using Loops & Conditions",
      "Variables & Events",
      "Sound & Background Effects",
      "Storytelling with Code",
      "Logical Thinking & Problem Solving"
    ],
    tools: [
      "Scratch",
      "ScratchJr",
      "Code.org",
      "Thunkable"
    ],
    features: [
      "Kid-friendly teaching approach",
      "Hands-on project-based learning",
      "Interactive sessions",
      "Fun mini-projects & games",
      "Certificate of Completion"
    ],
    eligibility: [
      "Kids aged 7 to 15 years",
      "School students interested in coding",
      "Beginners with no prior programming knowledge"
    ],
    faqs: [
      {
        question: "Does my child need coding experience?",
        answer: "No, Scratch is designed for beginners and starts from the basics."
      },
      {
        question: "Will kids create real games?",
        answer: "Yes, students will build simple games and animations during the course."
      },
      {
        question: "Is Scratch useful for future programming?",
        answer: "Yes, it builds a strong foundation for advanced programming languages."
      },
      {
        question: "Is this course suitable for young children?",
        answer: "Yes, it is specially designed for kids with an easy learning approach."
      }
    ],
    seo: {
      title: "Scratch Coding Course in Coimbatore | Lasak Edu",
      description: "Learn Scratch coding for kids aged 7-15 in Coimbatore at Lasak Edu. Create games, animations, and stories using block-based programming on our fun platform here.",
      keywords: "Scratch Coding, Kids Programming, Block Coding, Scratch for Kids, Coding Course Coimbatore, Lasak Edu"
    }
  }
];

export const TESTIMONIALS: StudentStory[] = [
  {
    id: 's1',
    name: 'Vishnu Lakshmi',
    company: 'LMW - COIMBATORE',
    role: 'Design Engineer',
    image: '/img/vishnu-lakshmi-s.webp',
    quote: 'Proud to start my career with a great opportunity.',
    package: '7 LPA'
  },
  {
    id: 's2',
    name: 'Ashok G',
    company: 'CADOPT',
    role: 'Design Engineer',
    image: '/img/ashok-g.webp',
    quote: 'Happy to begin my journey as a Design Engineer.',
    package: '3.5 LPA'
  },
  {
    id: 's3',
    name: 'Saravana Kumar R',
    company: 'CADOPT',
    role: 'Design Engineer',
    image: '/img/saravana-kumar-r.webp',
    quote: 'Great learning experience that shaped my career.',
    package: '3 LPA'
  },
  {
    id: 's4',
    name: 'ChandraLeka G.K.',
    company: 'CADOPT',
    role: 'Design Engineer',
    image: '/img/ms-chandraleka-k.webp',
    quote: 'Achieving this milestone feels amazing.',
    package: '3.2 LPA'
  },
  {
    id: 's5',
    name: 'Dharsan V',
    company: 'DESIGNTECH',
    role: 'Design Engineer',
    image: '/img/mr-dharsan-v.webp',
    quote: 'Excited to start my professional journey.',
    package: '3.5 LPA'
  },
  {
    id: 's7',
    name: 'Lokkesh V',
    company: 'CADOpt',
    role: 'Design Engineer',
    image: '/img/mr-lokkesh-v.webp',
    quote: 'Grateful for this rewarding job opportunity.',
    package: '3.7 LPA'
  },
  {
    id: 's8',
    name: 'Surya M',
    company: 'CADOpt',
    role: 'Design Engineer',
    image: '/img/mr-surya-m.webp',
    quote: 'Happy to start my professional journey',
    package: '3.2 LPA'
  },
  {
    id: 's9',
    name: 'Ruthresh V',
    company: 'MEKNO EOT Crane Manufacturer',
    role: 'Design Engineer',
    image: '/img/mr-ruthresh-v.webp',
    quote: 'Proud to begin my engineering career.',
    package: '2.7 LPA'
  },
  {
    id: 's10',
    name: 'Syed Sharukh',
    company: 'JACK GROUPS',
    role: 'Design Engineer',
    image: '/img/mr-syed-sharukh.webp',
    quote: 'Excited to join JACK Groups.',
    package: '3.2 LPA'
  },
  {
    id: 's11',
    name: 'Anish Joseph C',
    company: 'JACK GROUPS',
    role: 'Design Engineer',
    image: '/img/mr-anish-joseph-c.jpeg',
    quote: 'Grateful to begin my journey at JACK Groups.',
    package: '3.2 LPA'
  }


];

export const BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Mechanical Workshop for Students at Erode Government Engineering College',
    excerpt:
      'Lasak Edu conducted a hands-on Mechanical Engineering Workshop at Erode Government Engineering College, focusing on industry skills, practical exposure, and real-world applications.',
    date: 'Oct 10, 2024',
    category: 'Tech',
    image: '/img/mwerodegov.webp',
    content: `
At **Lasak Edu, Coimbatore**, we strongly believe that practical exposure plays a vital role in shaping successful engineering careers. With this objective, we conducted an **interactive Mechanical Engineering Workshop** for students at **Erode Government Engineering College**.



---

## Workshop Overview

![Workshop Overview](/img/mwerodegov.webp)

The workshop was designed to provide students with **hands-on exposure to core mechanical engineering concepts**, along with insights into how these concepts are applied in real-world industrial environments. The session focused on strengthening students’ technical foundations while aligning their academic knowledge with **current industry requirements**.

Students actively participated in discussions, demonstrations, and problem-solving activities, making the session both **engaging and informative**.

---

## Key Topics Covered


During the workshop, students explored a wide range of essential mechanical engineering topics, including:

- **Mechanical design and drafting techniques**
- Fundamentals of **industrial manufacturing processes**
- **Industry-standard tools and software** used in mechanical projects
- Introduction to **automation and robotics**
- Overview of **emerging mechanical technologies**
- Practical problem-solving exercises to enhance analytical skills

Each topic was explained with real-time examples to help students clearly understand **industrial workflows and applications**.

---

## Hands-On Learning Experience

![Hands-On Learning](/img/erodeblog1.webp)

A major highlight of the workshop was its **hands-on learning approach**. Instead of focusing only on theory, students were encouraged to:

- Apply mechanical concepts to real-life scenarios  
- Analyze engineering problems and propose solutions  
- Understand how mechanical systems function in industries  
- Interact with trainers and clarify technical doubts  

This approach helped students build **confidence, technical clarity, and practical thinking skills**.

---

## Industry Exposure and Career Guidance

![Career Guidance](/img/erodeblog3.webp)

Along with technical training, the workshop also provided valuable **career guidance**. Students were introduced to various career opportunities in the mechanical engineering domain, such as:

- Design Engineer  
- Production Engineer  
- Quality Engineer  
- Maintenance Engineer  
- R&D Engineer  

They also gained awareness about the importance of learning **industry-relevant tools and technologies** to stay competitive in today’s job market.

---

## Why This Workshop Matters

![Workshop Importance](/img/erodeblog2.webp)

The workshop helped students to:

- Bridge the gap between **classroom learning and industry practices**
- Gain clarity on **real-world mechanical engineering applications**
- Improve problem-solving and analytical abilities
- Understand industry expectations and job roles
- Prepare themselves for higher studies and professional careers

---

## Student Takeaways


By the end of the workshop, students gained:

- Practical understanding of mechanical engineering concepts  
- Exposure to industry-oriented problem-solving techniques  
- Improved confidence in applying technical knowledge  
- Motivation to enhance skills through advanced training  

---

## Our Commitment at Lasak Edu


At **Lasak Edu**, we are committed to **empowering engineering students** with the right mix of **technical knowledge, practical skills, and professional guidance**. Through workshops, seminars, and skill-development programs, we aim to prepare students for a **successful and future-ready engineering career**.

We sincerely thank the **management and faculty of Erode Government Engineering College** for their support and cooperation in making this workshop **successful and impactful**.

---

*Interested in organizing similar workshops or technical training programs for your institution?  
Connect with **Lasak Edu** to equip students with industry-ready skills.*
`
  },
  {
    id: 'b2',
    title: 'Lasak Edu Signs MoU with Bishop Appasamy College',
    excerpt: 'Lasak Edu partnered with Bishop Appasamy College to deliver industry-ready Textile CAD and Tally Prime training.',
    date: 'Nov 18, 2024',
    category: 'Announcement',
    image: '/img/bishop.webp',
    content: `
At **Lasak Edu, Coimbatore**, we are thrilled to announce the official signing of a **Memorandum of Understanding (MoU)** with **Bishop Appasamy College of Arts & Science**. This collaboration marks a significant step towards **bridging academic learning with industry-relevant skills**.

![MoU Signing with Bishop Appasamy College](/img/bishop.webp)

---

## Objectives of the Collaboration

The MoU aims to provide students with **specialized training programs** in:

- **Textile CAD** – empowering students with advanced textile design and digital tools  
- **Tally Prime** – enhancing accounting, finance, and business management skills

Through this collaboration, students will gain **hands-on experience, practical insights, and expert guidance** from Lasak Edu’s professional trainers, preparing them for **real-world industry challenges**.

---

## Textile CAD Training
![Textile CAD Training](/img/textile1.webp)

The **Textile CAD course** focuses on:

- Modern **design techniques** for textiles and apparel  
- Use of **digital textile tools and software**  
- Understanding **industry standards and workflow**  
- Preparation for **careers in textile and apparel design**

Students will have the opportunity to **create and simulate professional textile designs**, improving both their technical skills and creative abilities.

---

## Tally Prime Training
![Tally Prime Training](/img/tallyprimeblog.webp)

The **Tally Prime course** is designed to:

- Strengthen students’ **accounting and financial management skills**  
- Provide practical experience with **real-world financial operations**  
- Improve understanding of **business management and reporting tools**  
- Enhance employability in accounting, finance, and business roles

By the end of the course, students will be equipped to **efficiently manage accounting tasks** and understand business processes effectively.

---

## Significance of the MoU

![Significance of the MoU](/img/moubishop.webp )
This partnership reflects Lasak Edu’s **commitment to bridging the gap between academics and industry requirements**. Through structured training programs, students will:

- Gain **practical skills aligned with industry standards**  
- Enhance employability and career readiness  
- Access guidance from **expert trainers**  
- Explore opportunities in **textile design, finance, and business management**

---

## Commitment to Student Success
![Significance of the MoU](/img/studentsuccessbishop.webp )

At **Lasak Edu**, we are dedicated to **empowering students with industry-ready skills** that help them excel in their careers.  
This MoU strengthens our mission to provide **high-quality professional education** that combines theoretical knowledge with practical exposure.

---

*We sincerely thank the management and faculty of **Bishop Appasamy College** for their support and collaboration in making this partnership meaningful and impactful. Students now have access to **cutting-edge training** that will prepare them for future success.*
`
  },
  {
    id: 'b3',
    title: 'IT Orientation Program at Government Arts College for Women, Dindigul',
    excerpt: 'Lasak Edu conducted an IT orientation program to help students explore career paths in software development, analytics, AI, UI/UX, cybersecurity, and cloud.',
    date: 'Oct 25, 2024',
    category: 'Education',
    image: '/img/nellakottai-clg.webp',
    content: `
At **Lasak Edu, Coimbatore**, we recently conducted an **IT Orientation Program** at the **Government Arts College for Women, Dindigul**, aimed at creating awareness about career opportunities in the **Information Technology (IT) field**.


---

## Program Overview
![IT Orientation Program at Government Arts College for Women, Dindigul](/img/nellakottai-clg.webp)

The orientation provided students with **valuable insights into various IT fields, job roles, and career paths** that are shaping today's digital world. Our expert speakers explained:

- The latest **industry trends**  
- In-demand **technologies and tools**  
- Essential **skills required to build a strong IT career**

The session encouraged students to **explore multiple domains** and understand the opportunities available in the ever-growing IT industry.

---

## Key Topics Covered

During the program, students explored the following areas:

- **Software Development & Programming** career options  
- **Data Analytics & Artificial Intelligence (AI)** opportunities  
- **UI/UX Design** and creative technology roles  
- **Cybersecurity & Cloud Computing** career prospects  
- Importance of **continuous learning and upskilling** in IT  

Each topic was presented with **real-world examples, industry case studies, and guidance on skill-building pathways**.

---

## Career Guidance & Industry Insights
![Career Guidance & Industry Insights](/img/govnel4.webp)

The orientation also focused on **career planning strategies**, helping students to:

- Understand the **diverse job roles in IT**  
- Identify which domain aligns with their **interests and strengths**  
- Plan a **learning roadmap** to stay competitive in a technology-driven world  
- Gain clarity on **entry-level job expectations and future growth opportunities**  

Students received tips on how to **leverage certifications, internships, and project-based learning** to enhance their employability.

---

## Student Takeaways
![Student Takeaways](/img/govnel5.webp)

By the end of the session, students were able to:

- Explore various **IT career paths**  
- Understand **skills and tools required for each domain**  
- Plan their **personal learning and career development roadmap**  
- Gain **motivation and confidence** to pursue technology careers  

---

## Our Mission at Lasak Edu

At **Lasak Edu**, our mission is to **empower students with knowledge, skills, and career guidance**, enabling them to make informed decisions and achieve success in the world of technology.
![Student Takeaways](/img/govnel3.webp)

Through programs like this orientation, we aim to **bridge the gap between academics and industry**, preparing students for **future-ready IT careers**.

---

*We extend our gratitude to the management and faculty of the **Government Arts College for Women, Dindigul** for their support in making this program impactful and successful.*
`
  },
  {
    id: 'b4',
    title: '20-Day Basic Programming Languages Workshop at Smt. D. Padmavathi Ammal High School',
    excerpt: 'Lasak Edu conducted a 20-day workshop to introduce young learners to programming fundamentals, logical thinking, and hands-on coding experience.',
    date: 'Nov 2024',
    category: 'Education',
    image: '/img/schoolfront.webp',
    content: `
At **Lasak Edu, Coimbatore**, we successfully conducted a **20-day Basic Programming Languages Workshop** for students at **Smt. D. Padmavathi Ammal High School**. This initiative was designed to **introduce young learners to programming fundamentals** and spark their interest in the world of technology.


---

## Workshop Overview
![20-Day Basic Programming Languages Workshop at Smt. D. Padmavathi Ammal High School](/img/schooloverview.webp)

The workshop aimed to provide students with **hands-on coding experience** and strengthen their **logical and computational thinking**.  

Students learned:

- **Basics of programming languages** suitable for beginners  
- **Problem-solving and logical thinking skills**  
- **Hands-on coding exercises** to reinforce learning  
- **Practical applications of programming** in daily life and future careers  

---

## Objectives

Through this 20-day workshop, we aimed to:
![20-day workshop](/img/school1.webp)

- Build a **strong foundation in coding** for young learners  
- Equip students with **essential computational skills**  
- Encourage **curiosity, creativity, and problem-solving abilities**  
- Introduce students to the **world of IT and software development**  

---

## Student Takeaways

By the end of the workshop, students were able to:
![Student Takeaways](/img/school4.webp)

- Understand **fundamental programming concepts**  
- Apply **logical thinking to solve problems**  
- Gain **confidence in writing basic code**  
- Explore **future opportunities in technology and IT careers**

---

## Our Mission at Lasak Edu

At **Lasak Edu**, our mission is to **empower students with technical knowledge, practical skills, and confidence**, helping them **take their first steps toward a successful career in technology**.
![Our Mission at Lasak Edu](/img/school2.webp)

*We thank the faculty and management of **Smt. D. Padmavathi Ammal High School** for supporting this workshop and making it a success.*
`
  },
  {
    id: 'b5',
    title: "Lasak Edu CSR Free Skill Development Programs in Coimbatore",
    excerpt: 'Lasak Edu provides free CSR skill development programs in Coimbatore, offering practical training in CAD, Tally, Excel, and Python.',
    date: "2025-01-15",
    category: "CSR",
    image: "/img/csr-1.webp",
    content: `
At **Lasak Edu, Coimbatore**, we are dedicated to **empowering students with career-focused education and practical skills** that prepare them for the future.  

As part of our **Corporate Social Responsibility (CSR) initiatives**, we proudly offer **free skill development courses**, ensuring access to **quality coaching and industry-relevant training**.


---

## CSR Programs Overview
![Lasak Edu CSR Free Skill Development Programs](/img/csr-1.webp)

Our CSR programs include:

- **Textile CAD training**  
- **Tally Prime course**  
- **Advanced Excel classes**  
- **Basic Python programming**  

Each course is **carefully curated** to provide **hands-on learning, expert guidance, and real-world applications**, helping students enhance their **technical skills, employability, and career growth**.

---

## Objectives
![free CSR programs](/img/csr1.webp)

Through these free CSR programs, we aim to:

- Bridge the **gap between education and employment**  
- Provide students with **practical, job-ready skills**  
- Enhance **career opportunities in industries such as textiles, accounting, data analytics, and software development**  
- Create a **supportive learning environment** in Coimbatore

---

## Why Choose Lasak Edu?
![ Lasak Edu](/img/csr2.webp)

Students benefit from:

- ✔ **Free skill development courses**  
- ✔ **Expert trainers with industry experience**  
- ✔ **Focus on career growth and employability**  
- ✔ **Convenient learning environment in Coimbatore**

---

## Our Mission
![free CSR programs](/img/csr3.webp)

At **Lasak Edu**, we believe that **education creates opportunities**. Through our CSR initiatives, we are committed to **nurturing young talent, enhancing skills, and shaping brighter futures** for students in Coimbatore.

*We invite all students to take advantage of these programs and gain the skills necessary for a successful career.*
`
  },

  {
    id: 'b6',
    title: 'IT Orientation Program at Erode Sengunthar Engineering College by Lasak Edu',
    excerpt: 'Lasak Edu conducted an IT orientation program at Erode Sengunthar Engineering College, guiding students on tech careers, emerging skills, and industry expectations.',
    date: 'Nov 2024',
    category: 'Education',
    image: '/img/erodeit.webp',
    content: `
At **Lasak Edu, Coimbatore**, we recently conducted an **IT Orientation Program** for students at **Erode Sengunthar Engineering College**. The program aimed to introduce students to the **world of Information Technology**, career opportunities, and essential skills required to excel in the IT industry.

![IT Orientation Program at Erode Sengunthar Engineering College](/img/erodeit.webp)

---

## Program Overview
![free CSR programs](/img/csr3.webp)



The orientation provided students with **insights into IT careers, emerging technologies, and industry expectations**. During the session, students learned about:

- Various **IT career paths and roles**  
- Emerging technologies such as **Software Development, Data Analytics, Artificial Intelligence (AI), UI/UX Design, and Cybersecurity**  
- Core **technical skills and industry expectations**  
- **Career planning, upskilling, and future growth** in the IT domain  

---

## Objectives

The program aimed to help students:

- Understand **how the IT industry is evolving**  
- Identify the **skills required to stay competitive** in a technology-driven world  
- Gain **hands-on exposure** to coding, digital tools, and problem-solving techniques  
- Prepare for **internships, projects, and full-time roles**  

---

## Key Takeaways

By the end of the orientation, students were able to:

- Explore **various IT career opportunities**  
- Understand **emerging technologies and their applications**  
- Learn **industry expectations and best practices**  
- Build a **foundation for continuous learning and adaptability**  

---

## Our Mission at Lasak Edu

At **Lasak Edu**, we are committed to **empowering students with knowledge, practical skills, and career guidance**.  

Our mission is to **mentor and inspire young talent**, enabling students to confidently pursue **successful careers in technology**.

*We thank the management and faculty of **Erode Sengunthar Engineering College** for supporting this orientation and making it impactful.*
`
  },
  {
    id: 'b7',
    title: 'One-Day Software Testing Workshop at Sri Krishna Adithya College of Arts and Science',
    excerpt: 'Lasak Edu conducted a one-day workshop on software testing, automation, QA careers, and real-world testing practices at Sri Krishna Adithya College of Arts and Science.',
    date: 'Aug 7, 2024',
    category: 'Workshop',
    image: '/img/srikrishna.webp',
    content: `
On **7th August 2024**, **Lasak Edu, Coimbatore**, successfully conducted a **One-Day Software Testing Workshop** at **Sri Krishna Adithya College of Arts and Science**. The workshop focused on providing students with **hands-on exposure to modern testing methodologies and tools** used in the IT industry.

![One-Day Software Testing Workshop at Sri Krishna Adithya College of Arts and Science](/img/srikrishna.webp)

---

## Workshop Highlights

Students gained practical insights through:
![Workshop Highlights](/img/srikrishnast1.webp)

- Introduction to **manual and automation testing**  
- Hands-on sessions with **real-world test cases and QA scenarios**  
- Insights into **career opportunities in QA, software testing, and automation**  
- Interactive discussions and **Q&A with industry trainers**  

The workshop emphasized the importance of **Software Quality Assurance (SQA)** in real-world software development, helping students understand how testing **reduces defects, improves product reliability, and ensures user satisfaction**.

---

## Key Takeaways
![Workshop Highlights](/img/srikrishnast2.webp)

Participants gained clarity on:

- Differences between **manual and automation testing**  
- **Testing workflows** used in companies  
- How to **write test cases and maintain test documentation**  
- Skills required to become a **successful QA Engineer**  

The session also provided **career guidance**, covering entry paths such as **QA Analyst, Test Engineer, Automation Tester, and Quality Assurance Specialist**.

---

## Our Commitment
![Workshop Highlights](/img/srikrishnast3.webp)

At **Lasak Edu**, we are dedicated to bridging the gap between academics and industry through **skill development programs, industry workshops, and technical training sessions**.  

This initiative aimed to equip students with **job-ready skills** and boost their confidence as they prepare for **careers in IT and software testing**.

*We sincerely thank the management and faculty of **Sri Krishna Adithya College of Arts and Science** for their support in making this workshop impactful and successful.*
`
  },
  {
    id: 'b8',
    title: 'Empowering Mechanical Engineers — LASAK Techno Institute Seminar at Hindusthan College of Engineering and Technology',
    excerpt: 'LASAK Techno Institute conducted a seminar at Hindusthan College of Engineering and Technology, guiding mechanical engineering students on future career paths, industry skills, and technological trends.',
    date: 'Aug 2024',
    category: 'Seminar',
    image: '/img/hindustan.webp',
    content: `
**LASAK Techno Institute**, Coimbatore, recently conducted an inspiring seminar at **Hindusthan College of Engineering and Technology**, designed to empower aspiring **mechanical engineers** with career insights and industry knowledge. The session focused on helping students understand how engineering skills can be applied in real-world industries and how to build a strong professional future.

![LASAK Techno Institute Seminar at Hindusthan College of Engineering and Technology](/img/hindustan.webp)

---

## Key Topics Covered

Students explored:

- Emerging trends in **Mechanical Engineering and Industrial Technology**  
- Real-world applications of **CAD, CAM, CAE, product design, and simulation tools**  
- **Industry expectations and essential technical skills**  
- Career pathways in **manufacturing, aerospace, automotive, HVAC, and robotics**  
- Strategies for **continuous learning and professional growth**  

The seminar was delivered by experienced industry professionals who shared **practical examples, case studies, and success stories**. Students actively participated, asking questions and gaining clarity about challenges and opportunities in the engineering sector.

---

## Why This Seminar Matters

The session helped students:

- Understand how to **connect classroom learning with industry requirements**  
- Explore job roles such as **Design Engineer, Quality Engineer, Production Engineer, and R&D Engineer**  
- Learn about industry-standard tools like **SolidWorks, AutoCAD, Creo, CATIA, NX CAD, and Ansys**  
- Build **confidence in planning their professional journey after graduation**

---

## Our Mission

At **LASAK Techno Institute**, we are committed to **bridging the gap between academia and industry**. Through seminars, workshops, and skill-development programs, we equip students with the **right skills, exposure, and mindset** to become **future-ready engineering professionals**.

*We extend our sincere thanks to the management and faculty of **Hindusthan College of Engineering and Technology** for their support and collaboration in making this seminar impactful.*
`
  },
  {
    id: 'b9',
    title: 'Career Guidance Program for Mechanical Engineers – Sengunthar College, Erode',
    excerpt: 'LASAK Techno Institute conducted a Career Guidance Program at Sengunthar College, Erode, guiding mechanical engineering students on future career paths, industry skills, and technological trends.',
    date: 'Aug 2024',
    category: 'Career Guidance',
    image: '/img/erodemech1.webp',
    content: `
At **Lasak Edu, Coimbatore**, we are committed to **empowering students with career-focused education and practical skills** that prepare them for the future.  

Recently, we organized a **Career Guidance Program for Mechanical Engineering students** at **Sengunthar College, Erode**, aimed at bridging the gap between **academics and industry expectations**.

![Career Guidance Program at Sengunthar College, Erode](/img/erodemech1.webp)

---

## Program Overview

The program helped students **explore diverse career opportunities, understand industry trends, and develop the right mindset** to succeed in today’s competitive job market.  
![Program Overview](/img/erodemech1.webp)

By engaging with **expert trainers and industry professionals**, students gained valuable insights into potential career pathways in:

- **Manufacturing and production engineering**  
- **Design and R&D**  
- **Automotive and renewable energy sectors**  
- **Software-driven engineering solutions**  

---

## Why This Program Matters

Mechanical engineering is a versatile and high-demand field, but many students face challenges in choosing the right career path. This program enabled students to:
![Why This Program Matters](/img/erodemech2.webp)

- Understand **emerging industry needs and job roles**  
- Gain clarity on **higher studies vs. career options**  
- Learn **essential employability skills and interview readiness**  
- Discover opportunities in **both core and interdisciplinary domains**  

Students also learned how to connect classroom learning with **industry requirements**, explore job roles such as **Design Engineer, Quality Engineer, Production Engineer, and R&D Engineer**, and get acquainted with **tools like SolidWorks, AutoCAD, Creo, CATIA, NX CAD, and Ansys**.  

---

## Our Mission

At **LASAK Techno Institute**, we are committed to **bridging the gap between academia and industry**. Through **seminars, workshops, and skill-development programs**, we equip students with the **right skills, exposure, and mindset** to become **future-ready engineering professionals**.

*We sincerely thank the management and faculty of **Sengunthar College, Erode** for their support and collaboration in making this program meaningful and impactful.*
`
  },
  {
    id: 'b10',
    title: 'Empowering Polytechnic Students with Practical Skills — LASAK Techno Institute’s Value Added Courses at Sri Ramakrishna Mission Vidyalaya',
    excerpt: 'LASAK Techno Institute conducted a seminar at Sri Ramakrishna Mission Vidyalaya Polytechnic College, guiding mechanical engineering students on future career paths, industry skills, and technological trends.',
    date: 'Aug 2024',
    category: 'Seminar',
    image: '/img/empoweringpolytechnic.webp',
    content: `
At **LASAK Techno Institute** and **E-CADD Center**, we believe in **bridging the gap between academic learning and industry requirements**.  

As part of this mission, we conducted **Value Added Courses** at **Sri Ramakrishna Mission Vidyalaya Polytechnic College, Coimbatore**, to equip students with the **technical and practical skills needed for a successful engineering career**.


---

## Program Overview
![Program Overview](/img/empoweringpolytechnic.webp)

The program focused on **enhancing students’ knowledge in key engineering domains**, offering **hands-on training and real-world applications**.  

Through **interactive sessions and guided projects**, students gained deeper insights into **modern tools and technologies** shaping today’s industries.  

Participating in these courses allowed students to **strengthen their technical foundation**, improve **employability**, and boost **career readiness**.

---

## Why This Seminar Matters
![Why This Seminar Matters](/img/polytechnic2.webp)

The session helped students:

- Understand how to **connect classroom learning with industry requirements**  
- Explore job roles such as **Design Engineer, Quality Engineer, Production Engineer, and R&D Engineer**  
- Learn about **industry-standard tools** like **SolidWorks, AutoCAD, Creo, CATIA, NX CAD, and Ansys**  
- Build **confidence in planning their professional journey after graduation**

---

## Our Mission
![Our Mission](/img/polytechnic1.webp)

At **LASAK Techno Institute**, we are committed to **bridging the gap between academia and industry**.  

Through **seminars, workshops, and skill-development programs**, we equip students with the **right skills, exposure, and mindset** to become **future-ready engineering professionals**.

*We extend our sincere thanks to the management and faculty of **Sri Ramakrishna Mission Vidyalaya Polytechnic College** for their support and collaboration in making this program impactful.*
`
  },

  {
    id: 'b11',
    title: 'Hands-On Learning in SolidWorks — LASAK Techno Institute Conducts a Seminar on Weldments for KGISL Mechanical Students',
    excerpt:
      'LASAK Techno Institute conducted a hands-on SolidWorks Weldments seminar at KGISL Institute of Technology, helping mechanical students gain industry-ready CAD and design skills.',
    date: 'Aug 2024',
    category: 'Seminar',
    image: '/img/kgisl-mechanical-students.webp',
    content: `
At **LASAK Techno Institute and E-CADD Center, Coimbatore**, we are committed to empowering engineering students with **industry-relevant, career-focused training**. As part of our continuous academic–industry initiatives, we successfully conducted a **one-day hands-on seminar on Weldments in SolidWorks** for **Mechanical Engineering students** at **KGISL Institute of Technology**.


---

## Seminar Overview
![SolidWorks Weldments Seminar at KGISL](/img/kgisl-mechanical-students.webp)
The seminar was designed to introduce students to **SolidWorks Weldments**, a powerful module widely used in **mechanical design, fabrication, and manufacturing industries**. The session focused on transforming theoretical knowledge into **practical, real-world design skills**.

Students were exposed to **industry workflows** followed by professional design engineers, enabling them to understand how digital CAD models are converted into **fabricated structures** used in automotive, construction, aerospace, and heavy engineering sectors.

---

## Key Topics Covered
![SolidWorks Weldments Seminar at KGISL](/img/kgisl-mechanical-students.webp)
During the seminar, our expert trainers covered the following essential topics:

- Introduction to **SolidWorks Weldments**
- **3D Sketching techniques** for frame and structure creation
- **Structural member design** using standard profiles
- **Corner treatments, trimming, and alignment**
- Adding **weld beads and fabrication details**
- Best practices for **manufacturing-oriented design**

![Hands-on SolidWorks Training](/img/kgisl1.webp)

Each topic was demonstrated live, allowing students to **practice simultaneously** and clarify doubts instantly.

---

## Hands-On Learning Experience

Unlike traditional classroom lectures, this seminar emphasized **interactive, hands-on learning**. Students actively participated in:

- Creating weldment structures in SolidWorks  
- Understanding **design intent and constraints**  
- Exploring **real-time industrial use cases**  
- Engaging in live Q&A sessions with industry trainers  

This approach helped students gain **confidence in using professional CAD tools** and sharpen their problem-solving abilities.

---

## Why This Seminar Matters

The session played a crucial role in bridging the gap between academics and industry. Students were able to:

- Connect **classroom learning** with **industry expectations**
- Understand current **mechanical design trends**
- Explore career opportunities such as:
  - Design Engineer  
  - Quality Engineer  
  - Production Engineer  
  - R&D Engineer  
- Gain awareness of **industry-standard software tools**, including:
  - **SolidWorks**
  - **AutoCAD**
  - **Creo**
  - **CATIA**
  - **NX CAD**
  - **Ansys**

![Mechanical Students Interaction Session](/img/kgisl2.webp)

---

## Student Takeaways

By the end of the seminar, participants gained:

- Practical understanding of **weldment design workflows**
- Exposure to **industry-level CAD practices**
- Improved clarity on **career planning after graduation**
- Motivation to pursue **advanced skill-based training**

---

## Our Mission

At **LASAK Techno Institute**, our mission is to **bridge the gap between academia and industry**. Through **seminars, workshops, and advanced skill-development programs**, we equip students with the **right skills, exposure, and mindset** to become **future-ready engineering professionals**.

We extend our sincere thanks to the **management and faculty of Hindusthan College of Engineering and Technology** for their support and collaboration in making this seminar **successful and impactful**.

---

*Interested in conducting similar workshops or industrial training programs?  
Connect with **LASAK Techno Institute** to empower students with industry-ready skills.*
`
  }
];

// Mock Certificate Database
export const CERTIFICATES: CertificateData[] = [
  { certId: 'TN/MAA/070/LTIEC0022', studentName: 'MONISHA M', courseName: 'WEB DEVELOPMENT', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CHE/071/LTIEC0023', studentName: 'CHANDRALEKHA G K', courseName: 'NXcad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0024', studentName: 'NAVANEETHA KRISHNAN', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/ERD/080/LTIEC0025', studentName: 'JAIRASWANTH', courseName: 'C,C++', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0026', studentName: 'ABHI NIVESH P', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0027', studentName: 'KELVIN A', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0028', studentName: 'J AMAL ZICO', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0029', studentName: 'BALAJI', courseName: 'WEB DEVELOPMENT', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0030', studentName: 'VASANTH', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0031', studentName: 'VISHNU KUMAR V', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0032', studentName: 'Dharsan V', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0033', studentName: 'PRABHU', courseName: 'autocad', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0034', studentName: 'ARUL LAKSHMI', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0035', studentName: 'Ganesh Pradeep V', courseName: 'Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0036', studentName: 'Rajapandi', courseName: 'C,C++', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0037', studentName: 'Theenarasu S', courseName: 'Master Diploma', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0038', studentName: 'Vijay M', courseName: 'Hypermesh', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0039', studentName: 'Keerthana', courseName: 'Sketchup', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0040', studentName: 'Nijandhan K', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0041', studentName: 'Surya M', courseName: 'Nxcad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0042', studentName: 'Lokkesh V', courseName: 'Master Diploma', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0043', studentName: 'Muthulingam K', courseName: 'Autocad,Solidworks,Creo,Nxcad', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0044', studentName: 'Palanisamy C', courseName: 'Master Diploma', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0045', studentName: 'Sathyaseelan', courseName: 'Ecad', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0046', studentName: 'Dayanathi S', courseName: 'Revit', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0047', studentName: 'Lithin ABINAV M R', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0048', studentName: 'Alagappan V', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0049', studentName: 'Varun Kumar C', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0050', studentName: 'Harsh B', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0051', studentName: 'Niresh C', courseName: 'Master Diploma', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0052', studentName: 'Lokesh K', courseName: 'Nxcad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0053', studentName: 'Sanjay Karthikeyan M', courseName: 'C,C++,Python,Java', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0054', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0055', studentName: 'Lokendra', courseName: 'Autocad,Catia,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0056', studentName: 'Narayana Prakash', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0057', studentName: 'Franklin Blesson', courseName: 'Nxcad,Nxcam', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0058', studentName: 'Nithyanandhan', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0059', studentName: 'Subramaniya Bharathi', courseName: 'Autocad', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0060', studentName: 'Dhanabal', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0061', studentName: 'Dharun Kumar', courseName: 'Full Stack', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0062', studentName: 'Booshan Bharatvaj', courseName: 'Full Stack', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0063', studentName: 'Haripriya', courseName: 'Creo,Wiring Harness', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0064', studentName: 'Karthikeyan', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0065', studentName: 'Anadha Ganapathy', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0066', studentName: 'Nandhini', courseName: 'Data Analytics', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0067', studentName: 'Manikandan', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0068', studentName: 'Karthikeyan', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0069', studentName: 'Amurthavarsini', courseName: 'Ecad,PLC,Scada', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0070', studentName: 'Kumar', courseName: 'Autocad,Solidworks,Ansys', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0071', studentName: 'Subhash Chandra Bose', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0072', studentName: 'Hem Advai', courseName: 'Autocad,Solidworks,Ansys', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0073', studentName: 'Ruthresh', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0074', studentName: 'Krishna Kumar Chandran', courseName: 'Ansys', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0075', studentName: 'Syed Sharukh', courseName: 'Autocad,Revit,Sketchup', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0076', studentName: 'Jairaswanth Loganathan', courseName: 'Python', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0077', studentName: 'Sanjay Balaji', courseName: 'Python', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0078', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0079', studentName: 'Jayachandran', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0080', studentName: 'Thennavan', courseName: 'Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0081', studentName: 'Albert Enstien', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0082', studentName: 'Sethupathi', courseName: 'Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0083', studentName: 'Anish Joseph', courseName: 'Autocad,Sketchup', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0084', studentName: 'Viswamani', courseName: 'Python', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0085', studentName: 'RINESH', courseName: 'Autocad', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0086', studentName: 'KAUSHIK', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0087', studentName: 'M K SREEJESH', courseName: 'Software Testing', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0088', studentName: 'V ARON', courseName: 'Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0089', studentName: 'S D MOHAN KARTHICK', courseName: 'Solidworks,ANSYS', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0090', studentName: 'R GOPINATH', courseName: 'Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0091', studentName: 'BOOBALA KRISHNAN J', courseName: 'CIVILCAD', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0092', studentName: 'SAGAYA AMBROSE S', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0093', studentName: 'Pranav A', courseName: 'Autocad', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0094', studentName: 'Rajavel', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0095', studentName: 'SANTHOSH', courseName: 'DATA ANALYTICS', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0096', studentName: 'Kishore sp', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0097', studentName: 'Dinesh kumar s', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0098', studentName: 'SIVA BALAMURUGAN P P', courseName: 'NXCAD', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0099', studentName: 'Naveen k', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0100', studentName: 'Ram prakash', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0101', studentName: 'Ashwin c', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0102', studentName: 'Nikesh S', courseName: 'Autocad,Solidworks,Creo,Catia', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0103', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0104', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0105', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0106', studentName: 'MONIKA S', courseName: 'python', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0107', studentName: 'SWATHI M', courseName: 'python', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0108', studentName: 'SHAMLI SAMPORNA S', courseName: 'python', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0109', studentName: 'SUVATHI P', courseName: 'SOFTWARE TESTING', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0110', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0111', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0112', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0113', studentName: '', courseName: '', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0114', studentName: 'MUKESH', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0115', studentName: 'PRAKASH', courseName: 'Solidworks', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0116', studentName: 'SURYA', courseName: 'Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0117', studentName: 'karthikeyan', courseName: 'Autocad,Solidworks,Creo', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0118', studentName: 'Bretto sam', courseName: 'Autocad,Solidworks,Creo,Catia', duration: '6 Months', completionDate: '', status: 'Completed' },
  { certId: 'TN/CBE/069/LTIEC0119', studentName: 'lavanya', courseName: 'python, java', duration: '6 Months', completionDate: '', status: 'Completed' },
];

export const BLOG_PREVIEW_LIST = BLOGS.map(blog => ({
  id: blog.id,
  title: blog.title,
  excerpt: blog.excerpt,
  date: blog.date,
  category: blog.category,
  image: blog.image
}));



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
