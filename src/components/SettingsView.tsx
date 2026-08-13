import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Settings, Moon, Sun, Bell, Volume2, ShieldAlert, Sparkles, Database, 
  Check, Lock, Link, Key, UserCheck, RefreshCw, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsViewProps {
  currentLang: Language;
  onClose: () => void;
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
}

const SETTING_STRINGS = {
  uz: {
    systemSettings: "Tizim Sozlamalari",
    settingsSubtitle: "Rang sxemalari, axborot almashinuvi va shaxsiy hisob xavfsizligini moslashtiring",
    backBtn: "Orqaga",
    tabInterface: "Tizim koʻrinishi & Dizayn",
    tabInterfaceDesc: "Dark mode & Dizayn sozlamalari",
    tabNotifications: "Bildirishnomalar & Ovoz",
    tabNotificationsDesc: "Tezkor xabar signallari",
    tabSecurity: "Havfsizlik & Telegram",
    tabSecurityDesc: "Telegram bogʻlanish, 2FA tizimi",
    tabCache: "Kesh & Tizim unumdorligi",
    tabCacheDesc: "Lokal ma'lumotlar hajmi",
    yourIp: "Sizning IP manzilingiz",
    secureConn: "Xavfsiz bogʻlanish faol",
    appearanceTitle: "Tizim koʻrinishi & Mavzular",
    appearanceDesc: "Tungi rejimni va dizayn ranglarini oʻzingizning qulayligingizga moslashtiring",
    darkModeLabel: "Tungi qorongʻu rejim (Qora fon)",
    darkModeDesc: "Koʻzlar charchamasligi hamda akkumulyator quvvatini tejash uchun",
    accentLabel: "Interfeysning urgʻu rangi (Accent Scheme)",
    accentDesc: "Barcha tugmachalar, oʻtish darchalari va grafik chiziqlar urgʻusi ushbu rang orqali vizuallashadi",
    deviceSyncTitle: "Qurilmaga avtomat moslashuv",
    deviceSyncDesc: "Boshqa sozlamalar ham foydalanayotgan ushbu Brauzer kukinida avtomatik ravishda saqlanadi.",
    notifAndSoundTitle: "Bildirishnomalar & Ovoz Signallari",
    notifAndSoundDesc: "Tizimdagi muhim xabarlar, bitim holatlari hamda tovushli aloqa sozlamalari",
    soundSignalsLabel: "Ovozli signallar (Keypad chime)",
    soundSignalsDesc: "Tugma bosilganda yoki xabar kelganda muloyim ovoz chalish",
    testChimeBtn: "🎵 Chaldirib ko'rish (Test chime)",
    whenToNotify: "Sizni xabardor qilish holatlari",
    notifDealsLabel: "Xavfsiz bitimlardagi har bir status oʻzgarishi",
    notifDealsDesc: "Sarmoya muzlatilganida, topshirilganida va pul yechilganida elektron xabar yoʻllash.",
    notifMsgsLabel: "Mijozlar yoki Frilanserlardan shaxsiy xabarlar tushganda",
    notifMsgsDesc: "Muloqot chatlarida yangi taklif yozib qoldirilsa real-vaqtda ogohlantirish.",
    notifPromoLabel: "Yangi maqola, bonus keshbeklar va tahlillar",
    notifPromoDesc: "Platformadagi oylik eng faol top-10 loyihalar tahlilnomasini qabul qilish.",
    securityTitle: "Xavfsizlik & Telegram Integratsiyasi",
    securityDesc: "Telegram e’lonlar boti orqali tezkor buyurtmalar olish va shaxsiy hisob kirish xavfsizligi",
    statusLabel: "Status",
    statusConnected: "BOGʻLANGAN ✓",
    statusDisconnected: "ULANMAGAN 📴",
    disconnectBtn: "Ulanishni uzish",
    linkedAccount: "Sizning accountsiz: @{handle}",
    linkSuccess: "Muvaffaqiyatli bogʻlandi. Birja buyurtmalari avtomatik sizning shaxsiy botingizga yuborilmoqda.",
    copyBtn: "NUSXA",
    step1: "1. Maxsus kodni nusxalang",
    step2: "2. Telegram username kiriting",
    stepInstructions: "Ushbu kodni botga yuborib /start {code} buyrug'ini kiriting, so'ng tasdiqlash uchun quyidagi bogʻlash tugmasini bosing.",
    confirmLinkBtn: "Ulanishni tasdiqlash 🚀",
    twoFactorLabel: "Ikki bosqichli kirish xavfsizligi (2FA)",
    twoFactorDesc: "Har gal portalga kirilganda elektron pochta yoki Telegram kodini talab qilish",
    performanceTitle: "Kesh & Tizim unumdorligi",
    performanceDesc: "Lokal xotiradagi foydalanuvchi ma'lumotlari, yuklangan suratlar kesh kutilmalari tahlili",
    cacheSizeLabel: "Lokal xotira hajmi",
    cacheSizeDesc: "Siz ko'rgan portfolio suratlari, yuklangan takliflar hamda chat sarmoyalari tahlillari saqlangan kesh.",
    clearCacheBtn: "Kesh va xotirani tozalash",
    clearingCacheActive: "Tozalanmoqda...",
    versionLabel: "Platform versiyasi",
    versionDesc: "Ushbu platforma va uning xavfsiz kelishuv shifrlari (Secure escrow hashes) eng soʻnggi hukumat talablari asosida yangilangan.",
    autoUpdatesActive: "⚡ Yangilanishlar avtomatik (Eng oxirgisi: bugun, 14:20)",
    systemStatusTitle: "Tizim holati soʻrovnomasi (Status OK)",
    systemStatusDesc: "Tizim serversiz tarmoq interfeyslarida, asinxron rozolyutsiyalar va har bir foydalanuvchi maʼlumotlarini zaxiralangan server-cloud orqali mukammal sinxron qiladi.",
    saveBtn: "Tasdiqlash & Saqlash 💾",
    footerText: "Freelance.uz sozlamalari"
  },
  ru: {
    systemSettings: "Настройки системы",
    settingsSubtitle: "Настройте цветовую схему, уведомления и безопасность аккаунта",
    backBtn: "Назад",
    tabInterface: "Внешний вид и Тема",
    tabInterfaceDesc: "Настройки темной темы и интерфейса",
    tabNotifications: "Уведомления и Звук",
    tabNotificationsDesc: "Быстрые сигналы сообщений",
    tabSecurity: "Безопасность и Боты",
    tabSecurityDesc: "Связь со встроенным Telegram-ботом, 2FA",
    tabCache: "Кэш и Память",
    tabCacheDesc: "Объем локальных данных",
    yourIp: "Ваш IP-адрес",
    secureConn: "Безопасное соединение активно",
    appearanceTitle: "Внешний вид и Темы",
    appearanceDesc: "Адаптируйте ночной режим и основные цвета интерфейса под себя",
    darkModeLabel: "Темный ночной режим (Черный фон)",
    darkModeDesc: "Для экономии заряда батареи и снижения напряжения на глаза",
    accentLabel: "Акцентный цвет интерфейса (Accent Scheme)",
    accentDesc: "Все кнопки, переключатели и графические полосы будут оформлены в этом цвете",
    deviceSyncTitle: "Синхронизация с устройством",
    deviceSyncDesc: "Настройки автоматически сохраняются в куки-файлах вашего текущего браузера.",
    notifAndSoundTitle: "Уведомления и Звуковые Сигналы",
    notifAndSoundDesc: "Важные системные уведомления, статусы сделок и звуковые оповещения",
    soundSignalsLabel: "Звуковые сигналы (Keypad chime)",
    soundSignalsDesc: "Воспроизводить мягкий звук при нажатии кнопок или получении сообщений",
    testChimeBtn: "🎵 Проверить звук (Test chime)",
    whenToNotify: "Случаи для уведомлений",
    notifDealsLabel: "Каждое изменение статуса в безопасных сделках",
    notifDealsDesc: "Отправлять электронное письмо при блокировании, сдаче и выводе средств.",
    notifMsgsLabel: "При получении личных сообщений от клиентов или фрилансеров",
    notifMsgsDesc: "Мгновенное оповещение при поступлении новых предложений внутри чата.",
    notifPromoLabel: "Новые статьи, бонусные кэшбэки и аналитика биржи",
    notifPromoDesc: "Получать ежемесячный отчет о топ-10 самых активных проектах системы.",
    securityTitle: "Безопасность и Интеграция с Telegram",
    securityDesc: "Быстрое получение заказов через Telegram-бота и безопасность личного профиля",
    statusLabel: "Статус",
    statusConnected: "ПОДКЛЮЧЕНО ✓",
    statusDisconnected: "НЕ ПОДКЛЮЧЕНО 📴",
    disconnectBtn: "Отключить бота",
    linkedAccount: "Ваш аккаунт: @{handle}",
    linkSuccess: "Успешно привязано! Заказы биржи автоматически перенаправляются вашему боту.",
    copyBtn: "КОПИР",
    step1: "1. Скопируйте персональный код",
    step2: "2. Введите Telegram username",
    stepInstructions: "Отправьте этот код боту с командой /start {code}, затем нажмите кнопку подтверждения ниже.",
    confirmLinkBtn: "Подтвердить привязку 🚀",
    twoFactorLabel: "Двухфакторная аутентификация (2FA)",
    twoFactorDesc: "Требовать код подтверждения на почту или в Telegram при каждом входе",
    performanceTitle: "Кэш и Память",
    performanceDesc: "Статистика локального хранилища, кешированных изображений и файлов портфолио",
    cacheSizeLabel: "Объем локального кэша",
    cacheSizeDesc: "Кэшированные файлы портфолио, загруженные предложения и сохраненные сессии чата.",
    clearCacheBtn: "Очистить кэш и память",
    clearingCacheActive: "Очистка...",
    versionLabel: "Версия платформы",
    versionDesc: "Эта платформа и ключи безопасности сделок (Secure escrow hashes) полностью соответствуют стандартам.",
    autoUpdatesActive: "⚡ Обновления автоматические (Последнее: сегодня, 14:20)",
    systemStatusTitle: "Статус работы системы (Status OK)",
    systemStatusDesc: "Система обеспечивает идеальную асинхронную синхронизацию персональных данных через резервное облако.",
    saveBtn: "Подтвердить и Сохранить 💾",
    footerText: "Настройки Freelance.uz"
  },
  en: {
    systemSettings: "System Settings",
    settingsSubtitle: "Customize interface design themes, information exchange, and security parameters",
    backBtn: "Back",
    tabInterface: "Interface Theme",
    tabInterfaceDesc: "Dark mode & UI accent scheme",
    tabNotifications: "Notifications & Sounds",
    tabNotificationsDesc: "Real-time alert chime tones",
    tabSecurity: "Security & Bot Integration",
    tabSecurityDesc: "Telegram bot linkage, active 2FA system",
    tabCache: "Cache & Storage Settings",
    tabCacheDesc: "Local metadata size analysis",
    yourIp: "Your Active IP Address",
    secureConn: "Secure Connection Active",
    appearanceTitle: "Interface Theme & Design",
    appearanceDesc: "Adjust the visual darkness variant and accent color of your application",
    darkModeLabel: "Night Dark Mode (Black canvas)",
    darkModeDesc: "Reduces ocular strain and enhances mobile device battery longevity",
    accentLabel: "Primary Theme Accent (Accent Scheme)",
    accentDesc: "All primary button triggers and key highlights adopt this color scheme",
    deviceSyncTitle: "Automatic Device Synchronization",
    deviceSyncDesc: "All settings are instantly persisted to the current local browser session config.",
    notifAndSoundTitle: "Notifications & Sounds Options",
    notifAndSoundDesc: "System level alert settings, transaction statuses, and audio indicators",
    soundSignalsLabel: "Audio Chime Signals (Keypad chime)",
    soundSignalsDesc: "Trigger elegant brief user experience feedback tones during actions",
    testChimeBtn: "🎵 Sound Test Chime (Test chime)",
    whenToNotify: "Informed System Events",
    notifDealsLabel: "Safe deal transaction lifecycle updates",
    notifDealsDesc: "Dispatch transactional emails when funds are locked, delivered, or released.",
    notifMsgsLabel: "Direct chat messages from clients or providers",
    notifMsgsDesc: "Real-time popups when someone sends an inquiry inside active discussion rooms.",
    notifPromoLabel: "Marketing digests, bonus offers, and platform studies",
    notifPromoDesc: "Receive monthly newsletters summarizing top active projects across the marketplace.",
    securityTitle: "Profile Protection & Bot Linking",
    securityDesc: "Connect your Telegram account to receive instant job feeds and secure login alerts",
    statusLabel: "Status",
    statusConnected: "LINKED ✓",
    statusDisconnected: "DISCONNECTED 📴",
    disconnectBtn: "Disconnect Bot",
    linkedAccount: "Linked Profile: @{handle}",
    linkSuccess: "Connection authenticated! Real-time marketplace orders are routed to your direct messenger bot.",
    copyBtn: "COPY",
    step1: "1. Copy Unique Access Token",
    step2: "2. Input Telegram Handle",
    stepInstructions: "Send this token to the bot with command /start {code}, then trigger verification below.",
    confirmLinkBtn: "Verify Link Setup 🚀",
    twoFactorLabel: "Two-Factor Safe Lock (2FA)",
    twoFactorDesc: "Enforce email or Telegram code prompts for every session sign-in attempt",
    performanceTitle: "Performance & Storage",
    performanceDesc: "Localized database storage analysis, portfolio image caching stats",
    cacheSizeLabel: "Total Offline Cache Size",
    cacheSizeDesc: "Locally cached portfolio imagery, temporary layout states, and chat index databases.",
    clearCacheBtn: "Flush Offline Cache Data",
    clearingCacheActive: "Flushing...",
    versionLabel: "Platform Version Code",
    versionDesc: "The core platform engines and safe escrow hash signatures strictly align with active security directives.",
    autoUpdatesActive: "⚡ Autonomous regular updates (Latest: today, 14:20)",
    systemStatusTitle: "Server Connection Status (Status OK)",
    systemStatusDesc: "Our reliable serverless framework synchronizes client-side records via real-time backend state managers.",
    saveBtn: "Accept & Save Config 💾",
    footerText: "Freelance.uz Configurations"
  }
};

const playSuccessSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    
    oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    oscillator.start();
    
    setTimeout(() => {
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    }, 120);

    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    oscillator.stop(audioCtx.currentTime + 0.45);
  } catch (e) {
    console.log('Web Audio context not supported or user gesture required', e);
  }
};

export default function SettingsView({ currentLang, onClose, selectedCurrency }: SettingsViewProps) {
  const localStrings = SETTING_STRINGS[currentLang] || SETTING_STRINGS.uz;
  
  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'security' | 'system'>('general');
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sound_alerts') !== 'false';
  });

  const [tgLinked, setTgLinked] = useState<boolean>(false);
  const [tgHandle, setTgHandle] = useState<string>('');
  const [tgCode, setTgCode] = useState<string>('FR-68249');
  const [tgLoading, setTgLoading] = useState<boolean>(false);

  const [notifDeals, setNotifDeals] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);

  const [twoFactor, setTwoFactor] = useState(false);

  const [cacheSize, setCacheSize] = useState<string>('34.2 KB');
  const [clearingCache, setClearingCache] = useState(false);

  const handleClearCache = () => {
    setClearingCache(true);
    setTimeout(() => {
      setCacheSize('0.0 KB');
      setClearingCache(false);
      playSuccessSound();
    }, 1000);
  };

  const handleTgLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tgHandle) return;
    setTgLoading(true);
    setTimeout(() => {
      setTgLinked(true);
      setTgLoading(false);
      if (soundEnabled) playSuccessSound();
    }, 1200);
  };

  const handleTgDisconnect = () => {
    setTgLinked(false);
    setTgHandle('');
    setTgCode(`FR-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const handleSoundToggleChange = (v: boolean) => {
    setSoundEnabled(v);
    localStorage.setItem('sound_alerts', v ? 'true' : 'false');
    if (v) {
      setTimeout(() => playSuccessSound(), 50);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-805">
        <div>
          <h2 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 animate-spin-slow" />
            <span>{localStrings.systemSettings}</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{localStrings.settingsSubtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-550 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800 transition-colors cursor-pointer"
        >
          {localStrings.backBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          
          <button
            onClick={() => setActiveSection('general')}
            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-xs font-bold transition-all text-left border ${
              activeSection === 'general'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100/30 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-705 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-slate-100 dark:border-slate-800'
            }`}
          >
            <Sun className="w-4 h-4 shrink-0" />
            <div className="truncate flex-1">
              <span>{localStrings.tabInterface}</span>
              <span className="block text-[9px] font-mono opacity-80 mt-0.5 font-medium">{localStrings.tabInterfaceDesc}</span>
            </div>
            {activeSection === 'general' && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-xs font-bold transition-all text-left border ${
              activeSection === 'notifications'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100/30 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-705 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-slate-100 dark:border-slate-805'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <div className="truncate flex-1">
              <span>{localStrings.tabNotifications}</span>
              <span className="block text-[9px] font-mono opacity-80 mt-0.5 font-medium">{localStrings.tabNotificationsDesc}</span>
            </div>
            {activeSection === 'notifications' && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-xs font-bold transition-all text-left border ${
              activeSection === 'security'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100/30 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-705 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-slate-100 dark:border-slate-805'
            }`}
          >
            <Lock className="w-4 h-4 shrink-0" />
            <div className="truncate flex-1">
              <span>{localStrings.tabSecurity}</span>
              <span className="block text-[9px] font-mono opacity-80 mt-0.5 font-medium">{localStrings.tabSecurityDesc}</span>
            </div>
            {activeSection === 'security' && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setActiveSection('system')}
            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-xs font-bold transition-all text-left border ${
              activeSection === 'system'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100/30 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-705 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-850/30 border-slate-100 dark:border-slate-805'
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <div className="truncate flex-1">
              <span>{localStrings.tabCache}</span>
              <span className="block text-[9px] font-mono opacity-80 mt-0.5 font-medium">{localStrings.tabCacheDesc}</span>
            </div>
            {activeSection === 'system' && <Check className="w-3.5 h-3.5" />}
          </button>

          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150/40 dark:border-slate-800/50">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest leading-none mb-1">
              {localStrings.yourIp}
            </h4>
            <span className="text-[11px] font-mono font-extrabold text-slate-650 dark:text-slate-300 block">178.218.201.44 (Tashkent)</span>
            <span className="inline-block mt-2.5 text-[9px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/30 px-2 py-0.5 rounded-md font-bold">
              {localStrings.secureConn}
            </span>
          </div>

        </div>

        {/* Right Column: Settings Form/Details Content */}
        <div className="md:col-span-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 rounded-3xl p-6 shadow-sm min-h-[440px] flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* SECTION 1: GENERAL VIEW & DESIGN */}
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-805/30">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white mb-0.5">{localStrings.appearanceTitle}</h3>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">{localStrings.appearanceDesc}</p>
                  </div>

                  {/* Dark Mode switcher card element */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        {darkMode ? <Moon className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          {localStrings.darkModeLabel}
                        </span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{localStrings.darkModeDesc}</p>
                      </div>
                    </div>
                    
                    {/* Toggle Slider Switch */}
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative w-12 h-6.5 rounded-full transition-colors cursor-pointer flex items-center px-1 shrink-0 ${
                        darkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <motion.div 
                        layout 
                        className="w-4.5 h-4.5 rounded-full bg-white shadow-md"
                        animate={{ x: darkMode ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Accent Color Chooser */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{localStrings.accentLabel}</label>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal -mt-1.5 font-medium">{localStrings.accentDesc}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1.5">
                      {[
                        { id: 'indigo', name: 'Royal Indigo', color: 'bg-indigo-600', border: 'border-indigo-600/30' },
                        { id: 'emerald', name: 'Emerald Mint', color: 'bg-emerald-600', border: 'border-emerald-600/30' },
                        { id: 'violet', name: 'Cosmic Purple', color: 'bg-violet-600', border: 'border-violet-600/30' },
                        { id: 'rose', name: 'Coral Rose', color: 'bg-rose-600', border: 'border-rose-600/30' }
                      ].map((accent) => (
                        <div 
                          key={accent.id}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-150/80 dark:border-slate-850 hover:bg-slate-100/40 cursor-default transition-all relative overflow-hidden group"
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${accent.color} block shrink-0`} />
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">{accent.name}</span>
                          {accent.id === 'indigo' && (
                            <span className="absolute bottom-1 right-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-[8px] font-mono px-1 rounded border border-indigo-200/30 font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Device Sync Info Card */}
                  <div className="p-4 bg-amber-500/5 dark:bg-indigo-500/5 rounded-2xl border border-amber-500/10 dark:border-indigo-500/10 flex gap-3 text-left">
                    <Smartphone className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{localStrings.deviceSyncTitle}</span>
                      <p className="text-[10px] text-slate-550 dark:text-slate-455 leading-normal font-medium">{localStrings.deviceSyncDesc}</p>
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION 2: NOTIFICATIONS */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-805/30">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white mb-0.5">{localStrings.notifAndSoundTitle}</h3>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">{localStrings.notifAndSoundDesc}</p>
                  </div>

                  {/* Audio signals tester control */}
                  <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                            {localStrings.soundSignalsLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{localStrings.soundSignalsDesc}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSoundToggleChange(!soundEnabled)}
                        className={`relative w-12 h-6.5 rounded-full transition-colors cursor-pointer flex items-center px-1 shrink-0 ${
                          soundEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      >
                        <motion.div 
                          layout 
                          className="w-4.5 h-4.5 rounded-full bg-white shadow-md"
                          animate={{ x: soundEnabled ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    {soundEnabled && (
                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex justify-end">
                        <button
                          onClick={playSuccessSound}
                          type="button"
                          className="text-[10px] font-mono font-bold text-slate-550 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-250/50 dark:border-slate-800 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                        >
                          {localStrings.testChimeBtn}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Multiple notifications switches list */}
                  <div className="space-y-3.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{localStrings.whenToNotify}</label>

                    <div className="space-y-2.5">
                      {[
                        { state: notifDeals, action: setNotifDeals, label: localStrings.notifDealsLabel, desc: localStrings.notifDealsDesc },
                        { state: notifMessages, action: setNotifMessages, label: localStrings.notifMsgsLabel, desc: localStrings.notifMsgsDesc },
                        { state: notifPromo, action: setNotifPromo, label: localStrings.notifPromoLabel, desc: localStrings.notifPromoDesc }
                      ].map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start justify-between p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/20 transition-colors"
                        >
                          <div className="pr-4">
                            <span className="text-[11px] font-bold text-slate-755 dark:text-slate-300 block leading-tight">{item.label}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5 leading-normal">{item.desc}</span>
                          </div>
                          <button
                            onClick={() => item.action(!item.state)}
                            className={`relative w-9 h-5.5 rounded-full transition-colors cursor-pointer flex items-center px-0.5 shrink-0 mt-0.5 ${
                              item.state ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                            }`}
                          >
                            <motion.div 
                              layout 
                              className="w-4 h-4 rounded-full bg-white shadow"
                              animate={{ x: item.state ? 13 : 0 }}
                              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION 3: SECURITY & TELEGRAM */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-805/30">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white mb-0.5">{localStrings.securityTitle}</h3>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">{localStrings.securityDesc}</p>
                  </div>

                  {/* Telegram Linkage Area */}
                  <div className="bg-gradient-to-br from-sky-500/5 to-indigo-500/5 dark:from-sky-950/20 dark:to-indigo-950/20 p-5 rounded-2xl border border-sky-500/10 dark:border-sky-550/20 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg">
                          ✈
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">Official Telegram Secure Bot</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">{localStrings.statusLabel}: {tgLinked ? localStrings.statusConnected : localStrings.statusDisconnected}</span>
                        </div>
                      </div>

                      {tgLinked && (
                        <button
                          onClick={handleTgDisconnect}
                          className="text-[9px] font-mono font-bold text-rose-500 hover:underline bg-rose-50 dark:bg-rose-950/40 border border-rose-100/30 px-2 py-1 rounded"
                        >
                          {localStrings.disconnectBtn}
                        </button>
                      )}
                    </div>

                    {tgLinked ? (
                      <div className="flex items-center gap-3 bg-white/70 dark:bg-slate-950/70 p-3 rounded-xl border border-sky-500/10">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-black">
                          ✓
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{localStrings.linkedAccount.replace('{handle}', tgHandle)}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{localStrings.linkSuccess}</span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleTgLinkSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 block uppercase font-mono mb-1">{localStrings.step1}</label>
                            <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-black text-slate-800 dark:text-white">
                              <span>{tgCode}</span>
                              <span className="text-[8px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">{localStrings.copyBtn}</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 block uppercase font-mono mb-1">{localStrings.step2}</label>
                            <div className="relative">
                              <span className="absolute left-3 top-3.5 text-xs text-slate-400 font-bold">@</span>
                              <input
                                required
                                type="text"
                                value={tgHandle}
                                onChange={(e) => setTgHandle(e.target.value)}
                                placeholder="ramanove_sardor"
                                className="w-full text-xs font-semibold pl-7 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-850 dark:text-white focus:outline-none focus:border-sky-500"
                              />
                            </div>
                          </div>
                        </div>

                        <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal">
                          {localStrings.stepInstructions.replace('{code}', tgCode)}
                        </p>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            disabled={tgLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {tgLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                            <span>{localStrings.confirmLinkBtn}</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* 2-Factor Authentication Area */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          {localStrings.twoFactorLabel}
                        </span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{localStrings.twoFactorDesc}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`relative w-12 h-6.5 rounded-full transition-colors cursor-pointer flex items-center px-1 shrink-0 ${
                        twoFactor ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <motion.div 
                        layout 
                        className="w-4.5 h-4.5 rounded-full bg-white shadow-md animate-pulse-slow"
                        animate={{ x: twoFactor ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                </div>
              )}

              {/* SECTION 4: SYSTEM CACHE & DB */}
              {activeSection === 'system' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-805/30">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white mb-0.5">{localStrings.performanceTitle}</h3>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">{localStrings.performanceDesc}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono font-bold block uppercase">{localStrings.cacheSizeLabel}</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1 tracking-tight">{cacheSize}</span>
                        <p className="text-[9px] text-slate-450 dark:text-slate-500 font-medium leading-normal mt-1">{localStrings.cacheSizeDesc}</p>
                      </div>

                      <button
                        onClick={handleClearCache}
                        disabled={clearingCache || cacheSize === '0.0 KB'}
                        type="button"
                        className="w-full mt-4 justify-center flex items-center gap-2 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850/25 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Database className="w-3.5 h-3.5 shrink-0" />
                        <span>{clearingCache ? localStrings.clearingCacheActive : localStrings.clearCacheBtn}</span>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono font-bold block uppercase">{localStrings.versionLabel}</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1 tracking-tight">v2.4.9 (Stable)</span>
                        <p className="text-[9px] text-slate-450 dark:text-slate-500 font-medium leading-normal mt-1">{localStrings.versionDesc}</p>
                      </div>

                      <div className="mt-4 p-2.5 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100/30 text-[9px] font-semibold text-indigo-700 dark:text-indigo-300 text-center uppercase tracking-wide">
                        {localStrings.autoUpdatesActive}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex gap-3 text-left">
                    <UserCheck className="w-5 h-5 text-indigo-550 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{localStrings.systemStatusTitle}</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium mt-0.5">{localStrings.systemStatusDesc}</p>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Save Notice block */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-805/30 flex items-center justify-between">
              <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-550">{localStrings.footerText}</span>
              <button
                onClick={() => {
                  playSuccessSound();
                  onClose();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow cursor-pointer uppercase tracking-wider"
              >
                {localStrings.saveBtn}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
