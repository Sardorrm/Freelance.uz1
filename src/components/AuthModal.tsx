import React, { useState } from 'react';
import { Language, LanguageStrings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { X, Lock, Mail, User, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  currentLang: Language;
  onSuccess: (session: { uid: string; name: string; email: string }) => void;
}

// Small localized error-message map. Kept local to this component so we
// don't have to widen the global LanguageStrings contract for every
// possible Firebase Auth error code.
const AUTH_ERRORS: Record<Language, Record<string, string>> = {
  uz: {
    'auth/email-already-in-use': "Bu email allaqachon roʻyxatdan oʻtgan. Kirish (Login) qiling.",
    'auth/invalid-email': "Email manzili notoʻgʻri.",
    'auth/weak-password': "Parol juda kalta. Kamida 6 ta belgi kiriting.",
    'auth/wrong-password': "Parol notoʻgʻri.",
    'auth/user-not-found': "Bunday foydalanuvchi topilmadi. Roʻyxatdan oʻting.",
    'auth/invalid-credential': "Email yoki parol notoʻgʻri.",
    'auth/too-many-requests': "Juda koʻp urinish. Birozdan keyin qayta urinib koʻring.",
    default: "Xatolik yuz berdi. Qaytadan urinib koʻring.",
  },
  ru: {
    'auth/email-already-in-use': "Этот email уже зарегистрирован. Войдите в систему.",
    'auth/invalid-email': "Неверный адрес электронной почты.",
    'auth/weak-password': "Пароль слишком короткий. Минимум 6 символов.",
    'auth/wrong-password': "Неверный пароль.",
    'auth/user-not-found': "Пользователь не найден. Зарегистрируйтесь.",
    'auth/invalid-credential': "Неверный email или пароль.",
    'auth/too-many-requests': "Слишком много попыток. Попробуйте позже.",
    default: "Произошла ошибка. Попробуйте снова.",
  },
  en: {
    'auth/email-already-in-use': "This email is already registered. Please log in instead.",
    'auth/invalid-email': "That email address looks invalid.",
    'auth/weak-password': "Password is too short. Use at least 6 characters.",
    'auth/wrong-password': "Incorrect password.",
    'auth/user-not-found': "No account found with that email. Please register.",
    'auth/invalid-credential': "Incorrect email or password.",
    'auth/too-many-requests': "Too many attempts. Please try again shortly.",
    default: "Something went wrong. Please try again.",
  },
};

export default function AuthModal({ isOpen, onClose, mode, currentLang, onSuccess }: AuthModalProps) {
  const strings: LanguageStrings = TRANSLATIONS[currentLang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const localizeError = (err: unknown): string => {
    const code = (err as AuthError)?.code || 'default';
    const table = AUTH_ERRORS[currentLang];
    return table[code] || table.default;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !fullName)) {
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName });

        // Create the public user profile document. This matches the
        // firestore.rules requirement that incoming().uid === userId.
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name: fullName,
          email,
          role: 'client',
          createdAt: serverTimestamp(),
        });

        setSuccess(true);
        setTimeout(() => {
          onSuccess({ uid: cred.user.uid, name: fullName, email });
          setSuccess(false);
          resetFields();
          onClose();
        }, 1200);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setSuccess(true);
        setTimeout(() => {
          onSuccess({
            uid: cred.user.uid,
            name: cred.user.displayName || email.split('@')[0],
            email: cred.user.email || email,
          });
          setSuccess(false);
          resetFields();
          onClose();
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(localizeError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md z-10 overflow-hidden"
        >
          {/* Top close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {strings.authSuccess}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                {strings.successMessage}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
                  {mode === 'login' ? strings.login : strings.register}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Freelance.uz - Oʻzbekiston freelanserlar platformasi
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {strings.fullName}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Sardorbek Ramanov"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                    />
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {strings.email}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@freelance.uz"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {strings.password}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-indigo-150 transition-colors mt-2 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {mode === 'login' ? strings.login : strings.register}
              </button>

              <div className="text-[11px] text-center text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Loyiha joylashtirish yoki rezyume topshirish mutlaqo bepul!
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
