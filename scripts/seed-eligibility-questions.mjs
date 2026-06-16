import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

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
    env[key] = val.replace(/['"]/g, '').trim(); // strip quotes
}

const API_KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

if (!API_KEY || !PROJECT_ID) {
    console.error('❌ Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in .env.local');
    process.exit(1);
}

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

const IT_QUESTIONS = [
  { question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Processing Unit", "Control Processing Unit"], correct: 1 },
  { question: "Which data structure follows the LIFO principle?", options: ["Queue", "Array", "Stack", "Linked List"], correct: 2 },
  { question: "Which language is primarily used for Android app development?", options: ["Python", "Java", "PHP", "C"], correct: 1 },
  { question: "Which SQL command is used to retrieve data?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], correct: 2 },
  { question: "Which of the following is an operating system?", options: ["MySQL", "Oracle", "Windows", "HTML"], correct: 2 },
  { question: "What is the full form of RAM?", options: ["Random Access Memory", "Read Access Memory", "Run Access Memory", "Rapid Access Memory"], correct: 0 },
  { question: "Which protocol is used to transfer web pages?", options: ["FTP", "HTTP", "SMTP", "TCP"], correct: 1 },
  { question: "Which of the following is NOT a programming language?", options: ["Python", "Java", "HTML", "C++"], correct: 2 },
  { question: "What is the default port number of HTTP?", options: ["21", "25", "80", "443"], correct: 2 },
  { question: "Which database is a Relational Database Management System (RDBMS)?", options: ["MongoDB", "MySQL", "Redis", "Cassandra"], correct: 1 },
  { question: "What does OOP stand for?", options: ["Object Oriented Programming", "Object Organized Program", "Online Oriented Programming", "Open Object Programming"], correct: 0 },
  { question: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Linear Search"], correct: 2 },
  { question: "Which symbol is used for single-line comments in Java?", options: ["#", "<!-- -->", "//", "**"], correct: 2 },
  { question: "Which network topology uses a central hub?", options: ["Ring", "Bus", "Star", "Mesh"], correct: 2 },
  { question: "What does URL stand for?", options: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Retrieval Locator", "Universal Retrieval Link"], correct: 0 },
  { question: "Which of the following is a cloud computing platform?", options: ["AWS", "Excel", "Notepad", "Photoshop"], correct: 0 },
  { question: "What is the primary key in a database?", options: ["Duplicate value field", "Unique identifier for records", "Foreign key field", "Null value field"], correct: 1 },
  { question: "Which data type is used to store decimal values in Java?", options: ["int", "char", "float", "boolean"], correct: 2 },
  { question: "Which cybersecurity attack attempts to steal information through fake emails?", options: ["DDoS", "SQL Injection", "Phishing", "Malware"], correct: 2 },
  { question: "What does AI stand for?", options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Intelligence", "Automatic Information"], correct: 1 }
];

const MECH_QUESTIONS = [
  { question: "What is the unit of stress in the SI system?", options: ["Newton (N)", "Pascal (Pa)", "Joule (J)", "Watt (W)"], correct: 1 },
  { question: "Hooke's Law is valid up to which limit?", options: ["Yield point", "Elastic limit", "Proportional limit", "Ultimate stress point"], correct: 2 },
  { question: "Which material property allows it to be drawn into thin wires?", options: ["Brittleness", "Malleability", "Ductility", "Hardness"], correct: 2 },
  { question: "A beam supported at both ends is called a:", options: ["Cantilever beam", "Simply supported beam", "Fixed beam", "Overhanging beam"], correct: 1 },
  { question: "What type of stress does a shaft experience when transmitting torque?", options: ["Tensile stress", "Compressive stress", "Torsional shear stress", "Bending stress"], correct: 2 },
  { question: "Which law of thermodynamics defines the concept of temperature?", options: ["Zeroth Law", "First Law", "Second Law", "Third Law"], correct: 0 },
  { question: "The First Law of Thermodynamics is a statement of:", options: ["Conservation of mass", "Conservation of momentum", "Conservation of energy", "Conservation of heat"], correct: 2 },
  { question: "Which thermodynamic cycle is considered the most efficient ideal cycle?", options: ["Otto cycle", "Diesel cycle", "Carnot cycle", "Rankine cycle"], correct: 2 },
  { question: "Heat transfer by actual movement of fluid molecules is known as:", options: ["Conduction", "Convection", "Radiation", "Insulation"], correct: 1 },
  { question: "What is the main working fluid in a steam power plant operating on the Rankine cycle?", options: ["Air", "Helium", "Water", "Carbon dioxide"], correct: 2 },
  { question: "What is the reciprocal of density called?", options: ["Specific weight", "Specific gravity", "Specific volume", "Viscosity"], correct: 2 },
  { question: "Bernoulli's equation is based on the conservation of:", options: ["Mass", "Momentum", "Energy", "Angular momentum"], correct: 2 },
  { question: "A fluid that has zero viscosity and is incompressible is called:", options: ["Real fluid", "Ideal fluid", "Newtonian fluid", "Non-Newtonian fluid"], correct: 1 },
  { question: "What device is used to measure the flow rate of a fluid in a pipe?", options: ["Pressure gauge", "Venturimeter", "Thermometer", "Anemometer"], correct: 1 },
  { question: "Which manufacturing process involves pouring molten metal into a mold cavity?", options: ["Forging", "Casting", "Welding", "Extrusion"], correct: 1 },
  { question: "Gears are primarily used to transmit:", options: ["Heat", "Power and motion", "Fluid pressure", "Electrical signals"], correct: 1 },
  { question: "Which bearing is designed to carry loads parallel to the shaft axis?", options: ["Radial bearing", "Thrust bearing", "Journal bearing", "Bush bearing"], correct: 1 },
  { question: "CNC stands for:", options: ["Computer Network Control", "Computerized Numerical Control", "Central Numerical Computation", "Control Network Computer"], correct: 1 },
  { question: "Brass is an alloy of which two metals?", options: ["Copper and Tin", "Copper and Zinc", "Iron and Carbon", "Aluminum and Copper"], correct: 1 },
  { question: "In a 4-stroke petrol engine, the standard sequence of strokes is:", options: ["Compression, Intake, Power, Exhaust", "Intake, Compression, Power, Exhaust", "Intake, Power, Compression, Exhaust", "Power, Intake, Compression, Exhaust"], correct: 1 }
];

const CIVIL_QUESTIONS = [
  { question: "What is the unit of force in the SI system?", options: ["Pascal (Pa)", "Joule (J)", "Newton (N)", "Watt (W)"], correct: 2 },
  { question: "A beam that is fixed at one end and free at the other end is called a:", options: ["Simply supported beam", "Cantilever beam", "Overhanging beam", "Continuous beam"], correct: 1 },
  { question: "The ratio of change in dimension to the original dimension is called:", options: ["Stress", "Strain", "Young's Modulus", "Poisson's Ratio"], correct: 1 },
  { question: "Bending moment in a beam is maximum where the shear force is:", options: ["Maximum", "Minimum", "Zero or changes sign", "Constant"], correct: 2 },
  { question: "What is the main binding material in conventional concrete?", options: ["Sand", "Cement", "Gravel", "Water"], correct: 1 },
  { question: "The process of keeping concrete moist for a certain period after casting is called:", options: ["Compaction", "Curing", "Bleeding", "Segregation"], correct: 1 },
  { question: "Which test is commonly used to measure the workability of fresh concrete?", options: ["Slump test", "Compressive strength test", "Tensile strength test", "Soundness test"], correct: 0 },
  { question: "Concrete is very strong in compression but weak in:", options: ["Crushing", "Tension", "Shear", "Bearing"], correct: 1 },
  { question: "What is added to concrete to increase its tensile strength?", options: ["More sand", "Steel reinforcement bars (Rebar)", "Lime", "Fly ash"], correct: 1 },
  { question: "The resistance of a fluid to flow is called:", options: ["Surface tension", "Viscosity", "Buoyancy", "Capillarity"], correct: 1 },
  { question: "An ideal fluid is one which is:", options: ["Viscous and compressible", "Non-viscous and incompressible", "Viscous and incompressible", "Non-viscous and compressible"], correct: 1 },
  { question: "Atmospheric pressure at sea level is approximately:", options: ["10.13 kPa", "101.3 kPa", "1013 kPa", "1.013 kPa"], correct: 1 },
  { question: "The fundamental principle of surveying is to work from:", options: ["Part to whole", "Whole to part", "Lower to higher level", "Center to boundary"], correct: 1 },
  { question: "An instrument used for measuring horizontal and vertical angles precisely is a:", options: ["Levelling staff", "Theodolite", "Tape measure", "Odometer"], correct: 1 },
  { question: "Lines joining points of equal elevation on a map are called:", options: ["Isobars", "Contour lines", "Isotherms", "Meridian lines"], correct: 1 },
  { question: "Which of the following soil types has the smallest grain size?", options: ["Gravel", "Sand", "Silt", "Clay"], correct: 3 },
  { question: "The lowermost structural component of a building that transfers loads to the soil is the:", options: ["Column", "Slab", "Foundation", "Beam"], correct: 2 },
  { question: "Black cotton soil is notorious for its property of:", options: ["High permeability", "Swelling and shrinkage", "High bearing capacity", "Easy compaction"], correct: 1 },
  { question: "What is the standard cross-slope provided to highway pavements to drain off rainwater called?", options: ["Camber", "Super-elevation", "Gradient", "Curve"], correct: 0 },
  { question: "The separation of water or laitance from freshly mixed concrete to the surface is known as:", options: ["Segregation", "Bleeding", "Creep", "Shrinkage"], correct: 1 }
];

const data = {
  questions: {
    'Data Analytics': IT_QUESTIONS,
    'Python Full Stack': IT_QUESTIONS,
    'Java Full Stack': IT_QUESTIONS,
    'Digital Marketing': IT_QUESTIONS,
    'Software Testing': IT_QUESTIONS,
    'Mech Combo': MECH_QUESTIONS,
    'Civil Combo': CIVIL_QUESTIONS,
  },
  updatedAt: new Date().toISOString()
};

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
    console.log(`✅ Success writing ${collectionName}/${docId}`);
}

async function run() {
  const passwords = ['Lasakedu@2024', 'Lasakedu@2026', 'Admin@123', 'Lasakedu@2025'];
  const emails = ['info@lasakedu.in', 'brindhaa.lasak@gmail.com'];
  
  let success = false;
  for (const email of emails) {
    for (const password of passwords) {
      try {
        console.log(`Attempting sign-in for ${email} with ${password}...`);
        await signIn(email, password);
        success = true;
        break;
      } catch (e) {
        console.log(`❌ Auth failed for ${email} with ${password}`);
      }
    }
    if (success) break;
  }

  if (!success) {
    console.error('❌ Could not authenticate with any credential combination.');
    process.exit(1);
  }

  try {
    await writeDoc('eligibilityConfig', 'questions', data);
    console.log('🎉 Successfully seeded questions config in Firestore!');
  } catch (err) {
    console.error('❌ Error seeding questions config:', err);
    process.exit(1);
  }
}

run();
