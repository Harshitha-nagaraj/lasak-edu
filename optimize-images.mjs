import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const MAX_SIZE = 200 * 1024; // 200KB
const DIRS_TO_CHECK = ['public']; // public directory contains most static images

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stat.isFile() && /\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
      if (stat.size > MAX_SIZE) {
        console.log(`Optimizing ${fullPath} (${(stat.size / 1024).toFixed(2)} KB)`);
        const tempPath = fullPath + '.tmp.webp';
        try {
          await sharp(fullPath)
            .resize({ width: 1200, withoutEnlargement: true }) // resize large images
            .webp({ quality: 75 })
            .toFile(tempPath);
          fs.unlinkSync(fullPath); // Remove original
          // If original was not webp, we might need to keep the original extension or change it.
          // Since the user wants to reduce size, replacing with webp and same extension or just webp.
          // Let's just rename temp to original name, but sharp writes webp format. Browsers handle webp even with .jpg extension usually, but better to keep format or just optimize.
          // Let's optimize in same format to avoid breaking references:
          const ext = path.extname(fullPath).toLowerCase();
          const sharpInstance = sharp(tempPath);
          if (ext === '.png') {
              await sharp(tempPath).png({ quality: 75, compressionLevel: 9 }).toFile(fullPath);
          } else if (ext === '.jpg' || ext === '.jpeg') {
              await sharp(tempPath).jpeg({ quality: 75 }).toFile(fullPath);
          } else {
              fs.renameSync(tempPath, fullPath);
          }
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          
          const newStat = fs.statSync(fullPath);
          console.log(` -> Reduced to ${(newStat.size / 1024).toFixed(2)} KB`);
        } catch (e) {
          console.error(`Failed to process ${fullPath}`, e);
        }
      }
    }
  }
}

processDirectory('public').then(() => console.log('Done optimizing images.'));
