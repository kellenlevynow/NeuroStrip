#!/usr/bin/env node
// Assembles index.html from src/ partials and writes a single-file offline copy.
// No dependencies. Run from the repo root:  node tools/build.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// ---------- macros ----------
// {{i:name}}            inline icon
// {{ev:v:s8,s9}}        evidence chip. v = verified, s = shared in conversation,
//                       a = assumption, h = hypothesis. Second part = ids from data.js
const EV_LABEL = { v: 'Verified', s: 'Shared', a: 'Assumption', h: 'Hypothesis' };
const usedIcons = new Set();

function icon(name, cls = '') {
  usedIcons.add(name);
  return `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function expand(html) {
  return html
    .replace(/\{\{i:([a-z0-9-]+)(?::([a-z0-9- ]+))?\}\}/g, (_, n, c) => icon(n, c))
    .replace(/\{\{ev:([vsah])(?::([A-Za-z0-9,]+))?\}\}/g, (_, t, ids = '') => {
      const label = EV_LABEL[t];
      return `<button type="button" class="ev ev-${t}" data-ev="${t}" data-ids="${ids}" aria-label="${label}. Show source"><span class="ev-dot" aria-hidden="true"></span><span class="ev-t">${label}</span></button>`;
    });
}

// ---------- concatenate css and js sources ----------
const concat = (dir, ext) =>
  readdirSync(join(root, dir))
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => `/* ${f} */\n` + readFileSync(join(root, dir, f), 'utf8'))
    .join('\n');
writeFileSync(join(root, 'assets/css/site.css'), concat('src/css', '.css'));
writeFileSync(join(root, 'assets/js/app.js'), concat('src/js', '.js'));

// ---------- assemble ----------
const sectionDir = join(root, 'src/sections');
const sections = readdirSync(sectionDir)
  .filter((f) => f.endsWith('.html'))
  .sort()
  .map((f) => `\n<!-- ${f} -->\n` + readFileSync(join(sectionDir, f), 'utf8'))
  .join('\n');

let page = read('src/shell.html').replace('<!-- @sections -->', sections);
page = expand(page);

// icons referenced from JS templates are declared in src/icons-extra.txt
if (existsSync(join(root, 'src/icons-extra.txt'))) {
  read('src/icons-extra.txt').split(/\s+/).filter(Boolean).forEach((n) => usedIcons.add(n));
}

// prune the sprite to icons in use
const sprite = read('src/sprite.svg');
const symbols = [...sprite.matchAll(/<symbol id="i-([a-z0-9-]+)"[\s\S]*?<\/symbol>/g)];
const have = new Set(symbols.map((m) => m[1]));
const missing = [...usedIcons].filter((n) => !have.has(n));
if (missing.length) {
  console.error('Missing icons in sprite:', missing.join(', '));
  process.exit(1);
}
const pruned =
  '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">' +
  symbols.filter((m) => usedIcons.has(m[1])).map((m) => m[0]).join('') +
  '</svg>';
page = page.replace('<!-- @sprite -->', pruned);

const stamp = new Date().toISOString().slice(0, 10);
page = page.replace(/\{\{build\}\}/g, stamp);

const leftover = page.match(/\{\{[^}]+\}\}/g);
if (leftover) {
  console.error('Unexpanded macros:', [...new Set(leftover)].join(' '));
  process.exit(1);
}

writeFileSync(join(root, 'index.html'), page);

// ---------- single-file offline copy ----------
const mime = { '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const dataUri = (p) => {
  const buf = readFileSync(join(root, p));
  return `data:${mime[extname(p)] || 'application/octet-stream'};base64,${buf.toString('base64')}`;
};
let css = read('assets/css/site.css').replace(/url\((['"]?)\.\.\/(fonts|img)\/([^)'"]+)\1\)/g, (_, q, dir, file) => `url(${dataUri(`assets/${dir}/${file}`)})`);
let solo = page
  .replace(/<link rel="preload"[^>]*>\n?/g, '')
  .replace(/<span data-online>[\s\S]*?<\/span>/g, '')
  .replace(/<link rel="stylesheet" href="assets\/css\/site\.css[^"]*">/, () => `<style>${css}</style>`)
  .replace(/<script src="(assets\/js\/[a-z.-]+\.js)[^"]*"( defer)?><\/script>/g, (_, p) => `<script>${read(p).replace(/<\/script/g, '<\\/script')}</script>`)
  .replace(/(src|href)="(assets\/img\/[^"]+\.(?:svg|png|jpg|webp))"/g, (m, attr, p) => (existsSync(join(root, p)) ? `${attr}="${dataUri(p)}"` : m));
writeFileSync(join(root, 'standalone.html'), solo);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(0) + ' KB';
console.log(`index.html ${kb(page)} · standalone.html ${kb(solo)} · icons ${usedIcons.size}`);
