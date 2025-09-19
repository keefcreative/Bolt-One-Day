'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ExternalLink, MapPin, Building, Briefcase, Calendar, Clock, ChevronRight } from 'lucide-react'

interface PortfolioTestimonial {
  content: string
  author: string
  role: string
  company?: string
}

interface PortfolioItem {
  title: string
  category: string
  briefDescription?: string
  description: string
  image: string
  tags: string[]
  client?: string
  year?: string
  duration?: string
  industry?: string
  location?: string
  projectType?: string
  challenge?: string
  solution?: string
  results?: string[]
  services?: string[]
  brandMessage?: string
  whatWeLearned?: string
  testimonial?: PortfolioTestimonial
  liveUrl?: string
  caseStudyUrl?: string
  images?: string[]
}

interface PortfolioModalProps {
  project: PortfolioItem | null
  isOpen: boolean
  onClose: () => void
}

type TabType = 'overview' | 'case-study' | 'impact'

export default function PortfolioModal({ project, isOpen, onClose }: PortfolioModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Use project images from JSON data, fallback to local portfolio images
  const projectImages = project?.images || [
    project?.image || '',
    '/images/portfolio/techflow-rebrand.jpg',
    '/images/portfolio/innovatetech-campaign.jpg',
    '/images/portfolio/artisan-studios-portfolio.jpg',
    '/images/portfolio/bloom-beauty-ecommerce.jpg'
  ].filter(Boolean)

  // Auto-cycle images every 4 seconds
  useEffect(() => {
    if (!isOpen || projectImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % projectImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isOpen, projectImages.length])

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0)
      setActiveTab('overview')
    }
  }, [isOpen])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !project) return null

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Determine which tabs to show based on available data
  const showImpactTab = project.testimonial || project.brandMessage || project.whatWeLearned

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-white shadow-premium-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 group"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-ink group-hover:text-flame transition-colors" strokeWidth={1.2} />
        </button>

        <div className="flex h-full">
          {/* Left Panel - Project Details with Tabs */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <div className="p-8 lg:p-12">
              {/* Category Badge */}
              <div className="inline-block px-4 py-2 bg-flame text-white text-sm font-medium uppercase tracking-wider mb-6">
                {project.category}
              </div>

              {/* Title */}
              <h2 id="modal-title" className="text-4xl lg:text-5xl font-light text-ink mb-4 leading-tight">
                {project.title}
              </h2>

              {/* Description */}
              <p className="text-xl font-light text-smoke mb-8 leading-relaxed">
                {project.description}
              </p>

              {/* Tab Navigation */}
              <div className="flex gap-1 mb-8 border-b border-mist">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'text-flame border-b-2 border-flame'
                      : 'text-smoke hover:text-ink'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('case-study')}
                  className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                    activeTab === 'case-study'
                      ? 'text-flame border-b-2 border-flame'
                      : 'text-smoke hover:text-ink'
                  }`}
                >
                  Case Study
                </button>
                {showImpactTab && (
                  <button
                    onClick={() => setActiveTab('impact')}
                    className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                      activeTab === 'impact'
                        ? 'text-flame border-b-2 border-flame'
                        : 'text-smoke hover:text-ink'
                    }`}
                  >
                    Impact
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Meta Information Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      {project.client && (
                        <div className="flex items-start gap-3">
                          <Building className="w-5 h-5 text-flame mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-1">
                              Client
                            </div>
                            <div className="text-ink font-light">
                              {project.client}
                            </div>
                          </div>
                        </div>
                      )}

                      {project.year && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-flame mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-1">
                              Year
                            </div>
                            <div className="text-ink font-light">
                              {project.year}
                            </div>
                          </div>
                        </div>
                      )}

                      {project.duration && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-flame mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-1">
                              Duration
                            </div>
                            <div className="text-ink font-light">
                              {project.duration}
                            </div>
                          </div>
                        </div>
                      )}

                      {project.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-flame mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-1">
                              Location
                            </div>
                            <div className="text-ink font-light">
                              {project.location}
                            </div>
                          </div>
                        </div>
                      )}

                      {project.industry && (
                        <div className="flex items-start gap-3">
                          <Briefcase className="w-5 h-5 text-flame mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-1">
                              Industry
                            </div>
                            <div className="text-ink font-light">
                              {project.industry}
                            </div>
                          </div>
                        </div>
                      )}

                      {project.projectType && (
                        <div className="flex items-start gap-3">
                          <ChevronRight className="w-5 h-5 text-flame mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-1">
                              Project Type
                            </div>
                            <div className="text-ink font-light">
                              {project.projectType}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Services Section */}
                    {project.services && project.services.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-ink mb-4">Services Delivered</h3>
                        <div className="flex flex-wrap gap-3">
                          {project.services.map((service, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-silk text-smoke text-sm font-light border border-mist hover:border-flame hover:text-flame transition-colors duration-300"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags Section */}
                    {project.tags && project.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-ink mb-4">Expertise Areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-mist/20 text-smoke text-xs font-light"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-flame text-white font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:bg-ember hover:shadow-card-hover hover:-translate-y-0.5"
                        >
                          View Live Site
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.caseStudyUrl && (
                        <a
                          href={project.caseStudyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 border border-flame text-flame font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:bg-flame hover:text-white"
                        >
                          Full Case Study
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Case Study Tab */}
                {activeTab === 'case-study' && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Challenge */}
                    <div>
                      <h3 className="text-lg font-medium text-ink mb-4">The Challenge</h3>
                      <p className="text-smoke font-light leading-relaxed">
                        {project.challenge || 'Project challenge details coming soon.'}
                      </p>
                    </div>

                    {/* Solution */}
                    <div>
                      <h3 className="text-lg font-medium text-ink mb-4">Our Solution</h3>
                      <p className="text-smoke font-light leading-relaxed">
                        {project.solution || 'Solution approach details coming soon.'}
                      </p>
                    </div>

                    {/* Results */}
                    <div>
                      <h3 className="text-lg font-medium text-ink mb-4">Key Results</h3>
                      <ul className="space-y-3">
                        {(project.results || ['Results coming soon']).map((result, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-flame mt-2 flex-shrink-0" />
                            <span className="text-smoke font-light leading-relaxed">
                              {result}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What We Learned */}
                    {project.whatWeLearned && (
                      <div className="p-6 bg-silk/50 border-l-4 border-flame">
                        <h3 className="text-lg font-medium text-ink mb-3">What We Learned</h3>
                        <p className="text-smoke font-light leading-relaxed">
                          {project.whatWeLearned}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Impact Tab */}
                {activeTab === 'impact' && showImpactTab && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Brand Message */}
                    {project.brandMessage && (
                      <div className="p-8 bg-gradient-to-r from-flame/5 to-coral/5 border-l-4 border-flame">
                        <h3 className="text-lg font-medium text-ink mb-4">Key Takeaway</h3>
                        <p className="text-smoke font-light leading-relaxed text-lg">
                          {project.brandMessage}
                        </p>
                      </div>
                    )}

                    {/* Testimonial */}
                    {project.testimonial && (
                      <div>
                        <h3 className="text-lg font-medium text-ink mb-6">Client Feedback</h3>
                        <blockquote className="relative">
                          <div className="absolute -top-4 -left-2 text-6xl text-flame/20 font-serif">
                            &ldquo;
                          </div>
                          <p className="text-xl font-light text-smoke leading-relaxed italic pl-8 pr-4">
                            {project.testimonial.content}
                          </p>
                          <footer className="mt-6 pl-8">
                            <div className="font-medium text-ink">
                              {project.testimonial.author}
                            </div>
                            <div className="text-sm text-smoke">
                              {project.testimonial.role}
                              {project.testimonial.company && `, ${project.testimonial.company}`}
                            </div>
                          </footer>
                        </blockquote>
                      </div>
                    )}

                    {/* Additional Impact Metrics if needed */}
                    {project.whatWeLearned && !project.brandMessage && (
                      <div className="p-6 bg-silk/50 border-l-4 border-flame">
                        <h3 className="text-lg font-medium text-ink mb-3">Project Insights</h3>
                        <p className="text-smoke font-light leading-relaxed">
                          {project.whatWeLearned}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Image Gallery */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <div className="h-full relative overflow-hidden">
              {/* Images */}
              {projectImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}

              {/* Navigation Dots */}
              {projectImages.length > 1 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                  {projectImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`w-3 h-3 transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'bg-flame scale-125'
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Image Gallery */}
        <div className="lg:hidden">
          <div className="relative h-64 overflow-hidden">
            {projectImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}

            {/* Mobile Navigation Dots */}
            {projectImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {projectImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-flame scale-125'
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}