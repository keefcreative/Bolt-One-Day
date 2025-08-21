'use client'

import React from 'react'
import { Building2, Rocket, Users, Building, Heart, Palette } from 'lucide-react'
import solutionsData from '@/data/solutions.json'

export default function Solutions() {
  const { header, solutions } = solutionsData

  // Map icon names to actual icon components
  const iconMap = {
    Building2: Building2,
    Rocket: Rocket,
    Users: Users,
    Building: Building,
    Heart: Heart,
    Palette: Palette
  }

  return (
    <section id="solutions" className="section-padding bg-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {header.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-ink">
            {header.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-2xl mx-auto">
            {header.description}
          </p>
        </div>

        {/* Solutions Grid - Premium 3x2 Layout */}
        <div className="services-grid">
          {solutions.map((solution, index) => {
            const IconComponent = iconMap[solution.icon]
            return (
              <div key={index} className="service-card group">
                <div className="text-flame mb-6">
                  <IconComponent className="w-10 h-10" strokeWidth={1.2} />
                </div>
                
                <h3 className="text-[1.75rem] font-light text-ink mb-6 leading-[1.3] group-hover:text-flame transition-colors duration-600">
                  {solution.title}
                </h3>
                
                <p className="text-smoke font-light leading-[1.6] text-[1rem]">
                  {solution.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-flame transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}