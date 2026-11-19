const { cpSync, readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const dist = resolve(__dirname, '../dist');
const index = resolve(dist, 'index.html');
const html = readFileSync(index, 'utf8');
const headEnd = /<\/head\s*>/i;
const basePath = (process.env.PAGES_BASE_PATH || '').replace(/\/$/, '');
const assets = basePath + '/pwa';

if (!headEnd.test(html)) {
  throw new Error('Expo web export is missing the closing head tag.');
}

cpSync(resolve(__dirname, '../pwa'), resolve(dist, 'pwa'), { recursive: true });
writeFileSync(index, html.replace(headEnd, () => [
  '<meta name="theme-color" content="#0F172A">',
  '<link rel="manifest" href="' + assets + '/manifest.webmanifest">',
  '<link rel="apple-touch-icon" href="' + assets + '/apple-touch-icon.png">',
  '</head>',
].join('\n')));
