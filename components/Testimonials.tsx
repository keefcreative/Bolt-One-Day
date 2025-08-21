'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import testimonialsData from '@/data/testimonials.json'

export default function Testimonials() {
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

  const goToSlide = (index) => {
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
    <section id="testimonials" className="section-padding bg-pearl">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {testimonials.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-ink">
            {testimonials.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-2xl mx-auto">
            {testimonials.description}
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg border border-mist hover:border-flame hover:text-flame transition-all duration-200 flex items-center justify-center z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg border border-mist hover:border-flame hover:text-flame transition-all duration-200 flex items-center justify-center z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Testimonial Content */}
          <div className="p-8 md:p-12 relative">
            {/* Background Quote */}
            <div className="absolute top-8 right-8 opacity-5">
              <Quote className="w-24 h-24" strokeWidth={1} />
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
              <blockquote className="text-2xl md:text-3xl font-light text-ink leading-[1.4] mb-8 relative z-10">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-6">
                <Image
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.author}
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-mist"
                />
                <div>
                  <div className="font-medium text-ink text-xl mb-1">
                    {currentTestimonial.author}
                  </div>
                  <div className="text-smoke font-light text-lg mb-1">
                    {currentTestimonial.position}
                  </div>
                  <div className="text-flame font-medium">
                    {currentTestimonial.company}
                  </div>
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-flame w-8' 
                  : 'bg-mist hover:bg-flame/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail Navigation (Optional - for premium feel) */}
        <div className="hidden md:flex justify-center gap-4 mt-8 overflow-x-auto pb-4">
          {testimonials.items.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                currentIndex === index
                  ? 'border-flame bg-whisper'
                  : 'border-mist bg-white hover:border-flame/50'
              }`}
            >
              <Image
                src={testimonial.avatar}
                alt={testimonial.author}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-medium text-ink text-sm">
                  {testimonial.author}
                </div>
                <div className="text-smoke text-xs">
                  {testimonial.company}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </section>
  )
}