'use client'

import { Quote } from 'lucide-react'
import { useScrollReveal } from '@/lib/classOf2025/animations'

interface TestimonialsSectionProps {
  testimonial: {
    quote: string
    author: string
    title: string
    company: string
    challenge: string
    results: Array<{
      metric: string
      label: string
      highlight?: boolean
    }>
  }
}

export default function TestimonialsSection({ testimonial }: TestimonialsSectionProps) {
  const { ref, isVisible } = useScrollReveal(0.2)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 sm:py-24 px-6 sm:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-ink">
            Trusted by Companies Building Market Position
          </h2>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Featured Testimonial - Spans 2 columns */}
          <div
            className={`md:col-span-2 p-8 sm:p-10 bg-pearl border-l-4 border-flame transition-all duration-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Quote size={64} className="text-flame mb-6 opacity-20" />

            <blockquote className="text-lg sm:text-xl font-light leading-relaxed text-ink italic mb-8">
              "{testimonial.quote}"
            </blockquote>

            <div>
              <p className="text-base font-normal text-ink m-0">{testimonial.author}</p>
              <p className="text-sm font-light text-ink/70 m-0">{testimonial.title}</p>
              <p className="text-sm font-light text-ink/70 m-0">{testimonial.company}</p>
            </div>
          </div>

          {/* Results Column */}
          <div
            className={`flex flex-col bg-pearl border-l-4 border-flame p-6 transition-all duration-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            {/* Their Challenge */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-flame font-medium mb-3">
                Their Challenge
              </p>
              <p className="text-sm font-light text-ink/80 leading-relaxed m-0">
                {testimonial.challenge}
              </p>
            </div>

            {/* What Changed */}
            <div>
              <p className="text-xs uppercase tracking-wider text-flame font-medium mb-3">
                What Changed
              </p>
              <ul className="list-none p-0 m-0 space-y-2 text-sm text-ink">
                {testimonial.results.map((result, index) => (
                  <li key={index} className={result.highlight ? 'mt-4' : ''}>
                    <strong className={result.highlight ? 'font-medium text-flame' : 'font-medium'}>
                      {result.metric}
                    </strong>{' '}
                    {result.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              const section = document.getElementById('investment')
              section?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-10 sm:px-16 py-5 sm:py-6 bg-flame text-white text-sm sm:text-base font-medium uppercase tracking-widest border-0 cursor-pointer transition-all duration-400 ease-out hover:bg-ember hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(255,107,53,0.3)]"
          >
            Join Companies Building Market Velocity
          </button>
        </div>
      </div>
    </section>
  )
}
