import React from 'react';

// DARK VERSION - Recommended for premium design agency feel
const AnimatedDesignBackgroundDark = () => {
  return (
    <div className="animated-design-background-dark">
      <svg className="design-patterns" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        
        {/* Origin Dot - Right side away from typical content area */}
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

    </div>
  );
};

// LIGHT VERSION - Alternative for light backgrounds
const AnimatedDesignBackgroundLight = () => {
  return (
    <div className="animated-design-background-light">
      <svg className="design-patterns" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        
        {/* Origin Dot - Right side away from typical content area */}
        <circle className="start-dot" cx="1200" cy="400" r="4" fill="#FF6B35"/>

        {/* Golden Ratio Rectangles */}
        <g className="golden-rectangles">
          <rect className="draw-rect rect-1" x="1200" y="400" width="55" height="89" 
                fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <rect className="draw-rect rect-2" x="1255" y="400" width="89" height="89" 
                fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          <rect className="draw-rect rect-3" x="1200" y="311" width="144" height="89" 
                fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          <rect className="draw-rect rect-4" x="1056" y="311" width="144" height="144" 
                fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <rect className="draw-rect rect-5" x="1056" y="167" width="233" height="144" 
                fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          <rect className="draw-rect rect-6" x="823" y="167" width="233" height="233" 
                fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <rect className="draw-rect rect-7" x="823" y="-66" width="377" height="233" 
                fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          <rect className="draw-rect rect-8" x="446" y="-66" width="377" height="377" 
                fill="none" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Fibonacci Circles */}
        <g className="fibonacci-circles">
          <circle className="draw-circle fib-1" cx="1400" cy="200" r="3" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle fib-2" cx="1400" cy="200" r="8" 
                  fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          <circle className="draw-circle fib-3" cx="1400" cy="200" r="21" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle fib-4" cx="1400" cy="200" r="42" 
                  fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          <circle className="draw-circle fib-5" cx="1400" cy="200" r="76" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle fib-6" cx="1400" cy="200" r="131" 
                  fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          <circle className="draw-circle fib-7" cx="1400" cy="200" r="220" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle fib-8" cx="1400" cy="200" r="364" 
                  fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          <circle className="draw-circle fib-9" cx="1400" cy="200" r="598" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Rule of Thirds Grid */}
        <g className="thirds-grid">
          <line className="draw-line" x1="0" y1="360" x2="1920" y2="360" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="0" y1="720" x2="1920" y2="720" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="640" y1="0" x2="640" y2="1080" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="1280" y1="0" x2="1280" y2="1080" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-point" cx="640" cy="360" r="6" fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-point" cx="1280" cy="360" r="6" fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-point" cx="640" cy="720" r="6" fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-point" cx="1280" cy="720" r="6" fill="none" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Typography Baseline Grid */}
        <g className="type-grid">
          <line className="draw-line" x1="60" y1="356" x2="1920" y2="356" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="420" x2="1920" y2="420" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="484" x2="1920" y2="484" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="548" x2="1920" y2="548" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="612" x2="1920" y2="612" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="676" x2="1920" y2="676" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="740" x2="1920" y2="740" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="292" x2="1920" y2="292" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="804" x2="800" y2="804" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="60" y1="868" x2="1200" y2="868" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Swiss Modular Grid */}
        <g className="swiss-grid">
          <defs>
            <pattern id="swissGridPatternLight" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="1920" height="1080" fill="url(#swissGridPatternLight)"/>
          <line className="draw-line" x1="0" y1="180" x2="1920" y2="180" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="300" y1="0" x2="300" y2="1080" stroke="#FF6B35" strokeWidth="1"/>
        </g>

        {/* Color Theory Circles */}
        <g className="color-theory">
          <circle className="draw-circle" cx="1400" cy="300" r="200" 
                  fill="none" stroke="#FF6B35" strokeWidth="1"/>
          <circle className="draw-circle" cx="1400" cy="300" r="150" 
                  fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
          <line className="draw-line" x1="1400" y1="100" x2="1400" y2="500" stroke="#FF6B35" strokeWidth="1"/>
          <line className="draw-line" x1="1200" y1="300" x2="1600" y2="300" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
        </g>

      </svg>

    </div>
  );
};

export { AnimatedDesignBackgroundDark, AnimatedDesignBackgroundLight };