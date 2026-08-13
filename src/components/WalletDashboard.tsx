import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { convertAndFormat, convertAmount } from '../data/mockData';
import { 
  CreditCard, 
  ArrowUpRight, 
  Wallet, 
  Send, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  X,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { getWallet, updateWalletBalance, getWalletTransactions, addWalletTransaction, WalletTransaction } from '../services/db';

interface WalletDashboardProps {
  currentLang: Language;
  onClose?: () => void;
  selectedCurrency: 'UZS' | 'USD' | 'EUR';
}


const WALLET_STRINGS = {
  uz: {
    systemMonitor: "Toʻlov Tizimi & Komissiya Monitori",
    managementTitle: "Moliya va Toʻlovlar Boshqaruvi",
    managementSubtitle: "Freelance.uz Xavfsiz Bitim (Escrow) tizimidan keladigan foyda va sizning shaxsiy kartangiz sozlamalari.",
    connectedActive: "Karta muvaffaqiyatli ulangan",
    connectedActiveDesc: "Barcha bitimlardan yigʻilgan komissiya va saytdan olingan foyda siz koʻrsatgan ushbu {cardType} kartasiga avtomatik yoʻnaltiriladi.",
    myIncomeBalance: "Mening Foydam (Balans)",
    baseString: "Baza: {amount} UZS (Platforma tushumi)",
    volumeEscrow: "Garovdagi joriylar (Escrow)",
    escrowActiveStatus: "🔒 Xavfsiz kelishuv garovi faol",
    withdrawActionTitle: "Solishtirish va Toʻlovni Koʻchirish ({cardType} karta: {lastDigits})",
    withdrawSuccessAlert: "🎉 Koʻchirish muvaffaqiyatli yakunlandi! Mablagʻ bir soniya ichida {cardType} kartangizga ({cardNo}) yuborildi.",
    withdrawPlaceholderUSD: "Summani kiriting (Masalan: 1,000)",
    withdrawPlaceholderOther: "Summani kiriting (Masalan: 10,000,000)",
    transferringBtn: "O'tkazilmoqda...",
    transferBtn: "Oʻtkazish",
    invalidSumError: "Iltimos, to'g'ri summa ko'rsating.",
    minSumError: "Minimal yechish summasi {amount}.",
    insufficientError: "Hisobingizda mablag' yetarli emas.",
    adminLogsTitle: "Tranzaksiyalar Kelib tushishi (Admin logs)",
    commissionRateLabel: "5% komissiya stavkasi faol",
    escrowSecuredLabel: "Bitim himoyalangan",
    justNow: "Hozirgina",
    todayAt: "Bugun, {time}",
    yesterdayAt: "Kecha, {time}",
    mayDate: "29 May, 11:20",
    mayDate2: "28 May, 09:45"
  },
  ru: {
    systemMonitor: "Монитор платежной системы и комиссий",
    managementTitle: "Управление финансами и платежами",
    managementSubtitle: "Выручка от транзакций Safe Deal (Escrow) на Freelance.uz и настройки вашей личной карты.",
    connectedActive: "Карта успешно привязана",
    connectedActiveDesc: "Комиссионные сборы и доходы от платформы автоматически переводятся на указанную карту {cardType}.",
    myIncomeBalance: "Мой Доход (Баланс)",
    baseString: "База: {amount} UZS (Прибыль платформы)",
    volumeEscrow: "Объем в Сделках (Escrow)",
    escrowActiveStatus: "🔒 Активная защита сделок включена",
    withdrawActionTitle: "Вывод средств и Зачисление ({cardType} карта: {lastDigits})",
    withdrawSuccessAlert: "🎉 Вывод средств успешно завершен! Средства мгновенно зачислены на карту {cardType} ({cardNo}).",
    withdrawPlaceholderUSD: "Введите сумму (например, 1,000)",
    withdrawPlaceholderOther: "Введите сумму (например, 10,000,000)",
    transferringBtn: "Перевод средств...",
    transferBtn: "Вывести",
    invalidSumError: "Пожалуйста, введите корректную сумму.",
    minSumError: "Минимальная сумма к выводу {amount}.",
    insufficientError: "Недостаточно средств на вашем балансе.",
    adminLogsTitle: "Сводка последних транзакций (Admin logs)",
    commissionRateLabel: "Активна комиссия 5%",
    escrowSecuredLabel: "Сделка защищена",
    justNow: "Только что",
    todayAt: "Сегодня, {time}",
    yesterdayAt: "Вчера, {time}",
    mayDate: "29 мая, 11:20",
    mayDate2: "28 мая, 09:45"
  },
  en: {
    systemMonitor: "Payment Gateway & Escrow Fee Monitor",
    managementTitle: "Financial Records & Payout Control",
    managementSubtitle: "Secure platform commission yields generated from Escrow.uz along with direct bank configurations.",
    connectedActive: "Recipient Card Linked Successfully",
    connectedActiveDesc: "All generated fee revenue and system accruals are auto-routed to your connected {cardType} account.",
    myIncomeBalance: "My Revenue (Balance)",
    baseString: "Base Asset: {amount} UZS (Platform Income)",
    volumeEscrow: "Locked in Escrow",
    escrowActiveStatus: "🔒 Escrow protection active",
    withdrawActionTitle: "Withdrawal & Payout Settlement ({cardType} card: {lastDigits})",
    withdrawSuccessAlert: "🎉 Payout successfully settled! Funds were transferred instantly to your connected {cardType} ({cardNo}).",
    withdrawPlaceholderUSD: "Enter sum (e.g. 1,000)",
    withdrawPlaceholderOther: "Enter sum (e.g. 10,000,000)",
    transferringBtn: "Processing Payout...",
    transferBtn: "Withdraw",
    invalidSumError: "Please input a valid numeric amount.",
    minSumError: "The minimum withdrawal sum is {amount}.",
    insufficientError: "Insufficient funds in your platform balance.",
    adminLogsTitle: "Transaction History (Admin local logs)",
    commissionRateLabel: "5% platform fee active",
    escrowSecuredLabel: "Escrow secured",
    justNow: "Just now",
    todayAt: "Today, {time}",
    yesterdayAt: "Yesterday, {time}",
    mayDate: "29 May, 11:20",
    mayDate2: "28 May, 09:45"
  }
};

export default function WalletDashboard({ currentLang, onClose, selectedCurrency }: WalletDashboardProps) {
  const localStrings = WALLET_STRINGS[currentLang] || WALLET_STRINGS.uz;
  
  const isUSDActive = selectedCurrency === 'USD';
  const cardNo = isUSDActive ? "4176 5500 0651 4149" : "9860 3566 3919 1846";
  const cardHolder = "SARDORBEK RAMANOV";
  const cardType = isUSDActive ? 'Visa' : 'Humo';

  const [balanceUZS, setBalanceUZS] = useState(48250000); 
  const [totalEscrowActiveSum, setTotalEscrowActiveSum] = useState(135000000); 
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Sync wallet data and logs with Firestore database
  useEffect(() => {
    async function loadWalletData() {
      const mockUserId = 'sardorbek_ramanov'; // Simulated user ID for demo wallet
      try {
        const wallet = await getWallet(mockUserId);
        setBalanceUZS(wallet.balanceUZS);
        setTotalEscrowActiveSum(wallet.totalEscrowActiveSum);
      } catch (err) {
        console.error("Failed to load wallet balance from database:", err);
      }

      try {
        const txList = await getWalletTransactions(mockUserId);
        setTransactions(txList);
      } catch (err) {
        console.error("Failed to load transactional logs from database:", err);
      }
    }
    loadWalletData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage(localStrings.invalidSumError);
      return;
    }

    const amountInUZS = convertAmount(amountNum, selectedCurrency, 'UZS');

    if (amountInUZS < 50000) {
      setErrorMessage(localStrings.minSumError.replace('{amount}', convertAndFormat(50000, 'UZS', selectedCurrency)));
      return;
    }

    if (amountInUZS > balanceUZS) {
      setErrorMessage(localStrings.insufficientError);
      return;
    }

    setErrorMessage('');
    setIsWithdrawing(true);

    const mockUserId = 'sardorbek_ramanov';
    const newBalance = balanceUZS - amountInUZS;

    try {
      // Save updated total balance to Cloud Firestore database
      await updateWalletBalance(mockUserId, newBalance, totalEscrowActiveSum);

      const newTx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        userId: mockUserId,
        type: 'withdrawal',
        amount: amountInUZS,
        currency: 'UZS',
        desc: currentLang === 'uz' 
          ? `${cardType} qartasiga pul o'tkazildi (${cardNo.slice(-4)})` 
          : currentLang === 'ru' 
            ? `Вывод на карту ${cardType} (${cardNo.slice(-4)})` 
            : `Withdrawn to ${cardType} card (${cardNo.slice(-4)})`,
        date: localStrings.justNow,
        status: 'completed'
      };

      // Add log to Subcollection
      await addWalletTransaction(mockUserId, newTx);

      // Instantly update states
      setBalanceUZS(newBalance);
      setTransactions([newTx, ...transactions]);
      setWithdrawSuccess(true);
      setWithdrawAmount('');

      setTimeout(() => {
        setWithdrawSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Failed to process transaction in backend database:", err);
      setErrorMessage("Tranzaksiyani saqlashda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div id="wallet-dashboard-section" className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm max-w-5xl mx-auto my-6 relative overflow-hidden">
      
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{localStrings.systemMonitor}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {localStrings.managementTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            {localStrings.managementSubtitle}
          </p>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0 self-end sm:self-center"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Humo Card Visual & Balance */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Card Showcase */}
          <div className={`relative bg-gradient-to-br ${
            isUSDActive 
              ? 'from-emerald-950 via-slate-900 to-emerald-900 border-emerald-500/20' 
              : 'from-indigo-750 via-slate-900 to-indigo-900 border-indigo-500/10'
            } text-white rounded-2xl p-6 shadow-xl overflow-hidden aspect-[1.58/1] flex flex-col justify-between hover:shadow-2xl transition-all border`}
          >
            <div className={`absolute -right-16 -top-16 w-44 h-44 rounded-full blur-2xl pointer-events-none ${
              isUSDActive ? 'bg-emerald-500/20' : 'bg-indigo-600/20'
            }`}></div>
            <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none"></div>

            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-indigo-200/90 font-bold block">
                  {isUSDActive ? 'PLATFORM ADMIN USD WALLET' : 'PLATFORM ADMIN CARD'}
                </span>
                <span className="font-bold text-lg tracking-tight font-display">
                  {isUSDActive ? 'Visa' : 'Humo'} <span className="text-emerald-400 font-black">Xavfsiz</span>
                </span>
              </div>
              <div className="w-10 h-7 bg-white/10 rounded border border-white/20 backdrop-blur-sm flex items-center justify-center font-mono text-[9px] font-bold text-indigo-100">
                {isUSDActive ? 'US' : 'UZ'}
              </div>
            </div>

            {/* Simulated Chip */}
            <div className="w-9 h-7 bg-amber-400/80 rounded mt-2.5 shadow-inner border border-amber-500/20"></div>

            <div className="my-3 z-10">
              <span className="text-lg md:text-xl font-mono tracking-widest font-bold block drop-shadow-md text-slate-50">
                {cardNo}
              </span>
            </div>

            <div className="flex justify-between items-end z-10">
              <div>
                <span className="text-[8px] font-mono text-indigo-200/70 block">MUDDAT</span>
                <span className="font-mono text-xs font-semibold">12/29</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-mono text-indigo-300/70 block">KARTA EGASI</span>
                <span className="font-display font-medium text-[11px] tracking-wide block">{cardHolder}</span>
              </div>
            </div>
          </div>

          {/* Connected state label */}
          <div className="bg-indigo-50/70 dark:bg-slate-800/45 border border-indigo-100/60 dark:border-indigo-900/40 rounded-2xl p-4 flex gap-3.5 items-start">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-400 block font-sans">{localStrings.connectedActive}</span>
              <p className="text-[11px] text-indigo-950/70 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                {localStrings.connectedActiveDesc.replace('{cardType}', cardType)}
              </p>
            </div>
          </div>

        </div>

        {/* Center: Live Balance Dashboard, Stats Tracker and Withdrawal Interface */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Balance Panel */}
            <div className="bg-[#FAF9F5] dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-400 mb-1">
                <Wallet className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{localStrings.myIncomeBalance}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mt-1">
                {convertAndFormat(balanceUZS, 'UZS', selectedCurrency)}
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-600/80 block mt-1">
                {localStrings.baseString.replace('{amount}', balanceUZS.toLocaleString())}
              </span>
            </div>

            {/* Active Deals / volume in Escrow */}
            <div className="bg-[#FAF9F5] dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-1.5 text-slate-455 dark:text-slate-400 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{localStrings.volumeEscrow}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mt-1">
                {convertAndFormat(totalEscrowActiveSum, 'UZS', selectedCurrency)}
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600/85 block mt-1">
                {localStrings.escrowActiveStatus}
              </span>
            </div>
            
          </div>

          {/* Interactive Fast settlement tool withdrawal */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-indigo-600" />
              {localStrings.withdrawActionTitle.replace('{cardType}', cardType).replace('{lastDigits}', cardNo.slice(-4))}
            </h3>

            {withdrawSuccess ? (
              <div 
                className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 text-xs rounded-xl p-4 font-semibold text-center mt-1"
              >
                {localStrings.withdrawSuccessAlert.replace('{cardNo}', cardNo).replace('{cardType}', cardType)}
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="relative flex-1">
                    <input 
                      type="number"
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={isUSDActive ? localStrings.withdrawPlaceholderUSD : localStrings.withdrawPlaceholderOther}
                      disabled={isWithdrawing}
                      className="w-full text-xs font-semibold pl-5 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                    <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-slate-400">{selectedCurrency}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isWithdrawing}
                    className="bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all hover:bg-slate-800 dark:hover:bg-indigo-700 tracking-wide shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    {isWithdrawing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{localStrings.transferringBtn}</span>
                      </>
                    ) : (
                      <span>{localStrings.transferBtn}</span>
                    )}
                  </button>
                </div>

                {errorMessage && (
                  <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMessage}
                  </p>
                )}

                {/* Predefined fast amounts */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(selectedCurrency === 'UZS' 
                    ? [500000, 2000000, 5000000, 10000000] 
                    : selectedCurrency === 'USD' 
                      ? [50, 100, 500, 1000] 
                      : [55, 110, 550, 1100]
                  ).map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(amt.toString())}
                      className="text-[10px] font-mono font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 border border-slate-100/80 dark:border-slate-750 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                    >
                      +{selectedCurrency === 'UZS' ? `${amt.toLocaleString()} so'm` : selectedCurrency === 'EUR' ? `€${amt}` : `$${amt}`}
                    </button>
                  ))}
                </div>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Transaction Logs Frame */}
      <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            {localStrings.adminLogsTitle}
          </h3>
          <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded uppercase font-mono">
            {localStrings.commissionRateLabel}
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {transactions.map(tx => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between text-xs p-3.5 rounded-xl border border-slate-105 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                  tx.type === 'commission' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800'
                }`}>
                  {tx.type === 'commission' ? <Percent className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-850 dark:text-slate-205">{tx.desc}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tx.date}</div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-black tracking-tight ${
                  tx.type === 'commission' ? 'text-indigo-600' : 'text-amber-600'
                }`}>
                  {tx.type === 'commission' ? '+' : '-'}{convertAndFormat(tx.amount, 'UZS', selectedCurrency)}
                </div>
                <div className="text-[9px] text-emerald-600 font-mono font-bold mt-0.5 flex items-center gap-0.5 justify-end">
                  <Check className="w-2.5 h-2.5" /> {localStrings.escrowSecuredLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
