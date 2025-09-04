'use client'

import React from 'react'
import { scrollToElement } from '@/lib/utils'
import missionData from '@/data/designForGood/mission.json'

export default function DesignForGoodMission() {
  const { mission } = missionData

  return (
    <section className="section-padding bg-silk">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-8 text-section font-playfair font-bold tracking-[-0.03em] text-ink">
            {mission.title}
          </h2>
          
          <p className="text-xl font-light text-smoke leading-[1.6] mb-8">
            {mission.description}
          </p>
          
          <div className="p-8 bg-white border-l-4 border-l-charity mb-12">
            <p className="text-lg font-light text-ink leading-[1.6]">
              {mission.highlight}
            </p>
          </div>
          
          <button
            onClick={() => scrollToElement(mission.cta.href)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-ink text-white font-medium text-sm tracking-[0.05em] uppercase transition-all duration-400 hover:bg-charity hover:shadow-premium-lg hover:-translate-y-0.5"
          >
            {mission.cta.text}
          </button>
        </div>
      </div>
    </section>
  )
}