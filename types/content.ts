/**
 * Content Type Definitions
 * 
 * Comprehensive TypeScript types for all content structures
 * used across the Bolt-One-Day website and content-improver system.
 * 
 * These types ensure type safety and better IDE support when working
 * with content data from JSON files.
 */

// Base Content Types
export interface BaseContent {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface ButtonContent {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
}

export interface ImageContent {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
}

// Hero Section Types
export interface HeroStats {
  number: string;
  label: string;
}

export interface HeroContent extends BaseContent {
  primaryButton: ButtonContent;
  secondaryButton: ButtonContent;
}

export interface HeroData {
  hero: HeroContent;
  stats: {
    items: HeroStats[];
  };
}

// Services Section Types
export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServicesData {
  services: BaseContent & {
    items: ServiceItem[];
  };
}

// Pricing Section Types
export interface PricingFeature {
  text?: string;
  included?: boolean;
  note?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  stripePriceId: string;
  features: (string | PricingFeature)[];
  popular: boolean;
  badge?: string;
  note?: string;
}

export interface PricingData {
  pricing: BaseContent & {
    plans: PricingPlan[];
  };
}

// Team Section Types
export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
    behance?: string;
  };
}

export interface TeamData {
  team: BaseContent & {
    members: TeamMember[];
  };
}

// Testimonials Types
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  rating?: number;
}

export interface TestimonialsData {
  testimonials: BaseContent & {
    items: Testimonial[];
  };
}

// Portfolio Types
export interface PortfolioProject {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  tags: string[];
  image: ImageContent;
  gallery?: ImageContent[];
  client?: string;
  year?: string;
  url?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  metadata: {
    created: string;
    updated: string;
    author?: string;
  };
}

export interface PortfolioData {
  portfolio: BaseContent & {
    categories: string[];
    projects: PortfolioProject[];
  };
}

// FAQ Types
export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface FAQData {
  faq: BaseContent & {
    items: FAQItem[];
    categories?: string[];
  };
}

// Contact Types
export interface ContactMethod {
  type: 'email' | 'phone' | 'address' | 'social';
  label: string;
  value: string;
  icon?: string;
  primary?: boolean;
}

export interface ContactData {
  contact: BaseContent & {
    methods: ContactMethod[];
    form?: {
      enabled: boolean;
      endpoint: string;
      fields: string[];
    };
  };
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavigationItem[];
  icon?: string;
}

export interface NavigationData {
  navigation: {
    logo: {
      text: string;
      href: string;
    };
    menu: NavigationItem[];
    cta?: ButtonContent;
  };
}

// Design for Good Types (Non-profit section)
export interface DesignForGoodHero extends BaseContent {
  badge?: string;
  primaryButton: ButtonContent;
  secondaryButton?: ButtonContent;
  image?: ImageContent;
}

export interface ProblemItem {
  icon: string;
  title: string;
  description: string;
  statistic?: string;
}

export interface AdvantageItem {
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  duration?: string;
}

export interface DesignForGoodData {
  hero: DesignForGoodHero;
  mission: BaseContent;
  problems: {
    title: string;
    items: ProblemItem[];
  };
  advantage: BaseContent & {
    items: AdvantageItem[];
  };
  process: BaseContent & {
    steps: ProcessStep[];
  };
  pricing: BaseContent & {
    plans: PricingPlan[];
  };
  founder: {
    name: string;
    role: string;
    image: string;
    quote: string;
    bio: string;
  };
  faq: {
    items: FAQItem[];
  };
  finalCta: BaseContent & {
    button: ButtonContent;
  };
  comparison: {
    title: string;
    subtitle?: string;
    items: {
      feature: string;
      designForGood: string | boolean;
      traditional: string | boolean;
    }[];
  };
}

// Content Improvement System Types
export interface ContentAnalysisResult {
  file: string;
  section: string;
  status: 'pending' | 'analyzed' | 'improved' | 'reviewed' | 'applied';
  quality: {
    score: number;
    breakdown: {
      grammar: number;
      clarity: number;
      tone: number;
      seo: number;
      brandVoice: number;
    };
  };
  issues: ContentIssue[];
  improvements: ContentImprovement[];
  lastAnalyzed: string;
}

