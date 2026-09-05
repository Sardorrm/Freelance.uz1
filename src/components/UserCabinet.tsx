import React from 'react';
import { motion } from 'motion/react';
import { User, BriefcaseBusiness, Send, MessageSquare, Star, Settings, WalletCards, ArrowRight, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Job, Freelancer, Language } from '../types';

interface Props {
  currentLang: Language;
  user: { uid: string; name: string; email: string };
  profile?: Freelancer;
  jobs: Job[];
  onProfile: () => void;
  onJobs: () => void;
  onChats: () => void;
  onSettings: () => void;
  onPostJob: () => void;
}

const labels = {
  uz: { cabinet:'Mening kabinetim', welcome:'Xush kelibsiz', overview:'Hisobingiz bo‘yicha umumiy ko‘rinish', profile:'Profilim', jobs:'Mening buyurtmalarim', proposals:'Takliflarim', chats:'Xabarlar', wallet:'Balans', security:'Xavfsizlik', settings:'Sozlamalar', post:'Buyurtma joylash', empty:'Hozircha ma’lumot yo‘q', active:'Faol', total:'Jami', completed:'Tugallangan', private:'Shaxsiy kabinet', protected:'Ma’lumotlaringiz himoyalangan' },
  ru: { cabinet:'Мой кабинет', welcome:'Добро пожаловать', overview:'Обзор вашего аккаунта', profile:'Мой профиль', jobs:'Мои заказы', proposals:'Мои предложения', chats:'Сообщения', wallet:'Баланс', security:'Безопасность', settings:'Настройки', post:'Разместить заказ', empty:'Пока нет данных', active:'Активные', total:'Всего', completed:'Завершено', private:'Личный кабинет', protected:'Ваши данные защищены' },
  en: { cabinet:'My cabinet', welcome:'Welcome', overview:'Your account overview', profile:'My profile', jobs:'My jobs', proposals:'My proposals', chats:'Messages', wallet:'Balance', security:'Security', settings:'Settings', post:'Post a job', empty:'Nothing here yet', active:'Active', total:'Total', completed:'Completed', private:'Private cabinet', protected:'Your data is protected' }
}[currentLang];

export default function UserCabinet({ currentLang, user, profile, jobs, onProfile, onJobs, onChats, onSettings, onPostJob }: Props) {
  const ownJobs = jobs.filter(j => j.clientId === user.uid);
  const activeJobs = ownJobs.filter(j => !['completed','closed'].includes((j as any).status));
  const completedJobs = ownJobs.filter(j => ['completed','closed'].includes((j as any).status));
  const displayName = profile?.name || user.name;
  const avatar = profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4f46e5&color=fff&size=256`;

  const cards = [
    { icon: BriefcaseBusiness, title: labels.jobs, value: ownJobs.length, meta: `${activeJobs.length} ${labels.active.toLowerCase()}`, action: onJobs },
    { icon: Send, title: labels.proposals, value: 0, meta: labels.empty, action: onJobs },
    { icon: MessageSquare, title: labels.chats, value: 0, meta: labels.empty, action: onChats },
    { icon: WalletCards, title: labels.wallet, value: '—', meta: 'UZS', action: undefined },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-5">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-[0_20px_70px_-35px_rgba(15,23,42,.35)] p-5 sm:p-7">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <img src={avatar} alt={displayName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-indigo-950/50" referrerPolicy="no-referrer" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">{labels.private}</span><ShieldCheck className="w-4 h-4 text-emerald-500" /></div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight truncate">{labels.welcome}, {displayName}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onProfile} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition"><User className="w-4 h-4" />{labels.profile}</button>
            <button onClick={onPostJob} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"><Plus className="w-4 h-4" />{labels.post}</button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => { const Icon = card.icon; return <motion.button key={card.title} onClick={card.action} whileHover={{ y: -2 }} className="text-left rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all disabled:opacity-100">
          <div className="flex items-start justify-between gap-2"><span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Icon className="w-5 h-5" /></span><span className="text-[10px] font-bold text-slate-400">0{index + 1}</span></div>
          <div className="mt-4 text-sm font-bold">{card.title}</div><div className="mt-1 text-2xl font-display font-extrabold">{card.value}</div><div className="mt-1 text-[11px] text-slate-400">{card.meta}</div>
        </motion.button> })}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_.6fr] gap-5">
        <section className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5"><div><h2 className="text-lg font-display font-extrabold">{labels.jobs}</h2><p className="text-xs text-slate-400 mt-1">{labels.overview}</p></div><button onClick={onJobs} className="text-xs font-bold text-indigo-600 flex items-center gap-1">{labels.total} <ArrowRight className="w-3.5 h-3.5" /></button></div>
          {ownJobs.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 py-12 text-center"><BriefcaseBusiness className="w-8 h-8 mx-auto text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-500">{labels.empty}</p><button onClick={onPostJob} className="mt-4 text-xs font-bold text-indigo-600">+ {labels.post}</button></div> : <div className="space-y-2">{ownJobs.slice(0,5).map(job => <div key={job.id} className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3"><div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><BriefcaseBusiness className="w-4 h-4 text-slate-500" /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold truncate">{job.title}</p><p className="text-[11px] text-slate-400">{job.budget.toLocaleString()} {job.currency} · {job.proposalsCount} proposals</p></div><span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">{labels.active}</span></div>)}</div>}
        </section>
        <section className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-6">
          <h2 className="text-lg font-display font-extrabold">{labels.security}</h2><p className="text-xs text-slate-400 mt-1">{labels.protected}</p>
          <div className="mt-5 space-y-3"><div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><div><p className="text-sm font-bold">Firebase account</p><p className="text-[11px] text-slate-400">UID bilan bog‘langan</p></div></div><button onClick={onSettings} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition"><span className="flex items-center gap-2 text-sm font-bold"><Settings className="w-4 h-4" />{labels.settings}</span><ArrowRight className="w-4 h-4 text-slate-400" /></button></div>
        </section>
      </div>
      <p className="text-center text-[11px] text-slate-400 pb-2">{labels.protected} · {user.uid.slice(0, 8)}••••</p>
    </motion.div>
  );
}
