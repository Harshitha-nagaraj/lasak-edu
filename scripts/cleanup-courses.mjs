/**
 * Cleanup Script — Deletes course documents with empty/missing title from Firestore
 * Then re-seeds all courses cleanly using the correct data.
 * Run: node scripts/cleanup-courses.mjs
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
const BASE_PATH = `/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

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

async function listDocs(token, collection, pageToken) {
    let path = `${BASE_PATH}/${collection}?key=${API_KEY}&pageSize=300`;
    if (pageToken) path += `&pageToken=${pageToken}`;
    const res = await httpsRequest({
        hostname: 'firestore.googleapis.com',
        path,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.body;
}

async function deleteDoc(token, docPath) {
    const res = await httpsRequest({
        hostname: 'firestore.googleapis.com',
        path: `/v1/${docPath}?key=${API_KEY}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.status;
}

function toVal(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: v } : { doubleValue: v };
    if (typeof v === 'string') return { stringValue: v };
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

// ── ALL COURSES (same as fix-courses.mjs) ──
const ALL_COURSES = [
    // --- MECHANICAL COURSES ---
    { id: 'mech1', title: 'AutoCAD Mechanical', slug: 'autocad-mechanical', category: 'Mechanical', price: '₹5,999', oldPrice: '₹9,000', duration: '1 – 1.5 Months', image: '/img/Mech/Autocad.webp', description: 'Master AutoCAD Mechanical and accelerate your career growth with expert-led training.', skills_gained: ["2D Drafting & Mechanical Drawing", "Layer Management & Templates", "Mechanical Symbols & Standard Parts Library", "Dimensioning & Tolerancing", "GD&T", "BOM Creation", "Assembly Drawings", "Manufacturing Documentation", "Plotting & Printing Setup"], modules: ['Introduction to AutoCAD', 'Drafting & Precision', 'Layers & Documentation', 'Blocks & Attributes', 'Hatching & Gradients', 'Layouts & Plotting', '3D Basics', 'Project Work'] },
    { id: 'mech2', title: 'SolidWorks Masterclass', slug: 'solidworks-masterclass', category: 'Mechanical', price: '₹14,999', oldPrice: '₹25,000', duration: '1.5 – 2 Months', image: '/img/Mech/Solidworks.408Z.webp', description: 'Master SolidWorks and accelerate your career growth with expert-led training.', skills_gained: ["2D Sketching & Feature-Based 3D Modeling", "Advanced Part Modeling Techniques", "Assembly Design & Mates", "Sheet Metal Design", "Surface Modeling", "Weldments & Structural Design", "2D Drafting & Detailing", "GD&T", "BOM Generation", "Rendering & Basic Simulation"], modules: ['Sketching & Modeling', 'Assembly Design', 'Manufacturing Documentation', 'Sheet Metal', 'Surface Modeling', 'Real-Time Projects'] },
    { id: 'mech3', title: 'Creo Parametric Course', slug: 'creo-parametric', category: 'Mechanical', price: '₹14,999', oldPrice: '₹25,000', duration: '1.5 – 2 Months', image: '/img/Mech/Creo.688Z.webp', description: 'Master Creo Parametric and accelerate your career growth.', skills_gained: ["Sketching and 3D Part Modeling", "Advanced Feature Creation", "Assembly Modeling", "Sheet Metal Design", "Surface Modeling Basics", "Mechanism & Motion Analysis", "2D Drafting and Detailing", "GD&T", "BOM Creation and Documentation"], modules: ['Parametric Design', 'Intelligent Assembly', 'Production Detailing', 'Sheet Metal', 'Surface Modeling', 'Real-Time Projects'] },
    { id: 'mech4', title: 'CATIA V5 Course', slug: 'catia-v5', category: 'Mechanical', price: '₹17,999', oldPrice: '₹30,000', duration: '1.5 – 3 Months', image: '/img/Mech/Catia.118Z.webp', description: 'Master CATIA V5 and accelerate your career growth.', skills_gained: ["Introduction to CAD Concepts", "CATIA V5 Interface & Workbench", "Sketcher Workbench", "Part Design (3D Modeling)", "Assembly Design", "Drafting & 2D Drawing Creation", "Surface Modeling Basics", "Sheet Metal Design (Basic)", "Dimensioning & Tolerancing", "Design Modification & Optimization"], modules: ['Sketcher & Parts', 'Systems Assembly', 'Advanced Surfacing', 'Drafting', 'Sheet Metal', 'Real-Time Projects'] },
    { id: 'mech5', title: 'ANSYS Simulation Course', slug: 'ansys-simulation', category: 'Mechanical', price: '₹17,999', oldPrice: '₹30,000', duration: '2 – 3 Months', image: '/img/Mech/Ansys.670Z.webp', description: 'Master ANSYS Simulation and accelerate your career growth.', skills_gained: ["FEA Concepts", "ANSYS Interface", "Meshing Techniques", "Structural Analysis", "Thermal Analysis", "Result Interpretation"], modules: ['FEA Fundamentals', 'Advanced Meshing', 'Workflow Setup', 'Static Structural Analysis', 'Modal & Dynamic Analysis', 'Industry Project'] },
    { id: 'mech6', title: 'HyperMesh Course', slug: 'hypermesh', category: 'Mechanical', price: '₹19,999', oldPrice: '₹40,000', duration: '1.5 – 3 Months', image: '/img/Mech/Hypermesh.631Z.webp', description: 'Master HyperMesh and accelerate your career growth.', skills_gained: ["Geometry Cleanup", "1D, 2D, and 3D Meshing", "Quality Criteria", "Model Setup", "Load & Boundary Application"], modules: ['Geometry Cleanup', 'Elements Meshing', 'Quality Control', 'Material & Loads', 'Post-Processing'] },
    { id: 'mech7', title: 'ANSA Pre-Processing Course', slug: 'ansa-pre-processing', category: 'Mechanical', price: '₹14,999', oldPrice: '₹25,000', duration: '1.5 – 3 Months', image: '/img/Mech/Ansa.062Z.webp', description: 'Master ANSA Pre-Processing and accelerate your career growth.', skills_gained: ["Geometry Cleanup", "Topology Handling", "Advanced Meshing", "Model Assembly", "Quality Element Checks"], modules: ['Topology Handling', 'Advanced Meshing', 'Model Assembly', '1D 2D 3D Meshing', 'Quality Checks', 'Model Validation'] },
    { id: 'mech8', title: 'NX CAD Course', slug: 'nx-cad', category: 'Mechanical', price: '₹16,999', oldPrice: '₹30,000', duration: '1.5 – 2 Months', image: '/img/Mech/Nxcad.webp', description: 'Master NX CAD and accelerate your career growth.', skills_gained: ["3D Part Modeling", "Assembly Design", "Drafting & Detailing", "Surface Modeling", "Sheet Metal Basics"], modules: ['NX Interface & Part Design', 'Assembly Design', 'Drafting', 'Advanced Modeling', 'Sheet Metal', 'Real Projects'] },
    { id: 'mech9', title: 'Computational Fluid Dynamics (CFD)', slug: 'cfd', category: 'Mechanical', price: '₹11,999', oldPrice: '₹20,000', duration: '2 – 3 Months', image: '/img/Mech/CFD.486Z.webp', description: 'Master CFD for fluid flow and heat transfer simulations.', skills_gained: ["Fluid Mechanics Fundamentals", "Governing Equations", "Meshing Techniques", "Boundary Conditions", "Turbulence Modeling", "Post-Processing"], modules: ['CFD Fundamentals', 'Meshing for CFD', 'Boundary Conditions', 'Turbulence Models', 'Post-Processing', 'Industry Projects'] },
    { id: 'mech10', title: 'Master Diploma in Mechanical Design', slug: 'master-diploma-mechanical', category: 'Mechanical', price: '₹35,999', oldPrice: '₹60,000', duration: '6 Months', image: '/img/Mech/Solidworks.408Z.webp', description: 'Complete Master Diploma covering AutoCAD, SolidWorks, CATIA, NX CAD and more.', skills_gained: ["Advanced 3D Modeling", "Multi-Software Proficiency", "Industry Workflows", "Complex Assembly design", "Manufacturing Standards"], modules: ['AutoCAD Mechanical', 'SolidWorks', 'Creo Parametric', 'CATIA V5', 'NX CAD', 'ANSYS Basics', 'Industry Projects', 'Placement Preparation'] },

    // --- IT COURSES ---
    { id: 'it1', title: 'Full Stack Web Development', slug: 'full-stack-web-development', category: 'IT', price: '₹18,999', oldPrice: '₹35,000', duration: '3 – 4 Months', image: '/img/IT/FULL STACK DEVELOPMENT.171Z.webp', description: 'Master Full Stack Web Development and launch your tech career.', skills_gained: ["Front-End Dev (HTML, CSS, JS)", "Responsive Design", "React JS", "Back-End (Node, Express)", "REST APIs", "Database (MongoDB/MySQL)", "Auth & Security", "Git & Deployment"], modules: ['HTML5 & CSS3', 'JavaScript & ES6+', 'React.js', 'Node.js & Express', 'MongoDB', 'REST APIs', 'Git & Deployment', 'Real Projects'] },
    { id: 'it2', title: 'Python Programming', slug: 'python-programming', category: 'IT', price: '₹10,999', oldPrice: '₹20,000', duration: '2 – 3 Months', image: '/img/IT/PYTHON.267Z.webp', description: 'Master Python from basics to advanced with real-world projects.', skills_gained: ["Python Fundamentals", "Conditional Logic & Loops", "Functions & Modules", "OOP Concepts", "File & Exception Handling"], modules: ['Python Basics', 'OOP Concepts', 'File Handling', 'Libraries: NumPy, Pandas', 'Django Basics', 'Mini Projects'] },
    { id: 'it3', title: 'Data Analytics Course', slug: 'data-analytics', category: 'IT', price: '₹10,999', oldPrice: '₹28,000', duration: '3 to 4 Months', image: '/img/IT/DA.013Z.webp', description: 'Master Data Analytics with Excel, Power BI, Python and more.', skills_gained: ["Advanced Excel", "SQL Queries", "Power BI Dashboards", "Python for Analytics", "Business Reporting"], modules: ['Excel Advanced', 'SQL', 'Power BI', 'Python for Analytics', 'Statistics & Visualization', 'Dashboard Projects'] },
    { id: 'it4', title: 'Java Programming', slug: 'java-programming', category: 'IT', price: '₹10,999', oldPrice: '₹20,000', duration: '2 – 3 Months', image: '/img/IT/JAVA.747Z.webp', description: 'Master Java programming for enterprise-level software development.', skills_gained: ["Java Fundamentals", "OOP Principles", "Collections Framework", "Exception Handling", "File I/O"], modules: ['Java Basics', 'OOP', 'Collections', 'Exception Handling', 'Spring Boot Basics', 'Mini Projects'] },
    { id: 'it5', title: 'Software Testing', slug: 'software-testing', category: 'IT', price: '₹12,999', oldPrice: '₹22,000', duration: '2 – 3 Months', image: '/img/IT/ST.291Z.webp', description: 'Master Software Testing including manual and automation testing.', skills_gained: ["STLC & SDLC", "Manual Testing Concepts", "Test Case Design", "Bug Tracking (Jira)", "Automation (Selenium)", "API Testing"], modules: ['Testing Fundamentals', 'SDLC & STLC', 'Manual Testing', 'Selenium Automation', 'API Testing', 'Test Reports'] },
    { id: 'it6', title: 'Digital Marketing', slug: 'digital-marketing', category: 'IT', price: '₹12,999', oldPrice: '₹24,000', duration: '2 – 3 Months', image: '/img/IT/DIGITAL MARKETING.875Z.webp', description: 'Master Digital Marketing — SEO, Social Media, Ads and Analytics.', skills_gained: ["SEO (On-page/Off-page)", "Search Engine Marketing", "Social Media Marketing", "Lead Generation", "Analytics Tracking"], modules: ['SEO Fundamentals', 'Google Ads', 'Social Media Marketing', 'Content Strategy', 'Email Marketing', 'Analytics'] },
    { id: 'it7', title: 'C & C++ Programming', slug: 'c-cpp-programming', category: 'IT', price: '₹8,999', oldPrice: '₹15,000', duration: '1.5 – 2 Months', image: '/img/IT/programming.979Z.webp', description: 'Master C and C++ programming from basics to advanced concepts.', skills_gained: ["Language Fundamentals", "Memory Management", "OOP in C++", "Data Structures", "Algorithm Building"], modules: ['C Basics', 'Pointers & Memory', 'C++ OOP', 'Data Structures', 'File Handling', 'Mini Projects'] },
    { id: 'it8', title: 'UI/UX Design Course', slug: 'ui-ux-design', category: 'IT', price: '₹13,999', oldPrice: '₹34,999', duration: '2 – 3 Months', image: '/img/IT/UI.514Z.webp', description: 'Master UI/UX Design from research to prototype.', skills_gained: ["User Research", "Wireframing", "Prototyping", "Figma/Adobe XD", "Design Systems"], modules: ['Design Thinking', 'User Research', 'Wireframing', 'Visual Design', 'Figma Mastery', 'Prototyping'] },

    // --- CIVIL COURSES ---
    { id: 'civil1', title: 'AutoCAD Civil', slug: 'autocad-civil', category: 'Civil', price: '₹6,499', oldPrice: '₹12,000', duration: '1 – 2 Months', image: '/img/Civil/Civil Cad.webp', description: 'Master Civil AutoCAD for construction and infrastructure drafting.', skills_gained: ["2D Drafting", "Structural Drawings", "Floor Plans", "Site Layouts", "Documentation"], modules: ['Civil Drawing Basics', '2D Drafting', 'Floor Plans & Sections', 'Site Plans', 'Plotting', 'Real Projects'] },
    { id: 'civil2', title: 'Revit Architecture', slug: 'revit-architecture', category: 'Civil', price: '₹12,999', oldPrice: '₹25,000', duration: '1.5 – 2 Months', image: '/img/Civil/Revit.471Z.webp', description: 'Master Revit Architecture for BIM-based design and construction.', skills_gained: ["BIM Fundamentals", "3D Building Modeling", "Family Creation", "Coordination", "Documentation"], modules: ['Revit Interface', 'Walls Floors & Roofs', 'Doors & Windows', 'Stairs & Rails', 'Sheet Setup', 'BIM Documentation'] },
    { id: 'civil3', title: 'SketchUp 3D Design', slug: 'sketchup-3d', category: 'Civil', price: '₹9,999', oldPrice: '₹18,000', duration: '1 – 1.5 Months', image: '/img/Civil/Sketchup.430Z.webp', description: 'Master SketchUp for architectural 3D visualization.', skills_gained: ["3D Modeling", "Texturing", "Lighting/Shadows", "Visualization", "Interior Modeling"], modules: ['SketchUp Interface', '3D Modeling', 'Materials & Textures', 'Interior Design', 'Rendering', 'Presentation'] },
    { id: 'civil4', title: 'STAAD.Pro structural analysis', slug: 'staad-pro', category: 'Civil', price: '₹17,999', oldPrice: '₹30,000', duration: '1.5 – 2 Months', image: '/img/Civil/Staadpro.216Z.webp', description: 'Master STAAD.Pro for structural analysis and design.', skills_gained: ["Structural Modeling", "Load Calculation", "Analysis", "Design (RCC/Steel)", "Reporting"], modules: ['Modeling Basics', 'Loading Cases', 'Structural Analysis', 'Concrete Design', 'Steel Design', 'Reports'] },

    // --- ARTS & MEDIA COURSES ---
    { id: 'arts1', title: 'Graphic Design', slug: 'graphic-design', category: 'Arts', price: '₹9,999', oldPrice: '₹18,000', duration: '1.5 – 2 Months', image: '/img/Arts/Digital marketing.840Z.webp', description: 'Master Graphic Design using Photoshop, Illustrator and CorelDRAW.', skills_gained: ["Adobe Photoshop", "Illustrator", "CorelDRAW", "Logo Design", "Branding", "Print Design"], modules: ['Design Principles', 'Photoshop', 'Illustrator', 'CorelDRAW', 'Typography', 'Logo & Brand Design', 'Real Projects'] },
    { id: 'arts2', title: 'Video Editing', slug: 'video-editing', category: 'Arts', price: '₹9,999', oldPrice: '₹18,000', duration: '1.5 – 2 Months', image: '/img/Arts/MS office specialist.640Z.webp', description: 'Master Video Editing with Premiere Pro and After Effects.', skills_gained: ["Premiere Pro Editing", "Motion Graphics", "Color Grading", "Audio Syncing", "Effects"], modules: ['Editing Basics', 'Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics', 'YouTube Production'] },
    { id: 'arts3', title: 'Tally with GST', slug: 'tally-with-gst', category: 'Arts', price: '₹8,999', oldPrice: '₹15,000', duration: '1.5 – 2 Months', image: '/img/Arts/Tally with gst.448Z.webp', description: 'Master Tally with GST for accounting and financial management.', skills_gained: ["Accounting Basics", "TallyPrime Mastery", "GST Compliance", "Payroll", "BOM", "Banking"], modules: ['Tally Basics', 'GST Setup', 'Ledger & Vouchers', 'Bank Reconciliation', 'Reports', 'Real Projects'] },
    { id: 'arts4', title: 'MS Office Specialist', slug: 'ms-office', category: 'Arts', price: '₹5,999', oldPrice: '₹12,000', duration: '1 – 1.5 Months', image: '/img/Arts/MS office specialist.640Z.webp', description: 'Master MS Office for professional and academic success.', skills_gained: ["MS Word", "Advanced Excel", "PowerPoint", "Outlook", "Documentation"], modules: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Outlook", "Smart Reporting"] },
];

async function main() {
    console.log('\n🧹 Course Cleanup — LasakEdu');
    console.log(`📂 Project: ${PROJECT_ID}`);
    console.log('─'.repeat(40));

    const token = await signIn('info@lasakedu.in', 'Lasakedu@2026');

    // Step 1: List all courses from Firestore
    console.log('\n📋 Fetching all courses from Firestore...');
    let allDocs = [];
    let pageToken = null;
    do {
        const result = await listDocs(token, 'courses', pageToken);
        if (result.documents) allDocs = allDocs.concat(result.documents);
        pageToken = result.nextPageToken;
    } while (pageToken);

    console.log(`   Found ${allDocs.length} total course documents`);

    // Step 2: Delete docs with empty or missing title
    const validIds = new Set(ALL_COURSES.map(c => c.id));
    let deleted = 0;
    for (const d of allDocs) {
        const title = d.fields?.title?.stringValue;
        const docId = d.name.split('/').pop();
        // Delete if title is empty/missing OR if it's an old slug-based ID not in our known list
        if (!title || title.trim() === '' || !validIds.has(docId)) {
            process.stdout.write(`\r  Deleting: ${docId} (title="${title || 'EMPTY'}")...        `);
            await deleteDoc(token, d.name.replace('https://firestore.googleapis.com/v1/', ''));
            deleted++;
        }
    }
    console.log(`\n✅ Deleted ${deleted} incomplete/duplicate course documents`);

    // Step 3: Re-seed all courses with clean data
    console.log('\n📦 Re-seeding all courses with clean data...');
    let count = 0;
    for (const course of ALL_COURSES) {
        await writeDoc(token, 'courses', course.id, course);
        count++;
        process.stdout.write(`\r  Pushing ${count}/${ALL_COURSES.length} — ${course.title}        `);
    }
    console.log(`\n✅ ${count} courses pushed successfully!`);
    console.log('\n🎉 Cleanup complete! All courses are now clean in Firebase.');
    process.exit(0);
}

main().catch((err) => {
    console.error('\n❌ Failed:', err.message);
    process.exit(1);
});
