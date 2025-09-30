'use client'

import Image from 'next/image'
import { Twitter, Linkedin } from 'lucide-react'
import teamData from '@/data/team.json'
import { balanceHeadline, balanceDescription, balanceText } from '@/lib/typography-utils'

export default function Team() {
  const { team } = teamData

  // This component is deprecated - use TeamCollective instead
  // teamData now uses collective_experience structure
  // Keeping this component to avoid build errors, but it should not be used
  return (
    <section id="team" className="section-padding bg-silk">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {team.eyebrow}
          </p>
          <h2
            className="mb-6 text-section font-light tracking-[-0.03em] text-ink headline-balanced"
            dangerouslySetInnerHTML={{ __html: balanceHeadline(team.title) }}
          />
          <p
            className="text-lg font-light text-smoke leading-[1.6] max-w-2xl mx-auto description-balanced"
            dangerouslySetInnerHTML={{ __html: balanceDescription(team.description) }}
          />
        </div>

        {/* Team Grid - DEPRECATED: teamData structure changed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Removed team member mapping since data structure changed */}
          <p className="col-span-full text-center text-smoke">
            This component is deprecated. Please use TeamCollective instead.
          </p>
          {/* Deprecated - team member grid removed */}
        </div>
      </div>
    </section>
  )
}