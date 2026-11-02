import fs from 'fs';
import path from 'path';

const distDir = './dist';
const assetsDir = path.join(distDir, 'assets');
const htmlFile = path.join(distDir, 'index.html');

// 1. Find correct files
const files = fs.readdirSync(assetsDir);
const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('Could not find index.js or index.css in dist/assets');
  process.exit(1);
}

console.log(`Found JS: ${jsFile}, CSS: ${cssFile}`);

// 2. Read and Update HTML
let html = fs.readFileSync(htmlFile, 'utf8');

// Replace JS
const jsRegex = /src="\/assets\/index-.*\.js"/;
html = html.replace(jsRegex, `src="/assets/${jsFile}"`);

// Replace CSS
const cssRegex = /href="\/assets\/index-.*\.css"/;
html = html.replace(cssRegex, `href="/assets/${cssFile}"`);

fs.writeFileSync(htmlFile, html);
console.log('Successfully updated index.html with correct asset paths.');
