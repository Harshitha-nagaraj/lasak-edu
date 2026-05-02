import fs from 'fs';
import path from 'path';

const detailsFile = path.resolve('d:/april 20 lasakedu/constants/courseDetails.ts');
const summariesFile = path.resolve('d:/april 20 lasakedu/constants/courseSummaries.ts');

let detailsContent = fs.readFileSync(detailsFile, 'utf8');
let summariesContent = fs.readFileSync(summariesFile, 'utf8');

// We will use a regex to match each course block in details
const courseRegex = /id:\s*['"]([^'"]+)['"]\s*,[\s\S]*?(?=\n\s*id:\s*['"]|\n\s*\]\s*;)/g;

let match;
const courses = [];
while ((match = courseRegex.exec(detailsContent)) !== null) {
    courses.push({
        id: match[1],
        fullMatch: match[0],
        index: match.index
    });
}

console.log(`Found ${courses.length} courses in details.`);

for (const course of courses) {
    if (course.id === 'mech1') continue; // skip already done

    let block = course.fullMatch;

    // Extract title
    const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
    if (!titleMatch) continue;
    let oldTitle = titleMatch[1];
    
    // Extract category
    const catMatch = block.match(/category:\s*['"]([^'"]+)['"]/);
    const category = catMatch ? catMatch[1] : 'IT';

    // Clean title for SEO
    let baseTitle = oldTitle.replace(/\s*Course\s*/i, '').replace(/\s*\([^)]+\)\s*/g, '').trim();
    if (baseTitle.toLowerCase().includes('training')) {
        baseTitle = baseTitle.replace(/\s*training\s*/i, '').trim();
    }
    
    const newTitle = `Best ${baseTitle} Training in Coimbatore`;
    const newSlug = `${baseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-training-coimbatore`;

    // Replace Title
    block = block.replace(titleMatch[0], `title: '${newTitle}'`);

    // Replace Slug
    const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/);
    if (slugMatch) {
        block = block.replace(slugMatch[0], `slug: "${newSlug}"`);
    } else {
        block = block.replace(titleMatch[0], `title: '${newTitle}',\n    slug: "${newSlug}"`);
    }

    // Replace Tagline
    const taglineMatch = block.match(/tagline:\s*['"]([^'"]+)['"]/);
    const newTagline = `Join the best ${baseTitle} training institute in Coimbatore. ${category} courses with placement support.`;
    if (taglineMatch) {
        block = block.replace(taglineMatch[0], `tagline: '${newTagline}'`);
    }

    // Intro
    const introMatch = block.match(/introduction:\s*(["'])([\s\S]*?)(?<!\\)\1/);
    if (introMatch) {
        let oldIntro = introMatch[2];
        if (!oldIntro.includes('Lasak Edu offers the best')) {
            const newIntro = `Lasak Edu offers the best ${baseTitle} training in Coimbatore for students and professionals. Our course includes real-time projects and placement support.\\n\\n` + oldIntro;
            block = block.replace(introMatch[0], `introduction: "${newIntro}"`);
        }
    }

    // Long Description
    const longDescMatch = block.match(/long_description:\s*(["'])([\s\S]*?)(?<!\\)\1/);
    if (longDescMatch) {
        let oldLongDesc = longDescMatch[2];
        if (!oldLongDesc.includes('Why Choose Our')) {
            let newLongDesc = `## Why Choose Our ${baseTitle} Training in Coimbatore\\n\\nOur institute focuses on providing practical, industry-oriented training that guarantees you are job-ready. From learning the absolute basics to mastering advanced concepts, our course ensures a solid foundation.\\n\\n## Course Details – ${baseTitle} Training\\n\\nThis robust course walks you through the core concepts and industry standard workflows. You will work on real-time projects mimicking actual industry workflows.\\n\\n## Placement Support for Students\\n\\nWe provide 100% placement support for our students. Our network with core companies guarantees excellent career start opportunities.\\n\\n` + oldLongDesc;
            
            if (!newLongDesc.includes(`/courses/${category}`)) {
                newLongDesc += `\\n\\n[Explore more ${category} Courses](/courses/${category})`;
            }
            block = block.replace(longDescMatch[0], `long_description: "${newLongDesc}"`);
        }
    }

    // SEO
    const seoMatch = block.match(/seo:\s*\{[\s\S]*?\}/);
    const newSeo = `seo: {
      title: "${baseTitle} Training in Coimbatore | ${category} Courses | Lasak Edu",
      description: "Join the best ${baseTitle} training institute in Coimbatore. ${category} courses with placement support. Enroll today at Lasak Edu.",
      keywords: "${baseTitle} Training in Coimbatore, ${category} Courses, ${baseTitle} training institute in Coimbatore, Lasak Edu",
      alt_text: "${baseTitle} training class in Coimbatore"
    }`;
    if (seoMatch) {
        block = block.replace(seoMatch[0], newSeo);
    } else {
        // Find a good place to insert seo, e.g. after faqs
        const faqsMatch = block.match(/faqs:\s*\[[\s\S]*?\]\s*,/);
        if (faqsMatch) {
            block = block.replace(faqsMatch[0], faqsMatch[0] + '\n    ' + newSeo + ',');
        } else {
            // just append at the end before the last bracket
            block = block.replace(/\s*$/, ',\n    ' + newSeo);
        }
    }

    detailsContent = detailsContent.replace(course.fullMatch, block);

    // Also update summaries
    const sumRegex = new RegExp(`id:\\s*['"]${course.id}['"]\\s*,[\\s\\S]*?(?=\\n\\s*id:\\s*['"]|\\n\\s*\\]\\s*;)`);
    const sumMatch = sumRegex.exec(summariesContent);
    if (sumMatch) {
        let sBlock = sumMatch[0];
        
        const sTitleMatch = sBlock.match(/title:\s*['"]([^'"]+)['"]/);
        if (sTitleMatch) sBlock = sBlock.replace(sTitleMatch[0], `title: '${newTitle}'`);

        const sSlugMatch = sBlock.match(/slug:\s*['"]([^'"]+)['"]/);
        if (sSlugMatch) {
            sBlock = sBlock.replace(sSlugMatch[0], `slug: '${newSlug}'`);
        } else {
             sBlock = sBlock.replace(sTitleMatch[0], `title: '${newTitle}',\n    slug: '${newSlug}'`);
        }
        
        summariesContent = summariesContent.replace(sumMatch[0], sBlock);
    }
}

fs.writeFileSync(detailsFile, detailsContent);
fs.writeFileSync(summariesFile, summariesContent);
console.log('Done updating details and summaries.');
