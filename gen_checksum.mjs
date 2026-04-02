import fs from 'fs';
import crypto from 'crypto';

function canonicalize(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(canonicalize);
  const out = {};
  Object.keys(obj).sort().forEach(k => { out[k] = canonicalize(obj[k]); });
  return out;
}

function sha256hex(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

const file = new URL('./coefficients.json', import.meta.url);
const raw = fs.readFileSync(file, 'utf8');
const parsed = JSON.parse(raw);
const parsedNoChecksum = Object.assign({}, parsed);
delete parsedNoChecksum.checksum;
const canonical = JSON.stringify(canonicalize(parsedNoChecksum));
const hex = sha256hex(canonical);
console.log(hex);

if (process.argv.includes('--write')) {
  parsed.checksum = hex;
  fs.writeFileSync(file, JSON.stringify(parsed, null, 4) + '\n', 'utf8');
  console.log('Wrote checksum to coefficients.json');
}
