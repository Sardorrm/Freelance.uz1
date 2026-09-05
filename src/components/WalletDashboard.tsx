import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { convertAndFormat, convertAmount } from '../data/mockData';
import { ArrowUpRight, Wallet, Send, TrendingUp, Percent, ShieldCheck, Check, RefreshCw, X, AlertCircle } from 'lucide-react';
import { getWallet, getWalletTransactions, WalletTransaction } from '../services/db';
import { auth } from '../firebase';

interface WalletDashboardProps { currentLang: Language; onClose?: () => void; selectedCurrency: 'UZS' | 'USD' | 'EUR'; }

const TEXT = {
  uz: { title:'Moliya va toʻlovlar boshqaruvi', balance:'Mening balansim', escrow:'Escrowdagi summa', withdraw:'Mablagʻ yechish', request:'Yechishni soʻrash', checking:'Tekshirilmoqda...', invalid:'Toʻgʻri summa kiriting.', min:'Minimal summa: {amount}.', insufficient:'Balans yetarli emas.', login:'Hamyonni ko‘rish uchun tizimga kiring.', unavailable:'Payout serveri hali ulanmagan. Balansdan pul yechilmaydi va karta tomon pul yuborilmaydi.', tx:'Tranzaksiyalar' },
  ru: { title:'Финансы и платежи', balance:'Мой баланс', escrow:'Сумма в Escrow', withdraw:'Вывод средств', request:'Запросить вывод', checking:'Проверка...', invalid:'Введите корректную сумму.', min:'Минимальная сумма: {amount}.', insufficient:'Недостаточно средств.', login:'Войдите, чтобы открыть кошелёк.', unavailable:'Payout-сервер ещё не подключён. Баланс не изменяется и деньги на карту не отправляются.', tx:'Транзакции' },
  en: { title:'Finance & payments', balance:'My balance', escrow:'Escrow balance', withdraw:'Withdraw funds', request:'Request payout', checking:'Checking...', invalid:'Enter a valid amount.', min:'Minimum amount: {amount}.', insufficient:'Insufficient balance.', login:'Sign in to open your wallet.', unavailable:'Payout server is not connected yet. No balance is deducted and no card transfer is made.', tx:'Transactions' }
};

export default function WalletDashboard({ currentLang, onClose, selectedCurrency }: WalletDashboardProps) {
  const s = TEXT[currentLang] || TEXT.uz;
  const [balanceUZS,setBalanceUZS]=useState(0), [escrow,setEscrow]=useState(0), [amount,setAmount]=useState(''), [checking,setChecking]=useState(false), [error,setError]=useState('');
  const [transactions,setTransactions]=useState<WalletTransaction[]>([]);

  useEffect(()=>{
    let cancelled=false;
    async function load(){
      const user=auth.currentUser; if(!user) return;
      try { const [w,t]=await Promise.all([getWallet(user.uid),getWalletTransactions(user.uid)]); if(!cancelled){setBalanceUZS(w.balanceUZS);setEscrow(w.totalEscrowActiveSum);setTransactions(t);} }
      catch(e){ if(!cancelled) setError(e instanceof Error?e.message:'Wallet error'); }
    }
    load(); return ()=>{cancelled=true};
  },[]);

  const handleWithdraw=async(e:React.FormEvent)=>{
    e.preventDefault(); setError('');
    const n=Number(amount);
    if(!Number.isFinite(n)||n<=0){setError(s.invalid);return;}
    const uzs=convertAmount(n,selectedCurrency,'UZS');
    if(uzs<50000){setError(s.min.replace('{amount}',convertAndFormat(50000,'UZS',selectedCurrency)));return;}
    if(uzs>balanceUZS){setError(s.insufficient);return;}
    setChecking(true); await new Promise(r=>setTimeout(r,300)); setChecking(false); setError(s.unavailable);
  };

  if(!auth.currentUser) return <div className="max-w-5xl mx-auto my-6 p-8 rounded-3xl bg-white dark:bg-slate-900 border text-center"><Wallet className="w-8 h-8 mx-auto mb-3 text-indigo-500"/><p className="text-sm font-semibold">{s.login}</p>{onClose&&<button onClick={onClose} className="mt-5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">Back</button>}</div>;

  return <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto my-6">
    <div className="flex justify-between items-center border-b pb-6 mb-6"><div><h2 className="text-xl sm:text-2xl font-black dark:text-white">{s.title}</h2><p className="text-xs text-slate-500 mt-1">{auth.currentUser.email}</p></div>{onClose&&<button onClick={onClose}><X className="w-5 h-5 text-slate-400"/></button>}</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-slate-50 dark:bg-slate-950 border rounded-2xl p-5"><div className="flex gap-2 text-slate-500 mb-2"><Wallet className="w-4 h-4"/><span className="text-[10px] font-bold uppercase">{s.balance}</span></div><div className="text-2xl font-black dark:text-white">{convertAndFormat(balanceUZS,'UZS',selectedCurrency)}</div></div>
      <div className="bg-slate-50 dark:bg-slate-950 border rounded-2xl p-5"><div className="flex gap-2 text-slate-500 mb-2"><TrendingUp className="w-4 h-4"/><span className="text-[10px] font-bold uppercase">{s.escrow}</span></div><div className="text-2xl font-black dark:text-white">{convertAndFormat(escrow,'UZS',selectedCurrency)}</div></div>
    </div>
    <div className="mt-6 border rounded-2xl p-5"><h3 className="text-xs font-bold uppercase mb-3 flex gap-2"><Send className="w-4 h-4 text-indigo-600"/>{s.withdraw}</h3><form onSubmit={handleWithdraw} className="flex gap-2"><div className="relative flex-1"><input type="number" min="0" step="any" required value={amount} onChange={e=>setAmount(e.target.value)} disabled={checking} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 dark:text-white"/><span className="absolute right-3 top-3 text-xs text-slate-400">{selectedCurrency}</span></div><button disabled={checking} className="px-5 rounded-xl bg-slate-900 text-white text-xs font-bold">{checking?s.checking:s.request}</button></form>{error&&<p className="mt-3 text-xs text-rose-600 font-bold flex gap-1"><AlertCircle className="w-4 h-4"/>{error}</p>}</div>
    <div className="mt-8 border-t pt-6"><h3 className="text-xs font-bold uppercase mb-4">{s.tx}</h3>{transactions.length===0?<p className="text-xs text-slate-400">—</p>:transactions.map(tx=><div key={tx.id} className="flex justify-between p-3 border rounded-xl mb-2 text-xs"><span>{tx.desc}<small className="block text-slate-400">{tx.date}</small></span><b>{tx.type==='commission'?'+':'-'}{convertAndFormat(tx.amount,'UZS',selectedCurrency)}</b></div>)}</div>
  </div>;
}
