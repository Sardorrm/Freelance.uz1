import React, { useState } from 'react';
import { Language, Job, Freelancer } from './types';
import { MOCK_JOBS, MOCK_FREELANCERS } from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import Header from './components/Header';
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
import UserCabinet from './components/UserCabinet';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getJobs, postJob, getFreelancers, updateFreelancerProfile } from './services/db';
import { testConnection, auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';

const ADMIN_EMAIL = 'ramanovsardor8@gmail.com';
const PUBLIC_FREELANCER_FILTER = (f: Freelancer) => f.id !== 'f1';

type Tab = 'home' | 'jobs' | 'freelancers' | 'post' | 'wallet' | 'profile' | 'cabinet' | 'chats' | 'settings';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('uz');
  const strings = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedCurrency, setSelectedCurrency] = useState<'UZS' | 'USD' | 'EUR'>('UZS');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [freelancersList, setFreelancersList] = useState<Freelancer[]>(MOCK_FREELANCERS.filter(PUBLIC_FREELANCER_FILTER));
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<{ uid: string; name: string; email: string } | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({ isOpen: false, mode: 'login' });
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [paymentTermsOpen, setPaymentTermsOpen] = useState(false);
  const isAdmin = userSession?.email.trim().toLowerCase() === ADMIN_EMAIL;

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        localStorage.removeItem('freelance_uz_session');
        setUserSession(null);
        setSelectedFreelancerId(null);
        setActiveTab('home');
        return;
      }
      try {
        const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
        const profile = profileSnap.exists() ? profileSnap.data() : {};
        const session = { uid: firebaseUser.uid, name: profile.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User', email: firebaseUser.email || '' };
        setUserSession(session);
        localStorage.setItem('freelance_uz_session', JSON.stringify(session));
      } catch (err) {
        console.error('Failed to load user profile:', err);
        const session = { uid: firebaseUser.uid, name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User', email: firebaseUser.email || '' };
        setUserSession(session);
        localStorage.setItem('freelance_uz_session', JSON.stringify(session));
      }
    });

    const unsubscribeJobs = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const firestoreJobs: Job[] = snapshot.docs.map((jobDoc) => {
        const data = jobDoc.data();
        return { id: data.id || jobDoc.id, title: data.title || '', description: data.description || '', category: data.category, budget: Number(data.budget || 0), currency: data.currency || 'UZS', type: data.type || 'fixed', duration: data.duration || '', skills: Array.isArray(data.skills) ? data.skills : [], clientName: data.clientName || 'Unknown client', clientRating: Number(data.clientRating || 5), location: data.location || 'Uzbekistan', datePosted: data.datePosted || 'just_now', proposalsCount: Number(data.proposalsCount || 0), clientId: data.clientId };
      });
      setJobs(firestoreJobs.length > 0 ? firestoreJobs : MOCK_JOBS);
    }, (error) => console.error('Realtime jobs listener failed:', error));

    async function loadFirebaseData() {
      try { setJobs(await getJobs()); } catch (err) { console.error('Failed to load jobs from Firestore:', err); }
      try {
        const loadedFreelancers = await getFreelancers();
        setFreelancersList(loadedFreelancers.filter(PUBLIC_FREELANCER_FILTER));
      } catch (err) { console.error('Failed to load freelancers from Firestore:', err); }
    }
    loadFirebaseData();
    return () => { unsubscribeAuth(); unsubscribeJobs(); };
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); } catch (err) { console.warn('Signout warning:', err); }
    localStorage.removeItem('freelance_uz_session');
    setUserSession(null);
  };

  const handleOpenCabinet = async () => {
    if (!userSession) {
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }
    const ownProfile = freelancersList.find(f => f.ownerId === userSession.uid);
    if (ownProfile) {
      setSelectedFreelancerId(ownProfile.id);
      setActiveTab('cabinet');
      return;
    }
    const newProfile: Freelancer = {
      id: `user_${userSession.uid}`,
      ownerId: userSession.uid,
      name: userSession.name,
      title: 'Freelancer',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userSession.name)}&background=4f46e5&color=fff&size=512`,
      rating: 0,
      reviewsCount: 0,
      hourlyRate: 0,
      currency: 'UZS',
      category: 'development',
      skills: [],
      bio: '',
      location: 'Uzbekistan',
      verified: false,
      completedJobs: 0,
      portfolio: [],
      reviews: []
    };
    try {
      await updateFreelancerProfile(newProfile);
      setFreelancersList(prev => [...prev.filter(f => f.ownerId !== userSession.uid), newProfile]);
    } catch (error) {
      console.error('Failed to create personal cabinet:', error);
      setFreelancersList(prev => prev.some(f => f.id === newProfile.id) ? prev : [...prev, newProfile]);
    }
    setSelectedFreelancerId(newProfile.id);
    setActiveTab('cabinet');
  };

  const handlePostJobSubmit = async (newJob: Omit<Job, 'id' | 'datePosted' | 'proposalsCount'>) => {
    if (!userSession) { setAuthModal({ isOpen: true, mode: 'login' }); throw new Error('AUTH_REQUIRED'); }
    const jobWithMeta: Job = { ...newJob, id: `j_${Date.now()}_${userSession.uid.slice(0, 8)}`, datePosted: 'just_now', proposalsCount: 0, clientId: userSession.uid, clientName: newJob.clientName || userSession.name };
    await postJob(jobWithMeta);
    setActiveTab('jobs');
  };

  const handleTabChange = (tab: Tab) => {
    if (tab === 'post') {
      if (!userSession) { setAuthModal({ isOpen: true, mode: 'login' }); return; }
      setPostJobOpen(true);
      return;
    }
    if (tab === 'wallet') {
      if (!isAdmin) { setActiveTab('home'); return; }
    }
    if (tab === 'profile' || tab === 'cabinet') {
      void handleOpenCabinet();
      return;
    }
    setActiveTab(tab);
  };

  const ownProfile = userSession ? freelancersList.find(f => f.ownerId === userSession.uid) : undefined;
  const activeProfile = selectedFreelancerId ? freelancersList.find(f => f.id === selectedFreelancerId) : undefined;
  const home = <HomeDashboard currentLang={currentLang} jobs={jobs} freelancers={freelancersList} activeTab={activeTab} onTabChange={setActiveTab} onPostJobClick={() => userSession ? setPostJobOpen(true) : setAuthModal({ isOpen: true, mode: 'login' })} onSearchQuery={setSearchTerm} selectedCurrency={selectedCurrency} userSession={userSession} onSelectFreelancer={(id) => { setSelectedFreelancerId(id); setActiveTab('profile'); }} onOpenPaymentModal={() => setPaymentTermsOpen(true)} />;

  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--ink)] font-sans flex flex-col transition-colors duration-300 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true"><div className="absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full bg-indigo-500/[0.07] blur-[110px]" /><div className="absolute top-[38%] -left-40 w-[30rem] h-[30rem] rounded-full bg-emerald-400/[0.045] blur-[110px]" /><div className="absolute bottom-0 right-[15%] w-72 h-72 rounded-full bg-violet-400/[0.035] blur-[100px]" /></div>
      <Header currentLang={currentLang} onLanguageChange={setCurrentLang} activeTab={activeTab} onTabChange={handleTabChange} onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })} userSession={userSession} onLogout={handleLogout} selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />
      <main className="flex-1 w-full relative py-8 sm:py-10 px-3 sm:px-6 lg:px-8 z-10">
        {activeTab === 'home' && <section className="text-center max-w-5xl mx-auto mt-2 sm:mt-6 mb-10 sm:mb-12"><motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/75 dark:bg-slate-900/75 border border-indigo-100/80 dark:border-indigo-900/50 rounded-full text-indigo-700 dark:text-indigo-300 text-[10px] font-bold tracking-[0.12em] uppercase shadow-sm backdrop-blur"><Sparkles className="w-3.5 h-3.5" /><span>{currentLang === 'uz' ? 'Freelance.uz — OʻZBEKISTON MILLIY PLATFORMASI' : currentLang === 'ru' ? 'Freelance.uz — НАЦИОНАЛЬНАЯ ПЛATFORMA УЗБЕКИSTANA' : 'Freelance.uz — NATIONAL FREELANCE MARKET OF UZBEKISTAN'}</span></motion.div><motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-[-0.045em] text-slate-950 dark:text-white leading-[0.98]">{strings.heroTitle}</motion.h1><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-7">{strings.heroSubtitle}</motion.p></section>}
        <div className="mb-16 sm:mb-20 max-w-7xl mx-auto">
          {activeTab === 'home' ? home
          : activeTab === 'jobs' ? <JobList currentLang={currentLang} jobs={jobs} searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedCurrency={selectedCurrency} />
          : activeTab === 'freelancers' ? <FreelancerList currentLang={currentLang} searchTerm={searchTerm} onSearchChange={setSearchTerm} freelancers={freelancersList} onSelectFreelancer={(id) => { setSelectedFreelancerId(id); setActiveTab('profile'); }} selectedCurrency={selectedCurrency} />
          : activeTab === 'cabinet' ? (userSession ? <UserCabinet currentLang={currentLang} user={userSession} profile={ownProfile} jobs={jobs} onProfile={() => { setSelectedFreelancerId(ownProfile?.id || null); setActiveTab('profile'); }} onJobs={() => setActiveTab('jobs')} onChats={() => setActiveTab('chats')} onSettings={() => setActiveTab('settings')} onPostJob={() => setPostJobOpen(true)} /> : home)
          : activeTab === 'profile' ? (activeProfile || ownProfile ? <ProfileView currentLang={currentLang} freelancer={activeProfile || ownProfile!} isOwnProfile={Boolean(userSession && (activeProfile || ownProfile)?.ownerId === userSession.uid)} onUpdateFreelancer={async (updated) => { if (!userSession) return; const current = freelancersList.find(f => f.id === updated.id); if (current?.ownerId !== userSession.uid && !isAdmin) return; const saved = { ...updated, ownerId: updated.ownerId || userSession.uid }; try { await updateFreelancerProfile(saved); setFreelancersList(prev => prev.map(f => f.id === saved.id ? saved : f)); } catch (err) { console.error('Failed to update freelancer profile in Firestore:', err); } }} onStartChat={(id) => { setSelectedFreelancerId(id); setActiveTab('chats'); }} onBack={() => { setSelectedFreelancerId(null); setActiveTab('freelancers'); }} selectedCurrency={selectedCurrency} /> : home)
          : activeTab === 'chats' ? <ChatDashboard currentLang={currentLang} currentUserId={userSession?.uid} initialSelectedId={selectedFreelancerId || undefined} freelancers={freelancersList} onBackToJobs={() => { setSelectedFreelancerId(null); setActiveTab('freelancers'); }} />
          : activeTab === 'wallet' && isAdmin ? <WalletDashboard currentLang={currentLang} onClose={() => setActiveTab('home')} selectedCurrency={selectedCurrency} />
          : activeTab === 'settings' ? <SettingsView currentLang={currentLang} onClose={() => setActiveTab('home')} selectedCurrency={selectedCurrency} />
          : home}
        </div>
      </main>
      <footer className="w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-t border-slate-200/70 dark:border-slate-900 py-10 px-6 z-10"><div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400"><span>Freelance.uz © {new Date().getFullYear()}</span><span className="font-medium">Ish • Iste’dod • Imkoniyat</span></div></footer>
      <AnimatePresence>{authModal.isOpen && <AuthModal mode={authModal.mode} onClose={() => setAuthModal({ ...authModal, isOpen: false })} onAuthSuccess={(session) => { setUserSession(session); localStorage.setItem('freelance_uz_session', JSON.stringify(session)); setAuthModal({ isOpen: false, mode: 'login' }); }} currentLang={currentLang} />}</AnimatePresence>
      <AnimatePresence>{postJobOpen && <PostJobModal isOpen={postJobOpen} currentLang={currentLang} onClose={() => setPostJobOpen(false)} onSubmit={handlePostJobSubmit} selectedCurrency={selectedCurrency} />}</AnimatePresence>
      <AnimatePresence>{paymentTermsOpen && <PaymentTermsModal currentLang={currentLang} onClose={() => setPaymentTermsOpen(false)} />}</AnimatePresence>
    </div>
  );
}
