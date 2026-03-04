/**
 * Seed "Full Stack with Python" course into Firestore
 * Run: node scripts/seed-python-course.mjs
 */

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
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

const API_KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

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

function toFirestoreValue(val) {
    if (typeof val === 'string') return { stringValue: val };
    if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (val instanceof Date) return { timestampValue: val.toISOString() };
    if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
    if (typeof val === 'object' && val !== null) {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { nullValue: null };
}

async function seedCourse() {
    try {
        await signIn('info@lasakedu.in', 'Admin@123');

        const courseId = 'it9';
        const courseData = {
            title: 'Full Stack Development with Python \u2013 Django & Flask',
            category: 'IT',
            price: '\u20B929,999',
            old_price: '\u20B955,000',
            duration: '4 \u2013 6 Months',
            description: 'Master Full Stack Web Development using Python, Django, Flask, REST APIs, PostgreSQL, and modern deployment tools.',
            image: '/img/it/python-267z.webp',
            enroll_link: 'https://forms.gle/6sVSvE1schYRYfse7',
            phone: '+91 74187 32525',
            tagline: 'Full Stack Development with Python \u2013 Build Powerful Web Applications with Django & Flask',
            introduction: "Our Full Stack Python Development Course is designed to make you a complete web developer using the Python ecosystem. Python is the most popular programming language in the world, and this course teaches you how to build full-stack web applications from scratch using Python, Django, and Flask.\n\nYou will learn everything from front-end development (HTML, CSS, JavaScript) to back-end development with Django and Flask frameworks, REST API development, database management with PostgreSQL and SQLite, authentication, and cloud deployment.\n\nThis course is 100% practical and project-based, ensuring you gain hands-on experience building real-world applications.",
            long_description: "By the end of the course, you will be able to build complete, production-ready web applications using Python independently. Full Stack Python developers are among the most in-demand professionals in the tech industry.\n\n**Average Salary in India:**\n\u2022 Freshers: \u20B93.5 \u2013 \u20B97 LPA\n\u2022 Experienced: \u20B910 \u2013 \u20B920 LPA+\n\n**Career Paths:**\n\u2022 Full Stack Python Developer\n\u2022 Django Developer\n\u2022 Flask Developer\n\u2022 Backend Developer (Python)\n\u2022 API Developer\n\u2022 DevOps Engineer",
            modules: [
                "Python Core \u2013 Variables, Data Structures, OOP, File Handling, Exception Handling",
                "Frontend Development \u2013 HTML5, CSS3, JavaScript (ES6+), Bootstrap, Responsive Design",
                "Django Framework \u2013 MVT Architecture, Models, Views, Templates, Django ORM, Admin Panel",
                "Flask Framework \u2013 Routing, Jinja2 Templates, Flask-RESTful, Blueprints",
                "REST API Development \u2013 Django REST Framework (DRF), Serializers, ViewSets, Postman Testing",
                "Database Management \u2013 PostgreSQL, SQLite, MySQL, Database Design & Migrations",
                "Authentication \u2013 User Login/Signup, JWT Tokens, OAuth, Session Management",
                "Deployment \u2013 Docker Basics, Heroku, AWS EC2, Railway, CI/CD Pipelines",
                "Real-Time Projects \u2013 E-commerce Platform, Blog CMS, Task Management App, REST API Backend"
            ],
            tools: ["VS Code", "PyCharm", "Git", "GitHub", "Postman", "Docker", "PostgreSQL", "pgAdmin", "Django Admin", "Heroku", "AWS", "Jupyter Notebook"],
            skills_gained: [
                "Python Programming (Core & Advanced)",
                "Front-End Development (HTML5, CSS3, JavaScript, Bootstrap)",
                "Django Framework \u2013 Models, Views, Templates, ORM",
                "Flask Framework \u2013 Lightweight API Development",
                "REST API Development & Integration",
                "Database Management (PostgreSQL, SQLite, MySQL)",
                "Authentication & Authorization (JWT, Session-based)",
                "Version Control with Git & GitHub",
                "Cloud Deployment (AWS, Heroku, Railway)",
                "Testing & Debugging"
            ],
            eligibility: [
                "B.E / B.Tech / BCA / MCA Students",
                "Degree Students (Any Stream)",
                "Working Professionals",
                "Career Switchers",
                "Freshers & Job Seekers",
                "Beginners (No Prior Coding Knowledge Required)"
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
                { question: "Is this course beginner-friendly?", answer: "Yes. We start from Python basics and move step-by-step to advanced full stack concepts. No prior coding knowledge is required." },
                { question: "What is the difference between this and the MERN Stack course?", answer: "This course uses Python (Django/Flask) for backend instead of Node.js. Python is easier to learn and is widely used in data science, AI, and web development." },
                { question: "Will I build real projects?", answer: "Yes. You will build multiple full stack projects including an e-commerce platform, blog CMS, and REST API backend." },
                { question: "Do you provide placement support?", answer: "Yes. We provide resume building, mock interviews, portfolio development, and placement assistance." },
                { question: "Which framework is better \u2013 Django or Flask?", answer: "Both are excellent. Django is great for large applications with built-in features. Flask is lightweight and ideal for APIs and microservices. We teach both." },
                { question: "Will I get certification?", answer: "Yes. You will receive a Full Stack Python Development certification after course completion." }
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
        };

        const docFields = {};
        for (const [k, v] of Object.entries(courseData)) {
            docFields[k] = toFirestoreValue(v);
        }

        const url = `${BASE_URL}/courses/${courseId}?key=${API_KEY}`;
        const headers = { 'Content-Type': 'application/json' };
        if (ID_TOKEN) headers['Authorization'] = `Bearer ${ID_TOKEN}`;

        const res = await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ fields: docFields })
        });

        if (res.ok) {
            console.log(`\n✅ Course seeded successfully: ${courseData.title} (ID: ${courseId})`);
            console.log('You can now see and edit it in the admin panel at /admin/courses');
        } else {
            const error = await res.json();
            console.error(`\n❌ Failed to seed course:`, JSON.stringify(error, null, 2));
        }

    } catch (err) {
        console.error('\n❌ Error:', err.message);
    }
}

seedCourse();
