const fs = require('fs');
const path = require('path');

const dir = 'c:\\loafers\\LoafeRss-frontend\\src';

function replaceInDir(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const newContent = content.replace(/https:\/\/loafers-backend-2\.onrender\.com/g, 'https://loaferss-backend-2.onrender.com');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    }
}

replaceInDir(dir);
console.log('Replacement complete.');
