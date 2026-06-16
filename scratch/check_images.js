import fs from 'fs';
import path from 'path';

const dir = 'd:/april 20 lasakedu/public/img/placedstudnets';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.png')) {
    const filePath = path.join(dir, file);
    const buffer = fs.readFileSync(filePath);
    
    // Read PNG width and height from IHDR chunk (offset 16 and 20)
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    
    console.log(`${file}: Width = ${width}, Height = ${height}`);
  }
});
