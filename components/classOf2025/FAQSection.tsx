'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  discoveryCallUrl?: string
}

export default function FAQSection({ faqs, discoveryCallUrl }: FAQSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState<boolean>(false)

  // Essential FAQs shown by default (first 4)
  const essentialFAQs = faqs.slice(0, 4)
  const additionalFAQs = faqs.slice(4)
  const displayedFAQs = showAll ? faqs : essentialFAQs

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="py-16 sm:py-24 px-6 sm:px-8 bg-pearl">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-ink">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg font-light text-ink/70">
            Everything you need to know about Class of 2026
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-4">
          {displayedFAQs.map((faq, index) => (
            <div key={index} className="bg-white border border-ink/10 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 px-8 flex justify-between items-center bg-transparent border-0 cursor-pointer text-left transition-all duration-300 hover:bg-ink/[0.02]"
                aria-expanded={expandedIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-base sm:text-lg font-normal text-ink tracking-tight pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-flame flex-shrink-0 transition-transform duration-300 ease-out ${
                    expandedIndex === index ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-400 ease-out ${
                  expandedIndex === index
                    ? 'max-h-[2000px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 sm:px-8 pb-6 border-l-4 border-flame ml-4 sm:ml-8">
                  <div className="text-sm sm:text-base font-light leading-relaxed text-ink/70 whitespace-pre-line">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show/Hide All Questions Button */}
        {additionalFAQs.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-ink/20 text-ink text-sm font-medium uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-ink hover:text-white hover:border-ink"
            >
              {showAll ? 'Show Fewer Questions' : 'Show All Questions'}
              {!showAll && (
                <span className="text-xs font-light tracking-normal">
                  ({additionalFAQs.length} more)
                </span>
              )}
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 lg:p-12 border border-ink/10 bg-white text-center">
          <h3 className="text-xl sm:text-2xl font-normal text-ink mb-4">More questions?</h3>
          <p className="text-base font-light text-ink/70 mb-6 max-w-2xl mx-auto">
            We'll talk through your specific situation, answer your questions, and help you
            determine if Class of 2026 is right for your company.
          </p>
          <a
            href={discoveryCallUrl || 'https://meet.brevo.com/designworksbureau/class-of-2025-discovery-call'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 sm:px-12 py-4 sm:py-5 bg-flame text-white text-xs sm:text-sm font-medium uppercase tracking-[0.1em] border-none cursor-pointer transition-all duration-400 ease-out hover:bg-ember hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(255,107,53,0.3)] no-underline"
          >
            Book a 15-Minute Strategy Call
          </a>
          <p className="text-xs text-ink/50 mt-4 m-0">
            No pressure. No sales pitch. Just honest conversation about whether this is a fit.
          </p>
        </div>
      </div>
    </section>
  )
}
