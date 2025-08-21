'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import faqData from '@/data/designForGood/faq.json'

export default function DesignForGoodFaq() {
  const { faq } = faqData
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section-padding bg-pearl">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase" style={{ color: '#16a34a' }}>
              {faq.eyebrow}
            </p>
            <h2 className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-ink">
              {faq.title}
            </h2>
            <p className="text-lg font-light text-smoke leading-[1.6]">
              {faq.description}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 mb-12">
            {faq.questions.map((item, index) => (
              <div key={index} className="bg-white border border-mist overflow-hidden">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-silk transition-colors duration-300"
                >
                  <span className="font-medium text-ink pr-4">{item.question}</span>
                  <span className="font-playfair font-bold text-ink pr-4">{item.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`} 
                    style={{ color: openIndex === index ? '#16a34a' : '#6b7280' }}
                    strokeWidth={1.2}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 border-t border-silk">
                    <div className="pt-4">
                      <p className="font-light text-smoke leading-[1.6]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <p className="text-smoke font-light">
              {faq.contactCta}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}