
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
  skills_passport_price?: string;
  interview_passport_price?: string;
  job_passport_price?: string;
  seo?: {
    title: string;
    description: string;
    keywords: string;
  };
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
