'use client'

import { Quote } from 'lucide-react'

export default function SingleTestimonial() {
  return (
    <section id="testimonial" className="section-padding bg-ink">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            Client Testimonial
          </p>
          <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-white text-balance">
            What Our Clients Say
          </h2>
          <p className="text-lg font-light text-pearl/80 leading-[1.6] max-w-2xl mx-auto text-pretty">
            Real feedback from brands we've partnered with
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="relative max-w-4xl mx-auto">
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
            <div>
              <blockquote className="text-2xl md:text-3xl font-light text-white leading-[1.4] mb-8 relative z-10 text-balance">
                "We came to DesignWorks Bureau with a very open and non-specific brief, and they quickly transformed it into clear, innovative concepts. Every round of feedback was handled with exceptional speed and professionalism. The final design more than fulfilled our expectations. A fantastic partner—and the beginning of a long relationship."
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col gap-1">
                <div className="font-medium text-white text-xl">
                  Ray Livingston
                </div>
                <div className="text-pearl/70 font-light text-lg">
                  Head of Brand & Product Marketing
                </div>
                <div className="text-flame font-medium">
                  Jack Poker
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
