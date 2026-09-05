import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language, Freelancer } from '../types';
import { MOCK_FREELANCERS } from '../data/mockData';
import { auth, db } from '../firebase';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, setDoc, doc, where } from 'firebase/firestore';
import { Send, MessageSquare, CheckCheck } from 'lucide-react';

interface ChatMessage { id: string; senderId: string; text: string; timestamp: string; }
interface ChatThread { id: string; participants: string[]; freelancer: Freelancer; lastMessage?: { senderId: string; text: string }; }
interface ChatDashboardProps { currentLang: Language; initialSelectedId?: string; currentUserId?: string; onBackToJobs?: () => void; }

const CHAT_STRINGS = {
  uz: { title: 'SHAXSIY CHAT', empty: 'Hali chatlar yoʻq.', select: 'Suhbatni tanlang', placeholder: 'Xabar yozing...', login: 'Chatdan foydalanish uchun tizimga kiring.', unavailable: 'Bu profilga chat ochish uchun foydalanuvchi akkaunti kerak.', secure: '🔒 Faqat suhbat ishtirokchilari xabarlarni koʻra oladi.' },
  ru: { title: 'ЛИЧНЫЙ ЧАТ', empty: 'Чатов пока нет.', select: 'Выберите беседу', placeholder: 'Введите сообщение...', login: 'Войдите, чтобы пользоваться чатом.', unavailable: 'Для этого профиля нужен аккаунт пользователя.', secure: '🔒 Сообщения видят только участники этого чата.' },
  en: { title: 'DIRECT CHATS', empty: 'No chats yet.', select: 'Select a conversation', placeholder: 'Type a message...', login: 'Sign in to use chat.', unavailable: 'A user account is required to start this chat.', secure: '🔒 Only participants can read these messages.' }
};

