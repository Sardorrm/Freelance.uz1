import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language, Freelancer } from '../types';
import { auth, db } from '../firebase';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { ArrowLeft, MessageSquare, Search, Send, CheckCheck } from 'lucide-react';

interface ChatMessage { id: string; senderId: string; text: string; timestamp: string; }
interface ChatThread { id: string; participants: string[]; freelancer: Freelancer; lastMessage?: { senderId: string; text: string }; updatedAt?: any; }
interface ChatDashboardProps {
  currentLang: Language;
  currentUserId?: string;
  initialSelectedId?: string;
  freelancers?: Freelancer[];
  onBackToJobs?: () => void;
}

const STRINGS = {
  uz: { title:'Xabarlar', search:'Chatlardan qidiring...', empty:'Hali yozishmalar yo‘q.', select:'Suhbatni tanlang', placeholder:'Xabar yozing...', login:'Chatdan foydalanish uchun tizimga kiring.', newChat:'Yangi suhbat', secure:'Shaxsiy yozishmalar', noUser:'Foydalanuvchi topilmadi' },
  ru: { title:'Сообщения', search:'Поиск по чатам...', empty:'Пока нет переписок.', select:'Выберите беседу', placeholder:'Введите сообщение...', login:'Войдите, чтобы пользоваться чатом.', newChat:'Новый чат', secure:'Личные сообщения', noUser:'Пользователь не найден' },
  en: { title:'Messages', search:'Search chats...', empty:'No conversations yet.', select:'Select a conversation', placeholder:'Type a message...', login:'Sign in to use chat.', newChat:'New chat', secure:'Private messages', noUser:'User not found' }
};

function formatTime(value: any) {
  if (!value?.seconds) return '';
  return new Date(value.seconds * 1000).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
}
function chatIdFor(a: string, b: string) { return [a, b].sort().join('__'); }

