import React, { useState } from 'react';
import { Language, Job, JobCategory, JobType, Freelancer } from './types';
import { MOCK_JOBS, MOCK_FREELANCERS } from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import Header from './components/Header';
import StatsSection from './components/StatsSection';
import JobList from './components/JobList';
import FreelancerList from './components/FreelancerList';
import WalletDashboard from './components/WalletDashboard';
import ProfileView from './components/ProfileView';
import ChatDashboard from './components/ChatDashboard';
import AuthModal from './components/AuthModal';
import PostJobModal from './components/PostJobModal';
import HomeDashboard from './components/HomeDashboard';
import SettingsView from './components/SettingsView';
import PaymentTermsModal from './components/PaymentTermsModal';
import { Briefcase, Users, PlusCircle, CheckCircle, Globe, Award, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getJobs, postJob, getFreelancers, updateFreelancerProfile } from './services/db';
import { testConnection, auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  // Localization state (defaults to Uzbek 'uz' as requested by Uzbek prompt)
  const [currentLang, setCurrentLang] = useState<Language>('uz');
  const strings = TRANSLATIONS[currentLang];

  // Global layout view state: supports standard, profile and chats tabs
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'freelancers' | 'post' | 'wallet' | 'profile' | 'chats' | 'settings'>('home');
  
  // Active currency state for automatic conversions platform-wide
  const [selectedCurrency, setSelectedCurrency] = useState<'UZS' | 'USD' | 'EUR'>('UZS');
  
  // Searching keyword across lists
  const [searchTerm, setSearchTerm] = useState('');

  // Active jobs list in React state to allow live client creations!
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);

  // Active freelancers list with direct state to preserve dynamic portfolios edits and reviews comments!
  const [freelancersList, setFreelancersList] = useState<Freelancer[]>(MOCK_FREELANCERS);

  // Focused freelancer profile identifier
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);

  // Authenticated user session — now backed by real Firebase Authentication.
  // Starts as `null` (signed out) until onAuthStateChanged fires below.
  const [userSession, setUserSession] = useState<{ uid: string; name: string; email: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Authentication Dialog overlay state
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  // Client Post Job overlay state
  const [postJobOpen, setPostJobOpen] = useState(false);

  // Informative payment/escrow terms overlay state
  const [paymentTermsOpen, setPaymentTermsOpen] = useState(false);

  // Load and apply initial theme configuration and load real Firestore data
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    testConnection();

    // Listen for real Firebase Auth state (persists across reloads).
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUserSession(null);
        setAuthChecked(true);
        return;
      }
      try {
        const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
        const profileName = profileSnap.exists() ? profileSnap.data().name : (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User');
        setUserSession({
          uid: firebaseUser.uid,
          name: profileName,
          email: firebaseUser.email || ''
        });
      } catch (err) {
        console.error('Failed to load user profile:', err);
        setUserSession({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || ''
        });
      }
      setAuthChecked(true);
    });

    // Fetch initial database items dynamically from Firestore
    async function loadFirebaseData() {
      try {
        const firestoreJobs = await getJobs();
        setJobs(firestoreJobs);
      } catch (err) {
        console.error("Failed to load jobs from Firestore, falling back to mock", err);
      }

      try {
        const firestoreFreelancers = await getFreelancers();
        setFreelancersList(firestoreFreelancers);
      } catch (err) {
        console.error("Failed to load freelancers from Firestore, falling back to mock", err);
      }
    }
    loadFirebaseData();

    return () => unsubscribe();
  }, []);

  // Handle adding new job locally and persisting to Firestore
  const handlePostJobSubmit = async (newJob: Omit<Job, 'id' | 'datePosted' | 'proposalsCount'>) => {
    const jobWithMeta: Job = {
      ...newJob,
      id: `j_${Date.now()}`,
      datePosted: 'just_now',
      proposalsCount: 0
    };
    
    // Save to Firestore backend database
    try {
      await postJob(jobWithMeta);
    } catch (err) {
      console.error("Failed to persist job to Firestore:", err);
    }

    // Update local state instantly represent real-time updates as defined in the rules
    setJobs([jobWithMeta, ...jobs]);
    setActiveTab('jobs'); // Redirect back to find work tab to see it
  };


  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors duration-300">
      
      {/* Dynamic ambient decoration - represents luxury modern aesthetic */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 select-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-100/40 blur-[130px]"></div>
        <div className="absolute bottom-[-10%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-50/50 blur-[120px]"></div>
      </div>

      {/* Primary Header/Navbar component with actions */}
      <Header 
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'post') {
            setPostJobOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        userSession={userSession}
        onLogout={() => signOut(auth)}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
      />

      {/* Main Experience Layout Section */}
      <main className="flex-1 w-full relative py-8 px-4 sm:px-6 lg:px-8 z-10">
        
        {activeTab === 'home' && (
          <>
            {/* Banner Section */}
            <section className="text-center max-w-4xl mx-auto mt-6 mb-10">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-full text-indigo-800 dark:text-indigo-400 text-[10px] font-mono font-bold tracking-wider uppercase mb-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-200 dark:fill-indigo-950" />
                <span>
                  {currentLang === 'uz' 
                    ? 'Freelance.uz — OʻZBEKISTON MILLIY PLATFORMASI' 
                    : currentLang === 'ru' 
                      ? 'Freelance.uz — НАЦИОНАЛЬНАЯ ПЛАТФОРМА УЗБЕКИСТАНА' 
                      : 'Freelance.uz — NATIONAL FREELANCE MARKET OF UZBEKISTAN'}
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-none"
              >
                {strings.heroTitle}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-light"
              >
                {strings.heroSubtitle}
              </motion.p>
            </section>

            {/* Global Bento Grid Stats Showcase */}
            <StatsSection currentLang={currentLang} />
          </>
        )}

        {/* Dynamic Navigation Content Tab Selector Router */}
        <div className="mt-4 mb-20 max-w-7xl mx-auto">
          {activeTab === 'home' ? (
            <HomeDashboard 
              currentLang={currentLang}
              jobs={jobs}
              freelancers={freelancersList}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onPostJobClick={() => setPostJobOpen(true)}
              onSearchQuery={setSearchTerm}
              selectedCurrency={selectedCurrency}
              userSession={userSession}
              onSelectFreelancer={(id) => {
                setSelectedFreelancerId(id);
                setActiveTab('profile');
              }}
              onOpenPaymentModal={() => setPaymentTermsOpen(true)}
            />
          ) : activeTab === 'jobs' ? (
            <JobList 
              currentLang={currentLang}
              jobs={jobs}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCurrency={selectedCurrency}
            />
          ) : activeTab === 'freelancers' ? (
            <FreelancerList 
              currentLang={currentLang}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              freelancers={freelancersList}
              onSelectFreelancer={(id) => {
                setSelectedFreelancerId(id);
                setActiveTab('profile');
              }}
              selectedCurrency={selectedCurrency}
            />
          ) : activeTab === 'profile' ? (
            <ProfileView 
              currentLang={currentLang}
              freelancer={freelancersList.find(f => f.id === (selectedFreelancerId || 'f1')) || freelancersList[0]}
              isOwnProfile={!selectedFreelancerId || selectedFreelancerId === 'f1'}
              onUpdateFreelancer={async (updated) => {
                setFreelancersList(prev => prev.map(f => f.id === updated.id ? updated : f));
                try {
                  await updateFreelancerProfile(updated);
                } catch (err) {
                  console.error("Failed to update freelancer profile in Firestore:", err);
                }
              }}
              onStartChat={(id) => {
                setSelectedFreelancerId(id);
                setActiveTab('chats');
              }}
              onBack={() => {
                setSelectedFreelancerId(null);
                setActiveTab('freelancers');
              }}
              selectedCurrency={selectedCurrency}
            />
          ) : activeTab === 'chats' ? (
            <ChatDashboard 
              currentLang={currentLang}
              initialSelectedId={selectedFreelancerId || 'f2'}
              onBackToJobs={() => {
                setSelectedFreelancerId(null);
                setActiveTab('freelancers');
               }}
            />
          ) : (activeTab === 'wallet' && userSession?.email === "ramanovsardor8@gmail.com") ? (
            <WalletDashboard 
              currentLang={currentLang}
              onClose={() => setActiveTab('home')}
              selectedCurrency={selectedCurrency}
            />
          ) : activeTab === 'settings' ? (
            <SettingsView 
              currentLang={currentLang}
              onClose={() => setActiveTab('home')}
              selectedCurrency={selectedCurrency}
            />
          ) : (
            <HomeDashboard 
              currentLang={currentLang}
              jobs={jobs}
              freelancers={freelancersList}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onPostJobClick={() => setPostJobOpen(true)}
              onSearchQuery={setSearchTerm}
              selectedCurrency={selectedCurrency}
              userSession={userSession}
              onSelectFreelancer={(id) => {
                setSelectedFreelancerId(id);
                setActiveTab('profile');
              }}
              onOpenPaymentModal={() => setPaymentTermsOpen(true)}
            />
          )}
        </div>

      </main>

      {/* Complete Footer, beautifully clean, with domain prominence */}
      <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100/80 dark:border-slate-900 py-12 px-6 sm:px-12 z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-slate-900 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400">
              F
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                Freelance.uz
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {currentLang === 'uz' 
                  ? 'Ishonchli va xavfsiz freelans bozori' 
                  : currentLang === 'ru' 
                    ? 'Надежная и безопасная биржа фриланса' 
                    : 'Trusted and secure freelance marketplace'} © {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Quick legal/trust text links */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
            <button 
              onClick={(e) => { e.preventDefault(); setPaymentTermsOpen(true); }}
              className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {currentLang === 'uz' ? 'Foydalanish qoidalari' : currentLang === 'ru' ? 'Правила пользования' : 'Terms of Service'}
            </button>
            <span>•</span>
            <button 
              onClick={(e) => { e.preventDefault(); setPaymentTermsOpen(true); }}
              className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {strings.howItWorks}
            </button>
            <span>•</span>
            <button 
              onClick={(e) => { e.preventDefault(); setPaymentTermsOpen(true); }}
              className="hover:text-indigo-655 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {currentLang === 'uz' ? 'Xavfsiz bitim' : currentLang === 'ru' ? 'Безопасная сделка' : 'Safe Escrow'}
            </button>
          </div>

          <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 px-3.5 py-1.5 rounded-full font-bold">
            🔒 {currentLang === 'uz' 
                 ? 'SSL 256-bit xavfsizlik protokoli faol' 
                 : currentLang === 'ru' 
                   ? 'SSL 256-битный протокол безопасности активен' 
                   : 'SSL 256-bit security protocol active'}
          </div>
        </div>
      </footer>

      {/* DIALOG OVERLAYS & MODALS */}
      
      {/* Authentication Login/Register Dialog Modal */}
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
        currentLang={currentLang}
        onSuccess={(session) => setUserSession(session)}
      />

      {/* Post a Job client project creation Modal */}
      <PostJobModal 
        isOpen={postJobOpen}
        onClose={() => setPostJobOpen(false)}
        currentLang={currentLang}
        onPostJob={handlePostJobSubmit}
      />

      {/* Payment System & Escrow Terms Information Center Modal */}
      <PaymentTermsModal
        isOpen={paymentTermsOpen}
        onClose={() => setPaymentTermsOpen(false)}
        currentLang={currentLang}
        selectedCurrency={selectedCurrency}
      />

    </div>
  );
}
