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
