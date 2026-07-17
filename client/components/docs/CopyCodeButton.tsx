'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function CopyCodeButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return <button type="button" onClick={copy} className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700" aria-label="Salin contoh kode">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Tersalin' : 'Salin'}</button>;
}
