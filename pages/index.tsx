import { useMemo, useState } from 'react';
export default function Home() {
const [idea, setIdea] = useState('Box de snacks healthy pour étudiants');
const [audience, setAudience] = useState('Étudiants, jeunes actifs');
const [tone, setTone] = useState('professional');
const [loading, setLoading] = useState(false);
const [kit, setKit] = useState<any>(null);
const [error, setError] = useState<string | null>(null);
async function generate() {
setError(null); setLoading(true); setKit(null);
try {
6
const r = await fetch('/api/generate', { method: 'POST', headers: {
'Content-Type': 'application/json' }, body: JSON.stringify({ idea, audience,
tone }) });
if (!r.ok) throw new Error(await r.text());
const j = await r.json();
setKit(j);
} catch (e: any) {
setError(e?.message || 'Erreur inconnue');
} finally { setLoading(false); }
}
function download(name: string, content: string, mime: string) {
const blob = new Blob([content], { type: mime });
const url = URL.createObjectURL(blob);
const a = document.createElement('a'); a.href = url; a.download = name;
document.body.appendChild(a); a.click(); a.remove();
URL.revokeObjectURL(url);
}
function downloadAll() {
if (!kit) return;
download(`${kit.brand}-landing.html`, kit.landingHTML, 'text/html');
download(`${kit.brand}-logo.svg`, kit.logoSVG, 'image/svg+xml');
download(`${kit.brand}-README.md`, kit.readme, 'text/markdown');
(kit.socialPosts || []).forEach((p: string, i: number) => download(`$
{kit.brand}-post-${i + 1}.txt`, p, 'text/plain'));
}
return (
<div style={{ minHeight: '100vh', background: 'linear￾gradient(120deg,#f8fafc,#ffffff)', padding: '40px 16px' }}>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com"
crossOrigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?
family=Montserrat:wght@700&family=Inter:wght@400;600&display=swap"
rel="stylesheet"/>
<div style={{ maxWidth: 980, margin: '0 auto', background: '#fff',
border: '1px solid #e5e7eb', borderRadius: 16, boxShadow: '0 10px 30px 
rgba(0,0,0,.04)', padding: 24 }}>
<header style={{ display: 'flex', justifyContent: 'space-between',
alignItems: 'center' }}>
<div>
<h1 style={{ fontFamily: 'Montserrat, Inter, Arial', margin: 0 }}
>AI Site Factory</h1>
<p style={{ color: '#64748b', marginTop: 6 }}>Génère des micro￾sites propres, sécurisés et halal-first.</p>
</div>
<img src="/logo.svg" alt="logo" width={64} height={64} />
</header>
7
<main style={{ marginTop: 16 }}>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
gap: 12 }}>
<label>
<div style={{ fontWeight: 600 }}>Idée</div>
<input value={idea} onChange={e => setIdea(e.target.value)}
style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid 
#e5e7eb' }} />
</label>
<label>
<div style={{ fontWeight: 600 }}>Audience</div>
<input value={audience} onChange={e =>
setAudience(e.target.value)} style={{ width: '100%', padding: 12,
borderRadius: 10, border: '1px solid #e5e7eb' }} />
</label>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: 12,
marginTop: 8 }}>
<div>Ton</div>
<select value={tone} onChange={e => setTone(e.target.value)}
style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}>
<option value="professional">Professionnel</option>
<option value="friendly">Amical</option>
</select>
<button onClick={generate} disabled={loading} style={{
marginLeft: 'auto', background: '#0f172a', color: '#fff', padding: '10px 
14px', borderRadius: 10 }}>{loading ? 'Génération…' : 'Générer'}</button>
</div>
{error && <div style={{ background: '#fff7ed', color: '#9a3412',
padding: 12, borderRadius: 8, marginTop: 12 }}>{error}</div>}
{!kit && <p style={{ color: '#64748b' }}>Aucun kit pour l’instant.
Entre une idée et clique sur Générer.</p>}
{kit && (
<section style={{ marginTop: 12 }}>
<div style={{ display: 'flex', gap: 16, alignItems: 'flex￾start', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
<div dangerouslySetInnerHTML={{ __html: kit.logoSVG }}
style={{ width: 200 }} />
<div>
<h2 style={{ margin: '6px 0' }}>{kit.brand}</h2>
<p style={{ color: '#475569' }}>{kit.oneLiner}</p>
</div>
</div>
<div style={{ marginTop: 12, border: '1px solid #e5e7eb',
borderRadius: 12, padding: 12 }}>
<strong>Landing preview:</strong>
8
<div style={{ marginTop: 8, border: '1px solid #e5e7eb',
borderRadius: 12, overflow: 'hidden' }}>
<iframe title="preview" srcDoc={kit.landingHTML} style={{
width: '100%', height: 360, border: 'none' }} />
</div>
</div>
<div style={{ marginTop: 12, border: '1px solid #e5e7eb',
borderRadius: 12, padding: 12 }}>
<strong>Social posts:</strong>
<ul>
{(kit.socialPosts || []).map((p: string, i: number) => <li
key={i}>{p}</li>)}
</ul>
</div>
<div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
<button onClick={downloadAll} style={{ background:
'#059669', color: '#fff', padding: '10px 14px', borderRadius: 10 }}
>Télécharger</button>
</div>
</section>
)}
</main>
<footer style={{ marginTop: 16, color: '#94a3b8', fontSize: 12 }}>©
{new Date().getFullYear()} AI Site Factory — Sécurisé, halal-first. Déployé
sur Vercel.</footer>
</div>
</div>
);
}
