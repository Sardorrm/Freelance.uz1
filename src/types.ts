export type Language = 'uz' | 'ru' | 'en';

// --- Escrow / Deals ---
export type DealStatus =
  | 'pending_payment'
  | 'in_escrow'
  | 'released'
  | 'refunded'
  | 'disputed';

export interface Deal {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  currency: 'UZS';
  status: DealStatus;
  paymentProvider: 'payme';
  providerTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobType = 'fixed' | 'hourly';
export type JobCategory = 'development' | 'design' | 'marketing' | 'translation' | 'video' | 'other';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  currency: 'UZS' | 'USD' | 'EUR';
  type: JobType;
  duration: string;
  skills: string[];
  clientName: string;
  clientRating: number;
  location: string;
  datePosted: string;
  proposalsCount: number;
  // Firebase ownership metadata. Kept optional for compatibility with old/mock jobs.
  clientId?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  dateAdded?: string;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  text: string;
  date: string;
}

export interface Freelancer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  currency: 'UZS' | 'USD' | 'EUR';
  category: JobCategory;
  skills: string[];
  bio: string;
  location: string;
  verified: boolean;
  completedJobs: number;
  portfolio?: PortfolioItem[];
  reviews?: ReviewItem[];
  coverImage?: string;
  githubUsername?: string;
  // Firebase ownership metadata. Kept optional for old public profiles.
  ownerId?: string;
}

export interface LanguageStrings {
  findJobs: string;
  findFreelancers: string;
  howItWorks: string;
  postJob: string;
  login: string;
  register: string;
  logout: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  popularCategories: string;
  freelancersCount: string;
  jobsCount: string;
  completedCount: string;
  development: string;
  design: string;
  marketing: string;
  translation: string;
  video: string;
  other: string;
  browseJobsTitle: string;
  browseJobsSubtitle: string;
  filterPrice: string;
  filterType: string;
  filterCategory: string;
  allCategories: string;
  fixedPrice: string;
  hourlyRate: string;
  applyNow: string;
  sendProposal: string;
  proposalSuccess: string;
  budgetLabel: string;
  proposals: string;
  daysAgo: string;
  justNow: string;
  browseFreelancersTitle: string;
  browseFreelancersSubtitle: string;
  hireMe: string;
  hourlyHeader: string;
  jobsCompleted: string;
  memberSince: string;
  verifiedBadge: string;
  contactInfo: string;
  successMessage: string;
  closeBtn: string;
  noResults: string;
  postJobTitle: string;
  postJobSubtitle: string;
  jobTitleInput: string;
  jobDescInput: string;
  jobBudgetInput: string;
  submitJobBtn: string;
  jobCreatedSuccess: string;
  fullName: string;
  email: string;
  password: string;
  authSuccess: string;
}
