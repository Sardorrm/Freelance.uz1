import React, { useState } from 'react';
import { Language, Job, Freelancer, JobCategory } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { convertAndFormat } from '../data/mockData';
import { 
  Briefcase, Users, ShieldCheck, Zap, ArrowRight, Star, 
  TrendingUp, Search, Layers, Compass, CheckCircle2, Award, ChevronRight, Lock
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeDashboardProps {
  currentLang: Language;
  jobs: Job[];
  freelancers: Freelancer[];
  activeTab: 'home' | 'jobs' | 'freelancers' | 'post' | 'wallet' | 'profile' | 'chats';
  onTabChange: (tab: 'home' | 'jobs' | 'freelancers' | 'post' | 'wallet' | 'profile' | 'chats') => void;
  onPostJobClick: () => void;
  onSearchQuery: (query: string) => void;
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
  userSession: { name: string; email: string } | null;
  onSelectFreelancer: (id: string) => void;
  onOpenPaymentModal?: () => void;
}

export default function HomeDashboard({
  currentLang,
  jobs,
  freelancers,
  onTabChange,
  onPostJobClick,
  onSearchQuery,
  selectedCurrency,
  userSession,
  onSelectFreelancer,
  onOpenPaymentModal
}: HomeDashboardProps) {
  const strings = TRANSLATIONS[currentLang];
  const [internalSearch, setInternalSearch] = useState('');
  
  // Quick search autocomplete suggestions
  const suggestions = [
    { label: 'React Developer', search: 'React' },
    { label: 'Logo va UX/UI Dizayn', search: 'Design' },
    { label: 'Telegram Bot', search: 'Bot' },
    { label: 'SMM va Seo', search: 'SMM' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQuery(internalSearch);
    onTabChange('jobs');
  };

  const handleSuggestionClick = (query: string) => {
    onSearchQuery(query);
    onTabChange('jobs');
  };

  // Safe checks for stats
  const totalBalanceUZS = 48250000;
  const activeEscrowAmount = 159400000;

  // Custom visual categories with counts and vibrant modern gradients
  const dashboardCategories: { id: JobCategory; icon: string; title: string; color: string; count: number }[] = [
    { id: 'development', icon: '💻', title: strings.development, color: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30 text-blue-700', count: 1420 },
    { id: 'design', icon: '🎨', title: strings.design, color: 'from-pink-500/10 to-rose-500/10 hover:border-pink-500/30 text-rose-700', count: 980 },
    { id: 'marketing', icon: '📈', title: strings.marketing, color: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/30 text-emerald-700', count: 740 },
    { id: 'translation', icon: '✍️', title: strings.translation, color: 'from-amber-500/10 to-orange-500/10 hover:border-amber-500/30 text-amber-700', count: 420 },
    { id: 'video', icon: '🎥', title: strings.video, color: 'from-violet-500/10 to-purple-500/10 hover:border-violet-500/30 text-purple-700', count: 310 },
    { id: 'other', icon: '🌐', title: strings.other, color: 'from-slate-500/10 to-slate-600/10 hover:border-slate-500/30 text-slate-700', count: 650 }
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Supercharged Search Deck with suggestions */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden max-w-5xl mx-auto -mt-4">
        {/* Abstract background blobs for luxurious tech vibe */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-sm font-mono font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center justify-center md:justify-start gap-1.5">
              <Compass className="w-4 h-4 animate-spin-slow" /> Intellektual Qidiruv Tizimi
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Platformadagi barcha loyihalar va mutaxassislar portfelini onlayn skanerlash</p>
          </div>

          <div className="relative flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 w-5 h-5 text-slate-450 dark:text-slate-500" />
              <input
                type="text"
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                placeholder={strings.searchPlaceholder}
                className="w-full text-sm font-semibold pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-550/10 focus:border-indigo-500 text-slate-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-indigo-520/20 active:scale-[0.98]"
            >
              Qidirish
            </button>
          </div>

          {/* Rapid Suggestions Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1.5 justify-center md:justify-start">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Tezkor:</span>
            {suggestions.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleSuggestionClick(s.search)}
                className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-indigo-950 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800 transition-colors cursor-pointer"
              >
                🔍 {s.label}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Spectacular Bento Menu Command Deck (Bosh Menyu Hub) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              Tizim Boshqaruv Paneli
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Har bir yo'nalishga bir soniyalik tezkor o'tish darchalari va doimiy monitoring.</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded border border-indigo-105/35">
            Xizmat boshqaruvi
          </span>
        </div>

        {/* Bento Cards 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Card 1: JobList Bento Hub (span 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-indigo-500/20 group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      Ishlar & Buyurtmalar Birjasi
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Mijozlardan faol e'lon qilingan loyihalar feedi</p>
                  </div>
                </div>
                <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-black text-[10px] px-2.5 py-1 rounded border border-indigo-200/30">
                  {jobs.length} ta LOYIHA
                </span>
              </div>

              {/* Mini feed of latest 2 jobs inside the card */}
              <div className="mt-5 space-y-2.5">
                {jobs.slice(0, 2).map((job) => (
                  <div 
                    key={job.id} 
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/20 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 transition-colors cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      onSearchQuery(job.title);
                      onTabChange('jobs');
                    }}
                  >
                    <div className="truncate pr-4">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{job.title}</span>
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">{job.clientName} • {job.skills.slice(0, 2).join(', ')}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-black text-emerald-600 block">{convertAndFormat(job.budget, job.currency, selectedCurrency)}</span>
                      <span className="text-[8px] font-mono text-slate-400 uppercase font-bold">{job.type === 'fixed' ? 'Fixed' : 'Soatbay'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
               onClick={() => onTabChange('jobs')}
               className="mt-6 w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-indigo-100/40"
            >
              <span>{strings.findJobs}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: FreelancerList Bento Hub (span 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-emerald-500/20 group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      Mutaxassislar Bazasi
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">O'zbekistonning top malakali ijrochilari</p>
                  </div>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-black text-[10px] px-2.5 py-1 rounded border border-emerald-200/30 animate-pulse">
                  ONLINE ☄️
                </span>
              </div>

              {/* Showcase Mini Specialist Row with Neon checked badges */}
              <div className="mt-5 space-y-3">
                {freelancers.slice(0, 3).map((f) => (
                  <div 
                    key={f.id}
                    className="flex items-center gap-3 p-2 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/10 rounded-xl transition-colors cursor-pointer"
                    onClick={() => onSelectFreelancer(f.id)}
                  >
                    <div className="relative shrink-0">
                      <img src={f.avatar} alt={f.name} className="w-9 h-9 rounded-full object-cover border border-emerald-100" />
                      <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[6px] text-white">✓</span>
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{f.name}</span>
                        <div className="flex items-center text-[10px] text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 shrink-0" />
                          <span>{f.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">{f.title}</span>
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-750 shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {f.hourlyRate ? `${convertAndFormat(f.hourlyRate, f.currency, selectedCurrency)}/so'm` : 'Kelishilgan'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
               onClick={() => onTabChange('freelancers')}
               className="mt-6 w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-100/40"
            >
              <span>{strings.findFreelancers}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Escrow Security & Wallet Admin (span 6) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-amber-500/20 group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Xavfsiz Kelishuv Kafolati
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Mablag'lar 100% himoyalangan hisobda turadi</p>
                  </div>
                </div>
                <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono font-black text-[9px] px-2.5 py-1 rounded border border-amber-200/30">
                  ESCROW ACTIVE
                </span>
              </div>

              {/* Conditional design for Sardorbek vs regular user */}
              {userSession?.email === "ramanovsardor8@gmail.com" ? (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-250/30 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      Sardorbek (Admin kabinet)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono">Xizmat Balansingiz</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white block tracking-tight">
                        {convertAndFormat(totalBalanceUZS, 'UZS', selectedCurrency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono">Garovdagi joriylar</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white block tracking-tight">
                        {convertAndFormat(activeEscrowAmount, 'UZS', selectedCurrency)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-normal pt-1 border-t border-slate-200/50 dark:border-slate-800">
                    Soliq va komissiyalar toʻlovini boshqarish yoki Humo/Visa qartasiga pul tushirish uchun quyidagi tugmani bosing.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3 text-left">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-normal"><b className="font-bold text-slate-800 dark:text-white">Garov:</b> Buyurtmachi mablagʻni zaxira qiladi, xizmat uni xavfsiz muzlatib qoʻyadi.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-normal"><b className="font-bold text-slate-800 dark:text-white">Yetkazish:</b> Frilanser ishni a’lo darajada bajaradi va topshiriq skanerlanadi.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-normal"><b className="font-bold text-slate-800 dark:text-white">Toʻlov:</b> Tasdiqlanishi bilan mablagʻ frilanser kartasiga avtomat oʻtkaziladi.</p>
                  </div>
                </div>
              )}
            </div>

            {userSession?.email === "ramanovsardor8@gmail.com" ? (
              <button
                onClick={() => onTabChange('wallet')}
                className="mt-6 w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-amber-600/10"
              >
                <span>Hamyonni boshqarish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenPaymentModal) onOpenPaymentModal();
                }}
                className="mt-6 w-full py-3 px-4 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/50 text-amber-750 dark:text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-100/40 text-center"
              >
                <span>Xavfsiz bitim qoidalari 🛡️</span>
              </button>
            )}
          </div>

          {/* Card 4: Action Post Jobs Creator (span 6) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-indigo-500/20 group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Zap className="w-5 h-5 text-indigo-550" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Loyihangiz Bormi?
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Mutaxassislardan arzon va sifatli takliflar oling</p>
                  </div>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-750 dark:text-emerald-300 font-mono font-bold text-[9px] px-2.5 py-1 rounded border border-emerald-100/30">
                  BEPUL JOYLASH
                </span>
              </div>

              {/* Illustration list of perks inside */}
              <div className="mt-5 space-y-3 text-left">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <CheckCircle2 className="w-4 h-4 text-emerald-550 shrink-0" />
                  <span>Mutlaqo bepul va oson shartnoma</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <CheckCircle2 className="w-4 h-4 text-emerald-550 shrink-0" />
                  <span>15 daqiqa ichida birinchi mutaxassis arizasi</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <CheckCircle2 className="w-4 h-4 text-emerald-550 shrink-0" />
                  <span>Telegram va poʻchta orqali bildirishnomalar</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <CheckCircle2 className="w-4 h-4 text-emerald-550 shrink-0" />
                  <span>Bitim yetkazilgandagina toʻlov yechiladi</span>
                </div>
              </div>
            </div>

            <button
               onClick={onPostJobClick}
               className="mt-6 w-full py-3.5 px-4 bg-gradient-to-r from-indigo-650 to-indigo-600 hover:from-indigo-700 hover:to-indigo-650 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-600/15"
            >
              <span>{strings.postJob} ☄️</span>
            </button>
          </div>

        </div>
      </section>

      {/* Categories quick selectors */}
      <section className="space-y-5 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-mono font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            ⭐ {strings.popularCategories}
          </h3>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Har bir kategoriya bo‘yicha tezkor saralash</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {dashboardCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSearchQuery(''); // Clear general search query first
                // Trigger quick category filter jump
                onSearchQuery(cat.id === 'other' ? 'boshqa' : cat.title);
                onTabChange('jobs');
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-md flex flex-col items-center justify-center gap-2.5 relative overflow-hidden group"
            >
              {/* Subtle top indicator bar representing the category color */}
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${cat.color}`} />
              
              <div className="text-2xl filter drop-shadow group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-455 transition-colors capitalize leading-tight">
                {cat.title}
              </div>
              <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-750">
                {cat.count} ta buyurtma
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works info-section with elegant clean design cards */}
      <section className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-mono font-bold text-indigo-600 uppercase tracking-widest">{strings.howItWorks}</h3>
          <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">O'zbekistondagi milliy platforma xizmatidan xavfsiz foydalanish tartibi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
            <div className="text-xl">🤵</div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Buyurtmachilar uchun</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1.5">
                Ishingiz uchun e'lon berining, takliflarni solishtiring va eng munosib frilanserni tanlang. Pul faqat ish to'liq bitganidan so'nggina to'lanadi.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
            <div className="text-xl">👩‍💻</div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Frilanserlar uchun</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1.5">
                O'z portfoliongizni yaratib, tekshirilgan va tasdiqlangan loyihalarga arizalar topshiring va daromadni Humo yoki Visa kartangizga oling!
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
            <div className="text-xl">💎</div>
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Kafolatlangan oʻtkazmalar</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1.5">
                Hukumat standarti doirasida, barcha bitimlarimiz shifrlangan. Platforma o'rtachilik komissiyasi atigi 5% gacha tashkil qiladi holos.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
