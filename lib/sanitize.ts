export function sanitize(input: string, max = 300) {
if (!input) return '';
let s = String(input).replace(/<[^>]*>/g, '');
if (s.length > max) s = s.slice(0, max);
return s.trim();
}
export function escapeHtml(str: string) {
return String(str).replace(/[&<>\'"]/g, (s) => ({ '&': '&amp;', '<':
'&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[s] as string));
}
