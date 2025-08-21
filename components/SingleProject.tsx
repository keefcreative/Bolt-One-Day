'use client'

import React from 'react'
import { Palette, Zap, Lightbulb, ArrowRight, Calendar } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import singleProjectData from '@/data/singleProject.json'

export default function SingleProject() {
  const { header, projectTypes, cta } = singleProjectData

  // Map icon names to actual icon components
  const iconMap = {
    Palette: Palette,
    Zap: Zap,
    Lightbulb: Lightbulb
  }

  return (
    <section className="section-padding bg-ink relative overflow-hidden">
      {/* Sophisticated dark texture */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-ash/20 via-transparent to-transparent" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-flame/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-ocean/[0.05] rounded-full blur-2xl" />
      </div>
      
      <div className="container-premium relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Refined Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-sm font-light text-flame tracking-[0.2em] uppercase">
                {header.eyebrow}
              </span>
              <div className="w-12 h-px bg-flame mt-2 mx-auto" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light tracking-[-0.02em] text-pearl mb-6 leading-tight">
              {header.title.split('<br />')[0]}<br />
              <span className="text-flame">{header.titleHighlight}</span>
            </h2>
            
            <p className="text-lg font-light text-silk/80 leading-relaxed max-w-2xl mx-auto">
              {header.description}
            </p>
          </div>

          {/* Sophisticated Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {projectTypes.map((type, index) => {
              const IconComponent = iconMap[type.icon]
              return (
                <div key={index} className="group">
                  <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 p-8 h-full transition-all duration-500 hover:bg-white/[0.04] hover:border-flame/20 hover:-translate-y-1">
                    <div className="text-flame mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8" strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-light text-pearl mb-4 group-hover:text-flame transition-colors duration-300">
                      {type.title}
                    </h3>
                    <p className="text-silk/70 font-light leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Elegant CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-light text-pearl mb-4">
              {cta.title}
            </h3>
            <p className="text-silk/70 font-light mb-8 max-w-md mx-auto">
              {cta.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToElement('#contact')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-flame text-white font-light text-sm tracking-[0.05em] uppercase transition-all duration-300 hover:bg-ember hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span>{cta.primaryButton.text}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href={cta.secondaryButton.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-silk/20 text-silk font-light text-sm tracking-[0.05em] uppercase transition-all duration-300 hover:border-flame hover:text-flame hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>{cta.secondaryButton.text}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}