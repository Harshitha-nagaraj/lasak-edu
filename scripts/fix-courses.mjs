/**
 * Course Fixer — Pushes ALL courses from constants.tsx to Firebase
 * with correct price field names and ₹ symbol format.
 * Run: node scripts/fix-courses.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import https from 'https';

const __dir = dirname(fileURLToPath(import.meta.url));
const envFile = resolve(__dir, '../.env.local');
const envText = readFileSync(envFile, 'utf8');
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
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── HTTP helper using Node's https (no fetch to avoid Windows assertion bug) ──
function httpsRequest(options, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function signIn(email, password) {
    const body = JSON.stringify({ email, password, returnSecureToken: true });
    const res = await httpsRequest({
        hostname: 'identitytoolkit.googleapis.com',
        path: `/v1/accounts:signInWithPassword?key=${API_KEY}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, body);
    if (res.status !== 200) throw new Error('Auth failed: ' + JSON.stringify(res.body));
    console.log(`🔐 Signed in as ${email}`);
    return res.body.idToken;
}

function toVal(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: v } : { doubleValue: v };
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

function toDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) fields[k] = toVal(v);
    return JSON.stringify({ fields });
}

async function writeDoc(token, collection, docId, data) {
    const path = `${collection}/${encodeURIComponent(docId)}`;
    const body = toDoc(data);
    const url = new URL(`${BASE}/${path}`);
    const res = await httpsRequest({
        hostname: 'firestore.googleapis.com',
        path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}?key=${API_KEY}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Authorization': `Bearer ${token}`,
        },
    }, body);
    if (res.status >= 300) throw new Error(`Write ${docId} failed: ${JSON.stringify(res.body)}`);
}

// ── ALL COURSES from constants.tsx with correct price format ──
// NOTE: price = actual selling price (₹X,XXX), old_price = crossed-out original price
const ALL_COURSES = [
    // ====== MECHANICAL ======
    { id: 'mech1', title: 'AutoCAD Mechanical', slug: 'autocad-mechanical', category: 'Mechanical', price: '₹5,999', old_price: '₹9,000', duration: '1 – 1.5 Months', image: '/img/Mech/Autocad.webp', description: 'Master AutoCAD Mechanical and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Introduction to AutoCAD - Interface, Workspace Navigation & Drawing Setup', 'Drafting & Precision - 2D Drawing Tools, Advanced Modify Commands', 'Layers & Documentation - Layer Management, Annotation Scales & GD&T', 'Drawing Accuracy & Control', 'Blocks & Attributes', 'Hatching & Gradients', 'Layouts & Plotting', 'Advanced Drafting Tools', '3D Basics', 'Industry-Specific Practices', 'Project Work'] },
    { id: 'mech2', title: 'SolidWorks Masterclass', slug: 'solidworks-masterclass', category: 'Mechanical', price: '₹14,999', old_price: '₹25,000', duration: '1.5 – 2 Months', image: '/img/Mech/Solidworks.408Z.webp', description: 'Master SolidWorks and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Sketching & Modeling - Convert Complex 2D Sketches into 3D Part Designs', 'Assembly Design - Mechanical Mates, Exploded Views & Motion Study', 'Manufacturing Documentation - 2D Sheets, Section Views & BOM', 'Sheet Metal Design', 'Surface Modeling', 'Weldments & Structural Design', 'GD&T', 'Rendering & Basic Simulation', 'Real-Time Industrial Projects'] },
    { id: 'mech3', title: 'Creo Parametric Course', slug: 'creo-parametric', category: 'Mechanical', price: '₹14,999', old_price: '₹25,000', duration: '1.5 – 2 Months', image: '/img/Mech/Creo.688Z.webp', description: 'Master Creo Parametric and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Parametric Design - 3D Modeling using Sketcher Tools', 'Intelligent Assembly', 'Production Detailing - ANSI/ISO Standard Drawings with GD&T', 'Sheet Metal Design', 'Surface Modeling', 'Mechanism & Motion Analysis', 'BOM Creation', 'Real-Time Industrial Projects'] },
    { id: 'mech4', title: 'CATIA V5 Course', slug: 'catia-v5', category: 'Mechanical', price: '₹17,999', old_price: '₹30,000', duration: '1.5 – 3 Months', image: '/img/Mech/Catia.118Z.webp', description: 'Master CATIA V5 and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Sketcher & Parts – 3D Mechanical Geometries', 'Systems Assembly - Constraints & Kinematics', 'Advanced Surfacing - Generative Shape Design (GSD)', 'Drafting & 2D Drawing', 'Sheet Metal Design', 'Dimensioning & Tolerancing', 'Real-Time Industrial Projects'] },
    { id: 'mech5', title: 'ANSYS Simulation Course', slug: 'ansys-simulation', category: 'Mechanical', price: '₹17,999', old_price: '₹30,000', duration: '2 – 3 Months', image: '/img/Mech/Ansys.670Z.webp', description: 'Master ANSYS Simulation and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['FEA Fundamentals - Static Structural analysis & Thermal Simulations', 'Advanced Meshing', 'Workflow Setup - Loads & Boundary Conditions', 'Static Structural Analysis', 'Modal & Dynamic Analysis', 'Thermal Analysis', 'Optimization & Validation', 'Industry-Based Project'] },
    { id: 'mech6', title: 'HyperMesh Course', slug: 'hypermesh', category: 'Mechanical', price: '₹19,999', old_price: '₹40,000', duration: '1.5 – 3 Months', image: '/img/Mech/Hypermesh.631Z.webp', description: 'Master HyperMesh and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Geometry Cleanup - Topology Repair & Mid-Surface Extraction', 'Elements Meshing - 1D, 2D Shell & 3D Hex Meshing', 'Quality Control - Jacobian & Aspect Ratio Checks', 'Mid-Surface Extraction', 'Material, Properties & Loads', 'Solver Interface & Model Setup', 'Post-Processing & Results'] },
    { id: 'mech7', title: 'ANSA Pre-Processing Course', slug: 'ansa-pre-processing', category: 'Mechanical', price: '₹14,999', old_price: '₹25,000', duration: '1.5 – 3 Months', image: '/img/Mech/Ansa.062Z.webp', description: 'Master ANSA Pre-Processing and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Topology Handling - Geometry Cleanup & Shell Modeling', 'Advanced Meshing - Industrial Shell & Solid Workflows', 'Model Assembly - Connections & Rigid Elements', '1D, 2D & 3D Meshing', 'Quality Checks', 'Model Validation'] },
    { id: 'mech8', title: 'NX CAD Course', slug: 'nx-cad', category: 'Mechanical', price: '₹16,999', old_price: '₹30,000', duration: '1.5 – 2 Months', image: '/img/Mech/Nxcad.webp', description: 'Master NX CAD and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['NX Interface & Part Design', 'Assembly Design', 'Drafting', 'Advanced Modeling', 'Sheet Metal', 'Real Projects'] },
    { id: 'mech9', title: 'AutoCAD 2D & 3D', slug: 'autocad-2d-3d', category: 'Mechanical', price: '₹7,999', old_price: '₹15,000', duration: '1 – 2 Months', image: '/img/Mech/Autocad.webp', description: 'Master AutoCAD 2D & 3D drafting for all engineering disciplines.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['2D Drafting Basics', 'Precision Drawing', 'Layer Management', '3D Modeling Basics', 'Rendering', 'Printing & Layouts'] },
    { id: 'mech10', title: 'Master Diploma in Mechanical Design', slug: 'master-diploma-mechanical', category: 'Mechanical', price: '₹35,999', old_price: '₹60,000', duration: '6 Months', image: '/img/Mech/Solidworks.408Z.webp', description: 'Complete Master Diploma covering AutoCAD, SolidWorks, CATIA, NX CAD and more.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['AutoCAD Mechanical', 'SolidWorks', 'Creo Parametric', 'CATIA V5', 'NX CAD', 'ANSYS Basics', 'Industry Projects', 'Placement Preparation'] },

    // ====== IT ======
    { id: 'it1', title: 'Full Stack Web Development', slug: 'full-stack-web-development', category: 'IT', price: '₹18,999', old_price: '₹35,000', duration: '3 – 4 Months', image: '/img/IT/fullstack.webp', description: 'Master Full Stack Web Development and launch your tech career.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['HTML5 & CSS3', 'JavaScript & ES6+', 'React.js', 'Node.js & Express', 'MongoDB', 'REST APIs', 'Git & Deployment', 'Real Projects'] },
    { id: 'it2', title: 'Python Programming', slug: 'python-programming', category: 'IT', price: '₹10,999', old_price: '₹20,000', duration: '2 – 3 Months', image: '/img/IT/python.webp', description: 'Master Python from basics to advanced with real-world projects.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Python Basics', 'OOP Concepts', 'File Handling', 'Libraries: NumPy, Pandas', 'Django Basics', 'Mini Projects'] },
    { id: 'it3', title: 'Data Analytics', slug: 'data-analytics', category: 'IT', price: '₹14,999', old_price: '₹28,000', duration: '2 – 3 Months', image: '/img/IT/dataanalytics.webp', description: 'Master Data Analytics with Excel, Power BI, Python and more.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Excel Advanced', 'SQL', 'Power BI', 'Python for Analytics', 'Statistics & Visualization', 'Dashboard Projects'] },
    { id: 'it4', title: 'Java Programming', slug: 'java-programming', category: 'IT', price: '₹10,999', old_price: '₹20,000', duration: '2 – 3 Months', image: '/img/IT/java.webp', description: 'Master Java programming for enterprise-level software development.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Java Basics', 'OOP', 'Collections', 'Exception Handling', 'Spring Boot Basics', 'Mini Projects'] },
    { id: 'it5', title: 'Software Testing', slug: 'software-testing', category: 'IT', price: '₹12,999', old_price: '₹22,000', duration: '2 – 3 Months', image: '/img/IT/testing.webp', description: 'Master Software Testing including manual and automation testing.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Testing Fundamentals', 'SDLC & STLC', 'Manual Testing', 'Selenium Automation', 'API Testing', 'Test Reports'] },
    { id: 'it6', title: 'Digital Marketing', slug: 'digital-marketing', category: 'IT', price: '₹12,999', old_price: '₹24,000', duration: '2 – 3 Months', image: '/img/IT/digitalmarketing.webp', description: 'Master Digital Marketing — SEO, Social Media, Ads and Analytics.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['SEO Fundamentals', 'Google Ads', 'Social Media Marketing', 'Content Strategy', 'Email Marketing', 'Analytics'] },
    { id: 'it7', title: 'C & C++ Programming', slug: 'c-cpp-programming', category: 'IT', price: '₹8,999', old_price: '₹15,000', duration: '1.5 – 2 Months', image: '/img/IT/cpp.webp', description: 'Master C and C++ programming from basics to advanced concepts.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['C Basics', 'Pointers & Memory', 'C++ OOP', 'Data Structures', 'File Handling', 'Mini Projects'] },

    // ====== CIVIL ======
    { id: 'civil1', title: 'AutoCAD Civil', slug: 'autocad-civil', category: 'Civil', price: '₹7,999', old_price: '₹15,000', duration: '1 – 2 Months', image: '/img/Civil/autocadcivil.webp', description: 'Master Civil AutoCAD and drive your construction career forward.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Civil Drawing Basics', '2D Drafting', 'Floor Plans & Sections', 'Site Plans', 'Plotting', 'Real Projects'] },
    { id: 'civil2', title: 'Revit Architecture', slug: 'revit-architecture', category: 'Civil', price: '₹12,999', old_price: '₹25,000', duration: '1.5 – 2 Months', image: '/img/Civil/revit.webp', description: 'Master Revit Architecture for BIM-based design and construction documentation.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Revit Interface', 'Walls, Floors & Roofs', 'Doors & Windows', 'Stairs & Rails', 'Sheet Setup', 'BIM Documentation'] },
    { id: 'civil3', title: 'SketchUp 3D Design', slug: 'sketchup-3d', category: 'Civil', price: '₹9,999', old_price: '₹18,000', duration: '1 – 1.5 Months', image: '/img/Civil/sketchup.webp', description: 'Master SketchUp for architectural 3D visualization and interior design.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['SketchUp Interface', '3D Modeling', 'Materials & Textures', 'Interior Design', 'Rendering', 'Presentation'] },
    { id: 'civil4', title: 'Civil 3D Course', slug: 'civil-3d', category: 'Civil', price: '₹14,999', old_price: '₹25,000', duration: '1.5 – 2 Months', image: '/img/Civil/civil3d.webp', description: 'Master Civil 3D for road design, grading, and infrastructure projects.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Civil 3D Interface', 'Survey Data Import', 'Surfaces', 'Corridors', 'Road Design', 'Grading'] },

    // ====== ARTS ======
    { id: 'arts1', title: 'Graphic Design', slug: 'graphic-design', category: 'Arts', price: '₹9,999', old_price: '₹18,000', duration: '1.5 – 2 Months', image: '/img/Arts/graphic.webp', description: 'Master Graphic Design using Photoshop, Illustrator and CorelDRAW.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Design Principles', 'Photoshop', 'Illustrator', 'CorelDRAW', 'Typography', 'Logo & Brand Design', 'Real Projects'] },
    { id: 'arts2', title: 'Video Editing', slug: 'video-editing', category: 'Arts', price: '₹9,999', old_price: '₹18,000', duration: '1.5 – 2 Months', image: '/img/Arts/videoediting.webp', description: 'Master Video Editing with Premiere Pro and After Effects.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Editing Basics', 'Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics', 'YouTube Production'] },
    { id: 'arts3', title: 'UI/UX Design', slug: 'ui-ux-design', category: 'Arts', price: '₹12,999', old_price: '₹22,000', duration: '2 – 2.5 Months', image: '/img/Arts/uiux.webp', description: 'Master UI/UX Design with Figma and Adobe XD for modern digital products.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['UX Principles', 'Wireframing', 'Figma', 'Prototyping', 'User Research', 'Portfolio Projects'] },

    // ====== KIDS ======
    { id: 'kids1', title: 'Robotics for Kids', slug: 'robotics-for-kids', category: 'Kids', price: '₹4,999', old_price: '₹8,000', duration: '1 Month', image: '/img/Kids/robotics.webp', description: 'Fun hands-on Robotics course for kids aged 8-15 using Arduino and Lego.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Introduction to Robotics', 'Basic Electronics', 'Arduino Basics', 'Sensors & Motors', 'Simple Robots', 'Fun Projects'], isFree: false },
    { id: 'kids2', title: 'Scratch Coding', slug: 'scratch-coding', category: 'Kids', price: '₹3,999', old_price: '₹6,000', duration: '1 Month', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600', description: 'Learn coding through fun games and animations using block-based programming!', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525', modules: ['Coding Basics', 'Visual Logic', 'Creative Storytelling', 'Game Mastery', 'Advanced Logic'], isFree: false },
];

async function main() {
    console.log('\n🔥 Course Fixer — LasakEdu');
    console.log(`📂 Project: ${PROJECT_ID}`);
    console.log('─'.repeat(40));

    const token = await signIn('info@lasakedu.in', 'Lasakedu@2026');
    let count = 0;

    for (const course of ALL_COURSES) {
        await writeDoc(token, 'courses', course.id, course);
        count++;
        process.stdout.write(`\r  Pushing courses... ${count}/${ALL_COURSES.length} — ${course.title}`);
    }

    console.log(`\n✅ courses: ${count} documents pushed`);
    console.log('\n🎉 All courses fixed in Firebase!');
    process.exit(0);
}

main().catch((err) => {
    console.error('\n❌ Failed:', err.message);
    process.exit(1);
});
