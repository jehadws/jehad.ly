// node scripts/css-modules-check.mjs        → report
// node scripts/css-modules-check.mjs --fix  → rewrite styles.navItem → styles['nav-item']
import fs from 'node:fs';
import path from 'node:path';

const FIX = process.argv.includes('--fix');
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const camel = (s) => s.replace(/-([a-z0-9])/gi, (_, c) => c.toUpperCase());

let problems = 0;
for (const file of walk('src').filter((f) => /\.(tsx?|jsx?)$/.test(f))) {
  let code = fs.readFileSync(file, 'utf8');
  let changed = false;
  const importRe = /import\s+(?:\*\s+as\s+)?(\w+)\s+from\s+['"](\.[^'"]+\.module\.s[ac]ss)['"]/g;
  for (const [, name, rel] of [...code.matchAll(importRe)]) {
    const scssFile = path.resolve(path.dirname(file), rel);
    if (!fs.existsSync(scssFile)) { console.log(`MISSING  ${file} -> ${rel}`); problems++; continue; }
    const classes = new Set(
      [...fs.readFileSync(scssFile, 'utf8').matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]));
    const used = new Set([...code.matchAll(new RegExp(`\\b${name}\\.([A-Za-z_]\\w*)`, 'g'))].map((m) => m[1]));
    for (const u of used) {
      if (classes.has(u)) continue;
      const kebab = [...classes].find((c) => camel(c) === u);
      problems++;
      if (kebab) {
        console.log(`CAMEL    ${file}: ${name}.${u} -> ${name}['${kebab}']`);
        if (FIX) {
          code = code.replace(new RegExp(`\\b${name}\\.${u}\\b`, 'g'), `${name}['${kebab}']`);
          changed = true;
        }
      } else {
        console.log(`UNKNOWN  ${file}: ${name}.${u} not found in ${path.basename(scssFile)}`);
      }
    }
  }
  if (changed) fs.writeFileSync(file, code);
}
console.log(problems ? `${problems} issue(s)` : 'OK');
