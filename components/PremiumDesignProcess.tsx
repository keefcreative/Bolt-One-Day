"use client";

import React from "react";
import { useState, useEffect } from "react";
import { MessageSquare, Lightbulb, Palette, Rocket, DivideIcon as LucideIcon } from 'lucide-react';
import premiumDesignProcessData from '@/data/premiumDesignProcess.json'

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Lightbulb,
  Palette,
  Rocket,
};

export function PremiumDesignProcess() {
  const { eyebrow, title, description, steps } = premiumDesignProcessData
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000); // Cycle every 2 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="section-padding bg-silk">
      <div className="container-premium">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {eyebrow}
          </p>
          <h2 className="text-section font-light text-ink mb-6">
            {title}
          </h2>
          <p className="text-xl font-light text-smoke leading-[1.6] max-w-[640px] mx-auto">
            {description}
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.icon] || Palette;
            return (
            <div 
              key={index}
              className={`card-premium text-center group relative transition-all duration-500 ${
                activeStep === index ? 'scale-105 shadow-premium-lg bg-whisper' : ''
              }`}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Step Number - Top Right Corner */}
              <div className={`absolute top-4 right-4 text-2xl font-light transition-colors duration-base ${
                activeStep === index ? 'text-flame' : 'text-mist group-hover:text-flame'
              }`}>
                {step.number}
              </div>
              
              {/* Icon */}
              <div className={`mb-6 flex justify-center transition-all duration-base ${
                activeStep === index ? 'text-flame' : 'text-flame'
              }`}>
                <IconComponent className="w-10 h-10" strokeWidth={1.2} />
              </div>
              
              {/* Title */}
              <h3 className={`text-xl font-medium mb-4 tracking-wide transition-colors duration-base ${
                activeStep === index ? 'text-flame' : 'text-ink'
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
              {index < steps.length - 1 && (
                <div className={`hidden lg:block absolute top-20 -right-4 w-8 h-px transition-colors duration-base ${
                  activeStep === index ? 'bg-flame' : 'bg-mist group-hover:bg-flame'
                }`}>
                  <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 transition-colors duration-base rotate-45 ${
                    activeStep === index ? 'bg-flame' : 'bg-mist group-hover:bg-flame'
                  }`}></div>
                </div>
              )}
            </div>
          );
          })}
        </div>


        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-smoke mb-8 max-w-2xl mx-auto">
            Experience our streamlined process that delivers exceptional results on time, every time. 
            Ready to see how we can transform your brand?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary">
              Start Your Project
            </a>
            <a href="#portfolio" className="btn-secondary">
              View Our Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}