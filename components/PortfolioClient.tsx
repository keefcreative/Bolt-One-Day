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
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
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
      // Error loading project data
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 [&>*:nth-child(1)]:md:col-span-2 [&>*:nth-child(1)]:md:row-span-2 [&>*:nth-child(2)]:md:col-span-2">
            {topGridProjects.map((project, index) => {
              // Apply specific height classes based on position
              const heightClass = index === 0 ? 'md:h-[800px]' : index === 1 ? 'md:h-[388px]' : 'md:h-[388px]';
              return (
                <div 
                  key={project.id}
                  className={`group cursor-pointer relative overflow-hidden h-[300px] ${heightClass}`}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="relative h-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes={index === 0 ? "(min-width: 768px) 50vw, 100vw" : index === 1 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                    
                    {/* View Project Overlay */}
                    <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                      <span className={`text-white font-medium uppercase tracking-wider ${
                        index === 0 ? 'text-lg' : 'text-base'
                      }`}>
                        View Project
                      </span>
                      <ArrowRight className={`text-white group-hover:translate-x-1 transition-transform ${
                        index === 0 ? 'w-6 h-6' : 'w-4 h-4'
                      }`} strokeWidth={1.2} />
                    </div>
                    
                    {/* Featured Badge - only show for first project */}
                    {index === 0 && (
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1 bg-flame text-white text-sm font-medium uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className={`absolute bottom-0 left-0 right-0 ${index === 0 ? 'p-8' : 'p-6'}`}>
                      <div className={`text-coral font-medium uppercase tracking-[0.1em] mb-2 ${
                        index === 0 ? 'text-sm' : 'text-xs'
                      }`}>
                        {project.category}
                      </div>
                      <h3 className={`font-light text-white mb-3 group-hover:text-coral transition-colors duration-400 ${
                        index === 0 ? 'text-[2rem]' : 'text-[1.5rem]'
                      }`}>
                        {project.title}
                      </h3>
                      <p className={`text-white/90 font-light leading-[1.6] mb-4 ${
                        index === 0 ? 'text-base' : 'text-sm'
                      }`}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, index === 0 ? 5 : 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`bg-white/20 backdrop-blur-sm text-white font-light ${
                              index === 0 ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs'
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
            })}
          </div>

          {/* Bottom Row - Only show if there are more than 4 projects */}
          {bottomRowProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {bottomRowProjects.map((project, index) => (
                <div 
                  key={project.id}
                  className="group cursor-pointer relative overflow-hidden h-64"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="relative h-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                    
                    {/* View Project Overlay */}
                    <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                      <span className="text-white font-medium uppercase tracking-wider text-sm">
                        View Project
                      </span>
                      <ArrowRight className="text-white group-hover:translate-x-1 transition-transform w-4 h-4" strokeWidth={1.2} />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-coral font-medium uppercase tracking-[0.1em] mb-2 text-xs">
                        {project.category}
                      </div>
                      <h3 className="font-light text-white mb-3 group-hover:text-coral transition-colors duration-400 text-lg">
                        {project.title}
                      </h3>
                      <p className="text-white/90 font-light leading-[1.6] mb-4 text-sm">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-white/20 backdrop-blur-sm text-white font-light px-2 py-1 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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