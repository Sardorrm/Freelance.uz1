import React, { useState } from 'react';
import { Language } from '../types';
import { 
  X, ShieldCheck, Scale, CreditCard, ChevronRight, Calculator,
  Lock, ArrowRight, DollarSign, FileText, CheckCircle2, RefreshCw, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
}

const MODAL_STRINGS = {
  uz: {
    title: "Freelance.uz Toʻlov Tizimi & Xavfsiz Bitim",
    subtitle: "Mablagʻingiz va mehnatingiz davlat standartlari darajasida himoyalangan.",
    tabEscrow: "🛡️ Xavfsiz Bitim (Escrow)",
    tabFees: "📊 Komissiyalar",
    tabArbitrage: "⚖️ Arbitraj (Nizo)",
    tabMethods: "💳 Toʻlov Turlari",
    
    calcTitle: "🧮 Komissiya Kalkulyatori",
    calcDesc: "Loyiha byudjeti boʻyicha taqsimotni sinab koʻring:",
    calcPlaceholder: "Byudjet miqdorini kiriting...",
    calcFlShare: "Frilanser oladi (95%)",
    calcFee: "Platforma Kafolati / Sugʻurta (5%)",
    calcTotal: "Jami muzlatilgan summa",
    
    step1Title: "1. Bitim kelishuvi",
    step1Desc: "Buyurtmachi va frilanser shartlarni tasdiqlaydilar. Buyurtmachi mablagʻni plastik karta (Humo/Uzcard/Visa) orqali kiritadi.",
    step2Title: "2. Muzlatish (Escrow)",
    step2Desc: "Freelance.uz mablagʻni maxsus tranzit hisobda (Xavfsiz Bitim) xavfsiz muzlatib qoʻyadi. Frilanser loyihani boshlaydi.",
    step3Title: "3. Ish topshirilishi",
    step3Desc: "Frilanser vazifani toʻliq bajarib topshiradi. Buyurtmachi natijani tekshiradi va tasdiqlaydi.",
    step4Title: "4. Toʻlov oʻtkazilishi",
    step4Desc: "Tasdiqlanishi bilan muzlatilgan mablagʻ frilanserning koʻrsatilgan kartasiga bir soniyada kelib tushadi.",
    
    arbitrageTitle: "Nizolar va Arbitraj Tizimi qanday ishlaydi?",
    arbitrageDesc1: "Agar loyiha yakunida buyurtmachi va ijrochi oʻrtasida kelishmovchilik kelib chiqsa (masalan, ish toʻliq bajarilmagan yoki talablarga javob bermasa), har ikki tomon ham 'Arbitrajga berish' tugmasini bosishi mumkin.",
    arbitrageDesc2: "Bunda loyiha va uning chat tarixi Freelance.uz professional hakamlari (arbitraj komissiyasi) tomonidan mutlaqo mustaqil ravishda oʻrganib chiqiladi.",
    arbitrageDecision: "Hakamlar qaroriga koʻra mablagʻ loyihadagi haqiqiy bajarilgan ulushga qarab adolatli taqsimlanadi.",
    
    methodsTitle: "Qanday toʻlov tizimlari qoʻllab-quvvatlanadi?",
    methodsDesc: "Biz Oʻzbekiston hududida eng ishonchli va ommabop milliy hamda xalqaro toʻlov shlyuzlari bilan ishlaymiz:",
    methodHumo: "Humo & Uzcard (Soniya ichida milliy valyutada oʻtkazmalar)",
    methodVisa: "Visa & MasterCard (Chet ellik mijozlar uchun xalqaro valyutadagi bitimlar)",
    methodLegal: "Yuridik shaxslar uchun bank hisob-raqami orqali shartnoma (schet-faktura)",
    
    escrowSecuredBadge: "💯 KAFOLATLANGAN BITIM",
    arbitrageStatus: "Hakamlar kengashi faol",
    zeroRiskTitle: "Frilanser uchun 0% xavf",
    zeroRiskDesc: "Siz loyihaga kirishishdan oldin buyurtmachi pulni toʻlaganiga 100% amin boʻlasiz. Ishingiz sifati kafolat boʻladi.",
    zeroRiskClientTitle: "Buyurtmachi uchun 0% xavf",
    zeroRiskClientDesc: "Siz faqat tayyor va sifatli natijani qabul qilganingizdan keyingina pul frilanserga oʻtadi."
  },
  ru: {
    title: "Платежная система & Безопасная сделка Freelance.uz",
    subtitle: "Ваши средства и труд защищены на уровне национальных стандартов безопасности.",
    tabEscrow: "🛡️ Безопасная Сделка (Escrow)",
    tabFees: "📊 Комиссии",
    tabArbitrage: "⚖️ Арбитраж (Споры)",
    tabMethods: "💳 Способы оплаты",
    
    calcTitle: "🧮 Калькулятор Распределения",
    calcDesc: "Посмотрите, как распределяется сумма сделки:",
    calcPlaceholder: "Введите сумму бюджета...",
    calcFlShare: "Получит исполнитель (95%)",
    calcFee: "Страховой сбор платформы (5%)",
    calcTotal: "Итого депонировано",
    
    step1Title: "1. Согласование условий",
    step1Desc: "Заказчик и исполнитель утверждают ТЗ. Заказчик вносит оплату через Humo, Uzcard или Visa.",
    step2Title: "2. Депонирование средств",
    step2Desc: "Freelance.uz безопасно замораживает средства на транзитном счете. Исполнитель приступает к работе.",
    step3Title: "3. Сдача готового проекта",
    step3Desc: "Фрилансер сдаёт работу. Заказчик проверяет результат на соответствие требованиям.",
    step4Title: "4. Выплата и зачисление",
    step4Desc: "После подтверждения замороженные средства мгновенно отправляются на карту исполнителя.",
    
    arbitrageTitle: "Как работает система споров и Арбитраж?",
    arbitrageDesc1: "Если в процессе работы возникают разногласия (например, качество не соответствует ТЗ), любая сторона может передать проект в Арбитраж.",
    arbitrageDesc2: "Арбитражные специалисты Freelance.uz детально изучают переписку, файлы проекта и утвержденное ТЗ.",
    arbitrageDecision: "На основе беспристрастного анализа формируется решение о возврате средств или выплате исполнителю.",
    
    methodsTitle: "Какие платежные шлюзы интегрированы?",
    methodsDesc: "Мы работаем с самыми надежными национальными и зарубежными платежными шлюзами:",
    methodHumo: "Humo и Uzcard (Мгновенные переводы в национальной валюте)",
    methodVisa: "Visa и MasterCard (Международные сделки для иностранных заказчиков)",
    methodLegal: "Безналичный расчет для юр. лиц (договор, закрывающие акты, счет-фактура)",
    
    escrowSecuredBadge: "💯 БЕЗОПАСНАЯ СДЕЛКА 100%",
    arbitrageStatus: "Комиссия арбитров активна",
    zeroRiskTitle: "0% риска для фрилансера",
    zeroRiskDesc: "Вы приступаете к работе только после того, как средства заморожены на платформе.",
    zeroRiskClientTitle: "0% риска для заказчика",
    zeroRiskClientDesc: "Средства переводятся только после успешного принятия качественной работы."
  },
  en: {
    title: "Freelance.uz Payment Escrow System",
    subtitle: "Your financial transactions and deliveries are secured at world-class standards.",
    tabEscrow: "🛡️ Safe Deals (Escrow)",
    tabFees: "📊 Platform Fee",
    tabArbitrage: "⚖️ Dispute Arbitrage",
    tabMethods: "💳 Settlement Gateways",
    
    calcTitle: "🧮 Ledger Calculator",
    calcDesc: "Calculate how the budget distribution works:",
    calcPlaceholder: "Enter budget sum...",
    calcFlShare: "Freelancer payout (95%)",
    calcFee: "Platform Escrow guarantee (5%)",
    calcTotal: "Total escrow hold",
    
    step1Title: "1. Agreement & Deposit",
    step1Desc: "Client and freelancer agree to terms. Client securely deposits the budget via credit card.",
    step2Title: "2. Escrow Locking",
    step2Desc: "Freelance.uz holds funds safely in a transit account. Freelancer begins the milestone execution.",
    step3Title: "3. Milestone Verification",
    step3Desc: "Freelancer submits the source project. Client inspects results and is satisfied with proof.",
    step4Title: "4. Direct Release",
    step4Desc: "Funds are immediately unfrozen and credited to the freelancer's card ledger instantly.",
    
    arbitrageTitle: "Disputes & Arbitrage Board",
    arbitrageDesc1: "If conflict arises regarding the quality of delivery, either party can request a review from our Arbitrage board.",
    arbitrageDesc2: "Certified moderators analyze the agreements, revisions history, and correspondence strictly inside the platform.",
    arbitrageDecision: "A final partial or full split is decided impartially, ensuring complete escrow enforcement safety.",
    
    methodsTitle: "Supported Financial Gateways",
    methodsDesc: "We support the most reliable local and international processors:",
    methodHumo: "Humo & Uzcard (Instant national currency settlements)",
    methodVisa: "Visa & MasterCard (Cross-border foreign currency processing)",
    methodLegal: "B2B bank invoicing for enterprise agencies & corporations",
    
    escrowSecuredBadge: "💯 VERIFIED ESCROW SECURITY",
    arbitrageStatus: "Arbiters panel active",
    zeroRiskTitle: "0% Risk for Freelancer",
    zeroRiskDesc: "Know with absolute certainty that 100% of the funds are locked on the platform before writing code.",
    zeroRiskClientTitle: "0% Risk for Clients",
    zeroRiskClientDesc: "Release funds only when you have analyzed and approved the resulting source work."
  }
};

