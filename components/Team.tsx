'use client'

import Image from 'next/image'
import { Twitter, Linkedin } from 'lucide-react'
import teamData from '@/data/team.json'

export default function Team() {
  const { team } = teamData

  return (
    <section id="team" className="section-padding bg-silk">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {team.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-ink">
            {team.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-2xl mx-auto">
            {team.description}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {team.team.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8 overflow-hidden">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-700" />
              </div>
              
              <h3 className="text-[1.5rem] font-light text-ink mb-2 group-hover:text-flame transition-colors duration-400">
                {member.name}
              </h3>
              
              <div className="text-flame text-sm font-medium uppercase tracking-[0.1em] mb-4">
                {member.position}
              </div>
              
              <p className="text-smoke font-light leading-[1.6] mb-6">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-4">
                {member.social.twitter && (
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-mist hover:border-flame hover:bg-flame hover:text-white transition-all duration-300"
                  >
                    <Twitter className="w-5 h-5" strokeWidth={1.2} />
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-mist hover:border-flame hover:bg-flame hover:text-white transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5" strokeWidth={1.2} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}