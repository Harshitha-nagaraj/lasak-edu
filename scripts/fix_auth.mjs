// Fix Skillryt LMS Portal -> Lasak LMS Portal
// Authenticates via Firebase email/password, then updates Firestore

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBIRTItwMrmr6atNujz4haGcl09b_0pKEg",
  authDomain: "lasak-edu.firebaseapp.com",
  projectId: "lasak-edu",
  storageBucket: "lasak-edu.firebasestorage.app",
  messagingSenderId: "158800350071",
  appId: "1:158800350071:web:4c5b25e99de7094f522f72",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get admin credentials from command line args
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node fix_auth.mjs <admin-email> <admin-password>');
  process.exit(1);
}

async function fixSkillrytTitle() {
  console.log(`Signing in as ${email}...`);
  await signInWithEmailAndPassword(auth, email, password);
  console.log('✅ Signed in successfully!');
  
  console.log('\nFetching learning_ecosystem collection...');
  const snapshot = await getDocs(collection(db, 'learning_ecosystem'));
  
  console.log(`Found ${snapshot.docs.length} document(s).\n`);
  
  let fixed = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    console.log(`  Doc ID: ${docSnap.id} | Title: "${data.title}"`);
    
    if (data.title && data.title.toLowerCase().includes('skillryt')) {
      const newTitle = data.title.replace(/skillryt/gi, 'Lasak');
      console.log(`  → FIXING to: "${newTitle}"`);
      await updateDoc(doc(db, 'learning_ecosystem', docSnap.id), { title: newTitle });
      console.log(`  ✅ Updated!`);
      fixed++;
    }
  }
  
  if (fixed === 0) {
    console.log('\n⚠️  No documents with "Skillryt" in title found!');
    console.log('All current titles:');
    snapshot.docs.forEach(d => console.log(`  - "${d.data().title}"`));
  } else {
    console.log(`\n✅ Fixed ${fixed} document(s) in Firestore!`);
  }
  
  process.exit(0);
}

fixSkillrytTitle().catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
