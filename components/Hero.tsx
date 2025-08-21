'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import heroData from '@/data/hero.json'

// Animated Design Background Component
const AnimatedDesignBackgroundDark = () => {
  return (
    <div className="animated-design-background-dark">
      <svg className="design-patterns" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        
        {/* Origin Dot */}
        <circle className="start-dot" cx="1200" cy="400" r="4" fill="#FF6B35"/>

        {/* Golden Ratio Rectangles */}
        <g className="golden-rectangles">
          <rect className="draw-rect rect-1" x="1200" y="400" width="55" height="89" 
                fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <rect className="draw-rect rect-2" x="1255" y="400" width="89" height="89" 
                fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <rect className="draw-rect rect-3" x="1200" y="311" width="144" height="89" 
                fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <rect className="draw-rect rect-4" x="1056" y="311" width="144" height="144" 
                fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <rect className="draw-rect rect-5" x="1056" y="167" width="233" height="144" 
                fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <rect className="draw-rect rect-6" x="823" y="167" width="233" height="233" 
                fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <rect className="draw-rect rect-7" x="823" y="-66" width="377" height="233" 
                fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <rect className="draw-rect rect-8" x="446" y="-66" width="377" height="377" 
                fill="none" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Fibonacci Circles */}
        <g className="fibonacci-circles">
          <circle className="draw-circle fib-1" cx="1400" cy="200" r="3" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle fib-2" cx="1400" cy="200" r="8" 
                  fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <circle className="draw-circle fib-3" cx="1400" cy="200" r="21" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle fib-4" cx="1400" cy="200" r="42" 
                  fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <circle className="draw-circle fib-5" cx="1400" cy="200" r="76" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle fib-6" cx="1400" cy="200" r="131" 
                  fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <circle className="draw-circle fib-7" cx="1400" cy="200" r="220" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle fib-8" cx="1400" cy="200" r="364" 
                  fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <circle className="draw-circle fib-9" cx="1400" cy="200" r="598" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Rule of Thirds Grid */}
        <g className="thirds-grid">
          <line className="draw-line" x1="0" y1="360" x2="1920" y2="360" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <line className="draw-line" x1="0" y1="720" x2="1920" y2="720" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <line className="draw-line" x1="640" y1="0" x2="640" y2="1080" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="1280" y1="0" x2="1280" y2="1080" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-point" cx="640" cy="360" r="6" fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-point" cx="1280" cy="360" r="6" fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-point" cx="640" cy="720" r="6" fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-point" cx="1280" cy="720" r="6" fill="none" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Typography Baseline Grid */}
        <g className="type-grid">
          <line className="draw-line" x1="60" y1="356" x2="1920" y2="356" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="420" x2="1920" y2="420" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="484" x2="1920" y2="484" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="548" x2="1920" y2="548" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="612" x2="1920" y2="612" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="676" x2="1920" y2="676" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="740" x2="1920" y2="740" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="292" x2="1920" y2="292" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="804" x2="800" y2="804" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="868" x2="1200" y2="868" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Swiss Modular Grid */}
        <g className="swiss-grid">
          <defs>
            <pattern id="swissGridPatternDark" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="1920" height="1080" fill="url(#swissGridPatternDark)"/>
          <line className="draw-line" x1="0" y1="180" x2="1920" y2="180" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="300" y1="0" x2="300" y2="1080" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Color Theory Circles */}
        <g className="color-theory">
          <circle className="draw-circle" cx="1400" cy="300" r="200" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle" cx="1400" cy="300" r="150" 
                  fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <line className="draw-line" x1="1400" y1="100" x2="1400" y2="500" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="1200" y1="300" x2="1600" y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        </g>

      </svg>

      <style jsx>{`
        .animated-design-background-dark {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
        }

        .design-patterns {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }

        /* Pattern Group Animations */
        .golden-rectangles { animation: patternShow 42s ease-in-out infinite; animation-delay: 0s; }
        .fibonacci-circles { animation: patternShow 42s ease-in-out infinite; animation-delay: -14s; }
        .thirds-grid { animation: patternShow 42s ease-in-out infinite; animation-delay: -7s; }
        .type-grid { animation: patternShow 42s ease-in-out infinite; animation-delay: -21s; }
        .swiss-grid { animation: patternShow 42s ease-in-out infinite; animation-delay: -28s; }
        .color-theory { animation: patternShow 42s ease-in-out infinite; animation-delay: -35s; }

        @keyframes patternShow { 0%, 90%, 100% { opacity: 0; } 17%, 83% { opacity: 1; } }

        .start-dot { animation: dotPulse 42s ease-in-out infinite; }
        @keyframes dotPulse {
          0% { opacity: 0; transform: scale(0); }
          2% { opacity: 1; transform: scale(1); }
          5% { opacity: 1; transform: scale(1); }
          7% { opacity: 0; transform: scale(0); }
          90%, 100% { opacity: 0; transform: scale(0); }
        }

        .draw-line[x1="0"][x2="1920"], .draw-line[x1="60"][x2="1920"], .draw-line[x1="60"][x2="800"], .draw-line[x1="60"][x2="1200"], .draw-line[x1="1200"][x2="1600"] {
          stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawAndMoveHorizontal 8s ease-in-out infinite;
        }
        .draw-line[y1="0"][y2="1080"] { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawAndMoveVertical 8s ease-in-out infinite; }

        @keyframes drawAndMoveHorizontal {
          0%, 90%, 100% { stroke-dashoffset: 1000; opacity: 0; transform: translateX(0); }
          15% { stroke-dashoffset: 1000; opacity: 1; transform: translateX(0); }
          40% { stroke-dashoffset: 0; opacity: 1; transform: translateX(0); }
          70% { stroke-dashoffset: 0; opacity: 0.3; transform: translateX(40px); }
          85% { stroke-dashoffset: 0; opacity: 0; transform: translateX(80px); }
        }

        @keyframes drawAndMoveVertical {
          0%, 90%, 100% { stroke-dashoffset: 1000; opacity: 0; transform: translateY(0); }
          15% { stroke-dashoffset: 1000; opacity: 1; transform: translateY(0); }
          40% { stroke-dashoffset: 0; opacity: 1; transform: translateY(0); }
          70% { stroke-dashoffset: 0; opacity: 0.3; transform: translateY(-40px); }
          85% { stroke-dashoffset: 0; opacity: 0; transform: translateY(-80px); }
        }

        .draw-rect, .draw-circle, .draw-point { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawAndFade 8s ease-in-out infinite; }
        @keyframes drawAndFade {
          0%, 90%, 100% { stroke-dashoffset: 1000; opacity: 0; }
          15% { stroke-dashoffset: 1000; opacity: 1; }
          40% { stroke-dashoffset: 0; opacity: 1; }
          70% { stroke-dashoffset: 0; opacity: 0.3; }
          85% { stroke-dashoffset: 0; opacity: 0; }
        }

        .rect-1 { animation-delay: 3s; } .rect-2 { animation-delay: 3.5s; } .rect-3 { animation-delay: 4s; } .rect-4 { animation-delay: 4.5s; }
        .rect-5 { animation-delay: 5s; } .rect-6 { animation-delay: 5.5s; } .rect-7 { animation-delay: 6s; } .rect-8 { animation-delay: 6.5s; }
        .fib-1 { animation-delay: 0s; } .fib-2 { animation-delay: 0.3s; } .fib-3 { animation-delay: 0.6s; } .fib-4 { animation-delay: 0.9s; }
        .fib-5 { animation-delay: 1.2s; } .fib-6 { animation-delay: 1.5s; } .fib-7 { animation-delay: 1.8s; } .fib-8 { animation-delay: 2.1s; } .fib-9 { animation-delay: 2.4s; }

        .design-patterns { will-change: transform, opacity; }
        .draw-rect, .draw-circle, .draw-line, .draw-point { will-change: transform, opacity; }

        @media (prefers-reduced-motion: reduce) {
          .draw-rect, .draw-circle, .draw-line, .draw-point { animation: none; opacity: 0.3; }
          .start-dot { animation: none; opacity: 0.8; }
        }
        @media (max-width: 768px) { .design-patterns { opacity: 0.4; } }
      `}</style>
    </div>
  )
}

