export interface PortfolioTestimonial {
  content: string;
  author: string;
  role: string;
  company?: string;
}

export interface PortfolioProject {
  // Core fields (required)
  id: string;
  title: string;
  category: string;
  briefDescription: string;
  description: string;
  createdDate: string;
  featured: boolean;
  draft: boolean;
  priority: number | null;

  // Images
  image: string;
  images: string[];

  // Metadata
  client: string;
  year: string;
  duration: string;
  tags: string[];

  // Optional metadata
  industry?: string;
  location?: string;
  projectType?: string;

  // Content sections
  challenge: string;
  solution: string;
  results: string[];
  services?: string[];

  // Optional extended content
  brandMessage?: string;
  whatWeLearned?: string;
  testimonial?: PortfolioTestimonial;

  // Links
  liveUrl?: string;
  caseStudyUrl?: string;

  // System fields (added by loader)
  filename?: string;
  fileDate?: Date;
  layoutConfig?: PortfolioLayoutConfig;
}

export interface PortfolioLayoutConfig {
  position: number;
  span: string;
  size: 'large' | 'medium' | 'small' | 'bottom';
  featured: boolean;
  containerClass: string;
}

export interface PortfolioData {
  eyebrow: string;
  title: string;
  description: string;
  projects: PortfolioProject[];
  totalProjects?: number;
  publishedProjects?: number;
  error?: string;
}

export const CONTENT_LIMITS = {
  title: {
    max: 50,
    recommended: 35
  },
  briefDescription: {
    min: 80,
    max: 120,
    recommended: 100
  },
  description: {
    min: 150,
    max: 300,
    recommended: 200
  },
  category: {
    max: 25,
    recommended: 20
  },
  challenge: {
    minWords: 100,
    maxWords: 250,
    recommended: 150
  },
  solution: {
    minWords: 100,
    maxWords: 250,
    recommended: 150
  },
  results: {
    minItems: 3,
    maxItems: 7,
    recommendedItems: 5,
    maxCharactersPerItem: 75
  },
  brandMessage: {
    minWords: 50,
    maxWords: 100,
    recommended: 75
  },
  whatWeLearned: {
    minWords: 50,
    maxWords: 100,
    recommended: 75
  },
  tags: {
    minItems: 3,
    maxItems: 10,
    recommendedItems: 6,
    featuredCardMax: 5,
    largeCardMax: 3,
    smallCardMax: 2
  },
  services: {
    minItems: 3,
    maxItems: 8,
    recommendedItems: 5
  }
}

export enum ProjectCategory {
  BRAND_IDENTITY = "Brand Identity",
  WEB_DESIGN = "Web Design",
  MOBILE_APP = "Mobile App",
  ECOMMERCE = "E-commerce",
  MARKETING = "Marketing Campaign",
  PACKAGING = "Packaging",
  DIGITAL_PRODUCT = "Digital Product",
  PRINT_DESIGN = "Print Design",
  BRAND_IMPLEMENTATION = "Brand Identity & Implementation",
  SOCIAL_MEDIA = "Social Media",
  EMAIL_DESIGN = "Email Design"
}

export enum ProjectIndustry {
  TECHNOLOGY = "Technology",
  RETAIL = "Retail",
  HEALTHCARE = "Healthcare",
  FINANCE = "Finance",
  EDUCATION = "Education",
  NONPROFIT = "Non-Profit",
  HOSPITALITY = "Hospitality",
  CONSTRUCTION = "Construction",
  BEAUTY = "Beauty & Wellness",
  FOOD_BEVERAGE = "Food & Beverage",
  ENTERTAINMENT = "Entertainment",
  REAL_ESTATE = "Real Estate",
  SPORTS = "Sports & Fitness",
  AUTOMOTIVE = "Automotive",
  PROFESSIONAL_SERVICES = "Professional Services"
}

export enum ProjectType {
  COMPLETE_BRAND = "Complete Brand System",
  REBRAND = "Rebrand",
  WEBSITE_REDESIGN = "Website Redesign",
  NEW_PRODUCT_LAUNCH = "New Product Launch",
  CAMPAIGN = "Marketing Campaign",
  DIGITAL_TRANSFORMATION = "Digital Transformation",
  VISUAL_IDENTITY = "Visual Identity",
  UX_DESIGN = "UX Design",
  CONTENT_STRATEGY = "Content Strategy",
  PACKAGING_SYSTEM = "Packaging System"
}