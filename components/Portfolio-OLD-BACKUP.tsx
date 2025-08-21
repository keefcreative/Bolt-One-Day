'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import PortfolioModal from './PortfolioModal'
import portfolioData from '@/data/portfolio/index.json'

export default function Portfolio() {
  const { portfolio } = portfolioData
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProjectClick = async (project: any) => {
    try {
      // Dynamically import the project data
      const projectData = await import(`@/data/portfolio/projects/${project.id}.json`)
      setSelectedProject(projectData.default)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading project data:', error)
      // Fallback to basic project data
      setSelectedProject(project)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <>
      <section id="portfolio" className="section-padding bg-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {portfolio.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-ink">
            {portfolio.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-2xl mx-auto">
            {portfolio.description}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[800px]">
          {/* Featured Project - Large */}
          <div 
            className="md:col-span-2 md:row-span-2 group cursor-pointer relative overflow-hidden"
            onClick={() => handleProjectClick(portfolio.projects[0])}
          >
            <div className="relative h-full">
              <Image
                src={portfolio.projects[0].image}
                alt={portfolio.projects[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              
              {/* View Project Overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <span className="text-white text-lg font-medium uppercase tracking-wider">View Project</span>
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" strokeWidth={1.2} />
              </div>
              
              {/* Featured Badge */}
              <div className="absolute top-6 left-6">
                <span className="px-3 py-1 bg-flame text-white text-sm font-medium uppercase tracking-wider">
                  Featured
                </span>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="text-coral text-sm font-medium uppercase tracking-[0.1em] mb-2">
                  {portfolio.projects[0].category}
                </div>
                <h3 className="text-[2rem] font-light text-white mb-3 group-hover:text-coral transition-colors duration-400">
                  {portfolio.projects[0].title}
                </h3>
                <p className="text-white/90 font-light leading-[1.6] mb-4">
                  {portfolio.projects[0].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {portfolio.projects[0].tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project 2 - Medium */}
          <div 
            className="md:col-span-2 group cursor-pointer relative overflow-hidden"
            onClick={() => handleProjectClick(portfolio.projects[1])}
          >
            <div className="relative h-full">
              <Image
                src={portfolio.projects[1].image}
                alt={portfolio.projects[1].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              
              {/* View Project Overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <span className="text-white text-base font-medium uppercase tracking-wider">View Project</span>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" strokeWidth={1.2} />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-coral text-sm font-medium uppercase tracking-[0.1em] mb-2">
                  {portfolio.projects[1].category}
                </div>
                <h3 className="text-[1.5rem] font-light text-white mb-2 group-hover:text-coral transition-colors duration-400">
                  {portfolio.projects[1].title}
                </h3>
                <p className="text-white/90 font-light leading-[1.6] mb-3 text-sm">
                  {portfolio.projects[1].description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {portfolio.projects[1].tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project 3 - Small */}
          <div 
            className="group cursor-pointer relative overflow-hidden"
            onClick={() => handleProjectClick(portfolio.projects[2])}
          >
            <div className="relative h-full">
              <Image
                src={portfolio.projects[2].image}
                alt={portfolio.projects[2].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              
              {/* View Project Overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <span className="text-white text-sm font-medium uppercase tracking-wider">View Project</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" strokeWidth={1.2} />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-coral text-xs font-medium uppercase tracking-[0.1em] mb-1">
                  {portfolio.projects[2].category}
                </div>
                <h3 className="text-lg font-light text-white mb-1 group-hover:text-coral transition-colors duration-400">
                  {portfolio.projects[2].title}
                </h3>
                <p className="text-white/90 font-light leading-[1.4] text-xs">
                  {portfolio.projects[2].description}
                </p>
              </div>
            </div>
          </div>

          {/* Project 4 - Small */}
          <div 
            className="group cursor-pointer relative overflow-hidden"
            onClick={() => handleProjectClick(portfolio.projects[3])}
          >
            <div className="relative h-full">
              <Image
                src={portfolio.projects[3].image}
                alt={portfolio.projects[3].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              
              {/* View Project Overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <span className="text-white text-sm font-medium uppercase tracking-wider">View Project</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" strokeWidth={1.2} />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-coral text-xs font-medium uppercase tracking-[0.1em] mb-1">
                  {portfolio.projects[3].category}
                </div>
                <h3 className="text-lg font-light text-white mb-1 group-hover:text-coral transition-colors duration-400">
                  {portfolio.projects[3].title}
                </h3>
                <p className="text-white/90 font-light leading-[1.4] text-xs">
                  {portfolio.projects[3].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - 4 Equal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Project 5 */}
          <div 
            className="group cursor-pointer relative overflow-hidden h-64"
            onClick={() => handleProjectClick(portfolio.projects[0])}
          >
            <div className="relative h-full">
              <Image
                src="/images/portfolio/artisan-studios-portfolio.jpg"
                alt="Creative Agency Rebrand"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              
              {/* View Project Overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <span className="text-white text-sm font-medium uppercase tracking-wider">View Project</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" strokeWidth={1.2} />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-coral text-xs font-medium uppercase tracking-[0.1em] mb-1">
                  Brand Identity
                </div>
                <h3 className="text-lg font-light text-white mb-1 group-hover:text-coral transition-colors duration-400">
                  Creative Agency
                </h3>
                <p className="text-white/90 font-light leading-[1.4] text-xs">
                  Complete rebrand for creative studio
                </p>
              </div>
            </div>
          </div>

          {/* Project 6 */}
          <div 
            className="group cursor-pointer relative overflow-hidden h-64"
            onClick={() => handleProjectClick(portfolio.projects[1])}
          >
            <div className="relative h-full">
              <Image
                src="/images/portfolio/techflow-rebrand.jpg"
                alt="Tech Startup Website"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              
              {/* View Project Overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <span className="text-white text-sm font-medium uppercase tracking-wider">View Project</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" strokeWidth={1.2} />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-coral text-xs font-medium uppercase tracking-[0.1em] mb-1">
                  Web Design
                </div>
                <h3 className="text-lg font-light text-white mb-1 group-hover:text-coral transition-colors duration-400">
                  Tech Startup
                </h3>
                <p className="text-white/90 font-light leading-[1.4] text-xs">
                  Modern website for SaaS platform
                </p>
              </div>
            </div>
          </div>

          {/* Project 7 */}
          <div 
            className="group cursor-pointer relative overflow-hidden h-64"
            onClick={() => handleProjectClick(portfolio.projects[2])}
          >
            <div className="relative h-full">
              <Image
                src="/images/portfolio/bloom-beauty-ecommerce.jpg"
                alt="Fashion Brand Campaign"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              
              {/* View Project Overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <span className="text-white text-sm font-medium uppercase tracking-wider">View Project</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" strokeWidth={1.2} />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-coral text-xs font-medium uppercase tracking-[0.1em] mb-1">
                  Marketing
                </div>
                <h3 className="text-lg font-light text-white mb-1 group-hover:text-coral transition-colors duration-400">
                  Fashion Brand
                </h3>
                <p className="text-white/90 font-light leading-[1.4] text-xs">
                  Campaign materials and lookbook
                </p>
              </div>
            </div>
          </div>

          {/* Project 8 */}
          <div 
            className="group cursor-pointer relative overflow-hidden h-64"
            onClick={() => handleProjectClick(portfolio.projects[3])}
          >
            <div className="relative h-full">
              <Image
                src="/images/portfolio/innovatetech-campaign.jpg"
                alt="Mobile App Design"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              
              {/* View Project Overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <span className="text-white text-sm font-medium uppercase tracking-wider">View Project</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" strokeWidth={1.2} />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-coral text-xs font-medium uppercase tracking-[0.1em] mb-1">
                  UI/UX Design
                </div>
                <h3 className="text-lg font-light text-white mb-1 group-hover:text-coral transition-colors duration-400">
                  Mobile App
                </h3>
                <p className="text-white/90 font-light leading-[1.4] text-xs">
                  Fitness tracking app interface
                </p>
              </div>
            </div>
          </div>
        </div>
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