import { Course, StudentStory, BlogPost, CertificateData } from '../types';
export const COURSES: Course[] = [
  // --- MECHANICAL COURSES ---
  {
    id: 'mech1',
    title: 'AutoCAD Mechanical',
    slug: "autocad-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹9,000',
    price: '₹5,999',
    duration: '1 – 1.5 Months',
    image: '/img/mech/autocad.webp',
    description: 'Master AutoCAD Mechanical and accelerate your career growth with expert-led training.',
    tagline: 'Join the best AutoCAD training institute in Coimbatore. Civil & Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best AutoCAD training in Coimbatore for civil and mechanical students. Our course includes real-time projects and placement support.\n\nAutoCAD Mechanical is a specialized CAD software designed for mechanical engineering and manufacturing industries. It provides advanced tools for creating precise mechanical drawings, standard parts, annotations, and documentation.\n\nThis course offers complete hands-on training in 2D drafting, mechanical detailing, dimensioning standards, and industry workflows used in real-world design projects.",
    long_description: "## Why Choose Our AutoCAD Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced 2D drafting and 3D detailing, our course ensures a solid foundation.\n\n## Course Details – AutoCAD Training\n\nThis robust course walks you through AutoCAD's interface, workspace navigation, drawing setup, and professional layer management. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Mechanical & Civil Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities for our mechanical and civil students.\n\n**Industries hiring include:**\n🏭 Manufacturing Companies\n🏗 Fabrication Industries\n🚗 Automotive Firms\n🚜 Heavy Machinery Sectors\n🛠 Product Development Companies\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "AutoCAD Training in Coimbatore | Civil & Mechanical Courses | Lasak Edu",
      description: "Join the best AutoCAD training institute in Coimbatore. Civil & Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "AutoCAD Training in Coimbatore, Civil & Mechanical Courses, AutoCAD training institute in Coimbatore, Lasak Edu, Mechanical Drawing",
      alt_text: "AutoCAD training class in Coimbatore"
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
    slug: "solidworks-masterclass-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1.5 – 2 Months',
    image: '/img/mech/solidworks-408z.webp',
    description: 'Master SolidWorks and accelerate your career growth with expert-led training.',
    tagline: 'Join the best SolidWorks Masterclass training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best SolidWorks Masterclass training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nThe SolidWorks Masterclass is a comprehensive, industry-focused training program designed to help you become proficient in 3D modeling, assembly design, and product development. SolidWorks is widely used in automotive, aerospace, manufacturing, and product design industries.\n\nThis course covers everything from basic sketching to advanced modeling techniques, ensuring you gain practical, real-world experience through live projects and hands-on exercises.",
    long_description: "## Why Choose Our SolidWorks Masterclass Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – SolidWorks Masterclass Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🚗 Automotive Companies\n🏭 Manufacturing Industries\n🏗 Heavy Machinery Firms\n🛠 Product Development Companies\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "SolidWorks Masterclass Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best SolidWorks Masterclass training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "SolidWorks Masterclass Training in Coimbatore, Mechanical Courses, SolidWorks Masterclass training institute in Coimbatore, Lasak Edu",
      alt_text: "SolidWorks Masterclass training class in Coimbatore"
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
    slug: "creo-parametric-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1.5 – 2 Months',
    image: '/img/mech/creo-688z.webp',
    description: 'Master Creo Parametric and accelerate your career growth with expert-led training.',
    tagline: 'Join the best Creo Parametric training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best Creo Parametric training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nCreo Parametric is a powerful 3D CAD software widely used in mechanical product design, manufacturing, and engineering industries. This course provides complete hands-on training in part modeling, assembly design, detailing, and real-time industrial projects.\n\nYou will learn industry-standard design workflows used in automotive, aerospace, and manufacturing sectors to create high-quality 3D models and production-ready drawings.",
    long_description: "## Why Choose Our Creo Parametric Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Creo Parametric Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🚗 Automotive Companies\n🏭 Manufacturing Firms\n🏗 Heavy Machinery Industries\n🛠 Product Development Companies\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "Creo Parametric Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best Creo Parametric training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Creo Parametric Training in Coimbatore, Mechanical Courses, Creo Parametric training institute in Coimbatore, Lasak Edu",
      alt_text: "Creo Parametric training class in Coimbatore"
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
    slug: "catia-v5-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '1.5 – 3 Months',
    image: '/img/mech/catia-118z.webp',
    description: 'Master CATIA V5 and accelerate your career growth with expert-led training.',
    tagline: 'Join the best CATIA V5 training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best CATIA V5 training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur CATIA V5 Course is designed for Mechanical Engineering students and professionals who want to build strong skills in product design and 3D modeling.\n\nCATIA V5 is one of the most widely used CAD software tools in automotive, aerospace, and manufacturing industries. It is used for designing complex mechanical components, assemblies, and industrial products.\n\nThis course provides hands-on training in part modeling, assembly design, drafting, and surface modeling. The focus is on real-time industrial design practices to help you become job-ready.\n\nBy the end of this course, you will be able to design mechanical components and generate production-ready drawings confidently.",
    long_description: "## Why Choose Our CATIA V5 Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – CATIA V5 Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring CATIA professionals:**\n🚗 Automotive Industry\n✈ Aerospace Industry\n🏭 Manufacturing Companies\n🔩 Heavy Machinery Industry\n\n**Average Fresher Salary in India:** ₹2.5 – ₹5 LPA\nWith Experience: ₹6 – ₹15 LPA+\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "CATIA V5 Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best CATIA V5 training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "CATIA V5 Training in Coimbatore, Mechanical Courses, CATIA V5 training institute in Coimbatore, Lasak Edu",
      alt_text: "CATIA V5 training class in Coimbatore"
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
    slug: "ansys-simulation-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '2 – 3 Months',
    image: '/img/mech/ansys-670z.webp',
    description: 'Master ANSYS Simulation and accelerate your career growth with expert-led training.',
    tagline: 'Join the best ANSYS Simulation training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best ANSYS Simulation training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur ANSYS Simulation Course is designed for Mechanical Engineering students and professionals who want to build expertise in Computer-Aided Engineering (CAE) and Finite Element Analysis (FEA).\n\nANSYS is one of the most powerful and widely used simulation software tools in industries like automotive, aerospace, manufacturing, and energy. This course focuses on structural analysis, thermal analysis, and simulation techniques used in real-world engineering applications.\n\nThrough practical training and real-time projects, you will learn how to analyze mechanical components, predict performance, and improve product design using simulation tools.\n\nBy the end of the course, you will confidently perform engineering simulations and solve complex mechanical problems.",
    long_description: "## Why Choose Our ANSYS Simulation Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – ANSYS Simulation Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring ANSYS professionals:**\n🚗 Automotive Companies\n✈ Aerospace Industry\n🏭 Manufacturing Firms\n⚙ Heavy Equipment Industries\n🔋 Energy & Power Sector\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹8 – ₹18 LPA+\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "ANSYS Simulation Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best ANSYS Simulation training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "ANSYS Simulation Training in Coimbatore, Mechanical Courses, ANSYS Simulation training institute in Coimbatore, Lasak Edu",
      alt_text: "ANSYS Simulation training class in Coimbatore"
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
    slug: "hypermesh-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹40,000',
    price: '₹19,999',
    duration: '1.5 – 3 Months',
    image: '/img/mech/hypermesh-631z.webp',
    description: 'Master HyperMesh and accelerate your career growth with expert-led training.',
    tagline: 'Join the best HyperMesh training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best HyperMesh training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur HyperMesh Course is specially designed for Mechanical Engineering students and professionals who want to build a strong career in CAE (Computer-Aided Engineering) and Finite Element Analysis (FEA).\n\nHyperMesh is one of the most widely used pre-processing tools in the automotive and aerospace industries for simulation and analysis. In this course, you will learn how to create high-quality meshes, apply loads and boundary conditions, and prepare models for structural analysis.\n\nThe training is completely practical and industry-oriented, focusing on real-time engineering problems and projects.\n\nBy the end of the course, you will be able to confidently work on CAE projects in leading core companies.",
    long_description: "## Why Choose Our HyperMesh Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – HyperMesh Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring HyperMesh professionals:**\n🚗 Automotive Industry\n✈ Aerospace Industry\n🏭 Manufacturing Companies\n🔩 Heavy Machinery Companies\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹8 – ₹15 LPA+\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "HyperMesh Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best HyperMesh training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "HyperMesh Training in Coimbatore, Mechanical Courses, HyperMesh training institute in Coimbatore, Lasak Edu",
      alt_text: "HyperMesh training class in Coimbatore"
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
    slug: "ansa-pre-processing-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1.5 – 3 Months',
    image: '/img/mech/ansa-062z.webp',
    description: 'Master ANSA Pre-Processing and accelerate your career growth with expert-led training.',
    tagline: 'Join the best ANSA Pre-Processing training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best ANSA Pre-Processing training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur ANSA Pre-Processing Course is designed for Mechanical Engineering students and professionals who want to build a strong career in CAE (Computer-Aided Engineering) and Finite Element Analysis (FEA).\n\nANSA is a powerful pre-processing software widely used in automotive and aerospace industries for model preparation, meshing, and simulation setup. It helps engineers create high-quality finite element models before analysis.\n\nThis course provides hands-on training in geometry cleanup, 2D and 3D meshing, model setup, and quality checks. The training is practical and industry-oriented, focusing on real-time engineering case studies.\n\nBy the end of the course, you will be able to prepare complete CAE models ready for simulation.",
    long_description: "## Why Choose Our ANSA Pre-Processing Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – ANSA Pre-Processing Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring ANSA professionals:**\n🚗 Automotive Industry\n✈ Aerospace Industry\n🏭 Manufacturing Companies\n🔩 Heavy Engineering Firms\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹8 – ₹16 LPA+\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "ANSA Pre-Processing Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best ANSA Pre-Processing training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "ANSA Pre-Processing Training in Coimbatore, Mechanical Courses, ANSA Pre-Processing training institute in Coimbatore, Lasak Edu",
      alt_text: "ANSA Pre-Processing training class in Coimbatore"
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
    slug: "computational-fluid-dynamics-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹11,999',
    duration: '2 – 3 Months',
    image: '/img/mech/cfd-486z.webp',
    description: 'Master Computational Fluid Dynamics (CFD) and accelerate your career growth with expert-led training.',
    tagline: 'Join the best Computational Fluid Dynamics training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best Computational Fluid Dynamics training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nComputational Fluid Dynamics (CFD) is a powerful simulation technique used to analyze fluid flow, heat transfer, and related physical phenomena. This course provides in-depth training in CFD theory and hands-on practice using industry-standard tools like ANSYS Fluent and ANSYS CFX.\n\nYou will learn how to simulate real-world engineering problems such as airflow over vehicles, heat exchangers, pipe flow, and thermal analysis through project-based learning.",
    long_description: "## Why Choose Our Computational Fluid Dynamics Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Computational Fluid Dynamics Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🚗 Automotive\n✈ Aerospace\n⚡ Energy\n❄ HVAC\n🏭 Manufacturing\n🔬 Research & Development\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "Computational Fluid Dynamics Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best Computational Fluid Dynamics training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Computational Fluid Dynamics Training in Coimbatore, Mechanical Courses, Computational Fluid Dynamics training institute in Coimbatore, Lasak Edu",
      alt_text: "Computational Fluid Dynamics training class in Coimbatore"
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
    slug: "nx-cad-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '2 – 3 Months',
    image: '/img/mech/nxcad-582z.webp',
    description: 'Master NX CAD (Unigraphics) and accelerate your career growth with expert-led training.',
    tagline: 'Join the best NX CAD training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best NX CAD training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur NX CAD (Unigraphics) Course is designed for Mechanical Engineering students and professionals who want to build strong expertise in advanced product design and 3D modeling.\n\nNX CAD (formerly known as Unigraphics) is a powerful CAD/CAM/CAE software widely used in automotive, aerospace, tool design, and manufacturing industries. It is known for its advanced modeling capabilities and precision engineering design tools.\n\nThis course provides hands-on training in part modeling, assembly design, drafting, surface modeling, and basic manufacturing concepts. The focus is on practical learning with real-time industrial design examples.\n\nBy the end of this course, you will be able to create complex mechanical components and assemblies with industry-level standards.",
    long_description: "## Why Choose Our NX CAD Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – NX CAD Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring NX CAD professionals:**\n🚗 Automotive Companies\n✈ Aerospace Industry\n🏭 Manufacturing Firms\n🛠 Tool & Die Industry\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹7 – ₹18 LPA+\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "NX CAD Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best NX CAD training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "NX CAD Training in Coimbatore, Mechanical Courses, NX CAD training institute in Coimbatore, Lasak Edu",
      alt_text: "NX CAD training class in Coimbatore"
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
    slug: "autodesk-inventor-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '1.5 – 3 Months',
    image: '/img/mech/autodesk-inventor-783z.webp',
    description: 'Master Autodesk Inventor and accelerate your career growth with expert-led training.',
    tagline: 'Join the best Autodesk Inventor training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best Autodesk Inventor training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur Autodesk Inventor Course is designed for Mechanical Engineering students and professionals who want to develop strong skills in 3D mechanical design, product modeling, and engineering drafting.\n\nAutodesk Inventor is a powerful 3D CAD software widely used in manufacturing, product design, machinery design, and industrial engineering. It allows engineers to create accurate digital prototypes, simulate product performance, and generate production-ready drawings.\n\nThis course focuses on practical training with real-time industrial examples, helping students understand how to design mechanical components and assemblies professionally.\n\nBy the end of this course, you will be able to design complete mechanical products and generate detailed technical drawings confidently.",
    long_description: "## Why Choose Our Autodesk Inventor Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Autodesk Inventor Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring Autodesk Inventor professionals:**\n🏭 Manufacturing Companies\n🚗 Automotive Industry\n🛠 Machinery & Equipment Industry\n🏗 Industrial Product Companies\n\n**Average Fresher Salary in India:** ₹2.5 – ₹5 LPA\nWith Experience: ₹6 – ₹14 LPA+\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "Autodesk Inventor Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best Autodesk Inventor training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Autodesk Inventor Training in Coimbatore, Mechanical Courses, Autodesk Inventor training institute in Coimbatore, Lasak Edu",
      alt_text: "Autodesk Inventor training class in Coimbatore"
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
    slug: "wiring-harness-design-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹35,000',
    price: '₹19,999',
    duration: '1.5 – 2 Months',
    image: '/img/mech/wiring-harness-catia-256z.webp',
    description: 'Master Wiring Harness Design and accelerate your career growth with expert-led training.',
    tagline: 'Join the best Wiring Harness Design training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best Wiring Harness Design training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nWiring Harness Design plays a critical role in industries like automotive, aerospace, and heavy machinery. This course provides comprehensive training on designing, routing, and documenting electrical harness systems using industry-standard tools such as CATIA V5 Electrical Workbench and AutoCAD Electrical.\n\nYou will gain hands-on experience in creating harness layouts, selecting connectors, preparing 2D drawings, and generating manufacturing documentation through real-time industry projects.",
    long_description: "## Why Choose Our Wiring Harness Design Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Wiring Harness Design Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🚗 Automotive OEMs\n⚡ EV Companies\n✈ Aerospace Firms\n🏭 Electrical Manufacturing Industries\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹8 – ₹15 LPA+\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "Wiring Harness Design Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best Wiring Harness Design training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Wiring Harness Design Training in Coimbatore, Mechanical Courses, Wiring Harness Design training institute in Coimbatore, Lasak Edu",
      alt_text: "Wiring Harness Design training class in Coimbatore"
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
    slug: "3d-printing-prototyping-training-coimbatore",
    category: 'Mechanical',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1 – 1.5 Months',
    image: '/img/mech/3d-399z.webp',
    description: 'Master 3D Printing & Prototyping and accelerate your career growth with expert-led training.',
    tagline: 'Join the best 3D Printing & Prototyping training institute in Coimbatore. Mechanical courses with placement support.',
    introduction: "Lasak Edu offers the best 3D Printing & Prototyping training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\n3D Printing & Prototyping is transforming product development across industries such as automotive, aerospace, medical, architecture, and consumer products. This course provides practical training on additive manufacturing technologies, design for 3D printing, material selection, and rapid prototyping workflows.\n\nYou will learn how to convert 3D models into physical prototypes using industry tools and real-time project practice.",
    long_description: "## Why Choose Our 3D Printing & Prototyping Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – 3D Printing & Prototyping Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🏭 Manufacturing Companies\n🛠 Product Design Firms\n🔬 R&D Centers\n🚀 Startups & Innovation Labs\n\n[Explore more Mechanical Courses](/courses/Mechanical)",
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
      title: "3D Printing & Prototyping Training in Coimbatore | Mechanical Courses | Lasak Edu",
      description: "Join the best 3D Printing & Prototyping training institute in Coimbatore. Mechanical courses with placement support. Enroll today at Lasak Edu.",
      keywords: "3D Printing & Prototyping Training in Coimbatore, Mechanical Courses, 3D Printing & Prototyping training institute in Coimbatore, Lasak Edu",
      alt_text: "3D Printing & Prototyping training class in Coimbatore"
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
    slug: "full-stack-development-build-complete-web-applications-training-coimbatore",
    category: 'IT',
    oldPrice: '₹60,000',
    price: '₹34,999',
    duration: "4 – 6 Months",
    image: '/img/it/full-stack-development-171z.webp',
    description: 'Master Front-End, Back-End, Databases, and Deployment with React & Node.js.',
    seo: {
      title: "Full Stack Development– Build Complete Web Applications Training in Coimbatore | IT Courses | Lasak Edu",
      description: "Join the best Full Stack Development– Build Complete Web Applications training institute in Coimbatore. IT courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Full Stack Development– Build Complete Web Applications Training in Coimbatore, IT Courses, Full Stack Development– Build Complete Web Applications training institute in Coimbatore, Lasak Edu",
      alt_text: "Full Stack Development– Build Complete Web Applications training class in Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: 'Join the best Full Stack Development– Build Complete Web Applications training institute in Coimbatore. IT courses with placement support.',
    introduction: "Lasak Edu offers the best Full Stack Development– Build Complete Web Applications training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur Full Stack Development Course is designed to make you a complete web developer capable of building both front-end and back-end applications. This course covers everything from designing user interfaces to managing servers and databases.\n\nYou will learn how to create responsive websites, develop REST APIs, connect databases, implement authentication systems, and deploy applications to live servers.",
    long_description: "## Why Choose Our Full Stack Development– Build Complete Web Applications Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Full Stack Development– Build Complete Web Applications Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\nBy the end of the course, you will be able to build complete full-stack web applications independently. The training is fully practical and project-based, ensuring you gain real-world development experience.\n\n**Average Salary in India:**\n• Freshers: ₹3 – ₹6 LPA\n• Experienced: ₹8 – ₹18 LPA+\n\n**Career Paths:**\n• Full Stack Developer\n• Front-End Developer\n• Back-End Developer\n• React Developer\n• Node.js Developer\n\n[Explore more IT Courses](/courses/IT)",
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
    slug: "web-development-become-a-full-stack-developer-training-coimbatore",
    category: 'IT',
    oldPrice: '₹34,999',
    price: '₹13,999',
    duration: "3 – 4 Months",
    image: '/img/it/web-development-387z.webp',
    description: 'Our Web Development Course is designed to help you become a professional Full Stack Web Developer. Learn to design, develop, and deploy modern websites.',
    seo: {
      title: "Web Development– Become a Full Stack Developer Training in Coimbatore | IT Courses | Lasak Edu",
      description: "Join the best Web Development– Become a Full Stack Developer training institute in Coimbatore. IT courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Web Development– Become a Full Stack Developer Training in Coimbatore, IT Courses, Web Development– Become a Full Stack Developer training institute in Coimbatore, Lasak Edu",
      alt_text: "Web Development– Become a Full Stack Developer training class in Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: 'Join the best Web Development– Become a Full Stack Developer training institute in Coimbatore. IT courses with placement support.',
    introduction: "Lasak Edu offers the best Web Development– Become a Full Stack Developer training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur Web Development Course is designed to help you become a professional Full Stack Web Developer. In this course, you will learn how to design, develop, and deploy modern websites and web applications using the latest technologies.\n\nWe start from the basics of HTML and CSS, then move to JavaScript, React, Node.js, and databases. The course is fully practical and project-based, ensuring that you gain real-world experience.",
    long_description: "## Why Choose Our Web Development– Become a Full Stack Developer Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Web Development– Become a Full Stack Developer Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\nBy the end of the course, you will be able to build dynamic, responsive, and fully functional web applications independently. Web Development offers excellent career opportunities in India and globally.\n\n**Average Salary in India:**\n• Freshers: ₹3 – ₹6 LPA\n• Experienced: ₹8 – ₹15 LPA+\n\n**Career Paths:**\n• Front-End & Back-End Development\n• Full Stack Web Applications\n• Remote Freelancing & Startups\n\n[Explore more IT Courses](/courses/IT)",
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
    slug: "software-testing-become-a-qa-expert-training-coimbatore",
    category: 'IT',
    oldPrice: '₹34,999',
    price: '₹13,999',
    duration: "3 – 4 Months",
    image: '/img/it/st-291z.webp',
    description: 'Master Manual and Automation Testing (Selenium) with real-time projects and placement support.',
    seo: {
      title: "Software Testing– Become a QA Expert Training in Coimbatore | IT Courses | Lasak Edu",
      description: "Join the best Software Testing– Become a QA Expert training institute in Coimbatore. IT courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Software Testing– Become a QA Expert Training in Coimbatore, IT Courses, Software Testing– Become a QA Expert training institute in Coimbatore, Lasak Edu",
      alt_text: "Software Testing– Become a QA Expert training class in Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: 'Join the best Software Testing– Become a QA Expert training institute in Coimbatore. IT courses with placement support.',
    introduction: "Lasak Edu offers the best Software Testing– Become a QA Expert training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur Software Testing Course is designed to help you become a skilled Quality Assurance (QA) professional. In this course, you will learn how to test software applications to ensure they are bug-free, secure, and high-performing.\n\nWe cover both Manual Testing and Automation Testing, including real-time projects and industry-standard tools. The course focuses on practical knowledge so you can confidently work on live projects in IT companies.",
    long_description: "## Why Choose Our Software Testing– Become a QA Expert Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Software Testing– Become a QA Expert Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\nBy the end of the course, you will understand the complete Software Testing Life Cycle (STLC) and be ready to work as a QA Engineer. Software Testing is one of the most stable and in-demand IT careers.\n\n**Average Salary in India:**\n• Freshers: ₹2.5 – ₹5 LPA\n• Experienced: ₹6 – ₹12 LPA+\n\n**Career Paths:**\n• Software Tester\n• QA Engineer\n• Automation Tester\n• Test Analyst\n\n[Explore more IT Courses](/courses/IT)",
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
    slug: "data-analytics-turn-data-into-powerful-insights-training-coimbatore",
    category: 'IT',
    oldPrice: '₹29,999',
    price: '₹10,999',
    duration: "3 to 4 Months",
    image: '/img/it/da-013z.webp',
    description: 'Learn to collect, analyze, interpret, and visualize data using industry-standard tools like Excel, SQL, Power BI, and Python.',
    seo: {
      title: "Data Analytics– Turn Data into Powerful Insights Training in Coimbatore | IT Courses | Lasak Edu",
      description: "Join the best Data Analytics– Turn Data into Powerful Insights training institute in Coimbatore. IT courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Data Analytics– Turn Data into Powerful Insights Training in Coimbatore, IT Courses, Data Analytics– Turn Data into Powerful Insights training institute in Coimbatore, Lasak Edu",
      alt_text: "Data Analytics– Turn Data into Powerful Insights training class in Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: 'Join the best Data Analytics– Turn Data into Powerful Insights training institute in Coimbatore. IT courses with placement support.',
    introduction: "Lasak Edu offers the best Data Analytics– Turn Data into Powerful Insights training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nIn today’s digital world, data is one of the most valuable assets for businesses. Companies use data analytics to make smart decisions, improve performance, increase profits, and understand customer behavior.\n\nOur Data Analytics Course is designed to help students learn how to collect, analyze, interpret, and visualize data using industry-standard tools like Excel, SQL, Power BI, and Python.\n\nThis course focuses on practical implementation and real-time business case studies. Students will learn how to transform raw data into meaningful insights and reports that help organizations grow.",
    long_description: "## Why Choose Our Data Analytics– Turn Data into Powerful Insights Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Data Analytics– Turn Data into Powerful Insights Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\nData Analytics is one of the highest-demand career fields in India and globally. Every business depends on data-driven decisions to optimize their operations and maximize growth.\n\n**Average Salary in India:**\n• Freshers: ₹18,000 – ₹30,000 per month\n• Experienced: ₹40,000 – ₹80,000+ per month\n• Senior Data Analysts: ₹6–12 LPA\n\n**Industries Hiring Data Professionals:**\n• IT & Tech Companies\n• Banking & Finance\n• E-commerce & Retail\n• Healthcare & Marketing\n\n[Explore more IT Courses](/courses/IT)",
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
    slug: "java-programming-beginner-to-advanced-training-coimbatore",
    category: 'IT',
    oldPrice: '₹29,999',
    price: '₹11,999',
    duration: "210 Hours",
    image: '/img/it/java-747z.webp',
    description: 'Build a strong career in software development with our comprehensive Java Programming Course. Learn from basics to advanced Core Java with practical training and projects.',
    seo: {
      title: "Java Programming| Beginner to Advanced Training in Coimbatore | IT Courses | Lasak Edu",
      description: "Join the best Java Programming| Beginner to Advanced training institute in Coimbatore. IT courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Java Programming| Beginner to Advanced Training in Coimbatore, IT Courses, Java Programming| Beginner to Advanced training institute in Coimbatore, Lasak Edu",
      alt_text: "Java Programming| Beginner to Advanced training class in Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: 'Join the best Java Programming| Beginner to Advanced training institute in Coimbatore. IT courses with placement support.',
    introduction: "Lasak Edu offers the best Java Programming| Beginner to Advanced training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nJava is one of the most powerful and widely used programming languages in the world. It is used to develop web applications, desktop applications, enterprise software, Android applications, and large-scale business systems.\n\nOur Java Programming Course is designed to help students learn programming fundamentals and master Core Java concepts with practical implementation. This course focuses on logical thinking, object-oriented programming (OOP), and real-time coding practice.",
    long_description: "## Why Choose Our Java Programming| Beginner to Advanced Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Java Programming| Beginner to Advanced Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\nJava is highly demanded in IT companies because it is secure, platform-independent, and widely used in enterprise-level applications. Learning Java opens doors to career opportunities in software development, backend development, and full stack development.\n\n**Average Salary in India:**\n• Freshers: ₹15,000 – ₹25,000 per month\n• Experienced: ₹30,000 – ₹70,000+ per month\n\n[Explore more IT Courses](/courses/IT)",
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
    slug: "python-programming-beginner-to-advanced-training-coimbatore",
    category: 'IT',
    oldPrice: '₹27,999',
    price: '₹10,999',
    duration: "180 Hours",
    image: '/img/it/python-267z.webp',
    description: 'Learn Python Programming from basics to advanced with practical training, real-time projects, and placement assistance. Join the best Python course in coimbatore and start your career as a Python Developer today.',
    seo: {
      title: "Python Programming | Beginner to Advanced Training in Coimbatore | IT Courses | Lasak Edu",
      description: "Join the best Python Programming | Beginner to Advanced training institute in Coimbatore. IT courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Python Programming | Beginner to Advanced Training in Coimbatore, IT Courses, Python Programming | Beginner to Advanced training institute in Coimbatore, Lasak Edu",
      alt_text: "Python Programming | Beginner to Advanced training class in Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: 'Join the best Python Programming | Beginner to Advanced training institute in Coimbatore. IT courses with placement support.',
    introduction: "Lasak Edu offers the best Python Programming | Beginner to Advanced training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nPython is one of the most popular and fastest-growing programming languages in the world. It is widely used in software development, web development, data science, artificial intelligence, automation, and machine learning. Because of its simple syntax and powerful capabilities, Python is the first choice for beginners and professionals alike.\n\nOur Python Programming Course is designed to provide a strong foundation in programming concepts while focusing on real-time practical implementation. This course helps students develop logical thinking, coding skills, and problem-solving ability required in the IT industry.",
    long_description: "## Why Choose Our Python Programming | Beginner to Advanced Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Python Programming | Beginner to Advanced Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\nPython is one of the most popular and fastest-growing programming languages in the world. It is widely used in software development, web development, data science, artificial intelligence, automation, and machine learning. Because of its simple syntax and powerful capabilities, Python is the first choice for beginners and professionals alike.\n\nOur Python Programming Course is designed to provide a strong foundation in programming concepts while focusing on real-time practical implementation. This course helps students develop logical thinking, coding skills, and problem-solving ability required in the IT industry.\n\n**Average Salary in India:**\n• Freshers: ₹15,000 – ₹25,000 per month\n• 2–3 Years Experience: ₹30,000 – ₹60,000+ per month\n• Experienced Developers: ₹8 LPA and above\n\n[Explore more IT Courses](/courses/IT)",
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
    slug: "digital-marketing-master-digital-marketing-excellence-training-coimbatore",
    category: 'IT',
    oldPrice: '₹29,999',
    price: '₹10,999',
    duration: "210 Hours",
    image: '/img/it/digital-marketing-875z.webp',
    description: 'Master SEO, SEM, and Social Media Marketing strategies to grow brands and increase sales.',
    seo: {
      title: "Digital Marketing| Master Digital Marketing Excellence Training in Coimbatore | IT Courses | Lasak Edu",
      description: "Join the best Digital Marketing| Master Digital Marketing Excellence training institute in Coimbatore. IT courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Digital Marketing| Master Digital Marketing Excellence Training in Coimbatore, IT Courses, Digital Marketing| Master Digital Marketing Excellence training institute in Coimbatore, Lasak Edu",
      alt_text: "Digital Marketing| Master Digital Marketing Excellence training class in Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: 'Join the best Digital Marketing| Master Digital Marketing Excellence training institute in Coimbatore. IT courses with placement support.',
    introduction: "Lasak Edu offers the best Digital Marketing| Master Digital Marketing Excellence training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur Digital Marketing Course is designed to provide practical, industry-focused training in SEO, SEM, Social Media Marketing, and complete online marketing strategies. This course helps students, entrepreneurs, and job seekers gain real-world skills to succeed in the digital industry.",
    long_description: "## Why Choose Our Digital Marketing| Master Digital Marketing Excellence Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Digital Marketing| Master Digital Marketing Excellence Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\nDigital Marketing is one of the fastest-growing career fields in today’s digital world. Every business — from small startups to multinational companies — depends on online marketing to grow their brand, attract customers, and increase sales. This course focuses on practical implementation, live projects, and real-time campaign management so that students gain hands-on experience.\n\nAverage Salary in India:\n• Freshers: ₹15,000 – ₹25,000 per month\n• Experienced: ₹30,000 – ₹60,000+ per month\n• Freelancers: Unlimited earning potential\n\n[Explore more IT Courses](/courses/IT)",
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
    slug: "ui-ux-design-master-digital-product-design-training-coimbatore",
    category: 'IT',
    oldPrice: '₹34,999',
    price: '₹13,999',
    duration: "2 – 3 Months",
    image: '/img/it/ui-514z.webp',
    description: 'Master UI/UX Design from research to prototype with practical training and real-time projects.',
    seo: {
      title: "UI/UX Design– Master Digital Product Design Training in Coimbatore | IT Courses | Lasak Edu",
      description: "Join the best UI/UX Design– Master Digital Product Design training institute in Coimbatore. IT courses with placement support. Enroll today at Lasak Edu.",
      keywords: "UI/UX Design– Master Digital Product Design Training in Coimbatore, IT Courses, UI/UX Design– Master Digital Product Design training institute in Coimbatore, Lasak Edu",
      alt_text: "UI/UX Design– Master Digital Product Design training class in Coimbatore"
    },
    enrollLink: "https://forms.gle/6sVSvE1schYRYfse7",
    phone: "+91 74187 32525",
    tagline: 'Join the best UI/UX Design– Master Digital Product Design training institute in Coimbatore. IT courses with placement support.',
    introduction: "Lasak Edu offers the best UI/UX Design– Master Digital Product Design training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur UI/UX Design Course is designed to help you become a professional User Interface (UI) and User Experience (UX) Designer. In this course, you will learn how to design visually appealing, user-friendly, and interactive digital products such as websites and mobile applications.\n\nWe cover design principles, user research, wireframing, prototyping, and real-time project implementation using industry-standard tools. This course focuses on practical learning, ensuring you build a strong portfolio.",
    long_description: "## Why Choose Our UI/UX Design– Master Digital Product Design Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – UI/UX Design– Master Digital Product Design Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\nBy the end of the course, you will be able to design complete user experiences from research to final prototype. UI/UX Design is one of the fastest-growing creative tech careers.\n\n**Average Salary in India:**\n• Freshers: ₹3 – ₹6 LPA\n• Experienced: ₹8 – ₹18 LPA+\n\n**Career Paths:**\n• UI/UX Designer\n• Product Designer\n• Interaction Designer\n• UX Researcher\n\n[Explore more IT Courses](/courses/IT)",
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


  // --- CIVIL COURSES ---

  {
    id: 'civil1',
    title: 'Civil CAD',
    slug: "civil-cad-training-coimbatore",
    category: 'Civil',
    oldPrice: '₹10,000',
    price: '₹6,499',
    duration: '1.5 to 2 Months',
    image: '/img/civil/civil-cad.webp',
    description: 'Master Civil CAD and accelerate your career growth with expert-led training.',
    tagline: 'Join the best Civil CAD training institute in Coimbatore. Civil courses with placement support.',
    introduction: "Lasak Edu offers the best Civil CAD training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nCivil CAD is essential for civil engineers involved in drafting, planning, and infrastructure design. This course provides complete hands-on training in 2D drafting, layout planning, structural drawings, and project documentation using industry-standard tools like AutoCAD.\n\nYou will learn how to prepare detailed construction drawings used in residential, commercial, and infrastructure projects.",
    long_description: "## Why Choose Our Civil CAD Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Civil CAD Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🏗 Construction Companies\n🏢 Infrastructure Firms\n🏛 Architectural Consultancies\n🏘 Real Estate Developers\n\n**Average Fresher Salary in India:** ₹2 – ₹4 LPA\nWith Experience: ₹5 – ₹10 LPA+\n\n*Check out our [AutoCAD Mechanical course](/courses/mechanical/auto-cad) or explore other [Civil CAD training options](/courses/civil/civil-cad).*\n\n[Explore more Civil Courses](/courses/Civil)",
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
      title: "Civil CAD Training in Coimbatore | Civil Courses | Lasak Edu",
      description: "Join the best Civil CAD training institute in Coimbatore. Civil courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Civil CAD Training in Coimbatore, Civil Courses, Civil CAD training institute in Coimbatore, Lasak Edu",
      alt_text: "Civil CAD training class in Coimbatore"
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
    slug: "revit-architecture-training-coimbatore",
    category: 'Civil',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1.5 to 2 Months',
    image: '/img/civil/revit-471z.webp',
    description: 'Master Revit Architecture and accelerate your career growth with expert-led training.',
    tagline: 'Join the best Revit Architecture training institute in Coimbatore. Civil courses with placement support.',
    introduction: "Lasak Edu offers the best Revit Architecture training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nAutodesk Revit (Revit Architecture) is a leading BIM (Building Information Modeling) software widely used in architectural design and construction industries. It enables professionals to create intelligent 3D building models with accurate project data and documentation.\n\nThis course provides complete hands-on training in architectural modeling, drafting, visualization, and project coordination using real-time building projects.",
    long_description: "## Why Choose Our Revit Architecture Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Revit Architecture Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🏛 Architectural Firms\n🏗 Construction Companies\n🏘 Real Estate Developers\n🏢 Infrastructure Firms\n🌍 International BIM Consultancy Companies\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹7 – ₹15 LPA+\n\n[Explore more Civil Courses](/courses/Civil)",
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
      title: "Revit Architecture Training in Coimbatore | Civil Courses | Lasak Edu",
      description: "Join the best Revit Architecture training institute in Coimbatore. Civil courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Revit Architecture Training in Coimbatore, Civil Courses, Revit Architecture training institute in Coimbatore, Lasak Edu",
      alt_text: "Revit Architecture training class in Coimbatore"
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
    slug: "sketchup-for-civil-engineering-training-coimbatore",
    category: 'Civil',
    oldPrice: '₹25,000',
    price: '₹14,999',
    duration: '1 to 1.5 Months',
    image: '/img/civil/sketchup-430z.webp',
    description: 'Master SketchUp and accelerate your career growth with expert-led training.',
    tagline: 'Join the best SketchUp for Civil Engineering training institute in Coimbatore. Civil courses with placement support.',
    introduction: "Lasak Edu offers the best SketchUp for Civil Engineering training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nSketchUp is a powerful and user-friendly 3D modeling software widely used in civil engineering, architecture, construction planning, and interior design.\n\nThis course is specially designed for civil engineering students and professionals to create 3D building models, site layouts, elevations, and presentation-ready designs.\n\nYou will gain hands-on experience in modeling residential and commercial projects with real-time practical exercises.",
    long_description: "## Why Choose Our SketchUp for Civil Engineering Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – SketchUp for Civil Engineering Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🏗 Construction Companies\n🏛 Architectural Firms\n🏠 Interior Design Studios\n🏘 Real Estate Developers\n\n**Average Fresher Salary in India:** ₹2.5 – ₹5 LPA\nWith Experience: ₹6 – ₹12 LPA+\n\n[Explore more Civil Courses](/courses/Civil)",
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
      title: "SketchUp for Civil Engineering Training in Coimbatore | Civil Courses | Lasak Edu",
      description: "Join the best SketchUp for Civil Engineering training institute in Coimbatore. Civil courses with placement support. Enroll today at Lasak Edu.",
      keywords: "SketchUp for Civil Engineering Training in Coimbatore, Civil Courses, SketchUp for Civil Engineering training institute in Coimbatore, Lasak Edu",
      alt_text: "SketchUp for Civil Engineering training class in Coimbatore"
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
    slug: "staad-pro-training-coimbatore",
    category: 'Civil',
    oldPrice: '₹30,000',
    price: '₹17,999',
    duration: '2 to 3 Months',
    image: '/img/civil/staadpro-216z.webp',
    description: 'Master STAAD.Pro and accelerate your career growth with expert-led training.',
    tagline: 'Join the best STAAD.Pro training institute in Coimbatore. Civil courses with placement support.',
    introduction: "Lasak Edu offers the best STAAD.Pro training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nSTAAD.Pro is one of the most widely used structural analysis and design software tools in civil and structural engineering. It is used for analyzing and designing buildings, bridges, towers, industrial structures, and other infrastructure projects.\n\nThis course provides comprehensive training in structural modeling, load application, analysis, and design according to industry standards. You will gain practical experience by working on real-time structural projects.",
    long_description: "## Why Choose Our STAAD.Pro Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – STAAD.Pro Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🏗 Construction Companies\n🏢 Structural Consultancy Firms\n🏗 Infrastructure Developers\n🌍 EPC Companies\n\n**Average Fresher Salary in India:** ₹3 – ₹6 LPA\nWith Experience: ₹7 – ₹15 LPA+\n\n[Explore more Civil Courses](/courses/Civil)",
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
      title: "STAAD.Pro Training in Coimbatore | Civil Courses | Lasak Edu",
      description: "Join the best STAAD.Pro training institute in Coimbatore. Civil courses with placement support. Enroll today at Lasak Edu.",
      keywords: "STAAD.Pro Training in Coimbatore, Civil Courses, STAAD.Pro training institute in Coimbatore, Lasak Edu",
      alt_text: "STAAD.Pro training class in Coimbatore"
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
    slug: "bim-professional-training-coimbatore",
    category: 'Civil',
    oldPrice: '₹50,000',
    price: '₹34,999',
    duration: '2 to 3 Months',
    image: '/img/civil/bim-240z.webp',
    description: 'Master Building Information Modeling (BIM) and accelerate your career growth with expert-led training.',
    tagline: 'Join the best BIM Professional training institute in Coimbatore. Civil courses with placement support.',
    introduction: "Lasak Edu offers the best BIM Professional training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nBuilding Information Modeling (BIM) is revolutionizing the construction and infrastructure industry by enabling intelligent 3D modeling, coordination, and project management.\n\nThis BIM Professional course provides in-depth training using industry-standard tools like Autodesk Revit, Navisworks, and AutoCAD.\n\nYou will learn how to create detailed 3D building models, manage project data, perform clash detection, and generate accurate construction documentation.",
    long_description: "## Why Choose Our BIM Professional Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – BIM Professional Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🏗 Construction Companies\n🏛 Architectural Firms\n🏗 Infrastructure Developers\n🌍 International EPC Companies\n\n**Average Fresher Salary in India:** ₹3.5 – ₹7 LPA\nWith Experience: ₹8 – ₹18 LPA+\n\n[Explore more Civil Courses](/courses/Civil)",
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
      title: "BIM Professional Training in Coimbatore | Civil Courses | Lasak Edu",
      description: "Join the best BIM Professional training institute in Coimbatore. Civil courses with placement support. Enroll today at Lasak Edu.",
      keywords: "BIM Professional Training in Coimbatore, Civil Courses, BIM Professional training institute in Coimbatore, Lasak Edu",
      alt_text: "BIM Professional training class in Coimbatore"
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
    slug: "graphic-design-training-coimbatore",
    category: 'Arts',
    oldPrice: '₹18,000',
    price: '₹9,999',
    duration: '1.5 – 2 Months',
    image: '/img/arts/digital-marketing-840z.webp',
    description: 'Master Graphic Design using Photoshop, Illustrator and CorelDRAW.',
    tagline: 'Join the best Graphic Design training institute in Coimbatore. Arts courses with placement support.',
    introduction: "Lasak Edu offers the best Graphic Design training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur Graphic Design course is designed for aspiring designers who want to master industry-standard tools like Adobe Photoshop, Illustrator, and CorelDRAW. Learn the art of visual communication and brand identity.\n\nFrom logo design to professional layouts, this course covers everything you need to become a successful graphic designer in today's digital world.",
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
      title: "Graphic Design Training in Coimbatore | Arts Courses | Lasak Edu",
      description: "Join the best Graphic Design training institute in Coimbatore. Arts courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Graphic Design Training in Coimbatore, Arts Courses, Graphic Design training institute in Coimbatore, Lasak Edu",
      alt_text: "Graphic Design training class in Coimbatore"
    }
  },
  {
    id: 'arts2',
    title: 'Video Editing',
    slug: "video-editing-training-coimbatore",
    category: 'Arts',
    oldPrice: '₹18,000',
    price: '₹9,999',
    duration: '1.5 – 2 Months',
    image: '/img/arts/ms-office-specialist-640z.webp',
    description: 'Master Video Editing with Premiere Pro and After Effects.',
    tagline: 'Join the best Video Editing training institute in Coimbatore. Arts courses with placement support.',
    introduction: "Lasak Edu offers the best Video Editing training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur Video Editing course provides hands-on training in professional video production using Adobe Premiere Pro and After Effects. Learn to create high-quality content for YouTube, social media, and film.\n\nFrom basic cuts to advanced motion graphics and color grading, you will gain the skills needed to excel in the rapidly growing video industry.",
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
      title: "Video Editing Training in Coimbatore | Arts Courses | Lasak Edu",
      description: "Join the best Video Editing training institute in Coimbatore. Arts courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Video Editing Training in Coimbatore, Arts Courses, Video Editing training institute in Coimbatore, Lasak Edu",
      alt_text: "Video Editing training class in Coimbatore"
    }
  },
  {
    id: 'arts3',
    title: 'Digital Marketing (Media)',
    slug: "digital-marketing-training-coimbatore",
    category: 'Arts',
    oldPrice: '₹29,999',
    price: '₹11,999',
    duration: '90 Days',
    image: '/img/arts/digital-marketing-840z.webp',
    description: 'Focus on branding, content strategy and online presence.',
    tagline: 'Join the best Digital Marketing training institute in Coimbatore. Arts courses with placement support.',
    introduction: "Lasak Edu offers the best Digital Marketing training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nOur Digital Marketing (Media) course is specifically tailored for those who want to master branding, social media strategy, and content creation. Learn how to grow reach and engagement for brands on platforms like Facebook, Instagram, and YouTube.",
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
      title: "Digital Marketing Training in Coimbatore | Arts Courses | Lasak Edu",
      description: "Join the best Digital Marketing training institute in Coimbatore. Arts courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Digital Marketing Training in Coimbatore, Arts Courses, Digital Marketing training institute in Coimbatore, Lasak Edu",
      alt_text: "Digital Marketing training class in Coimbatore"
    }
  },
  {
    id: 'arts4',
    title: 'MS Office',
    slug: "ms-office-training-coimbatore",
    category: 'Arts',
    oldPrice: '₹12,000',
    price: '₹5,999',
    duration: '1 to 1.5 Months',
    image: '/img/arts/ms-office-specialist-640z.webp',
    description: 'Master MS Office and build essential computer skills for academic and professional success.',
    tagline: 'Join the best MS Office training institute in Coimbatore. Arts courses with placement support.',
    introduction: "Lasak Edu offers the best MS Office training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nThis course provides complete training in Microsoft Word, Excel, PowerPoint, and Outlook. Learn essential computer skills that are required in every professional environment.",
    long_description: "## Why Choose Our MS Office Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – MS Office Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n🏢 Corporate Offices\n🏪 Retail & Trading\n🏥 Healthcare & Hospitals\n🏫 Educational Institutions\n💼 Every Industry Sector\n\n**Average Fresher Salary in India:** ₹1.8 – ₹3.5 LPA\nWith Experience: ₹3.5 – ₹6 LPA+\n\n[Explore more Arts Courses](/courses/Arts)",
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
      title: "MS Office Training in Coimbatore | Arts Courses | Lasak Edu",
      description: "Join the best MS Office training institute in Coimbatore. Arts courses with placement support. Enroll today at Lasak Edu.",
      keywords: "MS Office Training in Coimbatore, Arts Courses, MS Office training institute in Coimbatore, Lasak Edu",
      alt_text: "MS Office training class in Coimbatore"
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
    slug: "tally-with-gst-training-coimbatore",
    category: 'Arts',
    oldPrice: '₹15,000',
    price: '₹5,999',
    duration: '1.5 to 2 Months',
    image: '/img/arts/tally-with-gst-448z.webp',
    description: 'Master Tally with GST and accelerate your career growth with expert-led training.',
    tagline: 'Join the best Tally with GST training institute in Coimbatore. Arts courses with placement support.',
    introduction: "Lasak Edu offers the best Tally with GST training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nTallyPrime with GST is a complete accounting and taxation course designed to make you job-ready. This course covers practical accounting concepts, GST compliance, inventory management, payroll processing, and financial reporting with real-time examples.",
    long_description: "## Why Choose Our Tally with GST Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Tally with GST Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Industries hiring include:**\n💼 Accounting Firms\n🏢 Corporate Finance Departments\n🏪 Retail & Trading Companies\n📊 Tax Consultancies\n🏭 Manufacturing Companies\n\n**Average Fresher Salary in India:** ₹2 – ₹4 LPA\nWith Experience: ₹4 – ₹8 LPA+\n\n[Explore more Arts Courses](/courses/Arts)",
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
      title: "Tally with GST Training in Coimbatore | Arts Courses | Lasak Edu",
      description: "Join the best Tally with GST training institute in Coimbatore. Arts courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Tally with GST Training in Coimbatore, Arts Courses, Tally with GST training institute in Coimbatore, Lasak Edu",
      alt_text: "Tally with GST training class in Coimbatore"
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
    slug: "robotics-for-kids-training-coimbatore",
    category: 'Kids',
    price: '₹1',
    duration: '1 to 2 Months',
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=600',
    description: 'Fun robotics program for kids to learn coding, electronics, and build real robots!',
    tagline: 'Join the best Robotics for Kids training institute in Coimbatore. Kids courses with placement support.',
    introduction: "Lasak Edu offers the best Robotics for Kids training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nRobotics for Kids is a fun and interactive program designed to introduce children to the exciting world of robotics, coding, and automation. This course helps students develop logical thinking, creativity, and problem-solving skills through hands-on learning.\n\nStudents will build and program real robots using beginner-friendly platforms like Scratch and hardware such as Arduino IDE (basic level introduction).\n\nThe training is designed in a simple, engaging way so kids can learn technology while having fun.",
    long_description: "## Why Choose Our Robotics for Kids Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Robotics for Kids Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Benefits for your child:**\n🧠 Improves creativity & innovation\n📚 Enhances STEM knowledge\n💪 Builds confidence in technology\n🎯 Develops analytical thinking\n🤝 Encourages teamwork\n\n**Perfect for kids aged 8-16 years interested in science, technology, and building things!**\n\n[Explore more Kids Courses](/courses/Kids)",
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
      title: "Robotics for Kids Training in Coimbatore | Kids Courses | Lasak Edu",
      description: "Join the best Robotics for Kids training institute in Coimbatore. Kids courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Robotics for Kids Training in Coimbatore, Kids Courses, Robotics for Kids training institute in Coimbatore, Lasak Edu",
      alt_text: "Robotics for Kids training class in Coimbatore"
    }
  },
  {
    id: 'kid2',
    title: 'Scratch Coding',
    slug: "scratch-coding-training-coimbatore",
    category: 'Kids',
    price: 'Starts @ ₹4,000',
    duration: '1 Month',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    description: 'Learn coding through fun games and animations using block-based programming!',
    tagline: 'Join the best Scratch Coding training institute in Coimbatore. Kids courses with placement support.',
    introduction: "Lasak Edu offers the best Scratch Coding training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\n\nScratch is a beginner-friendly, block-based programming platform developed by MIT Media Lab. It helps kids learn coding in a fun and visual way without writing complex code.\n\nThis course introduces children to the fundamentals of programming through games, animations, and interactive stories, helping them build logical thinking and creativity.",
    long_description: "## Why Choose Our Scratch Coding Training in Coimbatore\n\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\n\n## Course Details – Scratch Coding Training\n\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\n\n## Placement Support for Students\n\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\n\n**Benefits of Learning Scratch:**\n🧠 Develops computational thinking\n🎨 Improves creativity and imagination\n🎯 Enhances problem-solving skills\n💪 Builds confidence in coding\n🚀 Strong foundation for Python, Java, and other languages\n\n**Perfect for kids aged 7-15 years who want to start their coding journey!**\n\n[Explore more Kids Courses](/courses/Kids)",
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
      title: "Scratch Coding Training in Coimbatore | Kids Courses | Lasak Edu",
      description: "Join the best Scratch Coding training institute in Coimbatore. Kids courses with placement support. Enroll today at Lasak Edu.",
      keywords: "Scratch Coding Training in Coimbatore, Kids Courses, Scratch Coding training institute in Coimbatore, Lasak Edu",
      alt_text: "Scratch Coding training class in Coimbatore"
    }
  }
];

