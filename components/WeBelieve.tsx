'use client'

import React from 'react'
import Image from 'next/image'
import weBelieveData from '@/data/weBelieve.json'

export default function WeBelieve() {
  const { philosophy, founderMessage, values } = weBelieveData
  return (
    <section id="we-believe" className="section-padding bg-ink relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-flame/[0.08] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-ocean/[0.1] rounded-full blur-2xl" />
      </div>
      
      <div className="container-premium relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Philosophy Statement */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-flame tracking-[0.1em] uppercase">
                {philosophy.eyebrow}
              </span>
              <div className="w-12 h-px bg-flame mt-2 mx-auto" />
            </div>
            
            <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-white">
              {philosophy.title.split('<br />')[0]}<br />
              <span className="text-flame">{philosophy.titleHighlight}</span>
            </h2>
            
            <p className="text-lg font-light text-white/80 leading-[1.6] max-w-2xl mx-auto">
              {philosophy.description}
            </p>
          </div>

          {/* Founder Message */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Message Content */}
            <div>
              <div className="mb-8">
                <span className="text-sm font-medium text-flame tracking-[0.1em] uppercase mb-4 block">
                  {founderMessage.eyebrow}
                </span>
                <h3 className="text-subsection font-light text-white mb-6 leading-tight">
                  {founderMessage.title}
                </h3>
              </div>
              
              <div className="space-y-6 text-white/80 font-light leading-[1.6]">
                {founderMessage.quotes.map((quote, index) => (
                  <p key={index} className={index === 0 ? "text-lg font-light text-white/80 leading-[1.6]" : ""}>
                    "{quote}"
                  </p>
                ))}
              </div>
              
              {/* Signature */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white font-medium">{founderMessage.founder.name}</p>
                    <p className="text-sm text-white/70 font-light">{founderMessage.founder.title}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Image */}
            <div className="relative">
              <div className="relative bg-white/10 border border-white/20 aspect-[3/4] w-[460px] overflow-hidden group">
                <Image
                  src={founderMessage.founder.image}
                  alt={founderMessage.founder.altText}
                  width={460}
                  height={613}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Elegant overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
            </div>
          </div>

          {/* Supporting Values */}
          <div className="mt-20 pt-16 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <h4 className="text-xl font-light text-white mb-4">{value.title}</h4>
                  <p className="text-white/70 font-light leading-[1.6]">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}