'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, MessageSquare, Lightbulb, Palette, Rocket } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import processData from '@/data/designForGood/process.json'

// Icon mapping for process steps
const iconMap = {
  'MessageSquare': MessageSquare,
  'Lightbulb': Lightbulb,
  'Palette': Palette,
  'Rocket': Rocket
}

export default function DesignForGoodProcess() {
  const { process } = processData
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 2000) // Cycle every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const handleMouseEnter = (index: number) => {
    setActiveStep(index)
  }

  return (
    <section className="section-padding bg-silk">
      <div className="container-premium">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="mb-4 font-medium text-green-600 text-sm tracking-[0.1em] uppercase">
            {process.eyebrow}
          </p>
          <h2 className="text-section font-playfair font-bold text-ink mb-6">
            {process.title}
          </h2>
          <p className="text-xl font-light text-smoke leading-[1.6] max-w-[640px] mx-auto">
            {process.description}
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {process.steps.map((step, index) => {
            const IconComponent = iconMap[step.icon as keyof typeof iconMap]
            return (
              <div 
                key={index}
                className={`card-premium text-center group relative transition-all duration-500 ${
                  activeStep === index ? 'scale-105 shadow-premium-lg bg-whisper' : ''
                }`}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                {/* Step Number - Top Right Corner */}
                <div className={`absolute top-4 right-4 text-2xl font-light transition-colors duration-base ${
                  activeStep === index ? 'text-green-600' : 'text-mist group-hover:text-green-600'
                }`}>
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className={`mb-6 flex justify-center transition-all duration-base text-green-600`}>
                  {IconComponent && <IconComponent className="w-10 h-10" strokeWidth={1.2} />}
                </div>
                
                {/* Title */}
                <h3 className={`text-xl font-playfair font-bold mb-4 tracking-wide transition-colors duration-base ${
                  activeStep === index ? 'text-green-600' : 'text-ink'
                }`}>
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className={`leading-relaxed transition-colors duration-base ${
                  activeStep === index ? 'text-ink' : 'text-smoke'
                }`}>
                  {step.description}
                </p>

                {/* Connection Line - Hidden on mobile */}
                {index < process.steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-16 -right-4 w-8 h-px transition-colors duration-base ${
                    activeStep === index ? 'bg-green-600' : 'bg-mist group-hover:bg-green-600'
                  }`}>
                    <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 transition-colors duration-base rotate-45 ${
                      activeStep === index ? 'bg-green-600' : 'bg-mist group-hover:bg-green-600'
                    }`}></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-smoke mb-8 max-w-2xl mx-auto">
            Experience our streamlined process that delivers exceptional results on time, every time. 
            Ready to see how we can transform your nonprofit's brand?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToElement('#pricing')}
              className="btn-primary hover:bg-green-600"
            >
              Start Your Project
            </button>
            <button 
              onClick={() => scrollToElement('#contact')}
              className="btn-secondary hover:bg-ink hover:text-white"
            >
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}