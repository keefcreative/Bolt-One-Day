'use client'

import React from 'react'
import Image from 'next/image'
import { TrendingDown, Clock, Target } from 'lucide-react'
import problemsData from '@/data/designForGood/problems.json'

const iconMap: { [key: string]: any } = {
  'Eroded Donor Confidence': TrendingDown,
  'Hours Down the Drain': Clock,
  'Diminished Effect': Target,
  // Fallback for original titles
  'Lost Donor Trust': TrendingDown,
  'Wasted Time': Clock,
  'Reduced Impact': Target
}

export default function DesignForGoodProblems() {
  const { problems } = problemsData

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase text-flame">
            {problems.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-ink">
            {problems.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-3xl mx-auto mb-4">
            {problems.description}
          </p>
          <p className="text-lg font-medium text-ink">
            {problems.subtitle}
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {problems.issues.map((issue, index) => {
            const IconComponent = iconMap[issue.title] || Target
            return (
              <div key={index} className="text-center p-8 bg-silk">
                <div className="w-16 h-16 mx-auto mb-6 bg-flame flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-white" strokeWidth={1.2} />
                </div>
                <h3 className="text-xl font-playfair font-bold text-ink mb-4">{issue.title}</h3>
                <p className="text-smoke font-light leading-[1.6]">{issue.description}</p>
              </div>
            )
          })}
        </div>

        {/* Before/After Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <Image
              src={problems.beforeImage}
              alt="Before: DIY nonprofit design with limited resources"
              width={400}
              height={300}
              className="w-full aspect-[4/3] object-cover mb-4"
            />
            <div className="inline-block px-4 py-2 bg-flame text-white font-medium text-sm uppercase tracking-wider">
              Before
            </div>
          </div>
          <div className="text-center">
            <Image
              src={problems.afterImage}
              alt="After: Professional nonprofit design that builds trust"
              width={400}
              height={300}
              className="w-full aspect-[4/3] object-cover mb-4"
            />
            <div className="inline-block px-4 py-2 text-white font-medium text-sm uppercase tracking-wider bg-charity">
              After
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}