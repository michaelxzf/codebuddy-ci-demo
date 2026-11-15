import { execFileSync } from 'node:child_process';
import { readStructured } from './cb-json.mjs';
const { data: t } = readStructured(process.argv[2], ['labels', 'priority']);
const n = process.env.NUMBER;
const labels = [...t.labels, t.priority];
for (const l of labels) { try { execFileSync('gh', ['label', 'create', l, '--force'], { stdio: 'ignore' }); } catch {} }
execFileSync('gh', ['issue', 'edit', n, '--add-label', labels.join(',')], { stdio: 'inherit' });
execFileSync('gh', ['issue', 'comment', n, '--body', `🏷️ **CodeBuddy triage** — ${labels.map((l) => '`' + l + '`').join(' ')}\n\n${t.summary}\n\n**Suggested next step:** ${t.next_step}`], { stdio: 'inherit' });
console.log('triaged', labels.join(','));
