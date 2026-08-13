import React, { useState } from 'react';
import { Language, LanguageStrings, Freelancer, JobCategory } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { convertAndFormat, convertAmount } from '../data/mockData';
import { CheckCircle, Star, Search, MapPin, Award, Mail, MessageSquare, ExternalLink, Calendar, CheckCircle2, ChevronRight, Send, Globe, Laptop, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FreelancerListProps {
  currentLang: Language;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectFreelancer: (id: string) => void;
  freelancers: Freelancer[];
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
}

export default function FreelancerList({ 
  currentLang, 
  searchTerm, 
  onSearchChange,
  onSelectFreelancer,
  freelancers,
  selectedCurrency
}: FreelancerListProps) {
  const strings: LanguageStrings = TRANSLATIONS[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  
  // Interactive Hire state
  const [hiringSpecialist, setHiringSpecialist] = useState<Freelancer | null>(null);
  const [message, setMessage] = useState('');
  const [hireSuccess, setHireSuccess] = useState(false);

  // Filters logic
  const filteredFreelancers = freelancers.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      f.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesRating = f.rating >= minRating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setHireSuccess(true);
    setTimeout(() => {
      setHireSuccess(false);
      setMessage('');
      setHiringSpecialist(null);
    }, 2800);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-0">
      
      {/* Search Input Filter */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={strings.searchPlaceholder}
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-xs md:text-sm"
        />
        <Search className="absolute left-4.5 top-4 w-5 h-5 text-slate-400" />
        {searchTerm && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-4 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 border border-slate-150 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="border-b pb-3 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Mutaxassislar Filtr
            </h3>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              Mutaxassisligi (Category)
            </label>
            <div className="space-y-1.5">
              {[
                { code: 'all', label: strings.allCategories },
                { code: 'development', label: strings.development },
                { code: 'design', label: strings.design },
                { code: 'marketing', label: strings.marketing },
                { code: 'translation', label: strings.translation },
                { code: 'video', label: strings.video }
              ].map((category) => (
                <button
                  key={category.code}
                  onClick={() => setSelectedCategory(category.code)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedCategory === category.code
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{category.label}</span>
                  {selectedCategory === category.code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum rating */}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Reyting (Rating)
            </label>
            <div className="flex gap-1">
              {[5.0, 4.9, 4.8, 0].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`py-1 flex-1 text-center font-bold text-[11px] rounded-lg border transition-all ${
                    minRating === rating 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-900 font-black' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {rating === 0 ? 'All' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Outer list results */}
        <div className="flex-1 space-y-5 w-full">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h2 className="text-lg font-display font-medium text-slate-900 dark:text-white">
                {strings.browseFreelancersTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {strings.browseFreelancersSubtitle}
              </p>
            </div>
            <span className="text-[10px] bg-indigo-50 font-bold text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              {filteredFreelancers.length} top top
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredFreelancers.map((freelancer, index) => (
              <motion.div
                key={freelancer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 md:p-6 hover:shadow-md transition-all relative"
              >
                
                {/* Micro Verified Badge in top corner */}
                {freelancer.verified && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100/60 rounded-full py-1 px-3 text-[10px] font-bold font-mono">
                    <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                    <span>VERIFIED</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-5 items-start">
                  
                  {/* Avatar Frame with dynamic initials placeholder on fallback */}
                  <button 
                    onClick={() => onSelectFreelancer(freelancer.id)}
                    className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0 relative bg-slate-100 border border-slate-200/50 cursor-pointer hover:border-indigo-650 focus:outline-none transition-all hover:scale-105"
                  >
                    <img 
                      src={freelancer.avatar} 
                      alt={freelancer.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Body profile details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <button
                        onClick={() => onSelectFreelancer(freelancer.id)}
                        className="font-display font-semibold text-slate-900 dark:text-white leading-none hover:text-indigo-650 text-left transition-colors cursor-pointer focus:outline-none"
                      >
                        {freelancer.name}
                      </button>
                      
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-black">
                        <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                        <span>{freelancer.rating.toFixed(2)}</span>
                        <span className="text-slate-400 font-light font-mono">({freelancer.reviewsCount})</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-indigo-600 font-mono mb-2">
                      {freelancer.title}
                    </h4>

                    {/* Short bio preview */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light mb-4 text-clamp">
                      {freelancer.bio}
                    </p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {freelancer.skills.map(skill => (
                        <span
                          key={skill}
                          className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded px-2.5 py-1 text-center font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                  </div>

                </div>

                {/* Bottom stats row & CTA */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-5 gap-3">
                  <div className="flex flex-wrap gap-6 text-[11px] font-mono font-medium text-slate-400/80">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{freelancer.location}</span>
                    </div>

                    <div className="flex items-center gap-1 border-l pl-5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{freelancer.completedJobs} {strings.jobsCompleted}</span>
                    </div>

                    <div className="flex items-center gap-1 border-l pl-5">
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{convertAndFormat(freelancer.hourlyRate, freelancer.currency, selectedCurrency)}/soat</span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onSelectFreelancer(freelancer.id)}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-205 text-slate-705 hover:bg-slate-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                    >
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span>Profil / Ishlari</span>
                    </button>
                    
                    <button
                      onClick={() => setHiringSpecialist(freelancer)}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-slate-900 border border-indigo-600 hover:border-slate-900 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{strings.hireMe}</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>

        </div>
      </div>

      {/* Hire dialog overlay */}
      <AnimatePresence>
        {hiringSpecialist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHiringSpecialist(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-100 rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md z-10 overflow-hidden"
            >
              <button 
                onClick={() => setHiringSpecialist(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {hireSuccess ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Sizning soʻrovingiz yuborildi!
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                    Mutaxassis {hiringSpecialist.name} platforma chatida siz bilan tez kunda bogʻlanadi. Freelance.uz xavfsiz hisob-kitoblaridan foydalanishni unutmang.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleHireSubmit} className="space-y-4">
                  <div className="border-b pb-3 border-slate-100 flex items-center gap-3">
                    <img 
                      src={hiringSpecialist.avatar} 
                      alt="" 
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 block leading-tight">
                        {hiringSpecialist.name}
                      </h3>
                      <span className="text-[10px] text-indigo-600 font-semibold font-mono block">
                        {hiringSpecialist.title}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Mutaxassisga loyiha tafsilotlarini yuboring
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Assalomu alaykum, ${hiringSpecialist.name.split(' ')[0]}. Bizga loyiha uchun siz kabi tajribali mutaxassis kerak edi...`}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium leading-relaxed"
                    />
                  </div>

                  <div className="text-[10px] text-slate-400 bg-slate-50 border rounded-xl p-3 leading-relaxed">
                    🌟 <strong>Soatbay stavka:</strong> {convertAndFormat(hiringSpecialist.hourlyRate, hiringSpecialist.currency, selectedCurrency)}/soat <br />
                    🔒 <strong>Xavfsiz kelishuv:</strong> Toʻlovingiz platforma tomonidan toʻliq himoyalangan boʻladi.
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Aloqaga chiqish (Contact Specialist)</span>
                  </button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
