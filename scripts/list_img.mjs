
import fs from 'fs';
import path from 'path';

function listFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            listFiles(fullPath);
        } else {
            console.log(fullPath.replace(/\\/g, '/').split('public/img/')[1]);
        }
    }
}

listFiles('public/img');
