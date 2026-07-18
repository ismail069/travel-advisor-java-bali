'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { destinationSlug } from '@/lib/site';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

function richLine(text, lineIndex, isEn) {
  const clean = text.replace(/^\s*[-*]\s+/, '');
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s]+)|\*\*([^*]+)\*\*/g;
  const nodes = [];
  let cursor = 0;
  let match;
  while ((match = pattern.exec(clean))) {
    if (match.index > cursor) nodes.push(clean.slice(cursor, match.index));
    if (match[1]) nodes.push(<a key={`${lineIndex}-${match.index}`} href={match[2]} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">{match[1]}</a>);
    else if (match[3]) nodes.push(<a key={`${lineIndex}-${match.index}`} href={match[3]} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">{isEn ? 'Open link' : 'Buka tautan'}</a>);
    else nodes.push(<strong key={`${lineIndex}-${match.index}`}>{match[4]}</strong>);
    cursor = pattern.lastIndex;
  }
  if (cursor < clean.length) nodes.push(clean.slice(cursor));
  return nodes;
}

function RichMessage({ content, isEn }) {
  return <div className="space-y-2">{content.split('\n').map((line, index) => {
    if (!line.trim()) return <div key={index} className="h-1" />;
    const bullet = /^\s*[-*]\s+/.test(line);
    return <div key={index} className={bullet ? 'flex gap-2' : ''}>{bullet && <span aria-hidden="true">•</span>}<span>{richLine(line, index, isEn)}</span></div>;
  })}</div>;
}

function RelatedDestinations({ items, isEn, locale }) {
  if (!items?.length) return null;
  const heading = isEn ? 'Related destinations' : 'Destinasi terkait';
  return <section className="mt-4 border-t border-slate-200 pt-4" aria-label={heading}>
    <h3 className="mb-3 text-sm font-black text-slate-950">{heading}</h3>
    <div className="grid gap-3 sm:grid-cols-2">{items.map((item) => {
      const name = isEn && item.name_en ? item.name_en : (item.name_id || item.name);
      return <Link key={item.id} href={`/${locale}/destinasi/${destinationSlug({ id: item.id, name: item.name_id || item.name })}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-primary hover:shadow-md">
      {item.imageUrl ? <img src={item.imageUrl} alt={name} width="480" height="270" className="aspect-video w-full object-cover" /> : null}
      <div className="p-3"><p className="font-black text-slate-950 group-hover:text-primary">{name}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{item.city}, {item.province}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{item.description}</p></div>
    </Link>
    })}</div>
  </section>;
}

export default function TripAssistant({ locale = 'id' }) {
  const isEn = locale === 'en';
  
  const initialGreeting = isEn 
    ? 'Hello! Tell me about the duration, departure point, budget, number of travelers, and your travel interests in Java or Bali.'
    : 'Halo! Ceritakan durasi, titik berangkat, budget, jumlah traveler, dan minat perjalananmu di Jawa atau Bali.';
    
  const suggestions = isEn 
    ? ['Hotels near Tanah Lot', 'Restaurants around Ubud', 'Transport to Borobudur', 'Health facilities near destinations']
    : ['Hotel dekat Tanah Lot', 'Restoran sekitar Ubud', 'Transportasi ke Borobudur', 'Fasilitas kesehatan dekat destinasi'];

  const errorMsg = isEn 
    ? 'Sorry, the assistant is currently unavailable. Please try again in a moment or explore the destination pages.'
    : 'Maaf, asisten sedang tidak dapat dihubungi. Coba lagi beberapa saat atau jelajahi halaman destinasi.';

  const loadingMsg = isEn ? 'TripAssistant is preparing an answer...' : 'TripAssistant sedang menyusun jawaban…';
  const labelMsg = isEn ? 'Message for TripAssistant' : 'Pesan untuk TripAssistant';
  const placeholderText = isEn ? 'Example: 3-day family vacation in Bali, budget 5 million...' : 'Contoh: Liburan keluarga 3 hari di Bali, budget 5 juta…';
  const hintText = isEn ? 'Enter to send · Shift+Enter for new line' : 'Enter untuk mengirim · Shift+Enter untuk baris baru';
  const btnText = isEn ? 'Send' : 'Kirim';

  const [messages, setMessages] = useState([{ role: 'assistant', content: initialGreeting, recommendations: [] }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    const next = [...messages, { role: 'user', content: message, recommendations: [] }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, language: locale, history: next.slice(-8).map(({ role, content }) => ({ role, content })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessages([...next, { role: 'assistant', content: data.reply, recommendations: data.recommendedDestinations || [] }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: errorMsg, recommendations: [] }]);
    } finally {
      setLoading(false);
    }
  }

  function handleInputKeyDown(event) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  return <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
    <div className="border-b border-violet-100 bg-violet-50 px-5 py-3 text-sm text-slate-700 sm:px-7">
      {isEn ? (
        <><strong>Database-driven answers.</strong> TripAssistant only discusses Java and Bali travel based on JawaBali Trip data.</>
      ) : (
        <><strong>Jawaban berbasis database.</strong> TripAssistant hanya membahas perjalanan Jawa dan Bali dari data JawaBali Trip.</>
      )}
    </div>
    <div className="flex flex-wrap gap-2 px-5 pt-5 sm:px-7">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setInput(suggestion)} className="rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-violet-50">{suggestion}</button>)}</div>
    <div className="max-h-[620px] min-h-[360px] space-y-4 overflow-y-auto p-5 sm:p-7" aria-live="polite">
      {messages.map((item, index) => <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 ${item.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-800 sm:max-w-[88%]'}`}>
          <RichMessage content={item.content} isEn={isEn} />
          <RelatedDestinations items={item.recommendations} isEn={isEn} locale={locale} />
        </div>
      </div>)}
      {loading && <p className="text-sm text-slate-500">{loadingMsg}</p>}
    </div>
    <form onSubmit={submit} className="border-t border-slate-200 p-4">
      <label htmlFor="chat-message" className="sr-only">{labelMsg}</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <textarea id="chat-message" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleInputKeyDown} maxLength={1000} rows="2" placeholder={placeholderText} aria-describedby="chat-keyboard-hint" className="min-h-14 w-full resize-none rounded-xl border border-slate-300 px-4 py-3" />
          <p id="chat-keyboard-hint" className="mt-1.5 px-1 text-xs text-slate-500">{hintText}</p>
        </div>
        <button disabled={loading} className="h-fit rounded-xl bg-primary px-6 py-3 font-black text-white disabled:opacity-60">{btnText}</button>
      </div>
    </form>
  </div>;
}
