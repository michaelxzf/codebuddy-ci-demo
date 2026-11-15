// Turn CodeBuddy's structured review into a GitHub PR review with inline comments.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { readStructured } from './cb-json.mjs';

const { data: r, meta } = readStructured(process.argv[2], ['summary', 'findings']);
const repo = process.env.GITHUB_REPOSITORY, pr = process.env.PR;
const icon = { critical: '🔴', warning: '🟠', suggestion: '🔵' };
const verdict = { approve: '✅ Looks good', comment: '💬 Comments', request_changes: '⛔ Changes requested' }[r.verdict] || r.verdict;
const rows = r.findings.map((f) => `| ${icon[f.severity] || ''} ${f.severity} | \`${f.file}:${f.line}\` | ${f.title} |`).join('\n');
const cost = meta && (meta.duration_ms || meta.num_turns) ? `\n\n<sub>CodeBuddy Code · ${meta.num_turns ?? '?'} turns · ${((meta.duration_ms || 0) / 1000).toFixed(0)}s</sub>` : '';
const body = `## 🤖 CodeBuddy review — ${verdict}\n\n${r.summary}\n\n` +
  (r.findings.length ? `| Severity | Location | Finding |\n|---|---|---|\n${rows}` : '_No actionable findings._') + cost;
const comments = r.findings.filter((f) => f.file && f.line > 0).map((f) => ({
  path: f.file.replace(/^\.?\//, ''), line: f.line, side: 'RIGHT',
  body: `${icon[f.severity] || ''} **${f.title}**\n\n${f.detail}${f.suggestion ? `\n\n**Suggested fix:** ${f.suggestion}` : ''}`,
}));
const post = (payload) => execFileSync('gh', ['api', `repos/${repo}/pulls/${pr}/reviews`, '--input', '-'], { input: JSON.stringify(payload), stdio: ['pipe', 'pipe', 'inherit'] });
try { post({ event: 'COMMENT', body, comments }); console.log(`posted review with ${comments.length} inline comments`); }
catch { post({ event: 'COMMENT', body }); console.log('inline positions rejected; posted summary review only'); }
fs.writeFileSync('review.md', body);
