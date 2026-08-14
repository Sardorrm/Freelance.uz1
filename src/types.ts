export type Language = 'uz' | 'ru' | 'en';

// --- Escrow / Deals ---
// A Deal represents one client paying one freelancer for one job through
// the platform's escrow flow. Client creates it (pending_payment); every
// later status change is written only by a Cloud Function once Payme
// confirms the payment (see /functions).
export type DealStatus =
  | 'pending_payment' // client created it, hasn't paid yet
  | 'in_escrow'        // Payme confirmed payment, funds held by the platform
  | 'released'         // funds released to the freelancer's wallet
  | 'refunded'          // funds returned to the client
  | 'disputed';         // flagged for manual admin review

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
}

export interface LanguageStrings {
  // Navigation elements
  findJobs: string;
  findFreelancers: string;
  howItWorks: string;
  postJob: string;
  login: string;
  register: string;
  logout: string;
  
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  popularCategories: string;
  freelancersCount: string;
  jobsCount: string;
  completedCount: string;
  
  // Category Labels
  development: string;
  design: string;
  marketing: string;
  translation: string;
  video: string;
  other: string;
  
  // Job specific translations
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
  
  // Freelancer specific translations
  browseFreelancersTitle: string;
  browseFreelancersSubtitle: string;
  hireMe: string;
  hourlyHeader: string;
  jobsCompleted: string;
  memberSince: string;
  verifiedBadge: string;
  
  // Interactive items
  contactInfo: string;
  successMessage: string;
  closeBtn: string;
  noResults: string;
  
  // Client forms
  postJobTitle: string;
  postJobSubtitle: string;
  jobTitleInput: string;
  jobDescInput: string;
  jobBudgetInput: string;
  submitJobBtn: string;
  jobCreatedSuccess: string;
  
  // General forms
  fullName: string;
  email: string;
  password: string;
  authSuccess: string;
}
