import Chatbot from '../components/Chatbot.jsx';

export default function Chat({ t, language, destinations, onOpen, onToggleSave }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t.chatbot}</h1>
      <Chatbot t={t} language={language} destinations={destinations} onOpen={onOpen} onToggleSave={onToggleSave} />
    </div>
  );
}