export interface ContentIssue {
  id: string;
  type: 'grammar' | 'tone' | 'clarity' | 'seo' | 'structure' | 'brand-voice' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion?: string;
  location: {
    field: string;
    line?: number;
    character?: number;
  };
  autoFixable: boolean;
}

export interface ContentImprovement {
  id: string;
  type: 'text-replacement' | 'structure-change' | 'addition' | 'removal' | 'rewrite';
  field: string;
  original: string;
  improved: string;
  reason: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  metadata: {
    model: string;
    timestamp: string;
    reviewer?: string;
    reviewNote?: string;
  };
}

export interface ContentWorkflowStatus {
  currentStage: 'idle' | 'analyzing' | 'improving' | 'reviewing' | 'implementing';
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  files: {
    pending: number;
    analyzed: number;
    improved: number;
    reviewed: number;
    applied: number;
  };
  quality: {
    averageScore: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  errors: string[];
  lastRun: string | null;
  nextRecommendedAction: string;
  estimatedCompletion?: string;
}

// Logo Carousel Types
export interface LogoItem {
  name: string;
  logo: string;
  url?: string;
  alt?: string;
}

export interface LogoCarouselData {
  logoCarousel: {
    title?: string;
    description?: string;
    logos: LogoItem[];
  };
}

// Legal Content Types
export interface LegalSection {
  title: string;
  content: string;
  subsections?: LegalSection[];
}

export interface LegalData {
  title: string;
  lastUpdated: string;
  effectiveDate: string;
  sections: LegalSection[];
}

// Utility Types for Content Operations
export type ContentFile = 
  | { type: 'hero'; data: HeroData }
  | { type: 'services'; data: ServicesData }
  | { type: 'pricing'; data: PricingData }
  | { type: 'team'; data: TeamData }
  | { type: 'testimonials'; data: TestimonialsData }
  | { type: 'portfolio'; data: PortfolioData }
  | { type: 'faq'; data: FAQData }
  | { type: 'contact'; data: ContactData }
  | { type: 'navigation'; data: NavigationData }
  | { type: 'design-for-good'; data: DesignForGoodData }
  | { type: 'legal'; data: LegalData }
  | { type: 'logo-carousel'; data: LogoCarouselData };

export type ContentSection = 
  | 'hero'
  | 'services' 
  | 'pricing'
  | 'team'
  | 'testimonials'
  | 'portfolio'
  | 'faq'
  | 'contact'
  | 'navigation'
  | 'design-for-good'
  | 'legal'
  | 'logo-carousel';

// Content Validation Types
export interface ContentValidationRule {
  field: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (content: any) => boolean;
}

export interface ContentValidationResult {
  valid: boolean;
  errors: ContentIssue[];
  warnings: ContentIssue[];
  score: number;
}

// Brand Voice and Tone Types
export interface BrandVoiceProfile {
  tone: {
    professional: number; // 0-10
    friendly: number;
    confident: number;
    approachable: number;
    innovative: number;
  };
  vocabulary: {
    technical: number; // 0-10
    casual: number;
    industry: string[];
    avoid: string[];
    preferred: string[];
  };
  structure: {
    sentenceLength: 'short' | 'medium' | 'long' | 'varied';
    paragraphLength: 'short' | 'medium' | 'long';
    useEmojis: boolean;
    useBulletPoints: boolean;
  };
  messaging: {
    valueProposition: string[];
    keyMessages: string[];
    callsToAction: string[];
  };
}

// Export all types for easy importing
export type {
  BaseContent,
  ButtonContent,
  ImageContent,
  HeroData,
  ServicesData,
  PricingData,
  TeamData,
  TestimonialsData,
  PortfolioData,
  FAQData,
  ContactData,
  NavigationData,
  DesignForGoodData,
  LogoCarouselData,
  LegalData,
  ContentAnalysisResult,
  ContentIssue,
  ContentImprovement,
  ContentWorkflowStatus,
  ContentValidationResult,
  BrandVoiceProfile
};

// Default export for the main content types
export default {
  BaseContent,
  ButtonContent,
  ImageContent,
  HeroData,
  ServicesData,
  PricingData,
  TeamData,
  TestimonialsData,
  PortfolioData,
  FAQData,
  ContactData,
  NavigationData,
  DesignForGoodData,
  ContentAnalysisResult,
  ContentWorkflowStatus
};