export default function Hero() {
  const { hero, stats } = heroData
  
  // Ensure we have valid hero data
  if (!hero || !stats) {
    return (
      <section className="pt-[140px] pb-32 px-16 min-h-[90vh] flex items-center relative overflow-hidden">
        <AnimatedDesignBackgroundDark />
        <div className="container-premium w-full relative z-10">
          <div className="hero-text max-w-[800px]">
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-[140px] pb-32 px-16 min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Animated Design Background */}
      <AnimatedDesignBackgroundDark />
      
      {/* Subtle bottom border - adjusted for dark background */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      
      <div className="container-premium w-full relative z-10">
        <div className="hero-text max-w-[800px]">
          {/* Eyebrow - keeping flame color as it works well on dark */}
          <p className="animate-fade-in text-sm font-medium tracking-[0.1em] uppercase text-flame mb-8">
            {hero.eyebrow}
          </p>
          
          {/* Title - changed to white for dark background */}
          <h1 className="animate-fade-in-delay-1 text-[clamp(3.5rem,5vw,5.5rem)] font-light leading-[1.1] mb-8 tracking-[-0.04em] text-white">
            {hero.title}
          </h1>
          
          {/* Description - changed to light grey for readability */}
          <p className="animate-fade-in-delay-2 text-xl font-light text-white/80 mb-12 leading-[1.8] max-w-[540px]">
            {hero.description}
          </p>

          {/* Buttons - adjusted for dark background */}
          <div className="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-6 mb-16">
            <button
              onClick={() => scrollToElement(hero.primaryButton.href)}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:bg-flame hover:text-white hover:shadow-premium-lg hover:-translate-y-0.5"
            >
              {hero.primaryButton.text}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.2} />
            </button>
            
            <button
              onClick={() => scrollToElement(hero.secondaryButton.href)}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-white/30 text-white font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:bg-white hover:text-black"
            >
              {hero.secondaryButton.text}
            </button>
          </div>

          {/* Stats - adjusted for dark background */}
          <div className="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-16">
            {stats.items.map((stat, index) => (
              <div key={index} className="group relative">
                {/* Decorative line above each stat */}
                <div className="w-10 h-px bg-white/30 mb-3" />
                <div className="text-[2.5rem] font-light text-white mb-2 group-hover:text-flame transition-colors duration-400">
                  {stat.number}
                </div>
                <div className="text-white/70 uppercase tracking-[0.1em] text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}