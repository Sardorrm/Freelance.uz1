import React, { useState, useEffect, useRef } from 'react';
import { Language, Freelancer } from '../types';
import { MOCK_FREELANCERS } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';
import { 
  Send, Bot, Sparkles, Smile, ArrowLeft, MoreVertical, 
  Paperclip, Image, MessageSquare, Check, CheckCheck, MapPin, Globe, Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  senderId: 'me' | string;
  text: string;
  timestamp: string;
  status: 'sent' | 'read';
}

interface ChatThread {
  id: string;
  freelancer: Freelancer;
  messages: ChatMessage[];
  unread?: number;
}

interface ChatDashboardProps {
  currentLang: Language;
  initialSelectedId?: string;
  onBackToJobs?: () => void;
}

const CHAT_STRINGS = {
  uz: {
    personalChat: "SHAXSIY CHAT",
    activeChats: "faol muloqotlar",
    escrowChatActive: "XAVFSIZ ESCROW CHAT FAOL",
    exit: "Chiqish",
    noMessages: "Xabarlar yoʻq.",
    clientLabel: "Buyurtmachi",
    protocolTitle: "🔒 XAVFSIZ BIRJA HIMOYA PROTOKOLI",
    protocolDesc: "Humo yoki Uzcard orqali toʻlovlarni amalga oshiring. Biz freelanser ishni yakunlamaguncha mablagʻingizni Escrow hisobida ushlab kafolat beramiz.",
    typingLabel: "Yozyapti...",
    inputPlaceholder: "Xabar yozing (Masalan: Click integratsiyasi qanday ketmoqda?)...",
    alertImage: "Karta oʻtkazmasi yoki portfolio rasmini yuklash uchun faylni chatga sudrang yoki profil sozlamalaridan foydalaning.",
    alertFile: "Hujjat biriktirish uchun profil loyihalaridan foydalansangiz qulayroq.",
    locationPrefix: "Stratega: "
  },
  ru: {
    personalChat: "ЛИЧНЫЙ ЧАТ",
    activeChats: "активные беседы",
    escrowChatActive: "ЗАЩИЩЕННЫЙ ESCROW ЧАТ АКТИВЕН",
    exit: "Выйти",
    noMessages: "Нет сообщений.",
    clientLabel: "Заказчик",
    protocolTitle: "🔒 ЗАЩИЩЕННЫЙ Escrow ПРОТОКОЛ",
    protocolDesc: "Совершайте платежи через Humo или Uzcard. Мы гарантируем безопасность, удерживая ваши средства на счете Escrow до тех пор, пока исполнитель не сдаст работу.",
    typingLabel: "Печатает...",
    inputPlaceholder: "Введите сообщение (например: как продвигается интеграция Click?)...",
    alertImage: "Чтобы загрузить изображение перевода или портфолио, перетащите файл в чат или используйте настройки профиля.",
    alertFile: "Для прикрепления документов удобнее использовать проекты вашего профиля.",
    locationPrefix: " Локация: "
  },
  en: {
    personalChat: "DIRECT CHATS",
    activeChats: "active threads",
    escrowChatActive: "SECURED ESCROW CHAT ONLINE",
    exit: "Exit",
    noMessages: "No messages yet.",
    clientLabel: "Employer",
    protocolTitle: "🔒 SECURE ESCROW PROTOCOL ACTIVE",
    protocolDesc: "Settle secure payments seamlessly via Humo or Uzcard. Funds are held in a double-insured escrow vault until final work gets approved.",
    typingLabel: "Typing...",
    inputPlaceholder: "Type a message (e.g. How is the API integration going?)...",
    alertImage: "To upload screenshots or portfolio files, please drag and drop them inside the chat area directly.",
    alertFile: "Using attachment panels inside active project slots is safer for document exchanges.",
    locationPrefix: "Expertise: "
  }
};

