"use client";

import React from "react";
import Image from 'next/image';
import premiumCtaData from '@/data/premiumCta.json'

export function PremiumCta() {
  const { eyebrow, title, description, cta, secondaryCta, backgroundImage } = premiumCtaData

  return (
    <section className="relative py-32 px-16 overflow-hidden group/parent bg-image">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          fill
          className="object-cover"
          alt="DesignWorks office space"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/50" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="text-[0.875rem] font-medium tracking-[0.1em] uppercase text-flame mb-8">
            {eyebrow}
          </div>
          
          {/* Heading */}
          <h2 className="text-[3.5rem] lg:text-[4rem] font-light tracking-[-0.03em] leading-[1.2] mb-8 text-white">
            {title}
          </h2>
          
          {/* Description */}
          <p className="text-xl font-light text-white/90 leading-[1.8] mb-12 max-w-lg">
            {description}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a 
              href={cta.url} 
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:bg-flame hover:text-white hover:shadow-premium-lg hover:-translate-y-0.5"
            >
              {cta.text}
            </a>
            
            <a 
              href={secondaryCta.url} 
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-white/30 text-white font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:bg-white hover:text-black"
            >
              {secondaryCta.text}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-flame to-transparent" />
    </section>
  );
}