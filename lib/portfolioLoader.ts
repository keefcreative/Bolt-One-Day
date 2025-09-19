import fs from 'fs';
import path from 'path';
import { PortfolioProject, PortfolioData, PortfolioLayoutConfig } from '@/types/portfolio';
import { validateAndFixProject, truncateText } from '@/lib/portfolio-validation';

// Layout configuration for bento grid positions
export const LAYOUT_CONFIG: PortfolioLayoutConfig[] = [
  { 
    position: 0, 
    span: "md:col-span-2 md:row-span-2", 
    size: "large", 
    featured: true,
    containerClass: "md:col-span-2 md:row-span-2 group cursor-pointer relative overflow-hidden"
  },
  { 
    position: 1, 
    span: "md:col-span-2", 
    size: "medium", 
    featured: false,
    containerClass: "md:col-span-2 group cursor-pointer relative overflow-hidden" 
  },
  { 
    position: 2, 
    span: "", 
    size: "small", 
    featured: false,
    containerClass: "group cursor-pointer relative overflow-hidden" 
  },
  { 
    position: 3, 
    span: "", 
    size: "small", 
    featured: false,
    containerClass: "group cursor-pointer relative overflow-hidden" 
  },
  // Bottom row projects
  { 
    position: 4, 
    span: "h-64", 
    size: "bottom", 
    featured: false,
    containerClass: "group cursor-pointer relative overflow-hidden h-64" 
  },
  { 
    position: 5, 
    span: "h-64", 
    size: "bottom", 
    featured: false,
    containerClass: "group cursor-pointer relative overflow-hidden h-64" 
  },
  { 
    position: 6, 
    span: "h-64", 
    size: "bottom", 
    featured: false,
    containerClass: "group cursor-pointer relative overflow-hidden h-64" 
  },
  { 
    position: 7, 
    span: "h-64", 
    size: "bottom", 
    featured: false,
    containerClass: "group cursor-pointer relative overflow-hidden h-64" 
  }
];

/**
 * Extracts date from filename with date prefix
 * @param {string} filename - e.g., "2024-08-01_techflow-rebrand.json"
 * @returns {Date|null} - parsed date or null if invalid
 */
