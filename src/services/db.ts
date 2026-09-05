import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { Job, Freelancer } from '../types';
import { MOCK_JOBS, MOCK_FREELANCERS } from '../data/mockData';

const DEMO_WALLET_BALANCE_UZS = 48_250_000;
const DEMO_ESCROW_UZS = 135_000_000;

// --- Jobs Data Management ---
export async function getJobs(): Promise<Job[]> {
  const path = 'jobs';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    if (querySnapshot.empty) return MOCK_JOBS;

    const jobs: Job[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      jobs.push({
        id: data.id || docSnap.id,
        title: data.title || '',
        description: data.description || '',
        category: data.category,
        budget: Number(data.budget || 0),
        currency: data.currency || 'UZS',
        type: data.type || 'fixed',
        duration: data.duration || '',
        skills: Array.isArray(data.skills) ? data.skills : [],
        clientName: data.clientName || 'Unknown client',
        clientRating: Number(data.clientRating || 5),
        location: data.location || 'Uzbekistan',
        datePosted: data.datePosted || 'just_now',
        proposalsCount: Number(data.proposalsCount || 0),
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
    throw new Error('AUTH_REQUIRED: You must be signed in to publish a job.');
  }

  try {
    await setDoc(doc(db, 'jobs', job.id), {
      ...job,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// --- Freelancers Data Management ---
export async function getFreelancers(): Promise<Freelancer[]> {
  const path = 'freelancers';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    if (querySnapshot.empty) return MOCK_FREELANCERS;

    const freelancers: Freelancer[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      freelancers.push({
        id: data.id || docSnap.id,
        name: data.name || 'Unknown freelancer',
        title: data.title || '',
        avatar: data.avatar || '',
        coverImage: data.coverImage,
        rating: Number(data.rating || 5),
        reviewsCount: Number(data.reviewsCount || 0),
        hourlyRate: Number(data.hourlyRate || 0),
        currency: data.currency || 'USD',
        category: data.category,
        skills: Array.isArray(data.skills) ? data.skills : [],
        bio: data.bio || '',
        location: data.location || 'Uzbekistan',
        verified: Boolean(data.verified),
        completedJobs: Number(data.completedJobs || 0),
        portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
        githubUsername: data.githubUsername,
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
    throw new Error('AUTH_REQUIRED: You must be signed in to update a profile.');
  }

  try {
    await setDoc(doc(db, 'freelancers', fl.id), {
      ...fl,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// --- User Wallet & Balance Management ---
export interface WalletData {
  userId: string;
  balanceUZS: number;
  totalEscrowActiveSum: number;
}

export async function getWallet(userId: string): Promise<WalletData> {
  const path = `wallets/${userId}`;
  if (!auth.currentUser) {
    return {
      userId,
      balanceUZS: DEMO_WALLET_BALANCE_UZS,
      totalEscrowActiveSum: DEMO_ESCROW_UZS,
    };
  }

  if (auth.currentUser.uid !== userId) {
    throw new Error('FORBIDDEN: You can only access your own wallet.');
  }

  try {
    const docRef = doc(db, 'wallets', userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Wallet creation is intentionally not performed from the client.
      // Firestore rules make wallet documents server-managed.
      return {
        userId,
        balanceUZS: 0,
        totalEscrowActiveSum: 0,
      };
    }

    const data = docSnap.data();
    return {
      userId,
      balanceUZS: Number(data.balanceUZS || 0),
      totalEscrowActiveSum: Number(data.totalEscrowActiveSum || 0),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
}

// Client-side balance mutation is deliberately blocked. Real withdrawals
// must be processed by a trusted server/Cloud Function after payment checks.
export async function updateWalletBalance(
  userId: string,
  _balanceUZS: number,
  _totalEscrowActiveSum: number,
): Promise<void> {
  const path = `wallets/${userId}`;
  if (!auth.currentUser) {
    throw new Error('AUTH_REQUIRED: Sign in before requesting a withdrawal.');
  }
  if (auth.currentUser.uid !== userId) {
    throw new Error('FORBIDDEN: You can only modify your own wallet.');
  }
  throw new Error('PAYOUT_BACKEND_REQUIRED: Wallet balances are server-managed and cannot be changed from the browser.');
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
    return [];
  }
  if (auth.currentUser.uid !== userId) {
    throw new Error('FORBIDDEN: You can only access your own wallet transactions.');
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'wallets', userId, 'transactions'));
    const txns: WalletTransaction[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      txns.push({
        id: data.id || docSnap.id,
        userId: data.userId || userId,
        type: data.type || 'unknown',
        amount: Number(data.amount || 0),
        currency: data.currency || 'UZS',
        desc: data.desc || '',
        date: data.date || '',
        status: data.status || 'unknown',
      });
    });
    return txns;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
}

// Client-created wallet transaction records are disabled for the same reason
// as balance writes: transaction history must be generated by trusted backend code.
export async function addWalletTransaction(userId: string, _tx: WalletTransaction): Promise<void> {
  const path = `wallets/${userId}/transactions`;
  if (!auth.currentUser) {
    throw new Error('AUTH_REQUIRED: Sign in before creating a transaction.');
  }
  if (auth.currentUser.uid !== userId) {
    throw new Error('FORBIDDEN: You can only modify your own wallet transactions.');
  }
  throw new Error('PAYOUT_BACKEND_REQUIRED: Transaction records are server-managed and cannot be created from the browser.');
}