export default function PaymentTermsModal({ isOpen, onClose, currentLang, selectedCurrency }: PaymentTermsModalProps) {
  const [activeTab, setActiveTab] = useState<'escrow' | 'fees' | 'arbitrage' | 'methods'>('escrow');
  const [calcVal, setCalcVal] = useState<number>(5000000);
  const strings = MODAL_STRINGS[currentLang] || MODAL_STRINGS.uz;

  if (!isOpen) return null;

  // Formatting calculations helpers
  const flShare = calcVal * 0.95;
  const sysFee = calcVal * 0.05;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glass blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Sheet Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto relative"
        >
          {/* Abs background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          {/* Header Close */}
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded">
                  {strings.escrowSecuredBadge}
                </span>
                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-mono font-bold tracking-wider px-2 py-0.5 rounded">
                  SSL SECURE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {strings.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-light leading-normal">
                {strings.subtitle}
              </p>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white" />
            </button>
          </div>

          {/* Tab Navigation buttons */}
          <div className="flex flex-wrap gap-2 mb-6 bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/40">
            {(['escrow', 'fees', 'arbitrage', 'methods'] as const).map(tab => {
              const label = tab === 'escrow' ? strings.tabEscrow 
                : tab === 'fees' ? strings.tabFees 
                : tab === 'arbitrage' ? strings.tabArbitrage 
                : strings.tabMethods;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs font-bold py-2.5 px-3 rounded-xl transition-all ${
                    activeTab === tab 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-white/30 dark:hover:bg-slate-900/50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Tab Body content */}
          <div className="space-y-6">
            
            {activeTab === 'escrow' && (
              <div className="space-y-6">
                
                {/* 4 Step Process Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { title: strings.step1Title, desc: strings.step1Desc },
                    { title: strings.step2Title, desc: strings.step2Desc },
                    { title: strings.step3Title, desc: strings.step3Desc },
                    { title: strings.step4Title, desc: strings.step4Desc }
                  ].map((step, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[#FAF9F5] dark:bg-slate-950 border border-slate-205/40 dark:border-slate-850 p-5 rounded-2xl text-left relative overflow-hidden group hover:border-indigo-500/20 hover:shadow-md transition-all"
                    >
                      <span className="absolute -right-3 -bottom-5 text-6xl font-black font-display text-slate-200/50 dark:text-slate-800/10 select-none group-hover:scale-105 transition-transform">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-indigo-400 block mb-2">{step.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{step.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Secure Zero Risk Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="bg-indigo-50/40 dark:bg-slate-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-5 flex gap-4 items-start text-left">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-indigo-950 dark:text-white block">{strings.zeroRiskTitle}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{strings.zeroRiskDesc}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/40 dark:bg-slate-950/20 border border-emerald-100/40 dark:border-emerald-900/30 rounded-2xl p-5 flex gap-4 items-start text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 dark:text-white block">{strings.zeroRiskClientTitle}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{strings.zeroRiskClientDesc}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'fees' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Fee Guidelines Text */}
                  <div className="text-left space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 rounded-full font-mono text-[10px] font-bold">
                      <Calculator className="w-3.5 h-3.5" />
                      Platforma boʻyicha eng past komissiya stavkasi
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Kafolatlangan bitta toʻlov: 5%</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                      Freelance.uz barcha xizmat garovlari monitoringi, xavfsiz server infratuzilmasi, server-side hisob-kitoblar hamda oʻzaro zaxiralashni taʼminlash uchun toʻlangan <b>loyha byudjetidan atigi 5% sugʻurta badali</b> ushlab qoladi.
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-slate-650 dark:text-slate-350">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-550 shrink-0" />
                        <span>Loyha eʼlon qilish — mutlaqo <b>bepul</b>.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-550 shrink-0" />
                        <span>Yashirin toʻlovlar yoki har oylik abonent toʻlovi <b>yoʻq</b>.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-550 shrink-0" />
                        <span>Platforma orqali daromadni Humo kartalariga avtomat va bepul chiqarish.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Calculator visual tool */}
                  <div className="bg-[#FAF9F5] dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 text-left space-y-4">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">{strings.calcTitle}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{strings.calcDesc}</p>
                    </div>

                    <div className="space-y-2">
                      <input 
                        type="number"
                        value={calcVal}
                        onChange={(e) => setCalcVal(Number(e.target.value))}
                        placeholder={strings.calcPlaceholder}
                        className="w-full text-xs font-bold pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-light">{strings.calcFlShare}</span>
                        <span className="font-mono font-bold text-emerald-600">
                          {flShare.toLocaleString()} {selectedCurrency}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500 font-light">
                          <span>{strings.calcFee}</span>
                        </div>
                        <span className="font-mono font-bold text-indigo-650 dark:text-indigo-400">
                          {sysFee.toLocaleString()} {selectedCurrency}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-dashed border-slate-200/70 dark:border-slate-850">
                        <span>{strings.calcTotal}</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">
                          {calcVal.toLocaleString()} {selectedCurrency}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'arbitrage' && (
              <div className="space-y-5 text-left max-w-2xl mx-auto bg-[#FAF9F5] dark:bg-slate-950 p-6 rounded-2xl border border-slate-205/30">
                <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800 pb-3">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <Scale className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-850 dark:text-white block">{strings.arbitrageTitle}</h3>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded">
                      🛡️ {strings.arbitrageStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  <p>{strings.arbitrageDesc1}</p>
                  <p>{strings.arbitrageDesc2}</p>
                  
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-2.5 font-semibold">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{strings.arbitrageDecision}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'methods' && (
              <div className="space-y-6 text-left">
                <div className="max-w-xl mx-auto space-y-4">
                  <div>
                    <h3 className="text-base font-black text-indigo-950 dark:text-white">{strings.methodsTitle}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1 font-light">{strings.methodsDesc}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-white dark:bg-slate-950 border border-slate-150/80 dark:border-slate-800 rounded-2xl flex items-center gap-4.5">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300">
                        🇺🇿
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-white block">{strings.methodHumo}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Soliqsiz, milliy valyutadagi qulay kartalar orqali oʻtkazmalar.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-950 border border-slate-150/80 dark:border-slate-800 rounded-2xl flex items-center gap-4.5">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-300">
                        🌎
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-white block">{strings.methodVisa}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Xorijiy valyutani milliy valyutaga qulay konvertatsiya qilish.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-950 border border-slate-150/80 dark:border-slate-800 rounded-2xl flex items-center gap-4.5">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-850 rounded-xl flex items-center justify-center font-bold text-slate-700 dark:text-slate-350">
                        🏢
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-white block">{strings.methodLegal}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Yirik korxonalar uchun barcha rasmiy hisob-kitoblar va shartnomalar.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer of modal */}
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Freelance.uz barcha operatsiyalari 100% himoyalangan.
            </span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto text-center font-black text-xs px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Tushunarli
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