export default function ChatDashboard({ currentLang, initialSelectedId, onBackToJobs }: ChatDashboardProps) {
  const strings = TRANSLATIONS[currentLang];
  const localStrings = CHAT_STRINGS[currentLang] || CHAT_STRINGS.uz;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Threads with enriched dialogues representing real chats
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'f2', // Shahzoda (Designer)
      unread: 1,
      freelancer: MOCK_FREELANCERS.find(f => f.id === 'f2') || MOCK_FREELANCERS[1],
      messages: [
        { id: '1', senderId: 'me', text: "Salom Shahzoda, yangi e-commerce ilova dizayni uchun qancha vaqt ketadi?", timestamp: "18:02", status: 'read' },
        { id: '2', senderId: 'f2', text: "Assalomu alaykum, Sardorbek! 25 tacha tahliliy ekran bo'lsa taxminan 2 hafta yetadi. Portfelimdagi yangi Uzum Bank prototipiga o'xshash qilib tayyorlaymiz.", timestamp: "18:05", status: 'read' },
        { id: '3', senderId: 'f2', text: "Agar xohlasangiz, bugunoq figma loyihasini ochib, simli maketlarni (wireframes) ko'rsatishim mumkin. Escrow (Xavfsiz bitim) orqali boshlasak bo'ladi 💳", timestamp: "18:08", status: 'read' }
      ]
    },
    {
      id: 'f3', // Alisher (SMM)
      freelancer: MOCK_FREELANCERS.find(f => f.id === 'f3') || MOCK_FREELANCERS[2],
      messages: [
        { id: '4', senderId: 'me', text: "Alisher, yangi ochilayotgan restoran reels videolarini montaj qilib bera olasizmi?", timestamp: "12:15", status: 'read' },
        { id: '5', senderId: 'f3', text: "Albatta, do'stim! Biz ijtimoiy tarmoqda trendda turuvchi 12 ta post va Reels strategiyasini tuzamiz. Auditoriyani tez o'stirish sirlari bor.", timestamp: "12:20", status: 'read' }
      ]
    },
    {
      id: 'f4', // Dilnoza (Translator)
      freelancer: MOCK_FREELANCERS.find(f => f.id === 'f4') || MOCK_FREELANCERS[3],
      messages: [
        { id: '6', senderId: 'me', text: "Dilnoza, shartnomalarni bugun kechgacha o'girib bera olasizmi?", timestamp: "Kechagi", status: 'read' },
        { id: '7', senderId: 'f4', text: "Ha, Sardorbek, barcha 45 varaq tayyor va qayta tahrirlandi. PDF formatda shaxsiy pochtangizga yubordim. Tekshirib baho bersangiz mamnun bo'lardim! 🌟", timestamp: "Kechagi", status: 'read' }
      ]
    }
  ]);

  // Selected Chat Thread
  const [activeThreadId, setActiveThreadId] = useState<string>(initialSelectedId || 'f2');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // If initialSelectedId is passed and thread doesn't exist, create it from MOCK_FREELANCERS
  useEffect(() => {
    if (initialSelectedId) {
      setActiveThreadId(initialSelectedId);
      const exists = threads.some(t => t.id === initialSelectedId);
      if (!exists) {
        const targetFreelancer = MOCK_FREELANCERS.find(f => f.id === initialSelectedId);
        if (targetFreelancer) {
          const newThread: ChatThread = {
            id: initialSelectedId,
            freelancer: targetFreelancer,
            messages: [
              {
                id: `init_${Date.now()}`,
                senderId: initialSelectedId,
                text: `Assalomu alaykum, Sardorbek! Profilimga qiziqish bildirganingiz uchun rahmat. Loyihangiz haqida gaplashamiz. Tafsilotlar bo'yicha uchrashuv belgilaylikmi? ☕`,
                timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
                status: 'read'
              }
            ]
          };
          setThreads(prev => [newThread, ...prev]);
        }
      }
    }
  }, [initialSelectedId]);

  // Clean unread count on selection
  useEffect(() => {
    setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, unread: 0 } : t));
  }, [activeThreadId]);

  // Auto Scroll message panel to lower bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, isTyping]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Simulating nice contextual responses based on freelancer specialty
  const getContextualReply = (specialistId: string, userMsg: string): string => {
    const text = userMsg.toLowerCase();
    
    if (specialistId === 'f2') { // Shahzoda UI/UX
      if (text.includes('figma') || text.includes('maket') || text.includes('dizayn')) {
        return currentLang === 'uz' 
          ? "Albatta, Figma faylda barcha qatlamlar (layers) tartibli bo'ladi. Ranglar palitrasi va barcha logotiplarni aslini saqlab loyihalashtiraman!"
          : currentLang === 'ru'
            ? "Конечно, в файле Figma все слои будут аккуратно упорядочены. Я разработаю проект, полностью сохранив цветовую палитру и логотипы!"
            : "Of course! In the Figma file, all layer hierarchies will be kept clean. I will design the app preserving the original color schemes and logotypes!";
      }
      return currentLang === 'uz'
        ? "Zo'r fikr! Buning ustida ish boshlasak arziydi. Ishlarni qabul qilishni Humo yoki Uzcard yordamida kafolatlangan Hisob-kitob (Escrow) tizimida rasmiylashtiramiz."
        : currentLang === 'ru'
          ? "Отличная мысль! Стоит начать работу над этим. Оформим приемку через гарантированные расчеты (Escrow) с помощью Humo или Uzcard."
          : "Great idea! It is absolutely worth starting on this. We can secure the delivery using Humo-based Escrow payments.";
    }

    if (specialistId === 'f1') { // Sardorbek Developer
      if (text.includes('kod') || text.includes('api') || text.includes('server')) {
        return "Node.js va React arxitekturamiz ideal darajada xavfsiz va tezkor bo'ladi. Redis va Postgres qo'shaman.";
      }
      return "Tushunarli! Texnik talablarni yozib chiqing, men platforma orqali sizga aniq smetani taqdim etaman va ishni boshlaymiz.";
    }

    if (specialistId === 'f3') { // Alisher SMM
      return currentLang === 'en' 
        ? "We can boost social media activity up to 3x! Organic growth is my specialty."
        : currentLang === 'ru'
          ? "Мы увеличим активность в соцсетях до 3 раз! Органический рост в трендах — моя специальность."
          : "Instagram tarmoqlarida faollikni 3 baravargacha oshiramiz. Savdoni yurgizish bo'yicha mening mutaxassisligim eng yaxshisi hisoblanadi!";
    }

    if (specialistId === 'f4') { // Dilnoza Translator
      return currentLang === 'uz'
        ? "Tashbiningiz o'rinli. Agar tahrirlar bo'lsa bepul tuzatib beraman. Sizning qoniqishingiz men uchun 5★ reyting tushishigacha teng qadrli!"
        : currentLang === 'ru'
          ? "Абсолютно верно. Если потребуются правки, я внесу их бесплатно. Ваша оценка для меня очень важна!"
          : "Indeed. If revisions are required, I will carry them out free of charge. Your absolute satisfaction is my 5-star priority!";
    }

    return "Tushundim! Juda ma'qul va qiziqarli buyurtma turi ekan. Men siz taqdim etgan barcha materiallarni o'rganib chiqib, yechim tayyorlayman.";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const myMessage: ChatMessage = {
      id: `me_${Date.now()}`,
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Update locally instantly
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, myMessage]
        };
      }
      return t;
    }));

    const userQuery = inputText;
    setInputText('');

    // Trigger typing simulation
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      const responseMsg: ChatMessage = {
        id: `buddy_${Date.now()}`,
        senderId: activeThreadId,
        text: getContextualReply(activeThreadId, userQuery),
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, responseMsg]
          };
        }
        return t;
      }));

    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row h-[620px]">
      
      {/* LEFT COLUMN: CONTACTS LISTS */}
      <div className="w-full md:w-[320px] shrink-0 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/40">
        <div>
          {/* Header Title with quick back */}
          <div className="p-5 border-b dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div>
              <h3 className="font-display font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 text-sm md:text-base">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>{localStrings.personalChat}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5 font-bold">{localStrings.activeChats}</p>
            </div>

            {onBackToJobs && (
              <button 
                onClick={onBackToJobs}
                className="md:hidden text-xs bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 px-2.5 py-1 rounded-xl text-slate-500 dark:text-slate-350 font-mono"
              >
                {localStrings.exit}
              </button>
            )}
          </div>

          {/* Quick Stats banner */}
          <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-indigo-100/10 dark:border-indigo-950/10 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-[10px] font-mono text-indigo-900 dark:text-indigo-400 font-bold">{localStrings.escrowChatActive}</span>
          </div>

          {/* Threads List mapping */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[460px] p-2 space-y-1">
            {threads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const isSelected = thread.id === activeThreadId;

              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center gap-3.5 transition-all text-sm group border ${
                    isSelected 
                      ? 'bg-indigo-650 text-white border-indigo-600 shadow-md shadow-indigo-150/20' 
                      : 'bg-white dark:bg-slate-900 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  {/* Photo with status indicator overlay */}
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 dark:bg-slate-800 shadow-3xs border dark:border-slate-700">
                    <img 
                      src={thread.freelancer.avatar} 
                      alt="" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className={`font-semibold truncate text-xs ${
                        isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {thread.freelancer.name}
                      </h4>
                      <span className={`text-[9px] font-mono ${
                        isSelected ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {lastMsg ? lastMsg.timestamp : ''}
                      </span>
                    </div>

                    <p className={`text-[11px] font-light truncate leading-none ${
                      isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {lastMsg ? lastMsg.text : localStrings.noMessages}
                    </p>
                  </div>

                  {/* Unread dot alerts */}
                  {Boolean(thread.unread) && !isSelected && (
                    <span className="w-5 h-5 bg-indigo-600 text-white text-[9px] font-bold font-mono rounded-full flex items-center justify-center shrink-0">
                      {thread.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Account micro profile bottom */}
        <div className="p-4 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
              SR
            </div>
            <div className="text-left leading-none">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block">Sardorbek</span>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">{localStrings.clientLabel}</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold font-mono text-slate-400 dark:text-slate-500">uzbekistan</span>
        </div>

      </div>

      {/* RIGHT COLUMN: CORE MESSAGE PANEL */}
      <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-950">
        
        {/* Active conversation title header */}
        <div className="px-6 py-4.5 border-b dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <img 
              src={activeThread.freelancer.avatar} 
              alt="" 
              className="w-10 h-10 rounded-xl object-cover border dark:border-slate-800"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {activeThread.freelancer.name}
              </h3>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold font-mono uppercase tracking-wider">
                {activeThread.freelancer.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-450 dark:text-slate-500 text-xs font-mono">
            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg border dark:border-slate-800 text-slate-800 dark:text-slate-200">
              ⚡ {localStrings.locationPrefix}{activeThread.freelancer.location.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Message Streams Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-slate-950/20 max-h-[460px]">
          
          {/* Welcome disclaimer card */}
          <div className="p-4 bg-emerald-500/5 text-center text-slate-500 rounded-2xl border border-emerald-500/10 space-y-1 max-w-md mx-auto">
            <h5 className="text-[11px] font-bold text-slate-800 dark:text-white font-mono uppercase">{localStrings.protocolTitle}</h5>
            <p className="text-[10px] text-slate-400 dark:text-slate-450 leading-normal font-light">
              {localStrings.protocolDesc}
            </p>
          </div>

          {activeThread.messages.map((msgRef) => {
            const isMe = msgRef.senderId === 'me';

            return (
              <div 
                key={msgRef.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md p-4 rounded-2xl text-xs space-y-1.5 ${
                  isMe 
                    ? 'bg-indigo-650 text-white rounded-br-none shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-bl-none text-slate-800 dark:text-slate-200 shadow-3xs'
                }`}>
                  <p className="leading-relaxed font-light whitespace-pre-wrap text-left">{msgRef.text}</p>
                  
                  <div className={`flex items-center justify-end gap-1 font-mono text-[9px] ${
                    isMe ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    <span>{msgRef.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-indigo-305 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Simulated Typing bubble */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-3.5 rounded-2xl rounded-bl-none flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold font-mono ml-1">{localStrings.typingLabel}</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input box Form bottom */}
        <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-slate-800 flex gap-2 items-center bg-white dark:bg-slate-900">
          
          {/* File tools dummy */}
          <div className="flex gap-1">
            <button 
              type="button" 
              title={localStrings.alertImage} 
              onClick={() => alert(localStrings.alertImage)}
              className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Image className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              title={localStrings.alertFile} 
              onClick={() => alert(localStrings.alertFile)}
              className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <input 
            type="text" 
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={localStrings.inputPlaceholder}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 text-xs text-slate-800 dark:text-white rounded-xl focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 w-10 shrink-0 bg-indigo-650 hover:bg-slate-950 dark:hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
