import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Import data from constants.tsx
// Note: tsx will handle the TS/JSX in constants.tsx
import {
    COURSES,
    BLOGS,
    TESTIMONIALS,
    PARTNERS,
    ACCREDITATIONS,
    CATEGORIES,
    COMPANY_LOGOS,
    CERTIFICATES
} from '../constants.tsx';

/**
 * 
 * DATA MIGRATION SCRIPT
 * 
 * This script transfers all static data from constants.tsx to Firestore.
 * 
 * Requirements:
 * 1. Generate a service-account.json from Firebase Console -> Project Settings -> Service Accounts.
 * 2. Place it in the project root.
 * 3. Run: npm run migrate
 */

const SERVICE_ACCOUNT_PATH = resolve(process.cwd(), 'service-account.json');

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: service-account.json not found!');
    console.log('Please download it from Firebase Console -> Project Settings -> Service Accounts');
    process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
    console.log('\x1b[36m%s\x1b[0m', '🚀 Starting Migration to Firestore...');

    try {
        // 1. Courses
        console.log('--- Migrating Courses ---');
        for (const course of COURSES) {
            const id = course.slug || course.id || course.title.toLowerCase().replace(/\s+/g, '-');
            await db.collection('courses').doc(id).set({
                ...course,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // 2. Blogs
        console.log('--- Migrating Blogs ---');
        for (const blog of BLOGS) {
            const id = blog.title.toLowerCase().replace(/\s+/g, '-');
            await db.collection('blogs').doc(id).set({
                ...blog,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // 3. Testimonials
        console.log('--- Migrating Testimonials ---');
        for (const t of TESTIMONIALS) {
            const id = t.name.toLowerCase().replace(/\s+/g, '-');
            await db.collection('testimonials').doc(id).set({
                name: t.name,
                role: `${t.role} @ ${t.company}`,
                content: t.quote,
                image: t.image,
                rating: 5,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // 4. Partners & Accreditations
        console.log('--- Migrating Partners ---');
        for (const p of PARTNERS) {
            const id = p.alt.toLowerCase().replace(/\s+/g, '-');
            await db.collection('partners').doc(id).set({
                name: p.alt,
                logo: p.src,
                type: 'training',
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        for (const p of ACCREDITATIONS) {
            const id = p.alt.toLowerCase().replace(/\s+/g, '-');
            await db.collection('accreditations').doc(id).set({
                alt: p.alt,
                src: p.src,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // 5. Hero Slides (Manual mapping as they are usually in Home.tsx but we've placed them in constants/Setup logic)
        console.log('--- Migrating Categories ---');
        for (const cat of CATEGORIES) {
            await db.collection('categories').doc(cat.id).set({
                id: cat.id,
                name: cat.name,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // 6. Certificates
        console.log('--- Migrating Certificates ---');
        for (const c of CERTIFICATES) {
            const id = c.certId.replace(/\s+/g, '-').replace(/\//g, '-');
            await db.collection('certificates').doc(id).set({
                cert_id: c.certId,
                student_name: c.studentName,
                course_name: c.courseName,
                duration: c.duration,
                status: c.status,
                completion_date: c.completionDate || new Date().toISOString().split('T')[0],
                created_at: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        console.log('\x1b[32m%s\x1b[0m', '✅ Migration Successful!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Migration Failed:', error);
    }
}

migrate();
