import { initializeApp } from 'firebase/app';
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
const db = getFirestore(app);

async function fixSkillrytTitle() {
  console.log('Fetching learning_ecosystem collection from Firestore...');
  const snapshot = await getDocs(collection(db, 'learning_ecosystem'));
  
  console.log(`Found ${snapshot.docs.length} document(s).`);
  
  let fixed = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    console.log(`  - Doc ID: ${docSnap.id} | Title: "${data.title}"`);
    
    if (data.title && data.title.toLowerCase().includes('skillryt')) {
      const newTitle = data.title.replace(/skillryt/gi, 'Lasak');
      console.log(`  ✅ FIXING: "${data.title}" → "${newTitle}"`);
      await updateDoc(doc(db, 'learning_ecosystem', docSnap.id), {
        title: newTitle
      });
      fixed++;
    }
  }
  
  if (fixed === 0) {
    console.log('\n⚠️  No documents with "Skillryt" found in title. The database may already be correct.');
    console.log('The issue might be browser caching on the live site.');
  } else {
    console.log(`\n✅ Fixed ${fixed} document(s) in Firestore!`);
  }
  
  process.exit(0);
}

fixSkillrytTitle().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
