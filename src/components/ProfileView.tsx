import React, { useState } from 'react';
import { Language, Freelancer, PortfolioItem, ReviewItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { convertAndFormat, convertAmount } from '../data/mockData';
import { 
  Star, MapPin, Award, CheckCircle, Plus, Send, ExternalLink, Globe, 
  Trash2, Edit, Camera, Sparkles, MessageSquare, Heart, AppWindow, ArrowLeft, UploadCloud,
  Github, GitFork, Terminal, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileViewProps {
  currentLang: Language;
  freelancer: Freelancer;
  isOwnProfile: boolean;
  onUpdateFreelancer: (updated: Freelancer) => void;
  onStartChat: (freelancerId: string) => void;
  onBack?: () => void;
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
}

export default function ProfileView({
  currentLang,
  freelancer,
  isOwnProfile,
  onUpdateFreelancer,
  onStartChat,
  onBack,
  selectedCurrency
}: ProfileViewProps) {
  const strings = TRANSLATIONS[currentLang];
  const [activeSubTab, setActiveSubTab] = useState<'portfolio' | 'reviews' | 'edit'>('portfolio');

  // Edit fields state
  const [editTitle, setEditTitle] = useState(freelancer.title);
  const [editBio, setEditBio] = useState(freelancer.bio);
  const [editLocation, setEditLocation] = useState(freelancer.location);
  const [editHourlyRate, setEditHourlyRate] = useState(freelancer.hourlyRate);
  const [editAvatar, setEditAvatar] = useState(freelancer.avatar);
  const [editCover, setEditCover] = useState(freelancer.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=400');
  const [editSkills, setEditSkills] = useState(freelancer.skills.join(', '));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // GitHub integration state
  const [repos, setRepos] = useState<any[]>([]);
  const [gitUser, setGitUser] = useState<any>(null);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [githubInput, setGithubInput] = useState(freelancer.githubUsername || '');
  const [isConnecting, setIsConnecting] = useState(false);

  React.useEffect(() => {
    if (!freelancer.githubUsername) {
      setRepos([]);
      setGitUser(null);
      return;
    }

    const fetchGitHubData = async () => {
      setReposLoading(true);
      setReposError(null);
      try {
        const userRes = await fetch(`https://api.github.com/users/${freelancer.githubUsername}`);
        if (!userRes.ok) {
          throw new Error('GitHub account not found');
        }
        const userData = await userRes.json();
        setGitUser(userData);

        const reposRes = await fetch(`https://api.github.com/users/${freelancer.githubUsername}/repos?sort=updated&per_page=4`);
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setRepos(reposData);
        }
      } catch (err: any) {
        console.error(err);
        setReposError(err.message || 'Error loading GitHub data');
      } finally {
        setReposLoading(false);
      }
    };

    fetchGitHubData();
  }, [freelancer.githubUsername]);

  const handleConnectGitHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim()) return;

    setIsConnecting(true);
    setReposError(null);
    fetch(`https://api.github.com/users/${githubInput.trim()}`)
      .then(res => {
        if (!res.ok) throw new Error('GitHub account not found');
        return res.json();
      })
      .then(data => {
        const updated = {
          ...freelancer,
          githubUsername: githubInput.trim()
        };
        onUpdateFreelancer(updated);
        setIsConnecting(false);
      })
      .catch(err => {
        setReposError('Kiritilgan GitHub foydalanuvchisi topilmadi. Iltimos, tekshirib qaytadan urinib koʻring.');
        setIsConnecting(false);
      });
  };

  const handleDisconnectGitHub = () => {
    const updated = {
      ...freelancer,
      githubUsername: undefined
    };
    onUpdateFreelancer(updated);
    setGithubInput('');
    setRepos([]);
    setGitUser(null);
  };

  // New Portfolio Item state
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectImg, setProjectImg] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  // New Review state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Drag and drop simulator
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const previewUrl = URL.createObjectURL(file);
      setUploadedPreview(previewUrl);
      // Give a random fallback cool unsplash image or support raw preview url for portfolio
      setProjectImg(previewUrl);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setUploadedPreview(previewUrl);
      setProjectImg(previewUrl);
    }
  };

  // Preset image generator helper if no URL provided
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDesc) return;

    const fallbackImages = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=600&h=400',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=400'
    ];
    const imageToUse = projectImg || uploadedPreview || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

    const newItem: PortfolioItem = {
      id: `p_new_${Date.now()}`,
      title: projectTitle,
      description: projectDesc,
      imageUrl: imageToUse,
      projectUrl: projectLink,
      dateAdded: new Date().toLocaleDateString('uz-UZ')
    };

    const currentPortfolio = freelancer.portfolio || [];
    const updatedFreelancer: Freelancer = {
      ...freelancer,
      portfolio: [newItem, ...currentPortfolio],
      completedJobs: freelancer.completedJobs + 1
    };

    onUpdateFreelancer(updatedFreelancer);

    // reset forms
    setProjectTitle('');
    setProjectDesc('');
    setProjectImg('');
    setProjectLink('');
    setUploadedPreview(null);
    setNewProjectOpen(false);
  };

  // Handle saving primary editable parts
  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFreelancer: Freelancer = {
      ...freelancer,
      title: editTitle,
      bio: editBio,
      location: editLocation,
      hourlyRate: Number(editHourlyRate) || 12,
      avatar: editAvatar,
      coverImage: editCover,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
      githubUsername: githubInput.trim() || undefined
    };

    onUpdateFreelancer(updatedFreelancer);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveSubTab('portfolio');
    }, 1500);
  };

  // Add a brand new client review feedback item
  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;

    const newReview: ReviewItem = {
      id: `rev_new_${Date.now()}`,
      authorName: newReviewAuthor,
      authorAvatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=100&h=100`,
      rating: newReviewRating,
      text: newReviewText,
      date: new Date().toISOString().substring(0, 10)
    };

    const currentReviews = freelancer.reviews || [];
    const updatedReviews = [newReview, ...currentReviews];
    
    // Recalculate average rating & counts
    const totalRatingSum = updatedReviews.reduce((sum, item) => sum + item.rating, 0);
    const newAverage = Number((totalRatingSum / updatedReviews.length).toFixed(2));

    const updatedFreelancer: Freelancer = {
      ...freelancer,
      reviews: updatedReviews,
      reviewsCount: updatedReviews.length,
      rating: newAverage
    };

    onUpdateFreelancer(updatedFreelancer);
    setNewReviewAuthor('');
    setNewReviewText('');
    setNewReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
    }, 3000);
  };

  const currentPortfolio = freelancer.portfolio || [];
  const currentReviews = freelancer.reviews || [];

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 shadow-xl relative z-10">
      
      {/* Absolute Back Button if onBack is passed (allows closing detail logs) */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute left-6 top-6 z-30 flex items-center gap-2 bg-white/90 hover:bg-white text-slate-800 hover:text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-md border hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ORQAGA QAYTISH</span>
        </button>
      )}

      {/* Cover Banner Area */}
      <div className="h-64 md:h-72 w-full relative bg-indigo-900 overflow-hidden">
        <img 
          src={editCover || freelancer.coverImage} 
          alt="Banner cover" 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
        
        {/* Decorative corner tag */}
        <span className="absolute bottom-4 right-6 bg-white/10 backdrop-blur-md text-white border border-white/20 font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>PRO PLATFORMA</span>
        </span>
      </div>

      {/* Profile Header Card */}
      <div className="px-6 md:px-8 pb-6 relative">
        <div className="flex flex-col md:flex-row gap-6 items-end md:items-start -mt-16 md:-mt-22 mb-6">
          {/* Avatar frame */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl md:rounded-3xl border-4 border-white dark:border-slate-900 bg-slate-100 shadow-md relative overflow-hidden shrink-0 group">
            <img 
              src={editAvatar || freelancer.avatar} 
              alt={freelancer.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isOwnProfile && (
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-3xs font-bold transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 mb-1" />
                <span>Rasm havolasi</span>
                <input 
                  type="text" 
                  value={editAvatar} 
                  onChange={(e) => {
                    setEditAvatar(e.target.value);
                    onUpdateFreelancer({ ...freelancer, avatar: e.target.value });
                  }}
                  className="absolute bottom-2 left-2 right-2 px-1 text-[9px] text-slate-800 rounded bg-white font-normal" 
                  placeholder="https://..."
                />
              </label>
            )}
          </div>

          {/* Core Info Info */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-none">
                {freelancer.name}
              </h2>
              {freelancer.verified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono">
                  <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                  <span>VERIFIED</span>
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm font-semibold font-mono text-indigo-600 mb-2">
              {freelancer.title}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono font-medium text-slate-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{freelancer.location}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span className="text-slate-700 dark:text-slate-300 font-bold">{freelancer.completedJobs} ta topshirilgan loyiha</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/30 px-2 py-0.5 rounded font-black text-[10px]">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 stroke-none" />
                <span>{freelancer.rating.toFixed(2)}</span>
                <span className="opacity-60 text-sans font-light bg-none border-none">({freelancer.reviewsCount} fikrlar)</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1.0 rounded font-black text-[10px] border border-indigo-200/30 font-mono">
                <span>Stavka:</span>
                <span>{convertAndFormat(freelancer.hourlyRate, freelancer.currency, selectedCurrency)}/soat</span>
              </div>
            </div>
          </div>

          {/* Action Call for hiring/chat */}
          {!isOwnProfile && (
            <div className="flex gap-2 w-full md:w-auto shrink-0 justify-center">
              <button
                onClick={() => onStartChat(freelancer.id)}
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-slate-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:scale-102"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chatga oʻtish (Direct Chat)</span>
              </button>
            </div>
          )}
        </div>

        {/* Short Bios */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 max-w-4xl mb-8">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5 font-bold">MUTAXASSIS BIO / MA'LUMOTI</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light whitespace-pre-line">
            {freelancer.bio}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-3xs font-mono text-slate-400 font-bold uppercase tracking-wide mr-1 mb-1 block">KO'NIKMALAR:</span>
            {freelancer.skills.map((skill) => (
              <span 
                key={skill}
                className="text-[10px] font-semibold bg-white border text-slate-600 px-2.5 py-1 rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* GitHub Integration Widget */}
        <div className="bg-[#fcfdfd] dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 max-w-4xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-full blur-2xl pointer-events-none -z-10" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-900 text-white rounded-xl">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 dark:text-slate-350 leading-none">GITHUB INTEGRATSIYASI</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Haqiqiy kod omborlari (repositories) va faollik darajasi</p>
              </div>
            </div>

            {/* If connected, show username and disconnect button */}
            {freelancer.githubUsername && (
              <div className="flex items-center gap-2">
                <span className="text-3xs font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-bold">
                  @{freelancer.githubUsername}
                </span>
                {isOwnProfile && (
                  <button 
                    onClick={handleDisconnectGitHub}
                    className="text-3xs font-mono text-red-500 hover:text-red-700 font-bold border border-red-200/50 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors cursor-pointer animate-fade-in"
                  >
                    Ulanishni uzish
                  </button>
                )}
              </div>
            )}
          </div>

          {/* GitHub Body */}
          {!freelancer.githubUsername ? (
            // NOT CONNECTED YET
            <div className="py-4 text-left">
              {isOwnProfile ? (
                <form onSubmit={handleConnectGitHub} className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-light">
                      Mijozlar ishonchini oshirish va professional portfolioingizni koʻrsatish uchun GitHub hisobingizni bogʻlang. Tizim sizning ochiq kod omborlaringizni avtomatik ravishda profil sahifangizda jonli koʻrsatadi.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 max-w-md pt-1">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">github.com/</span>
                      <input 
                        type="text"
                        required
                        value={githubInput}
                        onChange={(e) => setGithubInput(e.target.value)}
                        placeholder="foydalanuvchi-nomi"
                        className="w-full text-xs font-mono pl-[90px] pr-3 py-2 border rounded-xl bg-white dark:bg-slate-900 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isConnecting}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      {isConnecting ? 'Tekshirilmoqda...' : 'Ulash & Tekshirish'}
                    </button>
                  </div>
                  {reposError && (
                    <p className="text-[10px] text-red-500 font-mono mt-1 font-semibold">{reposError}</p>
                  )}
                </form>
              ) : (
                <div className="text-center py-4 text-slate-400">
                  <p className="text-3xs font-mono uppercase tracking-wider font-semibold">GitHub ulanmagan</p>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5 font-sans">Ushbu frilanser hali oʻz GitHub hisobini profilga bogʻlamagan.</p>
                </div>
              )}
            </div>
          ) : (
            // CONNECTED: Loading or Repos Display
            <div className="space-y-4">
              {reposLoading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black animate-pulse">GitHub dan ma'lumotlar o'qilmoqda...</span>
                </div>
              ) : reposError ? (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-800 dark:text-rose-400 p-4 rounded-xl text-xs font-mono flex items-start gap-2">
                  <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">GitHub API xatosi:</p>
                    <p className="text-[10px] font-light mt-0.5">{reposError}. Profilni qayta yuklang yoki foydalanuvchi nomini tekshiring.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  {/* User Profile Mini Badge card */}
                  {gitUser && (
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={gitUser.avatar_url} 
                          alt="GitHub avatar" 
                          className="w-10 h-10 rounded-full border border-slate-200" 
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-none flex items-center gap-1.5 font-sans">
                            <span>{gitUser.name || gitUser.login}</span>
                            <span className="text-[9px] font-mono font-normal text-slate-400">({gitUser.login})</span>
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1 leading-tight font-light max-w-md font-sans">{gitUser.bio || 'GitHub bio kiritilmagan'}</p>
                        </div>
                      </div>

                      {/* Stats pill-badge */}
                      <div className="flex gap-4 text-center">
                        <div className="font-mono">
                          <span className="text-xs font-black text-slate-900 dark:text-white block leading-none">{gitUser.public_repos}</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">OMBORLAR</span>
                        </div>
                        <div className="font-mono border-l pl-4 dark:border-slate-800">
                          <span className="text-xs font-black text-slate-900 dark:text-white block leading-none">{gitUser.followers}</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">KUZATUVCHILAR</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Public Repos list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {repos.map((repo) => (
                      <a 
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white dark:bg-slate-950 border border-slate-150/80 dark:border-slate-850 hover:border-indigo-500/30 p-4 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all group relative overflow-hidden text-left"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-850 dark:text-white font-mono group-hover:text-indigo-650 transition-colors flex items-center gap-1">
                              <Terminal className="w-3 h-3 text-slate-400" />
                              {repo.name}
                            </span>
                            <span className="text-[9px] bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded font-mono font-semibold text-slate-500">
                              {repo.visibility || 'public'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-light line-clamp-2 font-sans">
                            {repo.description || 'Tavsif berilmagan.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-900 pt-2.5 mt-3 text-[9px] font-mono text-slate-400 font-bold">
                          <div className="flex items-center gap-3">
                            {repo.language && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span>{repo.language}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500 stroke-none" />
                              <span>{repo.stargazers_count}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="w-3 h-3 text-slate-400" />
                              <span>{repo.forks_count}</span>
                            </span>
                          </div>
                          <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-0.5">
                            <span>Havola</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Tabs router */}
        <div className="border-b border-slate-100 mb-6 flex justify-between items-center">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveSubTab('portfolio')}
              className={`pb-3 px-4 text-xs font-bold font-mono tracking-wide border-b-2 transition-all ${
                activeSubTab === 'portfolio'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              💼 LOYIHALAR VA ISHLARI ({currentPortfolio.length})
            </button>
            <button
              onClick={() => setActiveSubTab('reviews')}
              className={`pb-3 px-4 text-xs font-bold font-mono tracking-wide border-b-2 transition-all ${
                activeSubTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              ⭐ MIJOZ FIKRLARI ({currentReviews.length})
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveSubTab('edit')}
                className={`pb-3 px-4 text-xs font-bold font-mono tracking-wide border-b-2 transition-all ${
                  activeSubTab === 'edit'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                ⚙️ PROFILNI TAHRIRLASH
              </button>
            )}
          </div>

          {/* Floating actions under tabs */}
          {activeSubTab === 'portfolio' && isOwnProfile && (
            <button
              onClick={() => setNewProjectOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold font-mono px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all hover:scale-103"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>YANGI ISH QO'SHISH</span>
            </button>
          )}
        </div>

        {/* Tab Contents Frame */}
        <div>
          
          {/* 1. PORTFOLIO VIEW */}
          {activeSubTab === 'portfolio' && (
            <div className="space-y-6">
              
              {/* Form to submit new work dynamically */}
              <AnimatePresence>
                {newProjectOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <form onSubmit={handleAddProject} className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 md:p-6 space-y-4">
                      <div className="flex justify-between items-center border-b pb-2 border-amber-200/20">
                        <h4 className="text-xs font-mono font-bold uppercase text-amber-900 flex items-center gap-1.5">
                          <Plus className="w-4 h-4" />
                          <span>Yangi Loyihani Portfelga Yuklash</span>
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => setNewProjectOpen(false)}
                          className="text-xs font-mono text-slate-400 hover:text-rose-500 font-bold"
                        >
                          YOpish [X]
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">LOyiha Nomi *</label>
                            <input 
                              type="text" 
                              required
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                              placeholder="Masalan: Uzum bank telegram bot integratsiyasi"
                              className="w-full px-3 py-2 rounded-xl text-xs border bg-white border-slate-200 focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Batafsil tavsifi *</label>
                            <textarea 
                              required
                              rows={3}
                              value={projectDesc}
                              onChange={(e) => setEditBio(editBio)} // trigger check
                              onChangeCapture={(e) => setProjectDesc((e.target as HTMLTextAreaElement).value)}
                              placeholder="Loyiha qanday muammolarni hal qildi va qaysi texnologiyalar ishlatildi..."
                              className="w-full px-3 py-2 rounded-xl text-xs border bg-white border-slate-200 focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Loyiha havolasi (Optional)</label>
                            <input 
                              type="url" 
                              value={projectLink}
                              onChange={(e) => setProjectLink(e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-xl text-xs border bg-white border-slate-200 focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        {/* Interactive Drag Drop File Upload container */}
                        <div className="space-y-3">
                          <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Loyiha Screen / Rasmi (Rasm yuklash yoki URL)</label>
                          
                          <div 
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                              dragActive 
                                ? 'bg-indigo-50/70 border-indigo-500' 
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {uploadedPreview ? (
                              <div className="relative w-full h-32 rounded-xl overflow-hidden group">
                                <img src={uploadedPreview} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadedPreview(null);
                                    setProjectImg('');
                                  }}
                                  className="absolute top-2 right-2 bg-red-600 text-white text-xs p-1.5 rounded-full hover:scale-105"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
                                <p className="text-[11px] font-mono text-slate-500 font-medium">
                                  Rasmni/Faylni shu yerga sudrab tashlang yoki <span className="text-indigo-600 underline font-semibold">fayl tanlang</span>
                                </p>
                                <p className="text-[9px] text-slate-400 mt-1">Humo/Uzcard check, figma screenshot yoki portfolio rasmi</p>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={handleFileSelect}
                                  className="hidden" 
                                  id="portfolio-file-upload"
                                />
                                <label htmlFor="portfolio-file-upload" className="absolute inset-0 cursor-pointer w-full h-full" onClick={(e) => e.stopPropagation()} />
                              </>
                            )}
                          </div>

                          <div className="text-center font-bold text-[10px] text-slate-400">YOKI RASM LINKINI INPUTGA QO'YING</div>

                          <input 
                            type="text" 
                            value={projectImg}
                            onChange={(e) => setProjectImg(e.target.value)}
                            placeholder="Havola (https://unsplash.com/...)"
                            className="w-full px-3 py-2 rounded-xl text-xs border bg-white border-slate-200 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-amber-200/10">
                        <button
                          type="button"
                          onClick={() => setNewProjectOpen(false)}
                          className="px-4 py-2 rounded-xl text-slate-500 text-xs font-bold hover:bg-slate-100"
                        >
                          Bekor qilish
                        </button>
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-slate-900 text-white text-xs font-bold px-5 py-2 rounded-xl shadow"
                        >
                          Portfolioga saqlash
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Portfolio Grid Render */}
              {currentPortfolio.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed text-slate-400">
                  <AppWindow className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs font-mono font-semibold uppercase">YUKLANGAN ISHLAR YO'Q</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-light">Bu mutaxassis hali o'z loyihalarini joylashtirmagan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPortfolio.map((project) => (
                    <div 
                      key={project.id}
                      className="bg-white border select-none border-slate-150/80 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-semibold tracking-tight text-slate-900 mb-2">
                            {project.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-light leading-relaxed mb-4">
                            {project.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t pt-3 mt-2 text-[10px] font-mono text-slate-400">
                          <span>Qo'shilgan sana: {project.dateAdded || 'Mulk'}</span>
                          {project.projectUrl && (
                            <a 
                              href={project.projectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                            >
                              <span>Ko'rish</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* 2. REVIEWS / COMMENTS VIEW */}
          {activeSubTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* Feedback statistics display */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-display font-black text-slate-900 dark:text-white leading-none mb-2">
                  {freelancer.rating.toFixed(2)}
                </span>
                <div className="flex gap-0.5 text-amber-500 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-4 h-4 ${s <= Math.round(freelancer.rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wide">
                  {currentReviews.length} TA BAHOLASH QOLDIRILDI
                </span>
              </div>

              {/* Interactive Form for leaving feedback/comments */}
              <div className="md:col-span-2 space-y-6">
                
                <form onSubmit={handleAddReviewSubmit} className="bg-white border rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-700 border-b pb-2">
                    🌟 Platfomada mulohaza qoldirish / Baholash
                  </h4>

                  {reviewSuccess && (
                    <div className="p-3 text-xs font-mono font-bold text-center bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl">
                      🎉 Fikringiz muvaffaqiyatli joʻnatildi va reyting yangilandi!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-slate-500 uppercase mb-1">Ismingiz *</label>
                      <input 
                        type="text" 
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="Masalan: Sardorbek Ramanov"
                        className="w-full px-3 py-2 rounded-xl text-xs border bg-slate-50 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-slate-500 uppercase mb-1">Reyting (Star) *</label>
                      <div className="flex gap-2 py-1 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="focus:outline-none hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`w-6 h-6 ${
                                star <= newReviewRating 
                                  ? 'fill-amber-500 text-amber-500' 
                                  : 'text-slate-200 hover:text-slate-300'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="text-xs font-mono font-bold text-slate-600 block pl-2">{newReviewRating} / 5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-slate-500 uppercase mb-1">Mulohaza matni *</label>
                    <textarea 
                      required
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Loyihadan qanchalik qoniqdingiz, mutaxassisning xushmuomalaligi va tezligi haqida yozing..."
                      className="w-full px-3 py-2 rounded-xl text-xs border bg-slate-50 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newReviewAuthor || !newReviewText}
                      className="bg-indigo-600 hover:bg-slate-900 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Fikrni nashr qilish</span>
                    </button>
                  </div>
                </form>

                {/* Render Review Items lists */}
                <div className="space-y-4">
                  {currentReviews.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl text-slate-400 text-xs">
                      Bu yerda hali hech kim fikr qoldirmagan. Birinchi bo'lib fikr qoldiring!
                    </div>
                  ) : (
                    currentReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={rev.authorAvatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80`} 
                              alt="" 
                              className="w-8 h-8 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 block leading-none">{rev.authorName}</h5>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{rev.date}</span>
                            </div>
                          </div>

                          <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((dummyStar) => (
                              <Star 
                                key={dummyStar} 
                                className={`w-3.5 h-3.5 ${dummyStar <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} 
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-light">
                          {rev.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          )}

          {/* 3. EDIT PROFILE SETTINGS VIEW */}
          {activeSubTab === 'edit' && isOwnProfile && (
            <form onSubmit={handleSaveProfileEdit} className="bg-slate-50 border rounded-2xl p-6 space-y-5">
              <div className="flex justify-between items-center border-b pb-3">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-indigo-600" />
                  <span>Ma'lumotlaringizni O'zgartirish</span>
                </h4>
                {saveSuccess && (
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    ✅ Oʻzgarishlar mukammal saqlandi!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Kasb unvoni (Title)</label>
                  <input 
                    type="text" 
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Soatlik toʻlov stavkasi ($/hour)</label>
                  <input 
                    type="number" 
                    required
                    value={editHourlyRate}
                    onChange={(e) => setEditHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Manzil / Location</label>
                  <input 
                    type="text" 
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Ko'nikmalar (Skills - vergul bilan ajrating)</label>
                  <input 
                    type="text" 
                    required
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Avatar Havolasi URL</label>
                  <input 
                    type="text" 
                    required
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Fon Banner Gid URL (Cover)</label>
                  <input 
                    type="text" 
                    required
                    value={editCover}
                    onChange={(e) => setEditCover(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">GitHub Foydalanuvchi nomi (Username)</label>
                  <input 
                    type="text" 
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="Masalan: SardorbekRamanov"
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase mb-1">Batafsil tarjimai hol (Bio)</label>
                <textarea 
                  required
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs border bg-white focus:ring-1 focus:ring-indigo-500 leading-relaxed font-light"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
                >
                  O'zgarishlarni saqlash
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
