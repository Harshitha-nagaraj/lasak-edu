import fs from 'fs';

// Map of new title -> original title (from git diff)
const titleMap = {
  "Best AutoCAD Training in Coimbatore": "AutoCAD Mechanical",
  "Best SolidWorks Masterclass Training in Coimbatore": "SolidWorks Masterclass",
  "Best Creo Parametric Training in Coimbatore": "Creo Parametric Course",
  "Best CATIA V5 Training in Coimbatore": "CATIA V5 Course (Mechanical Engineering)",
  "Best ANSYS Simulation Training in Coimbatore": "ANSYS Simulation Course (Mechanical Engineering)",
  "Best HyperMesh Training in Coimbatore": "HyperMesh Course (Mechanical Engineering)",
  "Best ANSA Pre-Processing Training in Coimbatore": "ANSA Pre-Processing Course (Mechanical Engineering)",
  "Best Computational Fluid Dynamics Training in Coimbatore": "Computational Fluid Dynamics (CFD)",
  "Best NX CAD Training in Coimbatore": "NX CAD (Unigraphics) Course (Mechanical Engineering)",
  "Best Autodesk Inventor Training in Coimbatore": "Autodesk Inventor Course (Mechanical Engineering)",
  "Best Wiring Harness Design Training in Coimbatore": "Wiring Harness Design Course",
  "Best 3D Printing & Prototyping Training in Coimbatore": "3D Printing & Prototyping",
  "Best Full Stack Development\u2013 Build Complete Web Applications Training in Coimbatore": "Full Stack Development Course \u2013 Build Complete Web Applications",
  "Best Web Development\u2013 Become a Full Stack Developer Training in Coimbatore": "Web Development Course \u2013 Become a Full Stack Developer",
  "Best Software Testing\u2013 Become a QA Expert Training in Coimbatore": "Software Testing Course \u2013 Become a QA Expert",
  "Best Data Analytics\u2013 Turn Data into Powerful Insights Training in Coimbatore": "Data Analytics Course \u2013 Turn Data into Powerful Insights",
  "Best Java Programming| Beginner to Advanced Training in Coimbatore": "Java Programming Course | Beginner to Advanced Training",
  "Best Python Programming | Beginner to Advanced Training in Coimbatore": "Python Programming | Beginner to Advanced Training",
  "Best Digital Marketing| Master Digital Marketing Excellence Training in Coimbatore": "Digital Marketing (Adv) | Master Digital Marketing Excellence",
  "Best UI/UX Design\u2013 Master Digital Product Design Training in Coimbatore": "UI/UX Design Course \u2013 Master Digital Product Design",
  "Best Civil CAD Training in Coimbatore": "Civil CAD",
  "Best Revit Architecture Training in Coimbatore": "Revit Architecture",
  "Best SketchUp for Civil Engineering Training in Coimbatore": "SketchUp for Civil Engineering",
  "Best STAAD.Pro Training in Coimbatore": "STAAD.Pro",
  "Best BIM Professional Training in Coimbatore": "BIM Professional",
  "Best Graphic Design Training in Coimbatore": "Graphic Design",
  "Best Video Editing Training in Coimbatore": "Video Editing",
  "Best Digital Marketing Training in Coimbatore": "Digital Marketing (Media)",
  "Best MS Office Training in Coimbatore": "MS Office",
  "Best Tally with GST Training in Coimbatore": "Tally with GST",
  "Best Robotics for Kids Training in Coimbatore": "Robotics for Kids",
  "Best Scratch Coding Training in Coimbatore": "Scratch Coding",
};

// Fix courseDetails.ts
const detailsFile = 'd:/april 20 lasakedu/constants/courseDetails.ts';
let content = fs.readFileSync(detailsFile, 'utf8');

for (const [newTitle, origTitle] of Object.entries(titleMap)) {
  // Replace only the display title line (title: 'Best X Training in Coimbatore')
  // But NOT seo title lines which use double quotes and different format
  const escaped = newTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`title: '${escaped}'`, 'g');
  content = content.replace(regex, `title: '${origTitle}'`);
}

fs.writeFileSync(detailsFile, content);
console.log('✅ courseDetails.ts titles restored.');

// Fix courseSummaries.ts
const summariesFile = 'd:/april 20 lasakedu/constants/courseSummaries.ts';
let sumContent = fs.readFileSync(summariesFile, 'utf8');

for (const [newTitle, origTitle] of Object.entries(titleMap)) {
  const escaped = newTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`title: '${escaped}'`, 'g');
  sumContent = sumContent.replace(regex, `title: '${origTitle}'`);
}

fs.writeFileSync(summariesFile, sumContent);
console.log('✅ courseSummaries.ts titles restored.');
