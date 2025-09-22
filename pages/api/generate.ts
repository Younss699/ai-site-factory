import type { NextApiRequest, NextApiResponse } from 'next';
import { sanitize, escapeHtml } from '../../lib/sanitize';
import { isHalalSafe } from '../../lib/halal';
// Simple rate-limit in-memory (soft)
const BUCKET: Record<string, { count: number; ts: number }> = {};
const WINDOW_MS = 60_000; // 1 min
const MAX_REQ = 20; // 20/min/IP
function rateLimit(ip: string) {
const now = Date.now();
const b = BUCKET[ip] || { count: 0, ts: now };
if (now - b.ts > WINDOW_MS) { b.count = 0; b.ts = now; }
b.count += 1; BUCKET[ip] = b;
return b.count <= MAX_REQ;
}
export default async function handler(req: NextApiRequest, res:
NextApiResponse) {
if (req.method !== 'POST') return res.status(405).send('Method Not 
Allowed');
const ip = (req.headers['x-forwarded-for'] as string || '').split(',')[0]
|| req.socket.remoteAddress || 'ip';
if (!rateLimit(ip)) return res.status(429).send('Too Many Requests');
const { idea, audience, tone } = req.body || {};
const sIdea = sanitize(idea, 160);
const sAudience = sanitize(audience, 120);
const sTone = sanitize(tone || 'professional', 20);
if (!sIdea) return res.status(400).send('Missing idea');
if (!isHalalSafe(sIdea) || !isHalalSafe(sAudience)) return
res.status(400).send('Rejected by halal filter');
// Prompt (aucun média, pas de scripts externes)
const prompt = `Tu es un générateur de kits de micro-site. Rends un JSON 
avec ces champs:
 brand: court nom de marque original (pas de caractères spéciaux),
 oneLiner: 1 phrase claire,
 landingHTML: page HTML5 minimaliste SANS scripts externes et avec Google 
Fonts autorisées (link) et style intégré, rien de haram,
 logoSVG: logo simple en SVG (fond dégradé, texte centré),
 socialPosts: 5 textes courts pour réseaux,
 readme: texte Markdown pour expliquer quoi faire.
 Contrainte halal: pas d'alcool, paris, contenu adulte, ni musique. Idée: $
{sIdea}. Audience: ${sAudience}. Ton: ${sTone}.`;
4
try {
const r = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Authorization': `Bearer ${process.env.AI_API_KEY}`,
'Content-Type': 'application/json'
},
body: JSON.stringify({
model: 'gpt-4o-mini',
messages: [{ role: 'user', content: prompt }],
temperature: 0.8,
max_tokens: 1400
})
});
if (!r.ok) {
const text = await r.text();
return res.status(502).send(text || 'Upstream error');
}
const j = await r.json();
const content = j.choices?.[0]?.message?.content || '';
// Best-effort parse JSON (assistant often returns fenced code); fallback 
to local minimal kit
let parsed: any = null;
try {
const jsonText = content.replace(/```(json)?/g, '').trim();
parsed = JSON.parse(jsonText);
} catch {
parsed = null;
}
if (!parsed || !parsed.landingHTML) {
const brand = 'Brand' + Math.floor(Math.random() * 90 + 10);
const oneLiner = `${sIdea} pour ${sAudience || 'tous'} — simple, 
fiable.`;
const landingHTML = `<!doctype html><html lang=fr><head><meta 
charset=utf-8><meta name=viewport content='width=device-width,initial￾scale=1'>
 <title>${escapeHtml(brand)}</title>
 <link rel=preconnect href=https://fonts.googleapis.com><link 
rel=preconnect href=https://fonts.gstatic.com crossorigin>
 <link href="https://fonts.googleapis.com/css2?
family=Montserrat:wght@700&family=Inter:wght@400;600&display=swap" 
rel="stylesheet">
 <style>body{font-family:Inter,system-ui;margin:
0;background:#f8fafc;color:#0f172a}h1{font-family:Montserrat;font-size:40px}
main{max-width:980px;margin:0 auto;padding:32px}.hero{background:linear￾gradient(120deg,#ede9fe,#e0f2fe);border-radius:20px;padding:36px}</style>
 </head><body><main><section class=hero><h1>${escapeHtml(brand)}</
5
h1><p>${escapeHtml(oneLiner)}</p></section></main></body></html>`;
const logoSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='420' 
height='120' viewBox='0 0 420 120'><defs><linearGradient id='g' x1='0' y1='0' 
x2='1' y2='1'><stop offset='0' stop-color='#6d28d9'/><stop offset='1' stopcolor='#0ea5e9'/></linearGradient></defs><rect width='420' height='120' 
rx='16' fill='url(#g)'/><text x='50%' y='55%' dominant-baseline='middle' 
text-anchor='middle' font-family='Montserrat, Inter, Arial' font-size='30' 
fill='white'>${escapeHtml(brand)}</text></svg>`;
const socialPosts = [
`Découvre ${brand} — ${sIdea}.`,
`${brand}: ${sIdea} pour ${sAudience || 'tous'}.`,
`Pourquoi ${brand}? Simplicité, sécurité, halal.`,
`Commence aujourd'hui avec ${brand}.`,
`Guide rapide: ${sIdea} en 3 étapes.`
];
const readme = `# ${brand}\n\nGénéré par fallback local.\n`;
return res.status(200).json({ brand, oneLiner, landingHTML, logoSVG,
socialPosts, readme });
}
// Halal check output
const allText = `${parsed.brand}\n${parsed.oneLiner}\n${parsed.readme}\n$
{(parsed.socialPosts||[]).join('\n')}`;
if (!isHalalSafe(allText) || !isHalalSafe(parsed.landingHTML)) {
return res.status(400).send('Rejected by halal filter (output)');
}
return res.status(200).json(parsed);
} catch (e: any) {
return res.status(500).send(e?.message || 'Internal error');
}
}
