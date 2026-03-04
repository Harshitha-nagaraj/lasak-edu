import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const SERVICE_ACCOUNT_PATH = resolve(process.cwd(), 'service-account.json');

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('Error: service-account.json not found!');
    process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const newBlogs = [
    {
        title: "New Data Analytics Course with AI – Launching with a Special Offer!",
        excerpt: "LasakEdu is excited to announce our cutting-edge Data Analytics course powered by AI tools! Enroll now and take advantage of our limited-time introductory offer. Learn data visualization, machine learning basics, and AI-driven analytics from industry experts.",
        content: "LasakEdu is excited to announce our cutting-edge Data Analytics course powered by AI tools! Enroll now and take advantage of our limited-time introductory offer. Learn data visualization, machine learning basics, and AI-driven analytics from industry experts.",
        date: "Mar 3, 2026",
        category: "New Course",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "Workshops Now Available Online – Learn From Anywhere!",
        excerpt: "Great news for our students across India! LasakEdu's popular workshops are now available in an online format. Join live interactive sessions, get mentorship, and receive your certification — all from the comfort of your home.",
        content: "Great news for our students across India! LasakEdu's popular workshops are now available in an online format. Join live interactive sessions, get mentorship, and receive your certification — all from the comfort of your home.",
        date: "Mar 3, 2026",
        category: "Workshops",
        image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&auto=format&fit=crop&q=60",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    }
];

async function addNews() {
    console.log('Adding news blogs to Firestore...');
    for (const blog of newBlogs) {
        const id = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 60);
        await db.collection('blogs').doc(id).set(blog, { merge: true });
        console.log(`✅ Added: ${blog.title}`);
    }
    console.log('Done!');
}

addNews().catch(console.error);