function makeChatId(a: string, b: string) { return [a, b].sort().join('__'); }
function formatTime(value: any) { return value?.seconds ? new Date(value.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''; }

export default function ChatDashboard({ currentLang, initialSelectedId, currentUserId, onBackToJobs }: ChatDashboardProps) {
  const local = CHAT_STRINGS[currentLang] || CHAT_STRINGS.uz;
  const userId = currentUserId || auth.currentUser?.uid || '';
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const freelancerById = useMemo(() => new Map(MOCK_FREELANCERS.map(f => [f.id, f])), []);

  // The query itself is scoped to the signed-in UID. Firestore rules enforce this boundary too.
  useEffect(() => {
    if (!userId) { setThreads([]); return; }
    const q = query(collection(db, 'chats'), where('participants', 'array-contains', userId));
    return onSnapshot(q, snapshot => {
      const next: ChatThread[] = [];
      snapshot.forEach(item => {
        const data = item.data();
        const otherId = data.participants.find((id: string) => id !== userId) || '';
        const freelancer = freelancerById.get(data.freelancerId) || ({ id: data.freelancerId || otherId, name: data.freelancerName || 'User', title: '', avatar: '', rating: 0, reviewsCount: 0, hourlyRate: 0, currency: 'UZS', category: 'other', skills: [], bio: '', location: '', verified: false, completedJobs: 0, ownerId: otherId } as Freelancer);
        next.push({ id: item.id, participants: data.participants, freelancer, lastMessage: data.lastMessage });
      });
      setThreads(next);
      if (initialSelectedId) {
        const target = freelancerById.get(initialSelectedId);
        if (target?.ownerId && target.ownerId !== userId) setActiveThreadId(makeChatId(userId, target.ownerId));
      }
      if (!activeThreadId && next[0]) setActiveThreadId(next[0].id);
    }, err => setError(err.message));
  }, [userId, initialSelectedId, freelancerById]);

  useEffect(() => {
    if (!userId || !activeThreadId) { setMessages([]); return; }
    const active = threads.find(t => t.id === activeThreadId);
    if (!active || !active.participants.includes(userId)) { setMessages([]); return; }
    const q = query(collection(db, 'chats', activeThreadId, 'messages'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, snapshot => setMessages(snapshot.docs.map(item => { const data = item.data(); return { id: item.id, senderId: data.senderId || '', text: data.text || '', timestamp: formatTime(data.createdAt) }; })), err => setError(err.message));
  }, [activeThreadId, threads, userId]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startChat = async (freelancer: Freelancer) => {
    if (!userId) { setError(local.login); return; }
    if (!freelancer.ownerId || freelancer.ownerId === userId) { setError(local.unavailable); return; }
    const chatId = makeChatId(userId, freelancer.ownerId);
    try {
      await setDoc(doc(db, 'chats', chatId), { participants: [userId, freelancer.ownerId], freelancerId: freelancer.id, freelancerName: freelancer.name, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
      setActiveThreadId(chatId); setError('');
    } catch (err: any) { setError(err.message || 'Chatni ochib bo‘lmadi.'); }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !userId || !activeThreadId) return;
    const thread = threads.find(t => t.id === activeThreadId);
    if (!thread || !thread.participants.includes(userId)) return;
    try {
      await addDoc(collection(db, 'chats', activeThreadId, 'messages'), { senderId: userId, senderName: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'User', text, createdAt: serverTimestamp() });
      await setDoc(doc(db, 'chats', activeThreadId), { lastMessage: { senderId: userId, text }, updatedAt: serverTimestamp() }, { merge: true });
      setInputText(''); setError('');
    } catch (err: any) { setError(err.message || 'Xabar yuborilmadi.'); }
  };

  const active = threads.find(t => t.id === activeThreadId);
  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[620px]">
      <aside className="w-full md:w-[320px] shrink-0 border-r border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-5 border-b dark:border-slate-800 flex items-center justify-between"><div><h3 className="font-black text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-600" />{local.title}</h3><p className="text-[10px] text-slate-400 mt-1">{threads.length} chat</p></div>{onBackToJobs && <button onClick={onBackToJobs} className="text-xs px-2 py-1 rounded-lg border">←</button>}</div>
        <div className="p-3 text-[10px] text-emerald-600 border-b">{local.secure}</div>
        <div className="p-2 overflow-y-auto">
          {threads.length === 0 && <p className="p-4 text-xs text-slate-400">{userId ? local.empty : local.login}</p>}
          {threads.map(thread => <button key={thread.id} onClick={() => setActiveThreadId(thread.id)} className={`w-full text-left p-3 rounded-2xl flex gap-3 mb-1 ${thread.id === activeThreadId ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}><img src={thread.freelancer.avatar} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-200" referrerPolicy="no-referrer" /><div className="min-w-0"><div className="font-semibold text-xs truncate">{thread.freelancer.name}</div><div className="text-[10px] opacity-70 truncate">{thread.lastMessage?.text || local.empty}</div></div></button>)}
        </div>
      </aside>
      <section className="flex-1 flex flex-col min-w-0">
        {active ? <><header className="p-4 border-b dark:border-slate-800 flex items-center gap-3"><img src={active.freelancer.avatar} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-200" /><div><h3 className="font-bold text-sm">{active.freelancer.name}</h3><p className="text-[10px] text-indigo-600">{active.freelancer.title}</p></div></header><div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/30 dark:bg-slate-950/20">{messages.map(msg => { const mine = msg.senderId === userId; return <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-md p-3 rounded-2xl text-xs ${mine ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-bl-none'}`}><p className="whitespace-pre-wrap">{msg.text}</p><div className="flex justify-end gap-1 text-[9px] opacity-60 mt-1">{msg.timestamp}{mine && <CheckCheck className="w-3 h-3" />}</div></div></div>; })}<div ref={scrollRef} /></div><form onSubmit={sendMessage} className="p-4 border-t dark:border-slate-800 flex gap-2"><input value={inputText} onChange={e => setInputText(e.target.value)} placeholder={local.placeholder} className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 text-xs outline-none" /><button disabled={!inputText.trim()} className="w-10 h-10 rounded-xl bg-indigo-600 text-white disabled:opacity-40 flex items-center justify-center"><Send className="w-4 h-4" /></button></form></> : <div className="flex-1 flex items-center justify-center text-sm text-slate-400">{local.select}</div>}
        {error && <div className="px-4 py-2 text-[10px] text-red-600 bg-red-50 dark:bg-red-950/20">{error}</div>}
      </section>
    </div>
  );
}
