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
        console.log('Connected.');
        
        console.log('Checking current directory...');
        console.log('Current PWD:', await client.pwd());
        
        console.log('Attempting to change directory to public_html...');
        try {
            await client.cd("public_html");
            console.log('Changed directory to public_html. PWD:', await client.pwd());
        } catch (e) {
            console.log('Could not cd to public_html, might already be in root or it doesn\'t exist. Continuing...');
        }

        console.log('Starting upload from "dist" folder...');
        await client.uploadFromDir("dist");
        
        console.log('Upload complete.');
    }
    catch (err) {
        console.log('FTP Upload Error:', err);
    }
    client.close();
}

deploy();
