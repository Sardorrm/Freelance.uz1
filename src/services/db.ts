import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { Job, Freelancer } from '../types';
import { MOCK_JOBS, MOCK_FREELANCERS } from '../data/mockData';

// --- Jobs Data Management ---
export async function getJobs(): Promise<Job[]> {
  const path = 'jobs';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    if (querySnapshot.empty) {
      // Seed initial jobs to Firestore so user database is pre-populated
      for (const job of MOCK_JOBS) {
        try {
          await setDoc(doc(db, path, job.id), {
            ...job,
            createdAt: serverTimestamp()
          });
        } catch (seedErr) {
          console.warn("Could not seed initial job (likely unauthenticated in Firebase):", seedErr);
        }
      }
      return MOCK_JOBS;
    }
    const jobs: Job[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      jobs.push({
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        budget: Number(data.budget),
        currency: data.currency,
        type: data.type,
        duration: data.duration,
        skills: data.skills || [],
        clientName: data.clientName,
        clientRating: Number(data.clientRating || 5),
        location: data.location || 'Uzbekistan',
        datePosted: data.datePosted || 'just_now',
        proposalsCount: Number(data.proposalsCount || 0)
      });
    });
    return jobs;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return MOCK_JOBS;
  }
}

export async function postJob(job: Job): Promise<void> {
  const path = `jobs/${job.id}`;
  if (!auth.currentUser) {
    console.log("Saving job locally only (not authenticated in Firebase Auth)");
    return;
  }
  try {
    await setDoc(doc(db, 'jobs', job.id), {
      ...job,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- Freelancers Data Management ---
export async function getFreelancers(): Promise<Freelancer[]> {
  const path = 'freelancers';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    if (querySnapshot.empty) {
      // Seed initial freelancers to Firestore
      for (const fl of MOCK_FREELANCERS) {
        try {
          await setDoc(doc(db, path, fl.id), {
            ...fl,
            createdAt: serverTimestamp()
          });
        } catch (seedErr) {
          console.warn("Could not seed initial freelancer (likely unauthenticated in Firebase):", seedErr);
        }
      }
      return MOCK_FREELANCERS;
    }
    const freelancers: Freelancer[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      freelancers.push({
        id: data.id,
        name: data.name,
        title: data.title,
        avatar: data.avatar,
        coverImage: data.coverImage,
        rating: Number(data.rating || 5),
        reviewsCount: Number(data.reviewsCount || 0),
        hourlyRate: Number(data.hourlyRate || 0),
        currency: data.currency || 'USD',
        category: data.category,
        skills: data.skills || [],
        bio: data.bio || '',
        location: data.location || 'Uzbekistan',
        verified: Boolean(data.verified),
        completedJobs: Number(data.completedJobs || 0),
        portfolio: data.portfolio || [],
        reviews: data.reviews || []
      });
    });
    return freelancers;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return MOCK_FREELANCERS;
  }
}

export async function updateFreelancerProfile(fl: Freelancer): Promise<void> {
  const path = `freelancers/${fl.id}`;
  if (!auth.currentUser) {
    console.log("Updating freelancer profile locally only (not authenticated in Firebase Auth)");
    return;
  }
  try {
    await setDoc(doc(db, 'freelancers', fl.id), {
      ...fl,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- User Wallet & Balance Management ---
interface WalletData {
  userId: string;
  balanceUZS: number;
  totalEscrowActiveSum: number;
}

export async function getWallet(userId: string): Promise<WalletData> {
  const path = `wallets/${userId}`;
  if (!auth.currentUser) {
    // Return mock data directly for unauthenticated demo sessions
    return {
      userId,
      balanceUZS: 48250000,
      totalEscrowActiveSum: 135000000
    };
  }
  try {
    const docRef = doc(db, 'wallets', userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Create default wallet
      const defaultWallet = {
        userId,
        balanceUZS: 48250000,
        totalEscrowActiveSum: 135000000
      };
      try {
        await setDoc(docRef, {
          ...defaultWallet,
          createdAt: serverTimestamp()
        });
      } catch (seedErr) {
        console.warn("Could not seed initial wallet (likely unauthenticated in Firebase):", seedErr);
      }
      return defaultWallet;
    }
    const data = docSnap.data();
    return {
      userId: data.userId,
      balanceUZS: Number(data.balanceUZS),
      totalEscrowActiveSum: Number(data.totalEscrowActiveSum)
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return {
      userId,
      balanceUZS: 48250000,
      totalEscrowActiveSum: 135000000
    };
  }
}

export async function updateWalletBalance(userId: string, balanceUZS: number, totalEscrowActiveSum: number): Promise<void> {
  const path = `wallets/${userId}`;
  if (!auth.currentUser) {
    console.log("Updating wallet balance locally only (not authenticated in Firebase Auth)");
    return;
  }
  try {
    await setDoc(doc(db, 'wallets', userId), {
      userId,
      balanceUZS,
      totalEscrowActiveSum,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  desc: string;
  date: string;
  status: string;
}

export async function getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
  const path = `wallets/${userId}/transactions`;
  if (!auth.currentUser) {
    // Return mock transactions directly for unauthenticated demo sessions
    return [
      { id: 'tx_1', userId, type: 'commission', amount: 1250000, currency: 'UZS', desc: "Safe Deal #419 ('Telegram Bot') platform fee", date: 'Bugun, 15:30', status: 'completed' },
      { id: 'tx_2', userId, type: 'commission', amount: 800000, currency: 'UZS', desc: "Safe Deal #412 ('UX UI Redesign') platform fee", date: 'Kecha, 18:10', status: 'completed' },
      { id: 'tx_3', userId, type: 'withdrawal', amount: 15000000, currency: 'UZS', desc: "O'tkazma: Humo card 1846", date: '29 May, 11:20', status: 'completed' },
      { id: 'tx_4', userId, type: 'commission', amount: 3100000, currency: 'UZS', desc: "Safe Deal #390 ('ERP integration') platform fee", date: '28 May, 09:45', status: 'completed' }
    ];
  }
  try {
    const querySnapshot = await getDocs(collection(db, 'wallets', userId, 'transactions'));
    if (querySnapshot.empty) {
      // Seed default transactions
      const defaultTxns: WalletTransaction[] = [
        { id: 'tx_1', userId, type: 'commission', amount: 1250000, currency: 'UZS', desc: "Safe Deal #419 ('Telegram Bot') platform fee", date: 'Bugun, 15:30', status: 'completed' },
        { id: 'tx_2', userId, type: 'commission', amount: 800000, currency: 'UZS', desc: "Safe Deal #412 ('UX UI Redesign') platform fee", date: 'Kecha, 18:10', status: 'completed' },
        { id: 'tx_3', userId, type: 'withdrawal', amount: 15000000, currency: 'UZS', desc: "O'tkazma: Humo card 1846", date: '29 May, 11:20', status: 'completed' },
        { id: 'tx_4', userId, type: 'commission', amount: 3100000, currency: 'UZS', desc: "Safe Deal #390 ('ERP integration') platform fee", date: '28 May, 09:45', status: 'completed' }
      ];
      for (const tx of defaultTxns) {
        try {
          await setDoc(doc(db, 'wallets', userId, 'transactions', tx.id), {
            ...tx,
            createdAt: serverTimestamp()
          });
        } catch (seedErr) {
          console.warn("Could not seed default transaction (likely unauthenticated in Firebase):", seedErr);
        }
      }
      return defaultTxns;
    }
    const txns: WalletTransaction[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      txns.push({
        id: data.id,
        userId: data.userId,
        type: data.type,
        amount: Number(data.amount),
        currency: data.currency || 'UZS',
        desc: data.desc,
        date: data.date,
        status: data.status
      });
    });
    return txns;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export async function addWalletTransaction(userId: string, tx: WalletTransaction): Promise<void> {
  const path = `wallets/${userId}/transactions/${tx.id}`;
  if (!auth.currentUser) {
    console.log("Adding transaction log locally only (not authenticated in Firebase Auth)");
    return;
  }
  try {
    await setDoc(doc(db, 'wallets', userId, 'transactions', tx.id), {
      ...tx,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
