
import fs from 'fs';
import path from 'path';

const SRC_DIR = './';
const PUBLIC_IMG_DIR = './public/img';

// Get map of "what the code might have" -> "what the file actually is"
function getGlobalReplacements() {
    const replacements = new Map();

    function walk(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else {
                const ext = path.extname(file).toLowerCase();
                if (['.webp', '.png', '.jpg', '.jpeg', '.svg', '.mp4'].includes(ext)) {
                    const relativePath = fullPath.replace('public', '').replace(/\\/g, '/');
                    const baseName = path.basename(file, ext);

                    // The "cleaned" version of any potential path
                    const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

                    // We want to find any string in code that looks like an image path
                    // e.g. "/img/Mech/Solidworks.408Z.webp"
                    // and replace it with its new normalized location.
                }
            }
        }
    }
    // ... simpler approach below
}

// 1. Collect all filenames from public/img
const allFiles = [];
function collectFiles(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) collectFiles(p);
        else allFiles.push(p.replace(/\\/g, '/').replace('public/', '/'));
    });
}
collectFiles('public/img');

// 2. Define how a filename was shifted
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const replacements = [];
allFiles.forEach(f => {
    const dir = path.dirname(f);
    const ext = path.extname(f);
    const base = path.basename(f, ext);
    // Since we already ran the normalization script, 'f' IS normalized.
    // We need to find what it USED to be.
});

// Actually, I'll just use a smarter regex-based replacer
const imgRegex = /\/img\/[a-zA-Z0-9.\/_\-\s% ]+\.(webp|png|jpg|jpeg|svg|mp4)/g;

function fixFile(filePath) {
    if (filePath.includes('node_modules') || filePath.includes('dist') || filePath.includes('.git')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    content = content.replace(imgRegex, (match) => {
        const ext = path.extname(match);
        const dir = path.dirname(match);
        const base = path.basename(match, ext);

        const newBase = normalize(base);
        const newMatch = (dir + '/' + newBase + ext.toLowerCase()).replace(/\/+/g, '/');

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
        if (fs.statSync(p).isDirectory()) walkDir(p);
        else if (['.tsx', '.ts', '.css', '.html', '.json'].some(ext => p.endsWith(ext))) fixFile(p);
    });
}

console.log('Starting code fix...');
walkDir('.');
console.log('Done!');
