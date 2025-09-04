'use client'

import React from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { scrollToElement } from '@/lib/utils'
import heroData from '@/data/designForGood/hero.json'
import DesignForGoodAnimation from './DesignForGoodAnimation'

export default function DesignForGoodHero() {
  const { hero } = heroData

  return (
    <section className="pt-[140px] pb-32 px-16 min-h-[90vh] flex items-center bg-ink relative">
      {/* Animated Design Background */}
      <DesignForGoodAnimation />
      
      {/* Background texture */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-green-500/[0.03] rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-green-400/[0.04] rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/3 w-[550px] h-[550px] bg-green-600/[0.025] rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-green-500/[0.035] rounded-full blur-3xl animate-float-slow-delay" />
        <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-green-400/[0.04] rounded-full blur-3xl animate-scale-slow" />
      </div>
      
      <div className="container-premium relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="max-w-[600px]">
            {/* Eyebrow */}
            {hero.eyebrow && (
              <p className="animate-fade-in text-sm font-medium tracking-[0.1em] uppercase mb-6 text-charity">
                {hero.eyebrow}
              </p>
            )}
            
            {/* Title */}
            <h1 className="animate-fade-in-delay-1 text-[clamp(3rem,4vw,4.5rem)] font-playfair font-bold leading-[1.1] mb-6 tracking-[-0.04em] text-white">
              {hero.title}
            </h1>
            
            {/* Subtitle */}
            <p className="animate-fade-in-delay-1 text-xl font-medium mb-8 text-charity">
              {hero.subtitle}
            </p>
            
            {/* Description */}
            {hero.description && (
              <p className="animate-fade-in-delay-2 text-lg font-light text-white/80 mb-8 leading-[1.6]">
                {hero.description}
              </p>
            )}

            {/* Benefits */}
            <div className="animate-fade-in-delay-2 space-y-3 mb-12">
              {hero.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center bg-charity">
                    <Check className="w-3 h-3 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-white font-light">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => scrollToElement(hero.primaryCta.href)}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-ink text-white font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:shadow-premium-lg hover:-translate-y-0.5 border border-white/30 hover:bg-charity hover:border-charity"
              >
                {hero.primaryCta.text}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.2} />
              </button>
              
              <a
                href={hero.secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-white/30 text-white font-medium text-[0.875rem] tracking-[0.05em] uppercase transition-all duration-400 hover:bg-white hover:text-ink"
              >
                {hero.secondaryCta.text}
              </a>
            </div>

            {/* Announcement */}
            {hero.announcement && (
              <div className="animate-fade-in-delay-3 mb-4">
                <p className="text-white/90 font-light text-lg">{hero.announcement}</p>
              </div>
            )}

            {/* Credibility */}
            {hero.credibility && (
              <div className="animate-fade-in-delay-3">
                <p className="text-white/70 font-light">{hero.credibility}</p>
              </div>
            )}
          </div>

          {/* Right Column - Empty space for balance */}
          <div className="relative h-[700px] flex items-center justify-center">
            {/* Animation is handled by the background DesignForGoodAnimation component */}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Container premium */
        .container-premium {
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
        }

        /* Background animations */
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 20px) scale(0.95);
          }
          66% {
            transform: translate(20px, -30px) scale(1.05);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.025;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.04;
          }
        }

        @keyframes float-slow-delay {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, 20px) scale(1.03);
          }
          50% {
            transform: translate(-30px, 10px) scale(0.97);
          }
          75% {
            transform: translate(10px, -20px) scale(1.02);
          }
        }

        @keyframes scale-slow {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.15) rotate(5deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 25s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }

        .animate-float-slow-delay {
          animation: float-slow-delay 30s ease-in-out infinite;
        }

        .animate-scale-slow {
          animation: scale-slow 18s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}