// Extract the structured object from `codebuddy -p --output-format json [--json-schema]` output.
import fs from 'node:fs';
export function readStructured(file, keys) {
  const raw = fs.readFileSync(file, 'utf8').trim();
  const tryParse = (s) => { try { return JSON.parse(s); } catch { return null; } };
  let top = tryParse(raw);
  if (!top) { const lines = raw.split('\n').map(tryParse).filter(Boolean); top = lines.reverse().find((o) => o.type === 'result') || lines[0]; }
  const seen = new Set();
  const walk = (v) => {
    if (v && typeof v === 'object' && !seen.has(v)) {
      seen.add(v);
      if (keys.every((k) => k in v)) return v;
      for (const x of Object.values(v)) { const r = walk(x); if (r) return r; }
    } else if (typeof v === 'string' && /^\s*[{[]/.test(v)) {
      const fence = v.match(/```(?:json)?\s*([\s\S]*?)```/); const p = tryParse(fence ? fence[1] : v); if (p) return walk(p);
    }
    return null;
  };
  const out = walk(top);
  if (!out) throw new Error('no structured output with keys ' + keys.join(','));
  return { data: out, meta: top };
}
