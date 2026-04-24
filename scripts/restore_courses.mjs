/**
 * RESTORE damaged course documents in Firestore
 * This restores ALL fields (not just image) for all damaged courses
 * Run: node scripts/restore_courses.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(__dir, '../.env.local'), 'utf8');
const env = {};
for (const line of envText.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const API_KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID;

async function signIn(email, password) {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Auth failed: ${data.error?.message}`);
    console.log(`🔐 Signed in as ${email}`);
    return data.idToken;
}

function toVal(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: `${v}` } : { doubleValue: v };
    if (typeof v === 'string') return { stringValue: v };
    if (v instanceof Date) return { timestampValue: v.toISOString() };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toVal) } };
    if (typeof v === 'object') {
        const fields = {};
        for (const [k, val] of Object.entries(v)) fields[k] = toVal(val);
        return { mapValue: { fields } };
    }
    return { stringValue: String(v) };
}

async function writeDoc(token, docId, data) {
    const fields = {};
    for (const [k, v] of Object.entries(data)) fields[k] = toVal(v);

    const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/courses/${docId}?key=${API_KEY}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fields })
        }
    );
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to write courses/${docId}: ${err}`);
    }
}

// ── FULL course data for ALL courses ──
const COURSES = [
    // ── MECHANICAL ──
    {
        id: 'mech1', title: 'AutoCAD Mechanical', slug: 'autocad-mechanical',
        category: 'Mechanical', price: '₹5,999', old_price: '₹9,000',
        duration: '1 – 1.5 Months', image: '/img/mech/autocad.webp',
        description: 'Master AutoCAD Mechanical and accelerate your career growth with expert-led training.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Introduction to AutoCAD', 'Drafting & Precision', 'Layers & Documentation', 'Drawing Accuracy & Control', 'Blocks & Attributes', 'Hatching & Gradients', 'Layouts & Plotting', 'Advanced Drafting Tools', '3D Basics', 'Industry-Specific Practices', 'Project Work'],
        show_on_home: false
    },
    {
        id: 'mech2', title: 'SolidWorks Masterclass', slug: 'solidworks-masterclass',
        category: 'Mechanical', price: '₹14,999', old_price: '₹25,000',
        duration: '1.5 – 2 Months', image: '/img/mech/solidworks-408z.webp',
        description: 'Master SolidWorks and accelerate your career growth with expert-led training.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Sketching & Modeling', 'Assembly Design', 'Manufacturing Documentation', 'Sheet Metal Design', 'Surface Modeling', 'Weldments & Structural Design', 'GD&T', 'Rendering & Basic Simulation', 'Real-Time Industrial Projects'],
        show_on_home: false
    },
    {
        id: 'mech3', title: 'Creo Parametric Course', slug: 'creo-parametric',
        category: 'Mechanical', price: '₹14,999', old_price: '₹25,000',
        duration: '1.5 – 2 Months', image: '/img/mech/creo-688z.webp',
        description: 'Master Creo Parametric for advanced 3D modeling and mechanical design.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Introduction to Creo', 'Sketch Mode', 'Part Design', 'Assembly Design', 'Drawing & Detailing', 'Surface Design', 'Sheet Metal Design', 'GD&T', 'Real-Time Projects'],
        show_on_home: false
    },
    {
        id: 'mech4', title: 'CATIA V5 Course (Mechanical Engineering)', slug: 'catia-v5',
        category: 'Mechanical', price: '₹17,999', old_price: '₹30,000',
        duration: '1.5 – 3 Months', image: '/img/mech/catia-118z.webp',
        description: 'Master CATIA V5 and accelerate your career growth with expert-led training.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Sketcher & Parts', 'Systems Assembly', 'Advanced Surfacing', 'Drafting & 2D Drawing Creation', 'Sheet Metal Design', 'Dimensioning & Tolerancing', 'Design Modification & Optimization', 'Real-Time Industrial Design Projects'],
        show_on_home: false
    },
    {
        id: 'mech5', title: 'ANSYS Simulation Course (Mechanical Engineering)', slug: 'ansys-simulation',
        category: 'Mechanical', price: '₹17,999', old_price: '₹30,000',
        duration: '2 – 3 Months', image: '/img/mech/ansys-670z.webp',
        description: 'Master ANSYS Simulation and accelerate your career growth with expert-led training.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['FEA Fundamentals', 'Advanced Meshing', 'Workflow Setup', 'Static Structural Analysis', 'Modal & Dynamic Analysis', 'Transient Structural Analysis', 'Fatigue Analysis', 'Thermal Analysis', 'Industry-Based Project'],
        show_on_home: false
    },
    {
        id: 'mech6', title: 'HyperMesh Course (Mechanical Engineering)', slug: 'hypermesh',
        category: 'Mechanical', price: '₹19,999', old_price: '₹40,000',
        duration: '1.5 – 3 Months', image: '/img/mech/hypermesh-631z.webp',
        description: 'Master HyperMesh pre-processing and accelerate your career growth.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Introduction to HyperMesh', 'Geometry Cleanup', 'Meshing Techniques', 'Material & Property Assignment', 'Loads & Boundary Conditions', 'Quality Checks & Corrections', 'Solver Integration', 'Real-World FEA Projects'],
        show_on_home: false
    },
    {
        id: 'mech7', title: 'ANSA Pre-Processing Course (Mechanical Engineering)', slug: 'ansa-pre-processing',
        category: 'Mechanical', price: '₹14,999', old_price: '₹25,000',
        duration: '1.5 – 3 Months', image: '/img/mech/ansa-062z.webp',
        description: 'Master ANSA Pre-Processing for CAE simulation workflows.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Introduction to ANSA', 'Geometry Import & Cleanup', 'Surface & Volume Meshing', 'Quality Check & Repair', 'Boundary Conditions Setup', 'Solver Deck Output', 'Project Work'],
        show_on_home: false
    },
    {
        id: 'mech8', title: 'NX CAD Course (Mechanical Engineering)', slug: 'nx-cad',
        category: 'Mechanical', price: '₹17,999', old_price: '₹30,000',
        duration: '1.5 – 3 Months', image: '/img/mech/nxcad-582z.webp',
        description: 'Master Siemens NX CAD for product design and mechanical engineering.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['NX Introduction & Interface', 'Sketching & Part Design', 'Assembly Modeling', 'Drafting & Dimensioning', 'Surface Modeling', 'Sheet Metal Design', 'NX CAM Basics', 'Industry Projects'],
        show_on_home: false
    },
    {
        id: 'mech9', title: 'Autodesk Inventor Course', slug: 'autodesk-inventor',
        category: 'Mechanical', price: '₹14,999', old_price: '₹25,000',
        duration: '1.5 – 2 Months', image: '/img/mech/autodesk-inventor-783z.webp',
        description: 'Master Autodesk Inventor for parametric 3D modelling and product design.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Inventor Interface', 'Part Modelling', 'Assembly Design', '2D Drawing Creation', 'Sheet Metal Design', 'Simulation Basics', 'Real-Time Projects'],
        show_on_home: false
    },
    {
        id: 'mech10', title: 'Wiring Harness Design (CATIA)', slug: 'wiring-harness-catia',
        category: 'Mechanical', price: '₹19,999', old_price: '₹35,000',
        duration: '2 – 3 Months', image: '/img/mech/wiring-harness-catia-256z.webp',
        description: 'Learn wiring harness design using CATIA for automotive electrical systems.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Introduction to Wiring Harness', 'CATIA Electrical Workbench', 'Harness Design & Routing', 'Connector & Bundle Setup', 'Formboard Layout', 'Manufacturing Output', 'Industry Projects'],
        show_on_home: false
    },
    {
        id: 'mech11', title: 'Computational Fluid Dynamics (CFD)', slug: 'cfd',
        category: 'Mechanical', price: '₹17,999', old_price: '₹30,000',
        duration: '2 – 3 Months', image: '/img/mech/cfd-486z.webp',
        description: 'Master CFD analysis for fluid mechanics and thermal engineering problems.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['CFD Fundamentals', 'Governing Equations', 'Meshing for CFD', 'Boundary Conditions', 'Solver Setup & Run', 'Post-Processing & Visualization', 'Industry Projects'],
        show_on_home: false
    },
    {
        id: 'mech12', title: '3D Printing & Scanning Technology', slug: '3d-printing-scanning',
        category: 'Mechanical', price: '₹12,999', old_price: '₹22,000',
        duration: '1 – 2 Months', image: '/img/mech/3d-399z.webp',
        description: 'Learn 3D printing, scanning, and rapid prototyping techniques.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Introduction to 3D Printing', 'Slicing Software', 'Printer Operation', '3D Scanning Basics', 'Reverse Engineering', 'Post-Processing', 'Industry Applications'],
        show_on_home: false
    },

    // ── IT ──
    {
        id: 'it1', title: 'Full Stack Web Development', slug: 'full-stack-web-development',
        category: 'IT', price: '₹18,999', old_price: '₹35,000',
        duration: '3 – 4 Months', image: '/img/it/full-stack-development-171z.webp',
        description: 'Master Full Stack Web Development and launch your career as a developer.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['HTML & CSS Fundamentals', 'JavaScript & ES6+', 'React.js Frontend', 'Node.js Backend', 'Express.js REST API', 'MongoDB & SQL Databases', 'Authentication & Auth', 'Deployment & DevOps', 'Final Project'],
        show_on_home: true
    },
    {
        id: 'it2', title: 'Python Programming', slug: 'python-programming',
        category: 'IT', price: '₹10,999', old_price: '₹20,000',
        duration: '2 – 3 Months', image: '/img/it/python-267z.webp',
        description: 'Learn Python programming from scratch and build real-world applications.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Python Basics', 'Data Types & Control Flow', 'Functions & Modules', 'OOP in Python', 'File Handling', 'Libraries (NumPy, Pandas)', 'Web Scraping', 'Mini Projects'],
        show_on_home: false
    },
    {
        id: 'it3', title: 'Data Analytics', slug: 'data-analytics',
        category: 'IT', price: '₹14,999', old_price: '₹28,000',
        duration: '2 – 3 Months', image: '/img/it/da-013z.webp',
        description: 'Master Data Analytics tools and become a data-driven professional.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Excel Advanced', 'SQL for Data Analysis', 'Python for Data', 'Power BI', 'Tableau', 'Statistics & Probability', 'Machine Learning Basics', 'Capstone Project'],
        show_on_home: true
    },
    {
        id: 'it4', title: 'Java Programming', slug: 'java-programming',
        category: 'IT', price: '₹12,999', old_price: '₹22,000',
        duration: '2 – 3 Months', image: '/img/it/java-747z.webp',
        description: 'Master Java and build enterprise-level applications with expert guidance.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Java Basics', 'OOP Concepts', 'Collections Framework', 'Exception Handling', 'File I/O', 'Multi-threading', 'JDBC & Database', 'Spring Framework Basics', 'Industry Projects'],
        show_on_home: false
    },
    {
        id: 'it5', title: 'Software Testing', slug: 'software-testing',
        category: 'IT', price: '₹10,999', old_price: '₹20,000',
        duration: '2 – 3 Months', image: '/img/it/st-291z.webp',
        description: 'Master software testing methodologies and automation tools for QA careers.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Testing Fundamentals', 'SDLC & STLC', 'Manual Testing', 'Test Case Design', 'Bug Tracking', 'Selenium Automation', 'API Testing', 'Performance Testing', 'Agile Testing'],
        show_on_home: false
    },
    {
        id: 'it6', title: 'Digital Marketing', slug: 'digital-marketing',
        category: 'IT', price: '₹9,999', old_price: '₹18,000',
        duration: '1.5 – 2 Months', image: '/img/it/digital-marketing-875z.webp',
        description: 'Master Digital Marketing strategies and grow your brand online.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['SEO & SEM', 'Social Media Marketing', 'Content Marketing', 'Google Ads', 'Facebook & Instagram Ads', 'Email Marketing', 'Analytics & Reporting', 'Capstone Campaign'],
        show_on_home: false
    },
    {
        id: 'it7', title: 'C & C++ Programming', slug: 'c-cpp-programming',
        category: 'IT', price: '₹8,999', old_price: '₹15,000',
        duration: '1.5 – 2 Months', image: '/img/it/programming-979z.webp',
        description: 'Build a strong programming foundation with C and C++ from scratch.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['C Language Basics', 'Control Flow', 'Functions & Pointers', 'Arrays & Strings', 'Structures & Unions', 'C++ OOP Concepts', 'Templates & STL', 'Mini Projects'],
        show_on_home: false
    },
    {
        id: 'it8', title: 'Web Development', slug: 'web-development',
        category: 'IT', price: '₹10,999', old_price: '₹20,000',
        duration: '2 – 3 Months', image: '/img/it/web-development-387z.webp',
        description: 'Learn HTML, CSS, JavaScript and build beautiful websites from scratch.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['HTML5 Basics', 'CSS3 & Flexbox', 'Responsive Design', 'JavaScript Essentials', 'DOM Manipulation', 'Bootstrap Framework', 'jQuery Basics', 'Website Projects'],
        show_on_home: false
    },
    {
        id: 'it9', title: 'UI/UX Design', slug: 'ui-ux-design',
        category: 'IT', price: '₹10,999', old_price: '₹20,000',
        duration: '1.5 – 2 Months', image: '/img/it/ui-514z.webp',
        description: 'Master UI/UX Design principles and tools to create stunning digital experiences.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Design Thinking', 'UX Research & User Personas', 'Wireframing', 'Prototyping', 'Figma Mastery', 'Visual Design Principles', 'Design Systems', 'Portfolio Project'],
        show_on_home: false
    },

    // ── CIVIL ──
    {
        id: 'civil1', title: 'AutoCAD Civil', slug: 'autocad-civil',
        category: 'Civil', price: '₹7,999', old_price: '₹15,000',
        duration: '1 – 2 Months', image: '/img/it/web-development-387z.webp',
        description: 'Master Civil AutoCAD drafting for construction and infrastructure projects.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['AutoCAD Interface', '2D Drafting', 'Layers & Annotations', 'Civil Drawing Standards', 'Plotting & Printing', 'Project Work'],
        show_on_home: false
    },
    {
        id: 'civil2', title: 'Revit Architecture', slug: 'revit-architecture',
        category: 'Civil', price: '₹12,999', old_price: '₹25,000',
        duration: '1.5 – 2 Months', image: '/img/it/web-development-387z.webp',
        description: 'Master Autodesk Revit for BIM-based architectural design.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Revit Interface & BIM Concepts', 'Walls, Floors & Roofs', 'Doors & Windows', 'Stairs & Railings', 'Families & Components', 'Documentation & Sheets', 'Rendering', 'Industry Projects'],
        show_on_home: false
    },
    {
        id: 'civil3', title: 'SketchUp 3D Design', slug: 'sketchup-3d-design',
        category: 'Civil', price: '₹9,999', old_price: '₹18,000',
        duration: '1.5 – 2 Months', image: '/img/it/web-development-387z.webp',
        description: 'Master SketchUp for 3D architectural modeling and interior design.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['SketchUp Interface', '3D Modeling Basics', 'Components & Groups', 'Materials & Textures', 'Scenes & Animations', 'V-Ray Rendering', 'Interior Design Projects'],
        show_on_home: false
    },
    {
        id: 'civil4', title: 'STAAD.Pro structural analysis', slug: 'staad-pro',
        category: 'Civil', price: '₹17,999', old_price: '₹30,000',
        duration: '1.5 – 2 Months', image: '/img/it/web-development-387z.webp',
        description: 'Master STAAD.Pro for structural analysis and design of buildings and bridges.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['STAAD.Pro Interface', 'Structural Modelling', 'Load Application', 'Structural Analysis', 'Design (Steel & Concrete)', 'Report Generation', 'Real Projects'],
        show_on_home: false
    },

    // ── ARTS ──
    {
        id: 'arts1', title: 'Graphic Design', slug: 'graphic-design',
        category: 'Arts', price: '₹9,999', old_price: '₹18,000',
        duration: '1.5 – 2 Months', image: '/img/it/ui-514z.webp',
        description: 'Master Graphic Design tools and visual communication for creative careers.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Design Principles', 'Adobe Photoshop', 'Adobe Illustrator', 'Typography & Color Theory', 'Logo & Brand Design', 'Social Media Design', 'Print Design', 'Portfolio Project'],
        show_on_home: false
    },
    {
        id: 'arts2', title: 'Video Editing', slug: 'video-editing',
        category: 'Arts', price: '₹9,999', old_price: '₹18,000',
        duration: '1.5 – 2 Months', image: '/img/it/programming-979z.webp',
        description: 'Master video editing for YouTube, social media and professional productions.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Video Editing Basics', 'Adobe Premiere Pro', 'After Effects Motion Graphics', 'Color Grading', 'Audio Editing', 'Transitions & Effects', 'YouTube & Social Media Editing', 'Final Project'],
        show_on_home: false
    },
    {
        id: 'arts3', title: 'Tally with GST', slug: 'tally-with-gst',
        category: 'Arts', price: '₹8,999', old_price: '₹15,000',
        duration: '1.5 – 2 Months', image: '/img/it/programming-979z.webp',
        description: 'Master Tally ERP 9 and Tally Prime with full GST accounting.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['Accounting Basics', 'Tally Interface', 'Ledger & Groups', 'Voucher Entry', 'GST Configuration', 'GST Returns', 'Payroll Management', 'Final Accounts & Reports'],
        show_on_home: false
    },
    {
        id: 'arts4', title: 'MS Office Specialist', slug: 'ms-office-specialist',
        category: 'Arts', price: '₹5,999', old_price: '₹10,000',
        duration: '1 – 1.5 Months', image: '/img/it/da-013z.webp',
        description: 'Master Microsoft Office tools for professional and business use.',
        enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525',
        modules: ['MS Word', 'MS Excel Advanced', 'MS PowerPoint', 'MS Outlook', 'Google Workspace', 'Data & Charts', 'Office Projects'],
        show_on_home: false
    },
];

async function main() {
    console.log('\n🔄 RESTORING damaged course documents in Firestore...');
    console.log(`📂 Project: ${PROJECT_ID}`);
    console.log('─'.repeat(60));

    const token = await signIn('info@lasakedu.in', 'Lasakedu@2026');
    let ok = 0;
    let fail = 0;

    for (const course of COURSES) {
        const { id, ...data } = course;
        try {
            await writeDoc(token, id, {
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            console.log(`  ✅ Restored: ${id} — ${data.title}`);
            ok++;
        } catch (err) {
            console.log(`  ❌ Failed: ${id} — ${err.message.slice(0, 80)}`);
            fail++;
        }
    }

    console.log('\n' + '─'.repeat(60));
    console.log(`✅ Restored: ${ok} courses`);
    if (fail > 0) console.log(`❌ Failed: ${fail} courses`);
    console.log('🎉 Done! Refresh lasakedu.in/admin/courses to verify.');
    process.exit(0);
}

main().catch(err => { console.error('\n❌ Fatal:', err.message); process.exit(1); });
