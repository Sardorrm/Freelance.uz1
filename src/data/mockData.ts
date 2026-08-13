import { Freelancer, Job } from '../types';

export const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: 'f1',
    name: 'Sardorbek Ramanov',
    title: 'Senior Full-Stack Node.js & React Developer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=260&h=260',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=400',
    rating: 4.97,
    reviewsCount: 78,
    hourlyRate: 30,
    currency: 'USD',
    category: 'development',
    skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'TailwindCSS'],
    bio: 'Professional software developer with over 6 years of international experience. Specialized in launching complex enterprise portals, scalable microservices, and elegant web dashboards. Based in Tashkent.',
    location: 'Tashkent, Uzbekistan',
    verified: true,
    completedJobs: 92,
    portfolio: [
      {
        id: 'port_1_1',
        title: 'Uzbekistan Logistics SaaS Portal',
        description: 'A full logistics management SaaS tracking 15,000+ national cargo shipments with real-time reactive leaflet maps, automated manifest generation, and Uzcard/Humo merchant integrations.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400',
        projectUrl: 'https://logistika.uz'
      },
      {
        id: 'port_1_2',
        title: 'AI Resume Analyzer & ATS Screener',
        description: 'Vite & Tailwind based elegant client portal leveraging LLMs to analyze and automatically rate human candidate resumes against complex job specifications in multiple languages.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
        projectUrl: 'https://hr-ai.uz'
      }
    ],
    reviews: [
      {
        id: 'rev_1_1',
        authorName: 'Jamshid Karimov',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100',
        rating: 5,
        text: 'Sardorbek juda professional darajada ishladi. Bizning logistika portalimizni aytilgan muddatdan oldin topshirdi. Maslahat beraman!',
        date: '2026-05-24'
      },
      {
        id: 'rev_1_2',
        authorName: 'Malika Sobirova',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100',
        rating: 5,
        text: 'Ideal execution! Code is extremely modular and typescript-safe. Communications were smooth and transparent.',
        date: '2026-04-18'
      }
    ]
  },
  {
    id: 'f2',
    name: 'Shahzoda Salimova',
    title: 'Product & UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=260&h=260',
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200&h=400',
    rating: 4.91,
    reviewsCount: 54,
    hourlyRate: 20,
    currency: 'USD',
    category: 'design',
    skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Landing Pages', 'Adobe Illustrator', 'Mobile Design'],
    bio: 'Experienced UI/UX designer on a mission to build beautiful, functional interfaces. Working with corporate leaders and ambitious startups within Central Asia and Europe.',
    location: 'Samarkand, Uzbekistan',
    verified: true,
    completedJobs: 61,
    portfolio: [
      {
        id: 'port_2_1',
        title: 'Uzum Bank Redesign Prototype',
        description: 'Comprehensive mobile banking UI flow containing modern interactive cards, quick transactions drawer, dark-theme presets, and minimalist typography focusing on usability.',
        imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=600&h=400',
        projectUrl: 'https://figma.com/file/uzum-redesign'
      },
      {
        id: 'port_2_2',
        title: 'Luxury Carpet E-Commerce Brand',
        description: 'High-fidelity Web designs showcasing elegant parallax interactions, beautiful spacing, and luxury color palettes for a national carpet exporter.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=400'
      }
    ],
    reviews: [
      {
        id: 'rev_2_1',
        authorName: 'Rustam Nazarov',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100&h=100',
        rating: 5,
        text: 'Ajoyib dizayner! Biz kutgandan ancha chiroyli va qulay bo\'lgan Figma maketlarini tayyorlab berdi. Ish uslubi ma\'qul keldi.',
        date: '2026-05-15'
      }
    ]
  },
  {
    id: 'f3',
    name: 'Alisher Kodirov',
    title: 'Expert SMM & Digital Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=260&h=260',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=400',
    rating: 4.85,
    reviewsCount: 39,
    hourlyRate: 15,
    currency: 'USD',
    category: 'marketing',
    skills: ['SMM', 'Meta Ads', 'SEO', 'Google Analytics', 'Content Writing', 'Copywriting'],
    bio: 'Driving hyper-growth using smart digital marketing strategies. Highly experienced in targeted ads, content planning, and SEO ranking optimizations for e-commerce platforms.',
    location: 'Tashkent, Uzbekistan',
    verified: true,
    completedJobs: 48,
    portfolio: [
      {
        id: 'port_3_1',
        title: 'Tezkor Burglar Franchise Launch',
        description: 'Comprehensive social engine launch which scaled an Uzbek fast food outlet from 0 to 45,000 active followers in exactly 90 days, producing 2.3M cumulative reel loops.',
        imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600&h=400'
      }
    ],
    reviews: [
      {
        id: 'rev_3_1',
        authorName: 'Sardor Shokirov',
        rating: 4,
        text: 'Target reklamani juda aniq va kam xarajat bilan sozladi. Savdolar rostdan ham sezilarli darajada oshdi. Rahmat!',
        date: '2026-05-02'
      }
    ]
  },
  {
    id: 'f4',
    name: 'Dilnoza Karimova',
    title: 'Professional Uzbek-Russian-English Translator & Interpreter',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=260&h=260',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200&h=400',
    rating: 5.0,
    reviewsCount: 110,
    hourlyRate: 12,
    currency: 'USD',
    category: 'translation',
    skills: ['Translation', 'Copywriting', 'Localization', 'Proofreading', 'Uzbek Language', 'Russian Language'],
    bio: 'Professional translator offering top-level localization services. Assisting international enterprises to bridge communication gaps in Uzbekistan market. Certified legal & medical translations.',
    location: 'Bukhara, Uzbekistan',
    verified: true,
    completedJobs: 134,
    portfolio: [
      {
        id: 'port_4_1',
        title: 'Fintech Legal Agreement Localization',
        description: 'Careful translation & legal formatting of a 150-page financial framework agreement from English to Uzbek, preserving regional terminology and regulatory compliance structures.',
        imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600&h=400'
      }
    ],
    reviews: [
      {
        id: 'rev_4_1',
        authorName: 'Elena Petrova',
        rating: 5,
        text: 'Перевод выполнен безупречно! Все юридические термины согласованы. Работать с Дильнозой — одно удовольствие.',
        date: '2026-05-20'
      }
    ]
  },
  {
    id: 'f5',
    name: 'Umid Nematov',
    title: 'Motion Graphics Artist & Video Editor',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=260&h=260',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200&h=400',
    rating: 4.78,
    reviewsCount: 22,
    hourlyRate: 25,
    currency: 'USD',
    category: 'video',
    skills: ['Adobe After Effects', 'Premiere Pro', 'Video Editing', '3D Modeling', 'Blender', 'Color Grading'],
    bio: 'Crafting visually stunning commercial promotional videos and modern YouTube graphics. I keep your audiences hooked utilizing custom pacing, original sound designs, and epic transitions.',
    location: 'Fergana, Uzbekistan',
    verified: false,
    completedJobs: 26,
    portfolio: [
      {
        id: 'port_5_1',
        title: 'Car Show Launch 3D Motion Promo',
        description: 'An action-focused cinematic promo utilizing 3D camera tracking, custom music scores, and premium color grading in Blender and After Effects.',
        imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=600&h=400'
      }
    ],
    reviews: [
      {
        id: 'rev_5_1',
        authorName: 'Lazizbek Madaminov',
        rating: 5,
        text: 'Video montaj a\'lo darajada! Dizayn, effektlar va tanlangan musiqalar bizga juda yoqdi. Kelasi safar yana hamkorlik qilamiz.',
        date: '2026-05-18'
      }
    ]
  },
  {
    id: 'f6',
    name: 'Nodira Yusupova',
    title: 'Lead Mobile App Developer (iOS & Android)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=260&h=260',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=400',
    rating: 4.95,
    reviewsCount: 42,
    hourlyRate: 28,
    currency: 'USD',
    category: 'development',
    skills: ['Flutter', 'Dart', 'Swift', 'Kotlin', 'Firebase', 'State Management'],
    bio: 'Flutter and Native mobile application developer focused on butter-smooth performance and pixel-perfect outputs. Experience uploading over 30 successful builds to App Store & Google Play.',
    location: 'Tashkent, Uzbekistan',
    verified: true,
    completedJobs: 45,
    portfolio: [
      {
        id: 'port_6_1',
        title: 'Tashkent FastFood Delivery App',
        description: 'Complete cross-platform food delivery app integrating interactive Google Live Map, SMS OTP authentication, and Humo pay APIs.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400'
      }
    ],
    reviews: [
      {
        id: 'rev_6_1',
        authorName: 'Bobur Rakhimov',
        rating: 5,
        text: 'Nodiraga katta rahmat. Mobil ilovamizni juda chiroyli va tez ishlaydigan qilib Flutter-da yozib berdi.',
        date: '2026-05-22'
      }
    ]
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'E-Commerce sayti uchun Web-Dasturchi kerak (React & Node.js)',
    description: 'Toshkentdagi kiyim-kechak brendimiz uchun zamonaviy internet doʻkon tayyorlash zarur. Toʻlov tizimlarini (Click, Payme, Uzum bank) integratsiya qilish, qulay qidiruv hamda telegram bot orqali buyurtmalarni boshqarish tizimi boʻlinger. Toʻliq moslashuvchan (Responsive) dizayn va admin paneli kerak.',
    category: 'development',
    budget: 15000000,
    currency: 'UZS',
    type: 'fixed',
    duration: '1 oy',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Payme/Click API', 'Telegram Bot'],
    clientName: 'Elegant Textile MCHJ',
    clientRating: 4.88,
    location: 'Tashkent, Uzbekistan',
    datePosted: '2026-06-01T10:30:00Z',
    proposalsCount: 14
  },
  {
    id: 'j2',
    title: 'Arenda avgost sayti uchun UI/UX Dizayner',
    description: 'Mobil ilovamiz va saytimiz uchun zamonaviy dizayn (Figma-da) yaratishi lozim boʻlgan tajribali UI/UX dizayner qidiryapmiz. Prototip tayyor boʻlishi va barcha xavfsizlik, foydalanish mezonlariga javob berishi zarur. 25 dan ortiq ekranli dizayn.',
    category: 'design',
    budget: 800,
    currency: 'USD',
    type: 'fixed',
    duration: '3 hafta',
    skills: ['Figma', 'Mobile UI/UX', 'Wireframing', 'Prototyping'],
    clientName: 'CarRent LLC',
    clientRating: 4.95,
    location: 'Samarkand, Uzbekistan',
    datePosted: '2026-05-31T15:20:00Z',
    proposalsCount: 9
  },
  {
    id: 'j3',
    title: 'SMM Mutaxassisi: Restoran tarmogʻi uchun ijtimoiy tarmoqlar (Instagram, TikTok)',
    description: 'Yangi milliy va yevropa taomlari restoranimiz sahifalarini boshqarish uchun professional SMM mutaxassisi kerak. Har oyda 12 ta post, 20 ta reels/stories tayyorlash, kopirayting, target reklamalarini sozlash va faollikni oshirish talab etiladi. Videomaker oʻzimizda bor.',
    category: 'marketing',
    budget: 4500000,
    currency: 'UZS',
    type: 'hourly',
    duration: 'Uzoq muddatli',
    skills: ['SMM', 'Copywriting', 'Targeting', 'Instagram Growth', 'TikTok Strategy'],
    clientName: 'Lazzat Garden',
    clientRating: 4.67,
    location: 'Tashkent, Uzbekistan',
    datePosted: '2026-05-30T08:12:00Z',
    proposalsCount: 22
  },
  {
    id: 'j4',
    title: 'Hujjatlarni professional ingliz tilidan oʻzbekchaga oʻgʻirish (Localization)',
    description: 'Xalqaro moliya va audit tashkilotiga tegishli umumiy 45 varaqdan iborat shartnomalar va biznes tavsiyanomalarni rus va ingliz tillaridan ona tilimiz – oʻzbek tiliga aniq, tushunarli va huquqiy atamalarni saqlagan holda oʻgirish kerak.',
    category: 'translation',
    budget: 3000000,
    currency: 'UZS',
    type: 'fixed',
    duration: '1 hafta',
    skills: ['English to Uzbek', 'Legal Translation', 'Proofreading', 'Technical Writing'],
    clientName: 'Apex Capital',
    clientRating: 5.0,
    location: 'Tashkent, Uzbekistan',
    datePosted: '2026-05-29T12:00:00Z',
    proposalsCount: 7
  },
  {
    id: 'j5',
    title: '3D Promo Video va Reklama uchun Motion dizayn',
    description: 'Yangi ochilayotgan IT Akademiyamizning taqdimot videosi uchun qiziqarli 3D motion animatsiya kerak. Davomiyligi 45 soniya. Ssenariy va ovoz dublyaji tayyor, dizaynerdan faqat motion animatsiya va montaj kutiladi.',
    category: 'video',
    budget: 600,
    currency: 'USD',
    type: 'fixed',
    duration: '2 hafta',
    skills: ['3D Motion', 'After Effects', 'Blender', 'Video Montaj'],
    clientName: 'Alfa Academy',
    clientRating: 4.8,
    location: 'Xorazm, Uzbekistan',
    datePosted: '2026-05-28T09:44:00Z',
    proposalsCount: 11
  }
];

