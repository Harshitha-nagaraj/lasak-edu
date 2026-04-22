import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// This script will run loaded with env vars to update category names
const envConfig = dotenv.parse(readFileSync('.env.local'));

const firebaseConfig = {
  apiKey: envConfig.VITE_FIREBASE_API_KEY,
  authDomain: envConfig.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envConfig.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envConfig.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envConfig.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envConfig.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateCategories() {
  const updates = [
    { id: 'Mechanical', name: 'MECH', order_num: 1 },
    { id: 'Civil', name: 'CIVIL', order_num: 2 },
    { id: 'IT', name: 'IT', order_num: 3 },
    { id: 'Arts', name: 'ARTS', order_num: 4 },
    { id: 'Kids', name: 'KIDS', order_num: 5 },
  ];

  console.log("Starting category updates...");
  for (const cat of updates) {
    try {
      const catRef = doc(db, 'categories', cat.id);
      await updateDoc(catRef, { name: cat.name, order_num: cat.order_num });
      console.log(`Successfully updated ${cat.id} to name: ${cat.name}, order: ${cat.order_num}`);
    } catch (error) {
      console.error(`Failed to update ${cat.id}:`, error);
    }
  }
  process.exit(0);
}

updateCategories();