export default function ChatDashboard({ currentLang, currentUserId, initialSelectedId, freelancers = [], onBackToJobs }: ChatDashboardProps) {
  const t = STRINGS[currentLang] || STRINGS.uz;
  const userId = currentUserId || auth.currentUser?.uid || '';
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const freelancerByOwner = useMemo(() => new Map(freelancers.filter(f => f.ownerId).map(f => [f.ownerId!, f])), [freelancers]);

  useEffect(() => {
    if (!userId) { setThreads([]); setActiveThreadId(''); return; }
    const q = query(collection(db, 'chats'), where('participants', 'array-contains', userId));
    return onSnapshot(q, snapshot => {
      const next: ChatThread[] = snapshot.docs.map(item => {
        const data = item.data();
        const participants = Array.isArray(data.participants) ? data.participants : [];
        const otherId = participants.find((id: string) => id !== userId) || '';
        const profile = freelancerByOwner.get(otherId);
        const freelancer: Freelancer = profile || {
          id: data.freelancerId || otherId,
          ownerId: otherId,
          name: data.otherName || data.freelancerName || 'User',
          title: '', avatar: data.otherAvatar || '', rating: 0, reviewsCount: 0, hourlyRate: 0,
          currency: 'UZS', category: 'other', skills: [], bio: '', location: '', verified: false, completedJobs: 0, portfolio: [], reviews: []
        } as Freelancer;
        return { id:item.id, participants, freelancer, lastMessage:data.lastMessage, updatedAt:data.updatedAt };
      });
      next.sort((a,b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setThreads(next);
      setActiveThreadId(current => {
        if (current && next.some(t => t.id === current)) return current;
        if (initialSelectedId) {
          const target = freelancers.find(f => f.id === initialSelectedId && f.ownerId && f.ownerId !== userId);
          if (target?.ownerId) {
            const id = chatIdFor(userId, target.ownerId);
            if (next.some(t => t.id === id)) return id;
            return '';
          }
        }
        return next[0]?.id || '';
      });
      setError('');
    }, err => setError(err.message));
  }, [userId, initialSelectedId, freelancers, freelancerByOwner]);

  useEffect(() => {
    if (!userId || !activeThreadId) { setMessages([]); return; }
    const active = threads.find(t => t.id === activeThreadId);
    if (!active || !active.participants.includes(userId)) { setMessages([]); return; }
    const q = query(collection(db, 'chats', activeThreadId, 'messages'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, snapshot => setMessages(snapshot.docs.map(item => {
      const data = item.data();
      return { id:item.id, senderId:data.senderId || '', text:data.text || '', timestamp:formatTime(data.createdAt) };
    })), err => setError(err.message));
  }, [activeThreadId, threads, userId]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  useEffect(() => {
    if (!userId || !initialSelectedId) return;
    const target = freelancers.find(f => f.id === initialSelectedId && f.ownerId && f.ownerId !== userId);
    if (!target?.ownerId) return;
    const id = chatIdFor(userId, target.ownerId);
    setActiveThreadId(current => current || id);
  }, [userId, initialSelectedId, freelancers]);

  const openOrCreateChat = async (freelancer: Freelancer) => {
    if (!userId || !freelancer.ownerId || freelancer.ownerId === userId) return;
    const id = chatIdFor(userId, freelancer.ownerId);
    try {
      await setDoc(doc(db, 'chats', id), {
        participants: [userId, freelancer.ownerId].sort(),
        freelancerId: freelancer.id,
        otherName: freelancer.name,
        otherAvatar: freelancer.avatar || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge:true });
      setActiveThreadId(id);
      setError('');
    } catch (err:any) { setError(err.message || 'Chat ochilmadi.'); }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !userId || !activeThreadId) return;
    const thread = threads.find(t => t.id === activeThreadId);
    if (!thread || !thread.participants.includes(userId)) return;
    try {
      await addDoc(collection(db, 'chats', activeThreadId, 'messages'), { senderId:userId, senderName:auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'User', text, createdAt:serverTimestamp() });
      await setDoc(doc(db, 'chats', activeThreadId), { lastMessage:{ senderId:userId, text }, updatedAt:serverTimestamp() }, { merge:true });
      setInputText(''); setError('');
    } catch (err:any) { setError(err.message || 'Xabar yuborilmadi.'); }
  };

  const visibleThreads = threads.filter(thread => thread.freelancer.name.toLowerCase().includes(search.toLowerCase()));
  const active = threads.find(t => t.id === activeThreadId);
  const availablePeople = freelancers.filter(f => f.ownerId && f.ownerId !== userId && !threads.some(t => t.participants.includes(f.ownerId!))).slice(0, 12);

  if (!userId) return <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">{t.login}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[680px]">
      <aside className="w-full md:w-[340px] shrink-0 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between"><div><h3 className="font-black text-base flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-600" />{t.title}</h3><p className="text-[10px] text-slate-400 mt-1">{threads.length} · {t.secure}</p></div>{onBackToJobs && <button onClick={onBackToJobs} className="w-9 h-9 rounded-xl border flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button>}</div>
          <div className="mt-4 relative"><Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs outline-none" /></div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {visibleThreads.length === 0 && <p className="p-5 text-xs text-slate-400">{t.empty}</p>}
          {visibleThreads.map(thread => <button key={thread.id} onClick={()=>setActiveThreadId(thread.id)} className={`w-full text-left p-3 rounded-2xl flex gap-3 mb-1 ${thread.id===activeThreadId ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}><div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">{thread.freelancer.avatar ? <img src={thread.freelancer.avatar} alt="" className="w-full h-full object-cover" /> : thread.freelancer.name.slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><span className="font-bold text-xs truncate">{thread.freelancer.name}</span><span className="text-[9px] opacity-60">{formatTime(thread.updatedAt)}</span></div><div className="text-[10px] opacity-70 truncate mt-1">{thread.lastMessage?.text || t.newChat}</div></div></button>)}
          {availablePeople.length > 0 && <div className="px-3 pt-5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.newChat}</div>}
          {availablePeople.map(person => <button key={person.id} onClick={()=>void openOrCreateChat(person)} className="w-full text-left p-3 rounded-2xl flex gap-3 mb-1 hover:bg-indigo-50 dark:hover:bg-slate-800"><div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center text-xs font-bold">{person.avatar ? <img src={person.avatar} alt="" className="w-full h-full object-cover" /> : person.name.slice(0,1).toUpperCase()}</div><div className="min-w-0"><div className="font-semibold text-xs truncate">{person.name}</div><div className="text-[10px] text-slate-400 truncate">{person.title || t.newChat}</div></div></button>)}
        </div>
      </aside>
      <section className="flex-1 flex flex-col min-w-0">
        {active ? <><header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3"><div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center font-bold">{active.freelancer.avatar ? <img src={active.freelancer.avatar} alt="" className="w-full h-full object-cover" /> : active.freelancer.name.slice(0,1).toUpperCase()}</div><div><h3 className="font-bold text-sm">{active.freelancer.name}</h3><p className="text-[10px] text-indigo-600">{active.freelancer.title || t.secure}</p></div></header><div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/40 dark:bg-slate-950/20">{messages.map(msg=>{const mine=msg.senderId===userId;return <div key={msg.id} className={`flex ${mine?'justify-end':'justify-start'}`}><div className={`max-w-md p-3 rounded-2xl text-xs ${mine?'bg-indigo-600 text-white rounded-br-none':'bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-bl-none'}`}><p className="whitespace-pre-wrap">{msg.text}</p><div className="flex justify-end gap-1 text-[9px] opacity-60 mt-1">{msg.timestamp}{mine&&<CheckCheck className="w-3 h-3" />}</div></div></div>})}<div ref={scrollRef}/></div><form onSubmit={sendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2"><input value={inputText} onChange={e=>setInputText(e.target.value)} placeholder={t.placeholder} className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs outline-none"/><button disabled={!inputText.trim()} className="w-10 h-10 rounded-xl bg-indigo-600 text-white disabled:opacity-40 flex items-center justify-center"><Send className="w-4 h-4"/></button></form></> : <div className="flex-1 flex items-center justify-center text-sm text-slate-400">{t.select}</div>}
        {error && <div className="px-4 py-2 text-[10px] text-red-600 bg-red-50 dark:bg-red-950/20">{error}</div>}
      </section>
    </div>
  );
}
