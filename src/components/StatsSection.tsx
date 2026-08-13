import React from 'react';
import { Language, LanguageStrings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Users, Briefcase, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsSectionProps {
  currentLang: Language;
}

export default function StatsSection({ currentLang }: StatsSectionProps) {
  const strings: LanguageStrings = TRANSLATIONS[currentLang];

  const statItems = [
    {
      id: 'stat_1',
      value: '24,500+',
      label: strings.freelancersCount,
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      bgClass: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      borderClass: 'border-indigo-100/60 dark:border-indigo-900/40'
    },
    {
      id: 'stat_2',
      value: '18,200+',
      label: strings.jobsCount,
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      bgClass: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      borderClass: 'border-emerald-100/60 dark:border-emerald-900/40'
    },
    {
      id: 'stat_3',
      value: '99.4%',
      label: strings.completedCount,
      icon: <CheckCircle2 className="w-5 h-5 text-amber-600" />,
      bgClass: 'bg-amber-50/50 dark:bg-amber-950/20',
      borderClass: 'border-amber-100/60 dark:border-amber-900/40'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl mx-auto my-8">
      {statItems.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className={`flex items-center gap-4 p-5 rounded-2xl border ${item.bgClass} ${item.borderClass} shadow-sm backdrop-blur-sm`}
        >
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
            {item.icon}
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {item.value}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              {item.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
