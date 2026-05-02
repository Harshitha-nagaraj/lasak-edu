
export interface Course {
  id: string;
  title: string;
  category: string;
  price: string;
  oldPrice?: string;
  duration: string;
  image: string;
  description: string;
  modules: string[];
  isFree?: boolean;
  show_on_home?: boolean;
  order?: number;
  slug?: string;
  enrollLink?: string;
  phone?: string;
  supportLink?: string;
  tools?: string[];
  companies?: { name: string; logo: string }[];
  fee_label?: string;
  discount_label?: string;
  tagline?: string;
  introduction?: string;
  skills_gained?: string[];
  eligibility?: string[];
  live_projects?: { title: string; description: string }[];
  career_opportunities?: { role: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  features?: string[];
  long_description?: string;
  promo_video?: string;
  shorts_url?: string;
  skills_passport_price?: string;
  interview_passport_price?: string;
  job_passport_price?: string;
  testimonials?: any[];
  syllabus?: any[];
  placement_stats?: any[];
  is_active?: boolean;
  is_upcoming?: boolean;
  is_popular?: boolean;
  is_recommended?: boolean;
  is_free?: boolean;
  is_live?: boolean;
  is_online?: boolean;
  is_offline?: boolean;
  is_hybrid?: boolean;
  start_date?: string;
  end_date?: string;
  schedule?: string;
  language?: string;
  level?: string;
  prerequisites?: string;
  projects?: string;
  instructors?: any[];
  rating?: number;
  reviews_count?: number;
  enrollment_count?: number;
  last_updated?: any;
  meta_description?: string;
  keywords?: string;
  og_image?: string;
  schema_markup?: string;
  seo?: {
    title: string;
    description: string;
    keywords: string;
    alt_text?: string;
  };
}


export interface CourseSummary {
  id: string;
  title: string;
  slug?: string;
  category: string;
  price: string;
  oldPrice?: string;
  duration: string;
  image: string;
  description: string;
  modules?: string[];
  isFree?: boolean;
  order?: number;
}

export interface BlogSummary {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface StudentStory {
  id: string;
  name: string;
  company: string;
  role: string;
  image: string;
  quote: string;
  package?: string;
  rating?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content?: string; // Full HTML content for the blog post
  relatedImages?: string[];
}

export interface CertificateData {
  certId: string;
  studentName: string;
  courseName: string;
  duration: string;
  completionDate: string;
  status: 'Completed' | 'Distinction' | 'Merit' | 'In Progress' | 'Issued';
}
export interface MOU {
  id: string;
  college_name: string;
  description?: string;
  image?: string;
  date?: string;
  order_num?: number;
  created_at?: string;
}
