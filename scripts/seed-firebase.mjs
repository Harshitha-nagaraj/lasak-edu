/**
 * Firebase Seeder for LasakEdu — REST API Version
 * Run: node scripts/seed-firebase.mjs
 *
 * Uses the Firestore REST API for maximum Node.js compatibility.
 * Requires VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in .env.local
 *
 * NOTE: Videos are NOT stored in Firebase. Place .mp4 files in public/videos/
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ─────────────────────────────────────────
// Load .env.local manually
// ─────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envFile = resolve(__dir, '../.env.local');
const envText = readFileSync(envFile, 'utf8');
const env = {};
for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    env[key] = val;
}

const API_KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

if (!API_KEY || !PROJECT_ID) {
    console.error('❌ Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in .env.local');
    process.exit(1);
}

console.log(`\n🔥 Firebase Seeder — LasakEdu`);
console.log(`📂 Project: ${PROJECT_ID}`);
console.log('─'.repeat(40));

// ─────────────────────────────────────────
// REST API Helper
// ─────────────────────────────────────────

// Convert JS value to Firestore REST document field type
function toFirestoreValue(val) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: val } : { doubleValue: val };
    if (typeof val === 'string') return { stringValue: val };
    if (val instanceof Date) return { timestampValue: val.toISOString() };
    if (Array.isArray(val)) {
        return { arrayValue: { values: val.map(toFirestoreValue) } };
    }
    if (typeof val === 'object') {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

function toFirestoreDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
        fields[k] = toFirestoreValue(v);
    }
    return { fields };
}

let ID_TOKEN = null;

async function signIn(email, password) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Auth failed: ${data.error?.message}`);
    ID_TOKEN = data.idToken;
    console.log(`🔐 Signed in as ${email}`);
}

async function writeDoc(collectionName, docId, data) {
    const url = `${BASE_URL}/${collectionName}/${docId}?key=${API_KEY}`;
    const body = toFirestoreDoc(data);

    const headers = { 'Content-Type': 'application/json' };
    if (ID_TOKEN) headers['Authorization'] = `Bearer ${ID_TOKEN}`;

    const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to write ${collectionName}/${docId}: ${err}`);
    }
}

async function seedCollection(collectionName, records, idFn) {
    let count = 0;
    for (const record of records) {
        const id = idFn(record);
        // Ensure standard fields exist
        const now = new Date();
        const dataWithMeta = {
            ...record,
            createdAt: record.createdAt || record.created_at || now,
            created_at: record.createdAt || record.created_at || now,
            updatedAt: now,
            updated_at: now,
            // Ensure images are clean
            image: record.image ? record.image.replace(/^\/public/, '') : (record.logo || '')
        };
        await writeDoc(collectionName, id, dataWithMeta);
        count++;
        process.stdout.write(`\r  Writing ${collectionName}... ${count}/${records.length}`);
    }
    console.log(`\n✅ ${collectionName}: ${count} documents pushed`);
}

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const PARTNERS = [
    { name: 'Creo', logo: '/img/ptccreo.webp', type: 'training', created_at: new Date() },
    { name: 'Solidworks', logo: '/img/solidworks.webp', type: 'training', created_at: new Date() },
    { name: 'L&T', logo: '/img/LT.webp', type: 'placement', created_at: new Date() },
    { name: 'Kavin', logo: '/img/kavin.webp', type: 'placement', created_at: new Date() },
    { name: 'Hinduja', logo: '/img/hinduja.webp', type: 'placement', created_at: new Date() },
    { name: 'Caresoft', logo: '/img/caresoft.webp', type: 'placement', created_at: new Date() },
    { name: 'Hirotec', logo: '/img/hirotec.webp', type: 'placement', created_at: new Date() },
    { name: 'Designtech', logo: '/img/designtech.webp', type: 'placement', created_at: new Date() },
    { name: 'Harita', logo: '/img/harita.webp', type: 'placement', created_at: new Date() },
];

const TESTIMONIALS = [
    { name: 'Vishnu Lakshmi', company: 'LMW - COIMBATORE', role: 'Design Engineer', image: '/img/vishnu lakshmi s.webp', quote: 'Proud to start my career with a great opportunity.', package: '7 LPA' },
    { name: 'Ashok G', company: 'CADOPT', role: 'Design Engineer', image: '/img/ASHOK G.webp', quote: 'Happy to begin my journey as a Design Engineer.', package: '3.5 LPA' },
    { name: 'Saravana Kumar R', company: 'CADOPT', role: 'Design Engineer', image: '/img/saravana kumar r.webp', quote: 'Great learning experience that shaped my career.', package: '3 LPA' },
    { name: 'ChandraLeka G.K.', company: 'CADOPT', role: 'Design Engineer', image: '/img/Ms.CHANDRALEKA_K.webp', quote: 'Achieving this milestone feels amazing.', package: '3.2 LPA' },
    { name: 'Dharsan V', company: 'DESIGNTECH', role: 'Design Engineer', image: '/img/Mr. DHARSAN V.webp', quote: 'Excited to start my professional journey.', package: '3.5 LPA' },
    { name: 'Lokkesh V', company: 'CADOpt', role: 'Design Engineer', image: '/img/Mr. LOKKESH V.webp', quote: 'Grateful for this rewarding job opportunity.', package: '3.7 LPA' },
    { name: 'Surya M', company: 'CADOpt', role: 'Design Engineer', image: '/img/Mr. SURYA M.webp', quote: 'Happy to start my professional journey', package: '3.2 LPA' },
    { name: 'Ruthresh V', company: 'MEKNO EOT Crane', role: 'Design Engineer', image: '/img/Mr. RUTHRESH V.webp', quote: 'Proud to begin my engineering career.', package: '2.7 LPA' },
    { name: 'Syed Sharukh', company: 'JACK GROUPS', role: 'Design Engineer', image: '/img/Mr. Syed Sharukh.webp', quote: 'Excited to join JACK Groups.', package: '3.2 LPA' },
    { name: 'Anish Joseph C', company: 'JACK GROUPS', role: 'Design Engineer', image: '/img/Mr. ANISH JOSEPH C.jpeg', quote: 'Grateful to begin my journey at JACK Groups.', package: '3.2 LPA' },
];

const YOUTUBE_VIDEOS = [
    { video_id: 'EnYGuUc6Qlk', title: 'LasakEdu Video 1', order_num: 1 },
    { video_id: 'h-xIqFdTIyk', title: 'LasakEdu Video 2', order_num: 2 },
    { video_id: 'VQ24NYVFVDE', title: 'LasakEdu Video 3', order_num: 3 },
    { video_id: 's2kJ52y4SCc', title: 'LasakEdu Video 4', order_num: 4 },
    { video_id: 'rcdalyx2Qjw', title: 'LasakEdu Video 5', order_num: 5 },
    { video_id: 'gD6bl4VjG8k', title: 'LasakEdu Video 6', order_num: 6 },
    { video_id: 'SAcspV9dKQI', title: 'LasakEdu Video 7', order_num: 7 },
    { video_id: 'TIqaEJvlkUg', title: 'LasakEdu Video 8', order_num: 8 },
    { video_id: 'r7hZgmf3jMY', title: 'LasakEdu Video 9', order_num: 9 },
    { video_id: 'k1Bo5qDZsj0', title: 'LasakEdu Video 10', order_num: 10 },
    { video_id: 'KAEhbSAsD8c', title: 'LasakEdu Video 11', order_num: 11 },
    { video_id: 'qIMJAT8XQJg', title: 'LasakEdu Video 12', order_num: 12 },
    { video_id: 'vNvXHulHGPw', title: 'LasakEdu Video 13', order_num: 13 },
    { video_id: 'O4Z2CSJnDuw', title: 'LasakEdu Video 14', order_num: 14 },
    { video_id: 'FcWXcn1_8rQ', title: 'LasakEdu Video 15', order_num: 15 },
    { video_id: '8yS6lRd8zQ0', title: 'LasakEdu Video 16', order_num: 16 },
    { video_id: 'nI1CX5ipdSE', title: 'LasakEdu Video 17', order_num: 17 },
    { video_id: 'Nxq6E_c5O98', title: 'LasakEdu Video 18', order_num: 18 },
    { video_id: '77Heu2B161Y', title: 'LasakEdu Video 19', order_num: 19 },
    { video_id: 'd_hvjjG0LlQ', title: 'LasakEdu Video 20', order_num: 20 },
];

const CONTACT_INFO = [
    { type: 'address', label: 'Main Office', value: '11A, STV Nagar, Peelamedu, Coimbatore - 641004', icon: 'MapPin', directions_url: 'https://maps.app.goo.gl/lasakedu', order_num: 1, active: true },
    { type: 'phone', label: 'Phone', value: '+91 7418 734 466', icon: 'Phone', order_num: 2, active: true },
    { type: 'email', label: 'Email', value: 'info@lasakedu.in', icon: 'Mail', order_num: 3, active: true },
    { type: 'address', label: 'Gandhipuram Branch', value: 'No.655 F Shri Paaththaa avenue, 1st floor, Near Gp signal Gandhipuram', icon: 'MapPin', directions_url: null, order_num: 4, active: true },
    { type: 'phone', label: 'Phone', value: '+91 74187 32525', icon: 'Phone', order_num: 5, active: true },
    { type: 'email', label: 'Email', value: 'info@lasakedu.in', icon: 'Mail', order_num: 6, active: true },
];

const NAV_LINKS = [
    { label: 'Home', href: '/', order_num: 1, active: true },
    { label: 'Courses', href: '/courses', order_num: 2, active: true },
    { label: 'Programs', href: '/programs', order_num: 3, active: true },
    { label: 'Scholarship', href: '/scholarship', order_num: 4, active: true },
    { label: 'Blog', href: '/blog', order_num: 5, active: true },
    { label: 'Verify', href: '/verification', order_num: 6, active: true },
    { label: 'Contact', href: '/contact', order_num: 7, active: true },
];

const HERO_SLIDES = [
    { title: 'Your Future Starts Here', subtitle: 'Industry-level software training with real placement support.', image: '/img/lsakbanner1.webp', cta_text: 'Explore Courses', cta_link: '/courses', order_num: 1, active: true },
    { title: 'Master Industry-Grade Tools', subtitle: 'SolidWorks, CATIA, Python, Full Stack & more from day one.', image: '/img/lsakbanner2.webp', cta_text: 'View Programs', cta_link: '/programs', order_num: 2, active: true },
    { title: 'Get Placed. Get Ahead.', subtitle: '100% placement assistance with top companies across Tamil Nadu.', image: '/img/lsakbanner3.webp', cta_text: 'Apply Scholarship', cta_link: '/scholarship', order_num: 3, active: true },
];

const SCHOLARSHIP_RULES = [
    { min_score: 90, max_score: 100, discount_percentage: 50, label: 'Excellence Scholarship' },
    { min_score: 75, max_score: 89, discount_percentage: 30, label: 'Merit Scholarship' },
    { min_score: 60, max_score: 74, discount_percentage: 20, label: 'Good Performance' },
    { min_score: 0, max_score: 59, discount_percentage: 10, label: 'Participation' },
];

const CERTIFICATES = [
    { cert_id: 'TN/MAA/070/LTIEC0022', student_name: 'MONISHA M', course_name: 'WEB DEVELOPMENT', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CHE/071/LTIEC0023', student_name: 'CHANDRALEKHA G K', course_name: 'NXcad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0024', student_name: 'NAVANEETHA KRISHNAN', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/ERD/080/LTIEC0025', student_name: 'JAIRASWANTH', course_name: 'C,C++', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0026', student_name: 'ABHI NIVESH P', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0027', student_name: 'KELVIN A', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0028', student_name: 'J AMAL ZICO', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0029', student_name: 'BALAJI', course_name: 'WEB DEVELOPMENT', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0030', student_name: 'VASANTH', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0031', student_name: 'VISHNU KUMAR V', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0032', student_name: 'Dharsan V', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0033', student_name: 'PRABHU', course_name: 'autocad', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0035', student_name: 'Ganesh Pradeep V', course_name: 'Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0036', student_name: 'Rajapandi', course_name: 'C,C++', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0037', student_name: 'Theenarasu S', course_name: 'Master Diploma', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0038', student_name: 'Vijay M', course_name: 'Hypermesh', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0039', student_name: 'Keerthana', course_name: 'Sketchup', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0040', student_name: 'Nijandhan K', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0041', student_name: 'Surya M', course_name: 'Nxcad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0042', student_name: 'Lokkesh V', course_name: 'Master Diploma', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0043', student_name: 'Muthulingam K', course_name: 'Autocad,Solidworks,Creo,Nxcad', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0044', student_name: 'Palanisamy C', course_name: 'Master Diploma', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0045', student_name: 'Sathyaseelan', course_name: 'Ecad', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0046', student_name: 'Dayanathi S', course_name: 'Revit', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0047', student_name: 'Lithin ABINAV M R', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0048', student_name: 'Alagappan V', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0049', student_name: 'Varun Kumar C', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0050', student_name: 'Harsh B', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0051', student_name: 'Niresh C', course_name: 'Master Diploma', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0052', student_name: 'Lokesh K', course_name: 'Nxcad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0053', student_name: 'Sanjay Karthikeyan M', course_name: 'C,C++,Python,Java', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0055', student_name: 'Lokendra', course_name: 'Autocad,Catia,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0056', student_name: 'Narayana Prakash', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0057', student_name: 'Franklin Blesson', course_name: 'Nxcad,Nxcam', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0058', student_name: 'Nithyanandhan', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0059', student_name: 'Subramaniya Bharathi', course_name: 'Autocad', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0060', student_name: 'Dhanabal', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0061', student_name: 'Dharun Kumar', course_name: 'Full Stack', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0062', student_name: 'Booshan Bharatvaj', course_name: 'Full Stack', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0063', student_name: 'Haripriya', course_name: 'Creo,Wiring Harness', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0064', student_name: 'Karthikeyan', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0065', student_name: 'Anadha Ganapathy', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0066', student_name: 'Nandhini', course_name: 'Data Analytics', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0067', student_name: 'Manikandan', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0069', student_name: 'Amurthavarsini', course_name: 'Ecad,PLC,Scada', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0070', student_name: 'Kumar', course_name: 'Autocad,Solidworks,Ansys', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0071', student_name: 'Subhash Chandra Bose', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0072', student_name: 'Hem Advai', course_name: 'Autocad,Solidworks,Ansys', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0073', student_name: 'Ruthresh', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0074', student_name: 'Krishna Kumar Chandran', course_name: 'Ansys', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0075', student_name: 'Syed Sharukh', course_name: 'Autocad,Revit,Sketchup', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0076', student_name: 'Jairaswanth Loganathan', course_name: 'Python', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0077', student_name: 'Sanjay Balaji', course_name: 'Python', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0079', student_name: 'Jayachandran', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0080', student_name: 'Thennavan', course_name: 'Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0081', student_name: 'Albert Enstien', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0082', student_name: 'Sethupathi', course_name: 'Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0083', student_name: 'Anish Joseph', course_name: 'Autocad,Sketchup', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0085', student_name: 'RINESH', course_name: 'Autocad', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0086', student_name: 'KAUSHIK', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0087', student_name: 'M K SREEJESH', course_name: 'Software Testing', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0088', student_name: 'V ARON', course_name: 'Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0089', student_name: 'S D MOHAN KARTHICK', course_name: 'Solidworks,ANSYS', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0090', student_name: 'R GOPINATH', course_name: 'Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0091', student_name: 'BOOBALA KRISHNAN J', course_name: 'CIVILCAD', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0092', student_name: 'SAGAYA AMBROSE S', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0093', student_name: 'Pranav A', course_name: 'Autocad', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0094', student_name: 'Rajavel', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0095', student_name: 'SANTHOSH', course_name: 'DATA ANALYTICS', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0096', student_name: 'Kishore sp', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0097', student_name: 'Dinesh kumar s', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0098', student_name: 'SIVA BALAMURUGAN P P', course_name: 'NXCAD', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0099', student_name: 'Naveen k', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0100', student_name: 'Ram prakash', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0101', student_name: 'Ashwin c', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0102', student_name: 'Nikesh S', course_name: 'Autocad,Solidworks,Creo,Catia', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0106', student_name: 'MONIKA S', course_name: 'python', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0107', student_name: 'SWATHI M', course_name: 'python', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0108', student_name: 'SHAMLI SAMPORNA S', course_name: 'python', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0109', student_name: 'SUVATHI P', course_name: 'SOFTWARE TESTING', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0114', student_name: 'MUKESH', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0115', student_name: 'PRAKASH', course_name: 'Solidworks', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0116', student_name: 'SURYA', course_name: 'Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0117', student_name: 'karthikeyan', course_name: 'Autocad,Solidworks,Creo', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0118', student_name: 'Bretto sam', course_name: 'Autocad,Solidworks,Creo,Catia', duration: '6 Months', completion_date: '', status: 'Completed' },
    { cert_id: 'TN/CBE/069/LTIEC0119', student_name: 'lavanya', course_name: 'python, java', duration: '6 Months', completion_date: '', status: 'Completed' },
];

const BLOGS = [
    {
        id: 'b1',
        title: 'Mechanical Workshop for Students at Erode Government Engineering College',
        excerpt: 'Lasak Edu conducted a hands-on Mechanical Engineering Workshop at Erode Government Engineering College, focusing on industry skills, practical exposure, and real-world applications.',
        date: 'Oct 10, 2024',
        category: 'Tech',
        image: '/img/mwerodegov.webp',
        content: `At **Lasak Edu, Coimbatore**, we strongly believe that practical exposure plays a vital role in shaping successful engineering careers. With this objective, we conducted an **interactive Mechanical Engineering Workshop** for students at **Erode Government Engineering College**.

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
Connect with **Lasak Edu** to equip students with industry-ready skills.*`
    },
    {
        id: 'b2',
        title: 'Lasak Edu Signs MoU with Bishop Appasamy College',
        excerpt: 'Lasak Edu partnered with Bishop Appasamy College to deliver industry-ready Textile CAD and Tally Prime training.',
        date: 'Nov 18, 2024',
        category: 'Announcement',
        image: '/img/bishop.webp',
        content: `At **Lasak Edu, Coimbatore**, we are thrilled to announce the official signing of a **Memorandum of Understanding (MoU)** with **Bishop Appasamy College of Arts & Science**. This collaboration marks a significant step towards **bridging academic learning with industry-relevant skills**.

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

*We sincerely thank the management and faculty of **Bishop Appasamy College** for their support and collaboration in making this partnership meaningful and impactful. Students now have access to **cutting-edge training** that will prepare them for future success.*`
    },
    {
        id: 'b3',
        title: 'IT Orientation Program at Government Arts College for Women, Dindigul',
        excerpt: 'Lasak Edu conducted an IT orientation program to help students explore career paths in software development, analytics, AI, UI/UX, cybersecurity, and cloud.',
        date: 'Oct 25, 2024',
        category: 'Education',
        image: '/img/nellakottai-clg.webp',
        content: `At **Lasak Edu, Coimbatore**, we recently conducted an **IT Orientation Program** at the **Government Arts College for Women, Dindigul**, aimed at creating awareness about career opportunities in the **Information Technology (IT) field**.

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

*We extend our gratitude to the management and faculty of the **Government Arts College for Women, Dindigul** for their support in making this program impactful and successful.*`
    },
    {
        id: 'b4',
        title: '20-Day Basic Programming Languages Workshop at Smt. D. Padmavathi Ammal High School',
        excerpt: 'Lasak Edu conducted a 20-day workshop to introduce young learners to programming fundamentals, logical thinking, and hands-on coding experience.',
        date: 'Nov 2024',
        category: 'Education',
        image: '/img/schoolfront.webp',
        content: `At **Lasak Edu, Coimbatore**, we successfully conducted a **20-day Basic Programming Languages Workshop** for students at **Smt. D. Padmavathi Ammal High School**. This initiative was designed to **introduce young learners to programming fundamentals** and spark their interest in the world of technology.

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

*We thank the faculty and management of **Smt. D. Padmavathi Ammal High School** for supporting this workshop and making it a success.*`
    },
    {
        id: 'b5',
        title: 'Lasak Edu CSR Free Skill Development Programs in Coimbatore',
        excerpt: 'Lasak Edu provides free CSR skill development programs in Coimbatore, offering practical training in CAD, Tally, Excel, and Python.',
        date: '2025-01-15',
        category: 'CSR',
        image: '/img/csr-1.webp',
        content: `At **Lasak Edu, Coimbatore**, we are dedicated to **empowering students with career-focused education and practical skills** that prepare them for the future.  

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

*We invite all students to take advantage of these programs and gain the skills necessary for a successful career.*`
    },
    {
        id: 'b6',
        title: 'IT Orientation Program at Erode Sengunthar Engineering College by Lasak Edu',
        excerpt: 'Lasak Edu conducted an IT orientation program at Erode Sengunthar Engineering College, guiding students on tech careers, emerging skills, and industry expectations.',
        date: 'Nov 2024',
        category: 'Education',
        image: '/img/erodeit.webp',
        content: `At **Lasak Edu, Coimbatore**, we recently conducted an **IT Orientation Program** for students at **Erode Sengunthar Engineering College**. The program aimed to introduce students to the **world of Information Technology**, career opportunities, and essential skills required to excel in the IT industry.

![IT Orientation Program at Erode Sengunthar Engineering College](/img/erodeit.webp)

 ---

## Program Overview

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

*We thank the management and faculty of **Erode Sengunthar Engineering College** for supporting this orientation and making it impactful.*`
    },
    {
        id: 'b7',
        title: 'One-Day Software Testing Workshop at Sri Krishna Adithya College of Arts and Science',
        excerpt: 'Lasak Edu conducted a one-day workshop on software testing, automation, QA careers, and real-world testing practices at Sri Krishna Adithya College of Arts and Science.',
        date: 'Aug 7, 2024',
        category: 'Workshop',
        image: '/img/srikrishna.webp',
        content: `On **7th August 2024**, **Lasak Edu, Coimbatore**, successfully conducted a **One-Day Software Testing Workshop** at **Sri Krishna Adithya College of Arts and Science**. The workshop focused on providing students with **hands-on exposure to modern testing methodologies and tools** used in the IT industry.

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

*We sincerely thank the management and faculty of **Sri Krishna Adithya College of Arts and Science** for their support in making this workshop impactful and successful.*`
    },
    {
        id: 'b8',
        title: 'Empowering Mechanical Engineers — LASAK Techno Institute Seminar at Hindusthan College of Engineering and Technology',
        excerpt: 'LASAK Techno Institute conducted a seminar at Hindusthan College of Engineering and Technology, guiding mechanical engineering students on future career paths, industry skills, and technological trends.',
        date: 'Aug 2024',
        category: 'Seminar',
        image: '/img/hindustan.webp',
        content: `**LASAK Techno Institute**, Coimbatore, recently conducted an inspiring seminar at **Hindusthan College of Engineering and Technology**, designed to empower aspiring **mechanical engineers** with career insights and industry knowledge. The session focused on helping students understand how engineering skills can be applied in real-world industries and how to build a strong professional future.

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

*We extend our sincere thanks to the management and faculty of **Hindusthan College of Engineering and Technology** for their support and collaboration in making this seminar impactful.*`
    },
    {
        id: 'b9',
        title: 'Career Guidance Program for Mechanical Engineers – Sengunthar College, Erode',
        excerpt: 'LASAK Techno Institute conducted a Career Guidance Program at Sengunthar College, Erode, guiding mechanical engineering students on future career paths, industry skills, and technological trends.',
        date: 'Aug 2024',
        category: 'Career Guidance',
        image: '/img/erodemech1.webp',
        content: `At **Lasak Edu, Coimbatore**, we are committed to **empowering students with career-focused education and practical skills** that prepare them for the future.  

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

*We sincerely thank the management and faculty of **Sengunthar College, Erode** for their support and collaboration in making this program meaningful and impactful.*`
    },
    {
        id: 'b10',
        title: 'Empowering Polytechnic Students with Practical Skills — LASAK Techno Institute’s Value Added Courses at Sri Ramakrishna Mission Vidyalaya',
        excerpt: 'LASAK Techno Institute conducted a seminar at Sri Ramakrishna Mission Vidyalaya Polytechnic College, guiding mechanical engineering students on future career paths, industry skills, and technological trends.',
        date: 'Aug 2024',
        category: 'Seminar',
        image: '/img/empoweringpolytechnic.webp',
        content: `At **LASAK Techno Institute** and **E-CADD Center**, we believe in **bridging the gap between academic learning and industry requirements**.  

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

*We extend our sincere thanks to the management and faculty of **Sri Ramakrishna Mission Vidyalaya Polytechnic College** for their support and collaboration in making this program impactful.*`
    },
    {
        id: 'b11',
        title: 'Hands-On Learning in SolidWorks — LASAK Techno Institute Conducts a Seminar on Weldments for KGISL Mechanical Students',
        excerpt: 'LASAK Techno Institute conducted a hands-on SolidWorks Weldments seminar at KGISL Institute of Technology, helping mechanical students gain industry-ready CAD and design skills.',
        date: 'Aug 2024',
        category: 'Seminar',
        image: '/img/kgisl-mechanical-students.webp',
        content: `At **LASAK Techno Institute and E-CADD Center, Coimbatore**, we are committed to empowering engineering students with **industry-relevant, career-focused training**. As part of our continuous academic–industry initiatives, we successfully conducted a **one-day hands-on seminar on Weldments in SolidWorks** for **Mechanical Engineering students** at **KGISL Institute of Technology**.

 ---

## Seminar Overview
![SolidWorks Weldments Seminar at KGISL](/img/kgisl-mechanical-students.webp)
The seminar was designed to introduce students to **SolidWorks Weldments**, a powerful module widely used in **mechanical design, fabrication, and manufacturing industries**. The session focused on transforming theoretical knowledge into **practical, real-world design skills**.

Students were exposed to **industry workflows** followed by professional design engineers, enabling them to understand how digital CAD models are converted into **fabricated structures** used in automotive, construction, aerospace, and heavy engineering sectors.

 ---

## Key Topics Covered
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

We sincerely thank the **management and faculty of Hindusthan College of Engineering and Technology** for their support and collaboration in making this seminar **successful and impactful**.

 ---

*Interested in conducting similar workshops or industrial training programs?  
Connect with **LASAK Techno Institute** to empower students with industry-ready skills.*`
    }
];

const COURSES = [
    { id: 'mech1', title: 'AutoCAD Mechanical', slug: 'autocad-mechanical', category: 'Mechanical', price: '5999', old_price: '9000', duration: '1 – 1.5 Months', image: '/img/Mech/Autocad.webp', description: 'Master AutoCAD Mechanical and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'mech2', title: 'SolidWorks Masterclass', slug: 'solidworks-masterclass', category: 'Mechanical', price: '14999', old_price: '25000', duration: '1.5 – 2 Months', image: '/img/Mech/Solidworks.408Z.webp', description: 'Master SolidWorks and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'mech3', title: 'Creo Parametric Course', slug: 'creo-parametric', category: 'Mechanical', price: '14999', old_price: '25000', duration: '1.5 – 2 Months', image: '/img/Mech/Creo.688Z.webp', description: 'Master Creo Parametric and accelerate your career growth with expert-led training.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'mech4', title: 'CATIA V5 Course', slug: 'catia-v5', category: 'Mechanical', price: '17999', old_price: '30000', duration: '1.5 – 3 Months', image: '/img/Mech/Catia.118Z.webp', description: 'Master CATIA V5 and accelerate your career growth.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'mech5', title: 'ANSYS Simulation Course', slug: 'ansys-simulation', category: 'Mechanical', price: '17999', old_price: '30000', duration: '2 – 3 Months', image: '/img/Mech/Ansys.670Z.webp', description: 'Master ANSYS Simulation and accelerate your career growth.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'mech6', title: 'HyperMesh Course', slug: 'hypermesh', category: 'Mechanical', price: '19999', old_price: '40000', duration: '1.5 – 3 Months', image: '/img/Mech/Hypermesh.631Z.webp', description: 'Master HyperMesh and accelerate your career growth.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'mech7', title: 'ANSA Pre-Processing Course', slug: 'ansa-pre-processing', category: 'Mechanical', price: '14999', old_price: '25000', duration: '1.5 – 3 Months', image: '/img/Mech/Ansa.062Z.webp', description: 'Master ANSA Pre-Processing and accelerate your career growth.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'it1', title: 'Full Stack Web Development', slug: 'full-stack-web-development', category: 'IT', price: '18999', old_price: '35000', duration: '3 – 4 Months', image: '/img/fullstack.webp', description: 'Master Full Stack Development and launch your web career.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'it2', title: 'Python Programming', slug: 'python-programming', category: 'IT', price: '10999', old_price: '20000', duration: '2 – 3 Months', image: '/img/python.webp', description: 'Master Python and accelerate your career growth.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'it3', title: 'Data Analytics', slug: 'data-analytics', category: 'IT', price: '14999', old_price: '28000', duration: '2 – 3 Months', image: '/img/dataanalytics.webp', description: 'Master Data Analytics and accelerate your career growth.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'civil1', title: 'AutoCAD Civil', slug: 'autocad-civil', category: 'Civil', price: '7999', old_price: '15000', duration: '1 – 2 Months', image: '/img/civil/autocadcivil.webp', description: 'Master Civil AutoCAD and drive your construction career forward.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'civil2', title: 'Revit Architecture', slug: 'revit-architecture', category: 'Civil', price: '12999', old_price: '25000', duration: '1.5 – 2 Months', image: '/img/civil/revit.webp', description: 'Master Revit Architecture for BIM-based design.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
    { id: 'arts1', title: 'Graphic Design', slug: 'graphic-design', category: 'Arts', price: '9999', old_price: '18000', duration: '1.5 – 2 Months', image: '/img/arts/graphic.webp', description: 'Master Graphic Design and build your creative career.', enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7', phone: '+91 74187 32525' },
];

const SITE_SETTINGS = {
    contact_form_settings: { url: 'https://script.google.com/macros/s/AKfycbyCXeBcecLMxEqsI895ypcAgNwa0v4obpE6lXMczvDolz3kaMRPf6aDxmTH9vEL5FzKsw/exec', title: 'Submit Your Details', departments: ['Mechanical', 'Civil', 'CSE', 'IT', 'ECE', 'Others'] },
    social_links: { instagram: 'https://www.instagram.com/lasak_techno_institute/', youtube: 'https://www.youtube.com/@lasakedutechno', facebook: 'https://www.facebook.com/lasak.techno.institute', whatsapp: 'https://wa.me/917418734466' },
    popup_settings: { enabled: true, title: 'Special Offer!', subtitle: 'Apply for Scholarship', delay_ms: 5000, features: ['Free Demo Classes', 'Internship Included', 'Scholarship Available'], button_text: 'Apply Now' },
};

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────

async function main() {
    try {
        await signIn('info@lasakedu.in', 'Lasakedu@2026');
        await seedCollection('partners', PARTNERS, r => r.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
        await seedCollection('testimonials', TESTIMONIALS, r => r.name.toLowerCase().replace(/\s+/g, '-'));
        await seedCollection('youtube_videos', YOUTUBE_VIDEOS, r => r.video_id);
        await seedCollection('contact_info', CONTACT_INFO, r => `${r.type}-${r.order_num}`);
        await seedCollection('nav_links', NAV_LINKS, r => r.label.toLowerCase().replace(/\s/g, '-'));
        await seedCollection('hero_slides', HERO_SLIDES, r => `slide-${r.order_num}`);
        await seedCollection('scholarship_rules', SCHOLARSHIP_RULES, r => r.label.toLowerCase().replace(/\s+/g, '-'));
        await seedCollection('certificates', CERTIFICATES, r => r.cert_id.replace(/\//g, '-'));
        await seedCollection('blogs', BLOGS, r => r.id);
        // await seedCollection('news', BLOGS, r => r.id); // Removed: Use dedicated news seeder instead
        await seedCollection('courses', COURSES, r => r.id);

        // Site settings
        for (const [key, value] of Object.entries(SITE_SETTINGS)) {
            await writeDoc('site_settings', key, { value });
        }
        console.log(`✅ site_settings: ${Object.keys(SITE_SETTINGS).length} documents pushed`);

        console.log('\n' + '─'.repeat(40));
        console.log('🎉 All data pushed to Firebase Firestore!');
        console.log('⚠️  Videos are NOT in Firebase — place .mp4 files in public/videos/');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Seeder failed:', err.message);
        process.exit(1);
    }
}

main();
