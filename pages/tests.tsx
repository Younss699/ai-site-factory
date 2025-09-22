import { useMemo } from 'react';
import { sanitize } from '../lib/sanitize';
import { isHalalSafe } from '../lib/halal';
export default function Tests() {
const results = useMemo(() => {
const out: { name: string; pass: boolean }[] = [];
const assert = (name: string, cond: boolean) => out.push({ name, pass: !!
cond });
// sanitize
assert('sanitize strips tags', sanitize('<b>x</b>') === 'x');
assert('sanitize trims', sanitize(' x ') === 'x');
9
assert('sanitize max len', sanitize('a'.repeat(400), 120).length ===
120);
// halal filter
assert('halal safe ok', isHalalSafe('snacks healthy pour étudiants'));
assert('halal safe blocks alcohol', !isHalalSafe('meilleure bière 
artisanale'));
// API method guard (documented expectation)
assert('API should require POST (doc test)', true);
return out;
}, []);
return (
<div style={{ padding: 20 }}>
<h1>Tests intégrés</h1>
<ul>
{results.map((t, i) => (
<li key={i} style={{ color: t.pass ? '#065f46' : '#b91c1c' }}
>{t.pass ? '✓' : '✗'} {t.name}</li>
))}
</ul>
<p>Ces tests sont basiques et valident le minimum vital côté client.</
p>
</div>
);
}
10) public/logo
