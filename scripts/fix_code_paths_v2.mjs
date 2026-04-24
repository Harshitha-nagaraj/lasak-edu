
import fs from 'fs';
import path from 'path';

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const imgRegex = /\/img\/[a-zA-Z0-9.\/_\-\s% ]+\.(webp|png|jpg|jpeg|svg|mp4)/g;

function fixFile(filePath) {
    if (filePath.includes('node_modules') || filePath.includes('dist') || filePath.includes('.git') || filePath.endsWith('.json')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    content = content.replace(imgRegex, (match) => {
        // match might be "/img/Arts/Digital-marketing-840Z.webp"
        const parts = match.split('/'); // ["", "img", "Arts", "Digital-marketing-840Z.webp"]
        const ext = path.extname(match);

        // Normalize each part except "" and "img"
        const newParts = parts.map((p, i) => {
            if (i < 2) return p;
            if (p.includes('.')) {
                // It's the filename
                const base = p.slice(0, p.lastIndexOf('.'));
                return normalize(base) + ext.toLowerCase();
            }
            return normalize(p);
        });

        const newMatch = newParts.join('/');

        if (match !== newMatch) {
            console.log(`  [${path.basename(filePath)}] ${match} -> ${newMatch}`);
            changed = true;
            return newMatch;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (f !== 'node_modules' && f !== '.git' && f !== 'dist') walkDir(p);
        } else if (['.tsx', '.ts', '.css', '.html'].some(ext => p.endsWith(ext))) {
            fixFile(p);
        }
    });
}

console.log('Starting code fix...');
walkDir('.');
console.log('Done!');
