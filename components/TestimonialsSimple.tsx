'use client'

import { useState, useEffect } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import testimonialsData from '@/data/testimonials.json'

export default function TestimonialsSimple() {
  const { testimonials } = testimonialsData
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.items.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.items.length, isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.items.length) % testimonials.items.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.items.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentTestimonial = testimonials.items[currentIndex]

  return (
    <section id="testimonials" className="section-padding bg-ink">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {testimonials.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-white text-balance">
            {testimonials.title}
          </h2>
          <p className="text-lg font-light text-pearl/80 leading-[1.6] max-w-2xl mx-auto text-pretty">
            {testimonials.description}
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-flame hover:text-flame text-white transition-all duration-200 flex items-center justify-center z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-flame hover:text-flame text-white transition-all duration-200 flex items-center justify-center z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Testimonial Content */}
          <div className="p-8 md:p-12 relative">
            {/* Background Quote */}
            <div className="absolute top-8 right-8 opacity-5">
              <Quote className="w-24 h-24 text-white" strokeWidth={1} />
            </div>

            {/* Quote Icon */}
            <div className="mb-8">
              <Quote className="w-10 h-10 text-flame" strokeWidth={1.2} />
            </div>

            {/* Testimonial Content */}
            <div
              key={currentIndex}
              className="animate-fade-in"
            >
              <blockquote className="text-2xl md:text-3xl font-light text-white leading-[1.4] mb-8 relative z-10">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author Info - Without Image */}
              <div className="flex flex-col gap-1">
                <div className="font-medium text-white text-xl">
                  {currentTestimonial.author}
                </div>
                <div className="text-pearl/70 font-light text-lg">
                  {currentTestimonial.position}
                </div>
                <div className="text-flame font-medium">
                  {currentTestimonial.company}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-flame w-8'
                  : 'bg-white/30 hover:bg-flame/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}