import React, { useState } from 'react';
import { Language, LanguageStrings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Globe, PlusCircle, LogIn, User, Menu, X, Check, Laptop, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'home' | 'jobs' | 'freelancers' | 'post' | 'wallet' | 'profile' | 'chats' | 'settings';
  onTabChange: (tab: 'home' | 'jobs' | 'freelancers' | 'post' | 'wallet' | 'profile' | 'chats' | 'settings') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  userSession: { name: string; email: string } | null;
  onLogout: () => void;
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
  onCurrencyChange: (currency: 'UZS' | 'USD' | 'EUR') => void;
}

export default function Header({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenAuth,
  userSession,
  onLogout,
  selectedCurrency,
  onCurrencyChange
}: HeaderProps) {
  const strings: LanguageStrings = TRANSLATIONS[currentLang];
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currencies: { code: 'UZS' | 'USD' | 'EUR'; label: string; flag: string }[] = [
    { code: 'UZS', label: 'Soʻm (UZS)', flag: '🇺🇿' },
    { code: 'USD', label: 'Dollar (USD)', flag: '🇺🇸' },
    { code: 'EUR', label: 'Euro (EUR)', flag: '🇪🇺' }
  ];

  const currentCurrencyObj = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'uz', name: 'Oʻzbekcha UZ', flag: '🇺🇿' },
    { code: 'ru', name: 'Русский RU', flag: '🇷🇺' },
    { code: 'en', name: 'English EN', flag: '🇬🇧' }
  ];

  const currentLangObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onTabChange('home')} 
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-650 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:bg-indigo-700 transition-all duration-350 transform group-hover:scale-105">
                F
              </div>
              <div className="text-left">
                <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors block">
                  Freelance<span className="text-indigo-600">.uz</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 block -mt-1 uppercase tracking-widest font-bold">
                  Bosh Menyu Hub
                </span>
              </div>
            </button>

            {/* Desktop Menu Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/30">
              <button
                onClick={() => onTabChange('home')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === 'home'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>🏡</span>
                <span>{currentLang === 'uz' ? 'Bosh sahifa' : currentLang === 'ru' ? 'Главная' : 'Home'}</span>
              </button>
              <button
                onClick={() => onTabChange('jobs')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === 'jobs'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>💼</span>
                <span>{strings.findJobs}</span>
              </button>
              <button
                onClick={() => onTabChange('freelancers')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === 'freelancers'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>👥</span>
                <span>{strings.findFreelancers}</span>
              </button>
              
              {userSession && (
                <>
                  <button
                    onClick={() => onTabChange('chats')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                      activeTab === 'chats'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <span>💬</span>
                    <span>Xabarlar</span>
                  </button>
                  <button
                    onClick={() => onTabChange('profile')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                      activeTab === 'profile'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <span>👤</span>
                    <span>Kabinetim</span>
                  </button>
                </>
              )}

              {userSession && userSession.email === "ramanovsardor8@gmail.com" && (
                <button
                  onClick={() => onTabChange('wallet')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                    activeTab === 'wallet'
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-white/50 hover:text-slate-900'
                  }`}
                >
                  <span>💳</span>
                  <span>Hamyon</span>
                </button>
              )}
            </div>
          </div>

          {/* Actions & Utilities Right Panel */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all border border-slate-200"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden lg:inline">{currentLangObj.name}</span>
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setLangDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 py-1"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onLanguageChange(lang.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            currentLang === lang.code ? 'text-indigo-600 bg-indigo-50/20' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                          {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Currency Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-2 rounded-xl transition-all border border-indigo-200/40"
              >
                <span>{currentCurrencyObj.flag}</span>
                <span>{currentCurrencyObj.code}</span>
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setCurrencyDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 py-1"
                    >
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            onCurrencyChange(curr.code);
                            setCurrencyDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            selectedCurrency === curr.code ? 'text-indigo-600 bg-indigo-50/20' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{curr.flag}</span>
                            <span>{curr.label}</span>
                          </div>
                          {selectedCurrency === curr.code && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Settings button */}
            <button
              onClick={() => onTabChange('settings')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 dark:shadow-none animate-pulse-slow'
                  : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-920 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800'
              }`}
              title={currentLang === 'uz' ? 'Sozlamalar' : currentLang === 'ru' ? 'Настройки' : 'Settings'}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Post Job button */}
            <button
              onClick={() => onTabChange('post')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                activeTab === 'post'
                  ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
                  : 'bg-indigo-600 text-white shadow-indigo-150 hover:bg-indigo-700'
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>{strings.postJob}</span>
            </button>

            {/* Auth section */}
            <div className="h-6 w-px bg-slate-200"></div>

            {userSession ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200/50">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">{userSession.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  {strings.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl transition-colors"
                >
                  {strings.login}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  {strings.register}
                </button>
              </div>
            )}

          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center gap-3">
            {/* Lang fast switcher */}
            <button
              onClick={() => {
                const idx = languages.findIndex(l => l.code === currentLang);
                const nextLang = languages[(idx + 1) % languages.length].code;
                onLanguageChange(nextLang);
              }}
              className="bg-slate-100 p-2 rounded-xl text-sm"
              title="Change Language"
            >
              {currentLangObj.flag}
            </button>

            {/* Currency fast switcher */}
            <button
              onClick={() => {
                const idx = currencies.findIndex(c => c.code === selectedCurrency);
                const nextCurr = currencies[(idx + 1) % currencies.length].code;
                onCurrencyChange(nextCurr);
              }}
              className="bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 font-mono"
              title="Change Currency"
            >
              {currentCurrencyObj.flag} {currentCurrencyObj.code}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-500 p-1 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden px-4 py-4"
          >
            <div className="space-y-2">
              <button
                onClick={() => {
                  onTabChange('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold leading-none ${
                  activeTab === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                🏡 {currentLang === 'uz' ? 'Bosh sahifa' : currentLang === 'ru' ? 'Главная' : 'Home'}
              </button>
              
              <button
                onClick={() => {
                  onTabChange('jobs');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold leading-none ${
                  activeTab === 'jobs' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                💼 {strings.findJobs}
              </button>
              
              <button
                onClick={() => {
                  onTabChange('freelancers');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold leading-none ${
                  activeTab === 'freelancers' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
               >
                👥 {strings.findFreelancers}
              </button>

              {userSession && (
                <>
                  <button
                    onClick={() => {
                      onTabChange('chats');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-bold leading-none ${
                      activeTab === 'chats' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Xabarlar / Chatlar 💬
                  </button>
                  
                  <button
                    onClick={() => {
                      onTabChange('profile');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-bold leading-none ${
                      activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Mening Profilim 👤
                  </button>
                </>
              )}

              {userSession && userSession.email === "ramanovsardor8@gmail.com" && (
                <button
                  onClick={() => {
                    onTabChange('wallet');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold leading-none ${
                    activeTab === 'wallet' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Mening Hamyonim 💳
                </button>
              )}

              <button
                onClick={() => {
                  onTabChange('settings');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold leading-none flex items-center gap-2 ${
                  activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>⚙️</span>
                <span>{currentLang === 'uz' ? 'Tizim Sozlamalari' : currentLang === 'ru' ? 'Настройки системы' : 'System Settings'}</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('post');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl text-xs font-bold leading-none bg-emerald-500 text-white flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>{strings.postJob}</span>
              </button>

              <div className="h-px bg-slate-100 my-4"></div>

              {userSession ? (
                <div className="space-y-3 p-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>{userSession.name} ({userSession.email})</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl border border-rose-100 text-xs font-bold text-rose-500"
                  >
                    {strings.logout}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 p-2">
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 text-center text-xs font-bold border rounded-xl text-slate-700"
                  >
                    {strings.login}
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('register');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 text-center text-xs font-bold bg-slate-900 text-white rounded-xl"
                  >
                    {strings.register}
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
