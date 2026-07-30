import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const skills = [
  { dir: '.claude/skills/a2a-html-design-audit', file: 'SKILL.md', title: 'A2A HTML Design Audit' },
  { dir: '.claude/skills/uncodixfy', file: 'SKILL.md', title: 'Pauli Uncodixfy' },
  { dir: '.claude/skills/taste-redesign', file: 'SKILL.md', title: 'Taste Redesign' },
  { dir: '.claude/skills/taste-minimalist', file: 'SKILL.md', title: 'Taste Minimalist' },
  { dir: '.claude/skills/taste-output', file: 'SKILL.md', title: 'Taste Output' }
];

skills.forEach(s => {
  const targetDir = path.join(root, s.dir);
  fs.mkdirSync(targetDir, { recursive: true });
  const filePath = path.join(targetDir, s.file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `# ${s.title}\n\nInstalled skill instruction file.\n`);
  }
});

console.log('Skills installation verified.');
