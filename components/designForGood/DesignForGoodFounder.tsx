'use client'

import React from 'react'
import Image from 'next/image'
import founderData from '@/data/designForGood/founder.json'

export default function DesignForGoodFounder() {
  const { founder } = founderData

  return (
    <section className="section-padding bg-silk">
      <div className="container-premium">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="mb-4 font-medium text-sm tracking-[0.1em] uppercase" style={{ color: '#16a34a' }}>
              {founder.eyebrow}
            </p>
            <h2 className="mb-6 text-section font-playfair font-bold tracking-[-0.03em] text-ink">
              {founder.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Founder Image */}
            <div className="relative">
              <Image
                src={founder.image}
                alt={`${founder.signature.name}, ${founder.signature.title}`}
                width={400}
                height={500}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>

            {/* Message Content */}
            <div>
              <div className="space-y-6 text-smoke font-light leading-[1.6] mb-8">
                {founder.message.map((paragraph, index) => (
                  <p key={index} className="text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Signature */}
              <div className="pt-8 border-t border-mist">
                <div className="text-ink">
                  <div className="font-medium text-xl mb-1">{founder.signature.name}</div>
                  <div className="text-smoke font-light">{founder.signature.title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}