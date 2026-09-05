import React, { useState } from 'react';
import { Language, LanguageStrings, Job, JobCategory, JobType } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { X, Briefcase, DollarSign, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSubmit: (job: Omit<Job, 'id' | 'datePosted' | 'proposalsCount'>) => Promise<void>;
  selectedCurrency?: 'UZS' | 'USD' | 'EUR';
}

export default function PostJobModal({ isOpen, onClose, currentLang, onSubmit, selectedCurrency }: PostJobModalProps) {
  const strings: LanguageStrings = TRANSLATIONS[currentLang];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(100000);
  const [currency, setCurrency] = useState<'UZS' | 'USD'>((selectedCurrency === 'USD' ? 'USD' : 'UZS'));
  const [type, setType] = useState<JobType>('fixed');
  const [category, setCategory] = useState<JobCategory>('development');
  const [duration, setDuration] = useState('1 hafta');
  const [skillsString, setSkillsString] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBudget(100000);
    setCurrency(selectedCurrency === 'USD' ? 'USD' : 'UZS');
    setType('fixed');
    setCategory('development');
    setDuration('1 hafta');
    setSkillsString('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !title.trim() || !description.trim() || !duration.trim() || budget <= 0) return;

    setSubmitting(true);
    setError(null);

    const skills = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        budget: Number(budget),
        currency,
        type,
        duration: duration.trim(),
        skills: skills.length > 0 ? skills : ['General'],
        clientName: 'Sizning loyihangiz',
        clientRating: 5.0,
        location: 'Oʻzbekiston'
      });

      setSuccess(true);
      window.setTimeout(() => {
        setSuccess(false);
        resetForm();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Job submission failed:', err);
      setError('Vakansiyani saqlab bo‘lmadi. Internet va hisobingizni tekshirib, qayta urinib ko‘ring.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !submitting && onClose()}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-2xl z-10 overflow-y-auto max-h-[90vh]"
        >
          <button onClick={onClose} disabled={submitting} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-40">
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{strings.jobCreatedSuccess}</h3>
              <p className="text-sm text-slate-400">{strings.successMessage}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  {strings.postJobTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{strings.postJobSubtitle}</p>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">{strings.jobTitleInput}</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Masalan: Telegram bot yaratib beradigan tajribali dasturchi kerak" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">{strings.filterCategory}</label>
                  <select value={category} onChange={e => setCategory(e.target.value as JobCategory)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold">
                    <option value="development">{strings.development}</option>
                    <option value="design">{strings.design}</option>
                    <option value="marketing">{strings.marketing}</option>
                    <option value="translation">{strings.translation}</option>
                    <option value="video">{strings.video}</option>
                    <option value="other">{strings.other}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">{strings.filterType}</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setType('fixed')} className={`flex-1 py-2 text-xs font-bold rounded-xl border ${type === 'fixed' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{strings.fixedPrice}</button>
                    <button type="button" onClick={() => setType('hourly')} className={`flex-1 py-2 text-xs font-bold rounded-xl border ${type === 'hourly' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{strings.hourlyRate}</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">{strings.jobBudgetInput} ({strings.budgetLabel})</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type="number" required min={1} value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold" />
                    <DollarSign className="absolute left-2.5 top-3 w-4 h-4 text-slate-400" />
                  </div>
                  <select value={currency} onChange={e => setCurrency(e.target.value as 'UZS' | 'USD')} className="w-24 px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold">
                    <option value="UZS">UZS (soʻm)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">Muddati (Duration)</label>
                  <input type="text" required value={duration} onChange={e => setDuration(e.target.value)} placeholder="Masalan: 2 hafta, 1 oy, uzoq muddatli" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">Texnologiya va talablar</label>
                  <input type="text" value={skillsString} onChange={e => setSkillsString(e.target.value)} placeholder="Masalan: React, Node.js, Click API" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">{strings.jobDescInput}</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Loyihada dasturchi yoki dizayner nima qilishi kerakligini mukammal tasvirlab bering..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium leading-relaxed" />
              </div>

              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">{error}</div>}

              <div className="pt-2">
                <button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors">
                  {submitting ? 'Saqlanmoqda...' : strings.submitJobBtn}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
