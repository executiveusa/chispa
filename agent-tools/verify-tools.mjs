import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const requiredPaths = [
  '.mcp.json',
  'AGENTS.md',
  'agent-tools/reference-lock.json',
  'artifacts/design-audit/audit.html',
  'artifacts/design-audit/prd.html',
  'artifacts/design-audit/fix-lab.html',
  'artifacts/design-audit/implementation-report.html',
  'docs/system/architecture.json',
  'docs/system/database-schema.json'
];

let missing = 0;
requiredPaths.forEach(p => {
  const fullPath = path.join(root, p);
  if (!fs.existsSync(fullPath)) {
    console.warn(`[MISSING] ${p}`);
    missing++;
  } else {
    console.log(`[OK] ${p}`);
  }
});

if (missing > 0) {
  console.error(`Verification failed: ${missing} missing paths.`);
  process.exit(1);
} else {
  console.log('All required agent tools and documentation artifacts verified.');
}
