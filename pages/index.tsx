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
