'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import PortfolioModal from './PortfolioModal'

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  featured: boolean;
  layoutConfig?: {
    position: number;
    span: string;
    size: string;
    featured: boolean;
    containerClass: string;
  };
  [key: string]: any;
}

interface PortfolioData {
  eyebrow: string;
  title: string;
  description: string;
  projects: PortfolioProject[];
}

interface PortfolioClientProps {
  portfolioData: PortfolioData;
}

export default function PortfolioClient({ portfolioData }: PortfolioClientProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProjectClick = async (project: PortfolioProject) => {
    try {
      // First, try to load additional project data from JSON
      let projectData;
      if (project.filename) {
        // Use the actual filename from the loader
        const filename = project.filename.replace('.json', '');
        projectData = await import(`@/data/portfolio/projects/${filename}.json`);
      } else {
        // Fallback to ID-based import (for compatibility)
        projectData = await import(`@/data/portfolio/projects/${project.id}.json`);
      }
      
      // Merge the JSON data with the gallery images from portfolio loader
      const mergedProject = {
        ...projectData.default,
        images: project.images // Use gallery images from portfolio loader
      };
      
      setSelectedProject(mergedProject)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading project data:', error)
      // Fallback to project data from portfolio loader - it already has gallery images
      setSelectedProject(project)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  // Split projects into top grid (first 4) and bottom row (remaining 4)
  const topGridProjects = portfolioData.projects.slice(0, 4);
  const bottomRowProjects = portfolioData.projects.slice(4, 8);

  const renderProjectCard = (project: PortfolioProject, index: number) => {
    const layoutConfig = project.layoutConfig;
    const isLarge = layoutConfig?.size === 'large';
    const isMedium = layoutConfig?.size === 'medium';
    const isBottom = layoutConfig?.size === 'bottom';

    return (
      <div 
        key={project.id}
        className={layoutConfig?.containerClass || "group cursor-pointer relative overflow-hidden"}
        onClick={() => handleProjectClick(project)}
      >
        <div className="relative h-full">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes={isLarge ? "(min-width: 768px) 50vw, 100vw" : isBottom ? "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          
          {/* View Project Overlay */}
          <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
            <span className={`text-white font-medium uppercase tracking-wider ${
              isLarge ? 'text-lg' : isBottom ? 'text-sm' : 'text-base'
            }`}>
              View Project
            </span>
            <ArrowRight className={`text-white group-hover:translate-x-1 transition-transform ${
              isLarge ? 'w-6 h-6' : 'w-4 h-4'
            }`} strokeWidth={1.2} />
          </div>
          
          {/* Featured Badge - only show for featured projects */}
          {project.featured && (
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1 bg-flame text-white text-sm font-medium uppercase tracking-wider">
                Featured
              </span>
            </div>
          )}
          
          {/* Content */}
          <div className={`absolute bottom-0 left-0 right-0 ${isLarge ? 'p-8' : isBottom ? 'p-4' : 'p-6'}`}>
            <div className={`text-coral font-medium uppercase tracking-[0.1em] mb-2 ${
              isLarge ? 'text-sm' : 'text-xs'
            }`}>
              {project.category}
            </div>
            <h3 className={`font-light text-white mb-3 group-hover:text-coral transition-colors duration-400 ${
              isLarge ? 'text-[2rem]' : isBottom ? 'text-lg' : 'text-[1.5rem]'
            }`}>
              {project.title}
            </h3>
            <p className={`text-white/90 font-light leading-[1.6] mb-4 ${
              isLarge ? 'text-base' : 'text-sm'
            }`}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, isLarge ? 5 : isBottom ? 2 : 2).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`bg-white/20 backdrop-blur-sm text-white font-light ${
                    isLarge ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!portfolioData.projects.length) {
    return (
      <section id="portfolio" className="section-padding bg-white">
        <div className="container-premium">
          <div className="text-center">
            <h2 className="text-section font-light tracking-[-0.03em] text-ink mb-4">
              Portfolio Loading...
            </h2>
            <p className="text-smoke">
              {portfolioData.error ? `Error: ${portfolioData.error}` : 'Loading portfolio projects...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="portfolio" className="section-padding bg-white">
        <div className="container-premium">
          {/* Header */}
          <div className="text-center mb-20">
            <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
              {portfolioData.eyebrow}
            </p>
            <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-ink">
              {portfolioData.title}
            </h2>
            <p className="text-lg font-light text-smoke leading-[1.6] max-w-2xl mx-auto">
              {portfolioData.description}
            </p>
          </div>

          {/* Top Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[800px]">
            {topGridProjects.map((project, index) => renderProjectCard(project, index))}
          </div>

          {/* Bottom Row - Only show if there are more than 4 projects */}
          {bottomRowProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {bottomRowProjects.map((project, index) => renderProjectCard(project, index + 4))}
            </div>
          )}

          {/* Debug info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
              <p>Portfolio Debug: {portfolioData.projects.length} projects loaded</p>
              {portfolioData.totalProjects && (
                <p>Total projects: {portfolioData.totalProjects} | Published: {portfolioData.publishedProjects}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Modal */}
      <PortfolioModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}