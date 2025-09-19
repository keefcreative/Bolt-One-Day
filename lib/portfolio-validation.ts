import { z } from 'zod';
import { CONTENT_LIMITS, ProjectCategory, ProjectIndustry, ProjectType } from '@/types/portfolio';

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

const portfolioTestimonialSchema = z.object({
  content: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string().optional()
});

export const portfolioProjectSchema = z.object({
  // Core fields
  id: z.string().min(1),
  title: z.string()
    .min(1)
    .max(CONTENT_LIMITS.title.max, `Title must be ${CONTENT_LIMITS.title.max} characters or less`),
  category: z.string()
    .max(CONTENT_LIMITS.category.max, `Category must be ${CONTENT_LIMITS.category.max} characters or less`),
  briefDescription: z.string()
    .min(CONTENT_LIMITS.briefDescription.min, `Brief description must be at least ${CONTENT_LIMITS.briefDescription.min} characters`)
    .max(CONTENT_LIMITS.briefDescription.max, `Brief description must be ${CONTENT_LIMITS.briefDescription.max} characters or less`),
  description: z.string()
    .min(CONTENT_LIMITS.description.min, `Description must be at least ${CONTENT_LIMITS.description.min} characters`)
    .max(CONTENT_LIMITS.description.max, `Description must be ${CONTENT_LIMITS.description.max} characters or less`),
  createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  priority: z.number().nullable().default(null),

  // Images
  image: z.string().min(1),
  images: z.array(z.string()).default([]),

  // Metadata
  client: z.string().min(1),
  year: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
  duration: z.string().min(1),
  tags: z.array(z.string())
    .min(CONTENT_LIMITS.tags.minItems, `Must have at least ${CONTENT_LIMITS.tags.minItems} tags`)
    .max(CONTENT_LIMITS.tags.maxItems, `Must have no more than ${CONTENT_LIMITS.tags.maxItems} tags`),

  // Optional metadata
  industry: z.string().optional(),
  location: z.string().optional(),
  projectType: z.string().optional(),

  // Content sections
  challenge: z.string().refine(
    (text) => {
      const words = countWords(text);
      return words >= CONTENT_LIMITS.challenge.minWords && words <= CONTENT_LIMITS.challenge.maxWords;
    },
    `Challenge must be between ${CONTENT_LIMITS.challenge.minWords} and ${CONTENT_LIMITS.challenge.maxWords} words`
  ),
  solution: z.string().refine(
    (text) => {
      const words = countWords(text);
      return words >= CONTENT_LIMITS.solution.minWords && words <= CONTENT_LIMITS.solution.maxWords;
    },
    `Solution must be between ${CONTENT_LIMITS.solution.minWords} and ${CONTENT_LIMITS.solution.maxWords} words`
  ),
  results: z.array(z.string().max(CONTENT_LIMITS.results.maxCharactersPerItem))
    .min(CONTENT_LIMITS.results.minItems, `Must have at least ${CONTENT_LIMITS.results.minItems} results`)
    .max(CONTENT_LIMITS.results.maxItems, `Must have no more than ${CONTENT_LIMITS.results.maxItems} results`),
  services: z.array(z.string())
    .min(CONTENT_LIMITS.services.minItems)
    .max(CONTENT_LIMITS.services.maxItems)
    .optional(),

  // Optional extended content
  brandMessage: z.string().refine(
    (text) => {
      const words = countWords(text);
      return words >= CONTENT_LIMITS.brandMessage.minWords && words <= CONTENT_LIMITS.brandMessage.maxWords;
    },
    `Brand message must be between ${CONTENT_LIMITS.brandMessage.minWords} and ${CONTENT_LIMITS.brandMessage.maxWords} words`
  ).optional(),
  whatWeLearned: z.string().refine(
    (text) => {
      const words = countWords(text);
      return words >= CONTENT_LIMITS.whatWeLearned.minWords && words <= CONTENT_LIMITS.whatWeLearned.maxWords;
    },
    `What we learned must be between ${CONTENT_LIMITS.whatWeLearned.minWords} and ${CONTENT_LIMITS.whatWeLearned.maxWords} words`
  ).optional(),
  testimonial: portfolioTestimonialSchema.optional(),

  // Links
  liveUrl: z.string().url().optional().or(z.literal('')),
  caseStudyUrl: z.string().url().optional().or(z.literal('')),

  // System fields
  filename: z.string().optional(),
  fileDate: z.date().optional(),
  layoutConfig: z.any().optional()
});

// Partial schema for existing projects (allows migration)
export const portfolioProjectPartialSchema = portfolioProjectSchema.partial({
  briefDescription: true,
  services: true,
  industry: true,
  location: true,
  projectType: true,
  brandMessage: true,
  whatWeLearned: true,
  testimonial: true,
  caseStudyUrl: true
});

// Helper function to validate and fix project data
export function validateAndFixProject(project: any): any {
  try {
    // Add missing fields with defaults
    const fixedProject = {
      ...project,
      briefDescription: project.briefDescription || truncateText(project.description || '', CONTENT_LIMITS.briefDescription.max),
      services: project.services || project.tags?.slice(0, 5),
      challenge: project.challenge || 'Project challenge details.',
      solution: project.solution || 'Our solution approach.',
      results: project.results || ['Successful project completion'],
      client: project.client || project.title,
      year: project.year || '2024',
      duration: project.duration || '6 weeks'
    };

    // Return the fixed project without strict validation for now
    return fixedProject;
  } catch (error) {
    console.error('Project validation error:', project.id || 'unknown', error);
    // Return the original project as fallback
    return project;
  }
}

// Helper function to truncate text
export function truncateText(text: string, maxLength: number, addEllipsis: boolean = true): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength).trim();

  if (!addEllipsis) return truncated;

  // Try to break at a word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}

// Helper function to limit tags based on card size
export function limitTags(tags: string[], cardSize: 'featured' | 'large' | 'small'): string[] {
  const limits = {
    featured: CONTENT_LIMITS.tags.featuredCardMax,
    large: CONTENT_LIMITS.tags.largeCardMax,
    small: CONTENT_LIMITS.tags.smallCardMax
  };

  return tags.slice(0, limits[cardSize]);
}

// Validation report generator
export function generateValidationReport(projects: any[]): {
  valid: any[],
  invalid: { project: any, errors: string[] }[],
  warnings: { project: any, warnings: string[] }[]
} {
  const valid: any[] = [];
  const invalid: { project: any, errors: string[] }[] = [];
  const warnings: { project: any, warnings: string[] }[] = [];

  projects.forEach(project => {
    try {
      const validated = portfolioProjectSchema.parse(project);
      valid.push(validated);

      // Check for recommendations
      const projectWarnings: string[] = [];

      if (validated.title.length > CONTENT_LIMITS.title.recommended) {
        projectWarnings.push(`Title is longer than recommended (${CONTENT_LIMITS.title.recommended} chars)`);
      }

      if (validated.tags.length !== CONTENT_LIMITS.tags.recommendedItems) {
        projectWarnings.push(`Consider having ${CONTENT_LIMITS.tags.recommendedItems} tags (currently ${validated.tags.length})`);
      }

      if (projectWarnings.length > 0) {
        warnings.push({ project: validated, warnings: projectWarnings });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        invalid.push({ project, errors });
      }
    }
  });

  return { valid, invalid, warnings };
}