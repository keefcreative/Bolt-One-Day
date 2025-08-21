'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'

interface PortfolioItem {
  title: string
  category: string
  description: string
  image: string
  tags: string[]
  client?: string
  year?: string
  duration?: string
  challenge?: string
  solution?: string
  results?: string[]
  liveUrl?: string
  images?: string[]
}

interface PortfolioModalProps {
  project: PortfolioItem | null
  isOpen: boolean
  onClose: () => void
}

export default function PortfolioModal({ project, isOpen, onClose }: PortfolioModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0)
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
          {/* Left Panel - Project Details */}
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

              {/* Meta Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 pb-8 border-b border-mist">
                <div>
                  <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-2">
                    Client
                  </div>
                  <div className="text-ink font-light">
                    {project.client || project.title}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-2">
                    Year
                  </div>
                  <div className="text-ink font-light">
                    {project.year || '2024'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-smoke uppercase tracking-wider mb-2">
                    Duration
                  </div>
                  <div className="text-ink font-light">
                    {project.duration || '6 weeks'}
                  </div>
                </div>
              </div>

              {/* Services Tags */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-ink mb-4">Services</h3>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-silk text-smoke text-sm font-light border border-mist hover:border-flame hover:text-flame transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenge */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-ink mb-4">Challenge</h3>
                <p className="text-smoke font-light leading-relaxed">
                  {project.challenge || `${project.title} needed a complete brand overhaul to position themselves as a premium provider and attract enterprise clients. Their existing brand felt outdated and didn't communicate the innovation and reliability required in their space.`}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-ink mb-4">Solution</h3>
                <p className="text-smoke font-light leading-relaxed">
                  {project.solution || `We developed a modern, tech-forward brand identity that communicates reliability and innovation. The new brand system includes comprehensive guidelines, a flexible logo system, and templates that scale across all touchpoints.`}
                </p>
              </div>

              {/* Results */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-ink mb-4">Results</h3>
                <ul className="space-y-3">
                  {(project.results || [
                    '40% increase in qualified enterprise leads',
                    '25% higher close rate on sales calls',
                    'Improved brand recognition in target market',
                    'Successfully positioned for Series B funding'
                  ]).map((result, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-flame mt-3 flex-shrink-0" />
                      <span className="text-smoke font-light leading-relaxed">
                        {result}
                      </span>
                    </li>
                  ))}
                </ul>
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