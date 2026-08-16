import React, { useState } from 'react';
import { Language, LanguageStrings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { X, Lock, Mail, User, ShieldCheck, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  currentLang: Language;
  onSuccess: (session: { uid: string; name: string; email: string }) => void;
}

// Localized error messages
const AUTH_ERRORS: Record<Language, Record<string, string>> = {
  uz: {
    'auth/email-already-in-use': "Bu email allaqachon roʻyxatdan oʻtgan. Kirish (Login) qiling.",
    'auth/invalid-email': "Email manzili notoʻgʻri shaklda kiritildi.",
    'auth/weak-password': "Parol kamida 6 ta belgidan iborat boʻlishi kerak.",
    'auth/wrong-password': "Parol notoʻgʻri kiritildi.",
    'auth/user-not-found': "Bunday email topilmadi. Iltimos, roʻyxatdan oʻting.",
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

const RESET_TEXTS: Record<Language, {
  forgotPasswordLink: string;
  resetTitle: string;
  resetSubtitle: string;
  sendResetBtn: string;
  backToLogin: string;
  resetSuccess: string;
  resetSuccessDesc: string;
}> = {
  uz: {
    forgotPasswordLink: "Parolni unutdingizmi?",
    resetTitle: "Parolni qayta tiklash",
    resetSubtitle: "Elektron pochtangizni kiriting va biz yangi parol oʻrnatish havolasini yuboramiz.",
    sendResetBtn: "Tiklash havolasini yuborish",
    backToLogin: "Kirish sahifasiga qaytish",
    resetSuccess: "Havola yuborildi!",
    resetSuccessDesc: "Parolni tiklash havolasi pochtangizga yuborildi. Iltimos, pochtangizni (va Spam papkasini) tekshiring.",
  },
  ru: {
    forgotPasswordLink: "Забыли пароль?",
    resetTitle: "Сброс пароля",
    resetSubtitle: "Введите ваш email, и мы отправим ссылку для создания нового пароля.",
    sendResetBtn: "Отправить ссылку",
    backToLogin: "Вернуться ко входу",
    resetSuccess: "Ссылка отправлена!",
    resetSuccessDesc: "Ссылка для сброса пароля отправлена на ваш email. Проверьте входящие и папку Спам.",
  },
  en: {
    forgotPasswordLink: "Forgot password?",
    resetTitle: "Reset Password",
    resetSubtitle: "Enter your email address and we'll send you a link to reset your password.",
    sendResetBtn: "Send Reset Link",
    backToLogin: "Back to login",
    resetSuccess: "Link Sent!",
    resetSuccessDesc: "Password reset link has been sent to your email. Please check your inbox and spam folder.",
  },
};

// Helper for persistent client-side user accounts store
interface StoredUser {
  uid: string;
  name: string;
  email: string;
  password?: string;
  createdAt: number;
}

function getStoredUsers(): Record<string, StoredUser> {
  try {
    const raw = localStorage.getItem('freelance_uz_users_db');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  return {};
}

function saveStoredUser(user: StoredUser) {
  try {
    const users = getStoredUsers();
    users[user.email.toLowerCase()] = user;
    localStorage.setItem('freelance_uz_users_db', JSON.stringify(users));
  } catch (e) {
    console.warn(e);
  }
}

export default function AuthModal({ isOpen, onClose, mode: initialMode, currentLang, onSuccess }: AuthModalProps) {
  const strings: LanguageStrings = TRANSLATIONS[currentLang];
  const resetText = RESET_TEXTS[currentLang];

  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      setIsForgotMode(false);
      setErrorMsg(null);
      setResetSent(false);
    }
  }, [isOpen, initialMode]);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setErrorMsg(null);
    setIsForgotMode(false);
    setResetSent(false);
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const localizeError = (err: unknown): string => {
    console.error('Firebase Auth Error:', err);
    const authErr = err as AuthError;
    const code = authErr?.code || 'default';
    const table = AUTH_ERRORS[currentLang] || AUTH_ERRORS.uz;

    if (table[code]) {
      return table[code];
    }
    if (code === 'auth/network-request-failed') {
      return currentLang === 'uz'
        ? "Internet bilan aloqa uzildi. Tarmoqni tekshiring."
        : "Network connection failed. Check your connection.";
    }
    return authErr?.message || table.default;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setErrorMsg(null);
    setSubmitting(true);
    try {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
      } catch (authErr) {
        console.warn('Firebase reset email note:', authErr);
      }
      setResetSent(true);
    } catch (err) {
      setErrorMsg(localizeError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanEmail || !password || (activeMode === 'register' && !cleanName)) {
      setErrorMsg(currentLang === 'uz' ? "Barcha maydonlarni toʻldiring." : "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg(AUTH_ERRORS[currentLang]?.['auth/weak-password'] || "Parol kamida 6 ta belgidan iborat boʻlishi kerak.");
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      if (activeMode === 'register') {
        // Check if user is already registered in local storage
        const storedUsers = getStoredUsers();
        if (storedUsers[cleanEmail]) {
          setErrorMsg(
            currentLang === 'uz'
              ? "Bu email allaqachon roʻyxatdan oʻtgan. Iltimos, Kirish boʻlimiga oʻting."
              : "This email is already registered. Please log in."
          );
          setSubmitting(false);
          return;
        }

        let uid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        
        // 1. Try Firebase Auth
        try {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          uid = cred.user.uid;
          try {
            await updateProfile(cred.user, { displayName: cleanName });
          } catch (pErr) {
            console.warn('DisplayName update note:', pErr);
          }
        } catch (fbErr) {
          const code = (fbErr as AuthError)?.code;
          if (code === 'auth/email-already-in-use') {
            setErrorMsg(
              currentLang === 'uz'
                ? "Bu email allaqachon roʻyxatdan oʻtgan. Iltimos, Kirish boʻlimiga oʻting."
                : "This email is already registered. Please log in."
            );
            setSubmitting(false);
            return;
          }
        }

        // Save to Firestore users collection
        try {
          await setDoc(doc(db, 'users', uid), {
            uid,
            name: cleanName,
            email: cleanEmail,
            password,
            role: 'client',
            createdAt: serverTimestamp(),
          });
        } catch (dbErr) {
          console.warn('Firestore doc write note:', dbErr);
        }

        // Save to persistent user store
        saveStoredUser({
          uid,
          name: cleanName,
          email: cleanEmail,
          password,
          createdAt: Date.now(),
        });

        const session = { uid, name: cleanName, email: cleanEmail };
        localStorage.setItem('freelance_uz_session', JSON.stringify(session));

        setSuccess(true);
        setTimeout(() => {
          onSuccess(session);
          setSuccess(false);
          resetFields();
          onClose();
        }, 800);

      } else {
        // STRICT LOGIN MODE - User MUST be registered and password MUST match
        let foundUser: { uid: string; name: string; email: string } | null = null;

        // Check 1: Check in local database
        const storedUsers = getStoredUsers();
        const localUser = storedUsers[cleanEmail];

        if (localUser) {
          if (!localUser.password || localUser.password !== password) {
            setErrorMsg(
              currentLang === 'uz'
                ? "Parol notoʻgʻri kiritildi. Qaytadan tekshirib yozing."
                : "Incorrect password. Please check and try again."
            );
            setSubmitting(false);
            return;
          }
          foundUser = {
            uid: localUser.uid,
            name: localUser.name,
            email: localUser.email,
          };
        }

        // Check 2: Check in Firestore users collection
        if (!foundUser) {
          try {
            const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
            const snap = await getDocs(q);
            if (!snap.empty) {
              const userData = snap.docs[0].data();
              if (!userData.password || userData.password !== password) {
                setErrorMsg(
                  currentLang === 'uz'
                    ? "Parol notoʻgʻri kiritildi. Qaytadan tekshirib yozing."
                    : "Incorrect password. Please check and try again."
                );
                setSubmitting(false);
                return;
              }
              foundUser = {
                uid: userData.uid || snap.docs[0].id,
                name: userData.name || cleanEmail.split('@')[0],
                email: userData.email || cleanEmail,
              };
              // Cache locally with password
              saveStoredUser({
                uid: foundUser.uid,
                name: foundUser.name,
                email: foundUser.email,
                password: userData.password,
                createdAt: Date.now(),
              });
            }
          } catch (fsErr) {
            console.warn('Firestore lookup warning:', fsErr);
          }
        }

        // Check 3: Check in Firebase Auth
        if (!foundUser) {
          try {
            const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
            foundUser = {
              uid: cred.user.uid,
              name: cred.user.displayName || cleanEmail.split('@')[0],
              email: cred.user.email || cleanEmail,
            };
          } catch (fbErr) {
            const code = (fbErr as AuthError)?.code;
            if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
              setErrorMsg(
                currentLang === 'uz'
                  ? "Parol notoʻgʻri kiritildi. Qaytadan tekshirib yozing."
                  : "Incorrect password. Please check and try again."
              );
              setSubmitting(false);
              return;
            }
          }
        }

        // STRICT REJECTION: If account does not exist anywhere, DO NOT log in!
        if (!foundUser) {
          setErrorMsg(
            currentLang === 'uz'
              ? "Bunday hisob topilmadi. Iltimos, avval 'Roʻyxatdan oʻtish' boʻlimidan roʻyxatdan oʻting."
              : "No registered account found with this email. Please register first."
          );
          setSubmitting(false);
          return;
        }

        const session = { uid: foundUser.uid, name: foundUser.name, email: cleanEmail };
        localStorage.setItem('freelance_uz_session', JSON.stringify(session));

        setSuccess(true);
        setTimeout(() => {
          onSuccess(session);
          setSuccess(false);
          resetFields();
          onClose();
        }, 800);
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
          onClick={handleClose}
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
            onClick={handleClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {strings.authSuccess}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                {strings.successMessage}
              </p>
            </motion.div>
          ) : isForgotMode ? (
            /* Forgot Password Form */
            <div className="space-y-4">
              <div className="text-center pb-1">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
                  {resetText.resetTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  {resetText.resetSubtitle}
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {resetSent ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl p-4 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold">{resetText.resetSuccess}</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed font-light">
                    {resetText.resetSuccessDesc}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(false);
                        setResetSent(false);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {resetText.backToLogin}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
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
                        placeholder="namuna@pochta.uz"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                      />
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-indigo-150 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {resetText.sendResetBtn}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(false);
                        setErrorMsg(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {resetText.backToLogin}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tab selector between Kirish and Roʻyxatdan oʻtish */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {strings.login}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeMode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {strings.register}
                </button>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {activeMode === 'register' && (
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
                      placeholder="Masalan: Alisher Qodirov"
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
                    placeholder="namuna@pochta.uz"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {strings.password}
                  </label>
                  {activeMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setErrorMsg(null);
                      }}
                      className="text-3xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {resetText.forgotPasswordLink}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 6 ta belgi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-indigo-150 transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {activeMode === 'login' ? strings.login : strings.register}
              </button>

              <div className="text-[11px] text-center text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Loyiha joylashtirish yoki frilans qilish mutlaqo bepul!
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


