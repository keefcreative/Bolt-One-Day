"use client";

import { MessageSquare, Lightbulb, Palette, Rocket } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      number: "01",
      icon: <MessageSquare className="w-10 h-10" strokeWidth={1.2} />,
      title: "Discovery & Strategy",
      description: "We start by understanding your brand, goals, and target audience through comprehensive research and strategic planning sessions.",
    },
    {
      number: "02",
      icon: <Lightbulb className="w-10 h-10" strokeWidth={1.2} />,
      title: "Concept Development",
      description: "Our creative team develops innovative concepts and design directions that align with your brand strategy and objectives.",
    },
    {
      number: "03",
      icon: <Palette className="w-10 h-10" strokeWidth={1.2} />,
      title: "Design & Refinement",
      description: "We craft pixel-perfect designs with meticulous attention to detail, iterating based on your feedback until perfection.",
    },
    {
      number: "04",
      icon: <Rocket className="w-10 h-10" strokeWidth={1.2} />,
      title: "Launch & Support",
      description: "We deliver final assets and provide ongoing support to ensure your design solutions perform at their highest potential.",
    },
  ];

  return (
    <section id="process" className="section-padding bg-silk">
      <div className="container-premium">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-section font-light text-ink mb-6">
            Our <span className="text-flame">Process</span>
          </h2>
          <p className="text-large text-smoke max-w-3xl mx-auto">
            A proven methodology that ensures exceptional results through 
            collaboration, creativity, and strategic thinking.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="card-premium text-center group"
            >
              {/* Step Number */}
              <div className="text-6xl font-light text-mist mb-6 group-hover:text-flame transition-colors duration-base">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="text-flame mb-6 flex justify-center">
                {step.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-medium text-ink mb-4 tracking-wide">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-smoke leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline Connector - Hidden on mobile */}
        <div className="hidden lg:block relative -mt-32 mb-20">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-mist transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-flame to-transparent transform -translate-y-1/2 opacity-30"></div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-smoke mb-8">
            Experience our streamlined process that delivers exceptional results on time, every time.
          </p>
          <button className="btn-secondary">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
}