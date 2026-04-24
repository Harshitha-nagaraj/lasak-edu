import * as ftp from 'basic-ftp';

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log('Connecting to FTP...');
        await client.access({
            host: "153.92.8.168",
            user: "u681419788.lasakedu.in",
            password: "Lasakedu@2024",
            secure: false
        });
        console.log('Connected. Starting upload to current directory (Hostinger root)...');
        await client.uploadFromDir("dist");
        
        console.log('Upload complete. Cleaning up rogue /public_html folder from earlier...');
        try {
            await client.removeDir("public_html");
        } catch (e) {
            console.log("Rogue folder cleanup failed or folder not found (safe to ignore)");
        }
    }
    catch (err) {
        console.log('FTP Upload Error:', err);
    }
    client.close();
}

deploy();
