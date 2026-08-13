import React, { useState } from 'react';
import { Language, LanguageStrings, Job, JobCategory, JobType } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { formatBudget, convertAndFormat, convertAmount } from '../data/mockData';
import { Search, MapPin, Calendar, Clock, DollarSign, Send, CheckCircle2, SlidersHorizontal, AlertCircle, Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobListProps {
  currentLang: Language;
  jobs: Job[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
}

export default function JobList({ currentLang, jobs, searchTerm, onSearchChange, selectedCurrency }: JobListProps) {
  const strings: LanguageStrings = TRANSLATIONS[currentLang];
  
  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(30000000); // 30 million UZS limit slider
  
  // Application details state
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [proposalText, setProposalText] = useState('');
  const [proposalRate, setProposalRate] = useState('');
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // Filter handlers
  const filteredJobs = jobs.filter(job => {
    // Search query check
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter check
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;

    // Type filter check
    const matchesType = selectedType === 'all' || job.type === selectedType;

    // Budget slider limitation logic (utilizing base currency UZS for slider thresholds)
    const normalizedBudget = convertAmount(job.budget, job.currency, 'UZS');
    const matchesBudget = normalizedBudget <= maxBudget;

    return matchesSearch && matchesCategory && matchesType && matchesBudget;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalText || !proposalRate) return;

    setProposalSuccess(true);
    setTimeout(() => {
      setProposalSuccess(false);
      setProposalText('');
      setProposalRate('');
      setApplyingJob(null);
    }, 2800);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-0">
      
      {/* Search Bar Frame */}
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
        
        {/* Sidenav Filters */}
        <div className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/85 p-5 sm:p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Qidiruv Filtrlari
            </h3>
          </div>

          {/* Category Dropdown/List */}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              {strings.filterCategory}
            </label>
            <div className="space-y-1.5">
              {[
                { code: 'all', label: strings.allCategories },
                { code: 'development', label: strings.development },
                { code: 'design', label: strings.design },
                { code: 'marketing', label: strings.marketing },
                { code: 'translation', label: strings.translation },
                { code: 'video', label: strings.video },
                { code: 'other', label: strings.other }
              ].map((cat) => (
                <button
                  key={cat.code}
                  onClick={() => setSelectedCategory(cat.code)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedCategory === cat.code
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Job Payment Type */}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              {strings.filterType}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'all', label: 'Barchasi' },
                { code: 'fixed', label: 'Fixed' },
                { code: 'hourly', label: 'Hourly' }
              ].map((t) => (
                <button
                  key={t.code}
                  onClick={() => setSelectedType(t.code)}
                  className={`py-1.5 rounded-lg border text-center transition-all text-[11px] font-semibold ${
                    selectedType === t.code
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom price/budget slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                {strings.filterPrice}
              </label>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">
                {maxBudget >= 30000000 ? 'No Limit' : maxBudget.toLocaleString() + ' UZS'}
              </span>
            </div>
            <input 
              type="range"
              min={100000}
              max={30000000}
              step={30000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-ew-resize"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>100K Buyurtma</span>
              <span>30M+ soʻm</span>
            </div>
          </div>

        </div>

        {/* Outer list results */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h2 className="text-lg font-display font-medium text-slate-900 dark:text-white">
                {strings.browseJobsTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {strings.browseJobsSubtitle}
              </p>
            </div>
            <span className="text-[10px] bg-slate-100 font-bold dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
              {filteredJobs.length} ta natija
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                tabIndex={0}
                className="text-center py-16 bg-white border border-slate-100 rounded-3xl"
              >
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">{strings.noResults}</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedType('all');
                    setMaxBudget(30000000);
                    onSearchChange('');
                  }}
                  className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
                >
                  Filtrlarni tozalash
                </button>
              </motion.div>
            ) : (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                  className="bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800 hover:border-indigo-400/50 hover:shadow-md rounded-2xl p-5 sm:p-6 transition-all relative flex flex-col justify-between"
                >
                  {/* Category Pill Tag */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md uppercase font-mono">
                      {strings[job.category]}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.0 h-3.0" />
                      {job.datePosted === 'just_now' ? strings.justNow : `2 ${strings.daysAgo}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* Body description preview */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 font-light leading-relaxed">
                    {job.description}
                  </p>

                  {/* Built Tags/Skills list */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {job.skills.map(skill => (
                      <span 
                        key={skill}
                        className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 rounded-md px-2 py-0.5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Strip: Budget, proposals, Apply CTA */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-5 gap-3">
                    <div className="flex flex-wrap gap-4 text-xs font-medium">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">{strings.budgetLabel}</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {convertAndFormat(job.budget, job.currency, selectedCurrency)}
                        </span>
                        <span className="text-[9px] text-slate-400 block">({job.type === 'fixed' ? strings.fixedPrice : strings.hourlyRate})</span>
                      </div>

                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">Buyurtmachi</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block truncate max-w-[120px]">{job.clientName}</span>
                        <span className="text-[10px] text-amber-500 block">★ {job.clientRating}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setApplyingJob(job)}
                      className="w-full sm:w-auto px-4.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow-indigo-100 dark:bg-white dark:text-slate-900 transition-all cursor-pointer text-center"
                    >
                      {strings.applyNow}
                    </button>
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Interactive applications overlay card modal */}
      <AnimatePresence>
        {applyingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApplyingJob(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-100 rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-lg z-10 overflow-hidden"
            >
              <button 
                onClick={() => setApplyingJob(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {proposalSuccess ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Taklifingiz muvaffaqiyatli ketdi!
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                    {strings.proposalSuccess}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="border-b pb-3 border-slate-100">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-600 font-bold block mb-1">
                      Loyiha arizasi (Submit Bid)
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-1">
                      {applyingJob.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Platforma: Freelance.uz xavfsiz bitim tizimi orqali ishlaysiz
                    </p>
                  </div>

                  {/* Input Bid Price */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Siz taklif etayotgan narx ({selectedCurrency}da)
                    </label>
                    <div className="relative">
                      <input 
                        type="number"
                        required
                        value={proposalRate}
                        onChange={(e) => setProposalRate(e.target.value)}
                        placeholder={`Tavsiya qilingan narx: ${convertAndFormat(applyingJob.budget, applyingJob.currency, selectedCurrency)}`}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border text-xs bg-slate-50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold"
                      />
                      <DollarSign className="absolute left-2.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Cover letter draft */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Maktub, muddat va tajribangiz haqida (Cover Letter)
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={proposalText}
                      onChange={(e) => setProposalText(e.target.value)}
                      placeholder="Assalomu alaykum, men ushbu loyihadan batamom xabardorman. Qulay muddatda va top-darajada ishlab bera olaman..."
                      className="w-full px-4 py-2.5 rounded-xl border text-xs bg-slate-50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{strings.sendProposal}</span>
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
