export const FORBIDDEN = [
'alcool', 'vin', 'bière', 'whisky', 'vodka',
'casino', 'pari', 'gambling', 'poker',
'porn', 'sex', 'nudité', 'adult',
'haine', 'racisme', 'terrorisme'
];
export function isHalalSafe(text: string) {
const t = (text || '').toLowerCase();
return !FORBIDDEN.some(k => t.includes(k));
}