function extractDateFromFilename(filename) {
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})_/);
  if (dateMatch) {
    const dateStr = dateMatch[1];
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

/**
 * Extracts project slug from filename
 * @param {string} filename - e.g., "2024-08-01_techflow-rebrand.json"
 * @returns {string} - project slug
 */
function extractSlugFromFilename(filename) {
  const slugMatch = filename.match(/^\d{4}-\d{2}-\d{2}_(.+)\.json$/);
  return slugMatch ? slugMatch[1] : filename.replace('.json', '');
}

/**
 * Auto-detects images for a project
 * @param {string} projectId - project slug
 * @returns {object} - { mainImage, galleryImages }
 */
function autoDetectImages(projectId) {
  const imageDir = path.join(process.cwd(), 'public', 'images', 'portfolio');
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  let mainImage = null;
  const galleryImages = [];
  
  // Check for main image with various extensions
  for (const ext of extensions) {
    const imagePath = path.join(imageDir, `${projectId}${ext}`);
    if (fs.existsSync(imagePath)) {
      mainImage = `/images/portfolio/${projectId}${ext}`;
      break;
    }
  }
  
  // Check for gallery folder
  const galleryDir = path.join(imageDir, projectId);
  if (fs.existsSync(galleryDir)) {
    try {
      const files = fs.readdirSync(galleryDir);
      files
        .filter(file => extensions.some(ext => file.toLowerCase().endsWith(ext)))
        .sort() // Sort alphabetically
        .forEach(file => {
          galleryImages.push(`/images/portfolio/${projectId}/${file}`);
        });
    } catch (error) {
      console.warn(`Could not read gallery directory for ${projectId}:`, error.message);
    }
  }
  
  // Ensure we always have at least 4 images for the modal gallery
  let finalImages = [];
  
  if (galleryImages.length >= 4) {
    // Use gallery images if we have 4 or more
    finalImages = galleryImages;
  } else if (galleryImages.length > 0) {
    // Use gallery images and fill with main image
    finalImages = [...galleryImages];
    while (finalImages.length < 4 && mainImage) {
      finalImages.push(mainImage);
    }
  } else if (mainImage) {
    // Use main image repeated 4 times as fallback
    finalImages = [mainImage, mainImage, mainImage, mainImage];
  }
  
  return {
    mainImage: mainImage || '/images/portfolio/placeholder.jpg', // fallback
    images: finalImages
  };
}

/**
 * Loads and processes all portfolio projects
 * @returns {PortfolioData} - processed portfolio data
 */
export function loadPortfolioProjects(): PortfolioData {
  try {
    const projectsDir = path.join(process.cwd(), 'data', 'portfolio', 'projects');
    
    if (!fs.existsSync(projectsDir)) {
      console.warn('Portfolio projects directory not found');
      return { projects: [] };
    }
    
    // Read all JSON files
    const files = fs.readdirSync(projectsDir)
      .filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.warn('No portfolio project files found');
      return { projects: [] };
    }
    
    // Process each project file
    const projects = files.map(filename => {
      try {
        const filePath = path.join(projectsDir, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const project = JSON.parse(fileContent);
        
        // Extract metadata from filename
        const fileDate = extractDateFromFilename(filename);
        const slug = extractSlugFromFilename(filename);
        
        // Auto-detect images
        const { mainImage, images } = autoDetectImages(project.id || slug);
        
        // Enhance project data
        const enhancedProject = {
          ...project,
          id: project.id || slug,
          filename,
          createdDate: project.createdDate || (fileDate ? fileDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          fileDate,
          image: project.image || mainImage,
          images: project.images && project.images.length > 0 ? project.images : images,
          featured: false, // Will be set below
          draft: project.draft || false,
          priority: project.priority || null,
          // Add brief description if missing
          briefDescription: project.briefDescription || truncateText(project.description || '', 120)
        };
        
        // Validate and fix project data
        const validatedProject = validateAndFixProject(enhancedProject);
        return validatedProject;
      } catch (error) {
        console.error(`Error processing project file ${filename}:`, error);
        return null;
      }
    }).filter((project): project is PortfolioProject => project !== null); // Remove null entries with type guard
    
    // Sort projects by date (newest first)
    projects.sort((a, b) => {
      // First by priority (if set)
      if (a.priority !== null && b.priority !== null) {
        return a.priority - b.priority;
      }
      if (a.priority !== null) return -1;
      if (b.priority !== null) return 1;
      
      // Then by date (newest first)
      const dateA = a.fileDate || new Date(a.createdDate);
      const dateB = b.fileDate || new Date(b.createdDate);
      return dateB - dateA;
    });
    
    // Filter out draft projects
    const publishedProjects = projects.filter(project => !project.draft);
    
    // Take first 8 projects
    const displayProjects = publishedProjects.slice(0, 8);
    
    // Mark first project as featured
    if (displayProjects.length > 0) {
      displayProjects[0].featured = true;
    }
    
    // Assign layout configurations
    const projectsWithLayout: PortfolioProject[] = displayProjects.map((project, index) => ({
      ...project,
      layoutConfig: LAYOUT_CONFIG[index] || LAYOUT_CONFIG[LAYOUT_CONFIG.length - 1]
    }));
    
    console.log(`Loaded ${projectsWithLayout.length} portfolio projects`);
    if (projectsWithLayout.length > 0) {
      console.log('First project:', projectsWithLayout[0].id, 'Layout:', projectsWithLayout[0].layoutConfig?.containerClass);
    }
    
    return {
      eyebrow: "Our Work",
      title: "Featured Projects", 
      description: "Explore our latest work and see how we've helped businesses transform their brands and achieve their goals.",
      projects: projectsWithLayout,
      totalProjects: projects.length,
      publishedProjects: publishedProjects.length
    };
    
  } catch (error) {
    console.error('Error loading portfolio projects:', error);
    return {
      eyebrow: "Our Work",
      title: "Featured Projects",
      description: "Explore our latest work and see how we've helped businesses transform their brands and achieve their goals.", 
      projects: [],
      error: error.message
    };
  }
}

/**
 * Gets a specific project by ID
 * @param {string} projectId - project slug
 * @returns {PortfolioProject|null} - project data or null
 */
export function getProjectById(projectId: string): PortfolioProject | null {
  const portfolioData = loadPortfolioProjects();
  return portfolioData.projects.find(project => project.id === projectId) || null;
}

/**
 * Gets projects by category
 * @param {string} category - category name
 * @returns {PortfolioProject[]} - filtered projects
 */
export function getProjectsByCategory(category: string): PortfolioProject[] {
  const portfolioData = loadPortfolioProjects();
  return portfolioData.projects.filter(project => 
    project.category?.toLowerCase() === category.toLowerCase()
  );
}