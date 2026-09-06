import React, { useState } from 'react';
import { Language, LanguageStrings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PlusCircle, User, Menu, X, Check, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'home' | 'jobs' | 'freelancers' | 'post' | 'wallet' | 'profile' | 'cabinet' | 'chats' | 'settings';
  onTabChange: (tab: 'home' | 'jobs' | 'freelancers' | 'post' | 'wallet' | 'profile' | 'cabinet' | 'chats' | 'settings') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  userSession: { name: string; email: string } | null;
  onLogout: () => void;
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
  onCurrencyChange: (currency: 'UZS' | 'USD' | 'EUR') => void;
}

export default function Header({ currentLang, onLanguageChange, activeTab, onTabChange, onOpenAuth, userSession, onLogout, selectedCurrency, onCurrencyChange }: HeaderProps) {
  const strings: LanguageStrings = TRANSLATIONS[currentLang];
  const [open, setOpen] = useState<'lang' | 'currency' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currencies = [{ code: 'UZS' as const, label: 'Soʻm', flag: '🇺🇿' }, { code: 'USD' as const, label: 'Dollar', flag: '🇺🇸' }, { code: 'EUR' as const, label: 'Euro', flag: '🇪🇺' }];
  const languages = [{ code: 'uz' as Language, name: 'Oʻzbekcha', flag: '🇺🇿' }, { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' }, { code: 'en' as Language, name: 'English', flag: '🇬🇧' }];
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];
  const nav = [
    { id: 'home' as const, icon: '⌂', label: currentLang === 'uz' ? 'Bosh sahifa' : currentLang === 'ru' ? 'Главная' : 'Home' },
    { id: 'jobs' as const, icon: '▣', label: strings.findJobs },
    { id: 'freelancers' as const, icon: '♙', label: strings.findFreelancers },
    ...(userSession ? [{ id: 'chats' as const, icon: '◌', label: currentLang === 'uz' ? 'Xabarlar' : currentLang === 'ru' ? 'Сообщения' : 'Messages' }, { id: 'cabinet' as const, icon: '◉', label: currentLang === 'uz' ? 'Kabinetim' : currentLang === 'ru' ? 'Мой кабинет' : 'My cabinet' }] : [])
  ];
  const go = (tab: typeof nav[number]['id']) => { onTabChange(tab); setMobileMenuOpen(false); };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl shadow-[0_1px_20px_rgba(15,23,42,0.04)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center justify-between gap-4">
          <button onClick={() => go('home')} className="group flex items-center gap-3 shrink-0" aria-label="Freelance.uz">
            <span className="relative w-10 h-10 rounded-[14px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white flex items-center justify-center font-display font-extrabold text-xl shadow-lg shadow-indigo-600/20 group-hover:-translate-y-0.5">F<span className="absolute inset-0 rounded-[14px] ring-1 ring-white/30" /></span>
            <span className="text-left hidden sm:block"><span className="block font-display text-[19px] font-extrabold tracking-[-0.03em] text-slate-950 dark:text-white">Freelance<span className="text-indigo-600">.uz</span></span><span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Uzbekistan • Freelance</span></span>
          </button>
          <div className="hidden lg:flex items-center gap-1 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 p-1">
            {nav.map(item => <button key={item.id} onClick={() => go(item.id)} className={`px-3.5 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2 ${activeTab === item.id ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}><span className="text-sm opacity-80">{item.icon}</span>{item.label}</button>)}
            {userSession?.email.trim().toLowerCase() === 'ramanovsardor8@gmail.com' && <button onClick={() => go('wallet')} className={`px-3.5 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2 ${activeTab === 'wallet' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-indigo-600'}`}>◈ Admin</button>}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative"><button onClick={() => setOpen(open === 'lang' ? null : 'lang')} className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900 text-xs font-bold flex items-center gap-2 hover:border-indigo-200"><span>{currentLanguage.flag}</span><span className="hidden xl:inline">{currentLanguage.name}</span><ChevronDown className="w-3.5 h-3.5 text-slate-400" /></button><AnimatePresence>{open === 'lang' && <><button aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(null)} /><motion.div initial={{opacity:0,y:6,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:.98}} className="absolute right-0 top-12 z-50 w-48 p-1.5 rounded-2xl border border-slate-200 bg-white shadow-2xl">{languages.map(l => <button key={l.code} onClick={() => { onLanguageChange(l.code); setOpen(null); }} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-50"><span className="flex items-center gap-2"><span>{l.flag}</span>{l.name}</span>{l.code === currentLang && <Check className="w-3.5 h-3.5 text-indigo-600" />}</button>)}</motion.div></>}</AnimatePresence></div>
            <div className="relative"><button onClick={() => setOpen(open === 'currency' ? null : 'currency')} className="h-10 px-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold flex items-center gap-2"><span>{currentCurrency.flag}</span>{currentCurrency.code}<ChevronDown className="w-3.5 h-3.5 opacity-60" /></button><AnimatePresence>{open === 'currency' && <><button aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(null)} /><motion.div initial={{opacity:0,y:6,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:.98}} className="absolute right-0 top-12 z-50 w-44 p-1.5 rounded-2xl border border-slate-200 bg-white shadow-2xl">{currencies.map(c => <button key={c.code} onClick={() => { onCurrencyChange(c.code); setOpen(null); }} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-50"><span className="flex items-center gap-2"><span>{c.flag}</span>{c.label} ({c.code})</span>{c.code === selectedCurrency && <Check className="w-3.5 h-3.5 text-indigo-600" />}</button>)}</motion.div></>}</AnimatePresence></div>
            <button onClick={() => go('settings')} className={`h-10 w-10 rounded-xl border flex items-center justify-center ${activeTab === 'settings' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/80 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600'}`} title="Sozlamalar"><Settings className="w-4 h-4" /></button>
            <button onClick={() => onTabChange('post')} className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-600/15"><PlusCircle className="w-4 h-4" />{strings.postJob}</button>
            {userSession ? <div className="flex items-center gap-2 ml-1"><div className="max-w-[150px] flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800"><User className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs font-bold truncate">{userSession.name}</span></div><button onClick={onLogout} className="text-[11px] font-bold text-slate-400 hover:text-rose-500">{strings.logout}</button></div> : <div className="flex items-center gap-1 ml-1"><button onClick={() => onOpenAuth('login')} className="h-10 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600">{strings.login}</button><button onClick={() => onOpenAuth('register')} className="h-10 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-lg">{strings.register}</button></div>}
          </div>
          <div className="md:hidden flex items-center gap-2"><button onClick={() => onLanguageChange(currentLang === 'uz' ? 'ru' : currentLang === 'ru' ? 'en' : 'uz')} className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-900 text-sm">{currentLanguage.flag}</button><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button></div>
        </div>
      </div>
      <AnimatePresence>{mobileMenuOpen && <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="md:hidden border-t border-slate-200/70 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl"><div className="p-4 space-y-1.5">{nav.map(item => <button key={item.id} onClick={() => go(item.id)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'}`}><span>{item.icon}</span>{item.label}</button>)}{userSession?.email.trim().toLowerCase() === 'ramanovsardor8@gmail.com' && <button onClick={() => go('wallet')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 ${activeTab === 'wallet' ? 'bg-slate-950 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}>◈ Admin panel</button>}<button onClick={() => go('settings')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}><Settings className="w-4 h-4" />Sozlamalar</button><button onClick={() => { onTabChange('post'); setMobileMenuOpen(false); }} className="w-full px-4 py-3 rounded-xl bg-emerald-500 text-white text-sm font-extrabold flex items-center gap-2"><PlusCircle className="w-4 h-4" />{strings.postJob}</button>{userSession && <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800"><div className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2 mb-2">{userSession.name}<span className="block text-slate-400 font-medium mt-0.5">{userSession.email}</span></div><button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full py-2.5 rounded-xl border border-rose-100 text-xs font-bold text-rose-500">{strings.logout}</button></div>}</div></motion.div>}</AnimatePresence>
    </nav>
  );
}