export function convertAmount(amount: number, from: 'UZS' | 'USD' | 'EUR', to: 'UZS' | 'USD' | 'EUR'): number {
  if (from === to) return amount;
  
  // Convert original amount to base (UZS)
  let amountInUZS = amount;
  if (from === 'USD') {
    amountInUZS = amount * 12800;
  } else if (from === 'EUR') {
    amountInUZS = amount * 14000;
  }
  
  // Convert from UZS to target
  if (to === 'USD') {
    return amountInUZS / 12800;
  } else if (to === 'EUR') {
    return amountInUZS / 14000;
  }
  return amountInUZS;
}

export function formatBudget(amount: number, currency: 'UZS' | 'USD' | 'EUR'): string {
  if (currency === 'UZS') {
    return Math.round(amount).toLocaleString('uz-UZ') + ' UZS';
  } else if (currency === 'EUR') {
    return '€' + Math.round(amount).toLocaleString('de-DE');
  } else {
    return '$' + Math.round(amount).toLocaleString('en-US');
  }
}

export function convertAndFormat(amount: number, fromCurrency: 'UZS' | 'USD' | 'EUR', targetCurrency: 'UZS' | 'USD' | 'EUR'): string {
  const converted = convertAmount(amount, fromCurrency, targetCurrency);
  return formatBudget(converted, targetCurrency);
}
