import { Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { api } from '../services/api.js';
import DestinationCard from './DestinationCard.jsx';

export default function Chatbot({ language, t, destinations, onOpen, onToggleSave }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.chatGreeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState([]);
  const suggested = [t.prompt1, t.prompt2, t.prompt3];
  const recommended = useMemo(() => destinations.filter((item) => recommendedIds.includes(item.id)), [destinations, recommendedIds]);

  async function send(text = input) {
    const message = text.trim();
    if (!message) return;
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((items) => [...items, { role: 'user', content: message }]);
    setInput('');
    setLoading(true);
    try {
      const data = await api.chat({ message, language, history });
      setMessages((items) => [...items, { role: 'assistant', content: data.reply }]);
      setRecommendedIds(data.recommendedDestinationIds || []);
    } catch {
      setMessages((items) => [...items, { role: 'assistant', content: t.chatError }]);
      setRecommendedIds([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="h-[58vh] space-y-3 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm ${message.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{message.content}</div>
            </div>
          ))}
          {loading && <div className="text-sm text-slate-500">{t.aiLoading}</div>}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
          {suggested.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-full bg-teal-50 px-3 py-2 text-xs text-primary dark:bg-teal-950">{prompt}</button>)}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.chatPlaceholder} className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950" />
          <button className="rounded-md bg-primary px-4 py-3 font-semibold text-white" disabled={loading}><Send size={18} /></button>
        </form>
      </section>
      <aside>
        <h2 className="mb-3 font-semibold">{t.recommended}</h2>
        <div className="space-y-4">
          {recommended.map((destination) => <DestinationCard key={destination.id} destination={destination} language={language} t={t} onOpen={onOpen} onToggleSave={onToggleSave} />)}
          {!recommended.length && <p className="rounded-lg bg-white p-4 text-sm text-slate-500 dark:bg-slate-900">{t.emptyMessage}</p>}
        </div>
      </aside>
    </div>
  );
}
