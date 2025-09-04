'use client'

import React from 'react'
import { Check, X, ArrowRight } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import comparisonData from '@/data/designForGood/comparison.json'

export default function DesignForGoodComparison() {
  const { comparison } = comparisonData

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase text-charity">
            {comparison.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-ink">
            {comparison.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-3xl mx-auto">
            {comparison.description}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-mist">
                <th className="text-left py-4 px-6 font-medium text-ink">Feature</th>
                <th className="text-center py-4 px-6 font-medium text-smoke">DIY Design</th>
                <th className="text-center py-4 px-6 font-medium text-smoke">Traditional Agency</th>
                <th className="text-center py-4 px-6 font-medium text-white bg-charity">
                  Design for Good
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.features.map((feature, index) => (
                <tr key={index} className="border-b border-mist/50">
                  <td className="py-6 px-6">
                    <div className="font-medium text-ink mb-1">{feature.name}</div>
                    <div className="text-sm text-smoke font-light">{feature.description}</div>
                  </td>
                  <td className="text-center py-6 px-6">
                    {feature.diy ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" strokeWidth={2} />
                    ) : (
                      <X className="w-5 h-5 text-flame mx-auto" strokeWidth={2} />
                    )}
                  </td>
                  <td className="text-center py-6 px-6">
                    {feature.agency ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" strokeWidth={2} />
                    ) : (
                      <X className="w-5 h-5 text-flame mx-auto" strokeWidth={2} />
                    )}
                  </td>
                  <td className="text-center py-6 px-6">
                    {feature.designForGood ? (
                      <Check className="w-5 h-5 text-charity mx-auto" strokeWidth={2} />
                    ) : (
                      <X className="w-5 h-5 text-flame mx-auto" strokeWidth={2} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Conclusion */}
        <div className="text-center mb-12">
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-3xl mx-auto">
            {comparison.conclusion}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {comparison.benefits.map((benefit, index) => (
            <div key={index} className="text-center p-6 bg-silk">
              <h3 className="text-lg font-playfair font-bold text-ink mb-3">{benefit.title}</h3>
              <p className="text-smoke font-light leading-[1.6]">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => scrollToElement('#pricing')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-ink text-white font-medium text-sm tracking-[0.05em] uppercase transition-all duration-400 hover:bg-charity hover:shadow-premium-lg hover:-translate-y-0.5"
          >
            Start Risk-Free
            <ArrowRight className="w-5 h-5" strokeWidth={1.2} />
          </button>
        </div>
      </div>
    </section>
  )
}