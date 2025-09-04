'use client'

import React from 'react'
import { Percent, Clock, Infinity as InfinityIcon, Heart } from 'lucide-react'
import advantageData from '@/data/designForGood/advantage.json'

const iconMap: { [key: string]: any } = {
  // New improved titles
  'Save 40% Year One': Percent,
  '48-Hour Turnaround': Clock,
  'No Limits Support': InfinityIcon,
  'Design That Champions Your Cause': Heart,
  // Original titles as fallback
  '40% First-Year Savings': Percent,
  '72-Hour Delivery': Clock,
  'Unlimited Requests': InfinityIcon,
  'Mission-Matched Design': Heart
}

export default function DesignForGoodAdvantage() {
  const { advantage } = advantageData

  return (
    <section className="section-padding bg-pearl">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase text-charity">
            {advantage.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-ink">
            {advantage.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-3xl mx-auto">
            {advantage.description}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {advantage.benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.title] || Heart
            return (
              <div key={index} className="card-premium">
                <div className="w-12 h-12 mb-6 flex items-center justify-center bg-charity">
                  <IconComponent className="w-6 h-6 text-white" strokeWidth={1.2} />
                </div>
                <h3 className="text-xl font-playfair font-bold text-ink mb-4">{benefit.title}</h3>
                <p className="text-smoke font-light leading-[1.6]">{benefit.description}</p>
              </div>
            )
          })}
        </div>

        {/* Conclusion */}
        <div className="text-center">
          <p className="text-xl font-light text-ink leading-[1.6] max-w-2xl mx-auto">
            {advantage.conclusion}
          </p>
        </div>
      </div>
    </section>
  )
}