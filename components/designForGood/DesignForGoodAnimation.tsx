import React from 'react';

// Animated Design Background Component for Design for Good
const DesignForGoodAnimation = () => {
  return (
    <div className="design-for-good-animation">
      <svg 
        className="main-canvas" 
        viewBox="0 0 1053 484.7" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Heart - 1px Green - Extended lines */}
        <g className="heart-section">
          <path className="heart-right-path" 
                d="M1553,305.94h-990.24c-4.84,0-13.44-1.35-18.54-3.49" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
          <path className="heart-left-path" 
                d="M520.93,287.14l-41.4-30.1c-22.28-16.6-42.67-42.9-42.67-75.09s24.78-55.33,55.32-55.33c14.86,0,28.13,6.46,37.91,15.97l2.14,2.33,2.14-2.33c9.78-9.51,23.06-15.97,37.92-15.97,30.54,0,55.32,24.79,55.32,55.33,0,32.19-20.4,58.49-42.68,75.09l-49.77,37.09c-9.16,6.83-20.47,11.81-33.46,11.81H-500" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
        </g>

        {/* Roof - 1px Flame Orange */}
        <g className="roof-section">
          <polyline className="roof-main-line" points="419.24 118.33 532.57 5 645.22 117.65" 
                    fill="none" stroke="#ff6b35" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline className="roof-chimney-outline" points="594.87 46.56 594.87 25.68 621.04 25.68 621.04 93.47" 
                    fill="none" stroke="#ff6b35" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        {/* Medical Cross - 1px Green */}
        <g className="medical-section">
          <path className="medical-right-arm" 
                d="M582.49,256.2l20.73,11.92c2.59,1.55,5.7.52,7.25-2.07l9.84-17.1c1.55-2.59.52-5.7-2.07-7.25l-47.67-27.46c-3.63-2.07-3.63-7.25,0-8.81l47.67-27.46c2.59-1.55,3.11-4.66,2.07-7.25l-9.84-17.1c-1.55-2.59-4.66-3.11-7.25-2.07l-48.19,27.46c-3.63,2.07-7.77-.52-7.77-4.66v-54.92c0-3.11-2.07-5.18-5.18-5.18h-19.69c-3.11,0-5.18,2.07-5.18,5.18v30.57" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
          <path className="medical-left-arm" 
                d="M517.21,174.85c0,4.15-4.15,6.22-7.77,4.66l-48.19-27.46c-2.59-1.55-5.7-.52-7.25,2.07l-9.84,17.1c-1.55,2.59-.52,5.7,2.07,7.25l47.67,27.46c3.63,2.07,3.63,7.25,0,8.81l-47.67,27.46c-2.59,1.04-3.63,4.15-2.07,6.74l9.84,17.1c1.55,2.59,4.66,3.11,7.25,2.07l48.19-27.46c3.63-2.07,7.77.52,7.77,4.66v55.44c0,3.11,2.07,5.18,5.18,5.18h19.69c3.11,0,5.18-2.07,5.18-5.18v-55.44c0-4.15,4.15-6.22,7.77-4.66" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
        </g>

        {/* Globe - 1px Green */}
        <g className="globe-section">
          <circle className="globe-main-circle" cx="535.47" cy="222.11" r="103.78" 
                  fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <line className="globe-vertical-line" x1="535.75" y1="118.33" x2="535.75" y2="325.67" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <line className="globe-horizontal-line" x1="432" y1="222.11" x2="638.93" y2="222.11" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <line className="globe-top-latitude" x1="446.18" y1="170.1" x2="624.76" y2="170.1" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <line className="globe-bottom-latitude" x1="446.18" y1="274.13" x2="624.76" y2="274.13" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path className="globe-right-longitude" d="M571.61,124.8c12.37,23.26,20.24,58.22,20.24,97.31s-7.87,74.06-20.25,97.32" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path className="globe-left-longitude" d="M499.32,319.42c-12.37-23.26-20.24-58.22-20.24-97.31s7.87-74.06,20.24-97.31" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        {/* Helping Hands - 1px Flame Orange */}
        <g className="hands-section">
          <path className="hands-right-fingers-path" 
                d="M674.75,411.29c2.77-2.6,5.53-5.37,8.47-8.3,12.41-12.41,10.9-35.13,18.61-123.15v.5c0-10.31-8.3-18.61-18.61-18.61s-16.85,7.04-18.61,18.61c-1.76,11.57-11.15,76.96-11.15,76.96" 
                fill="none" stroke="#ff6b35" strokeWidth="1" strokeLinecap="round"/>
          <path className="hands-right-thumb-path" 
                d="M617.49,399.64l30.68-30.68c7.29-7.29,7.29-19.03,0-26.32h0c-7.29-7.29-19.03-7.29-26.32,0l-19.28,19.28c-25.4,25.4-38.81,21.63-53.4,36.3-10.56,10.56-14.92,25.82-14.92,47.62v9.47c0,13.5,10.9,24.39,24.39,24.39h40.07c9.98,0,18.61-6.2,22.63-15.34,2.35-5.28,6.29-11.32,12.83-17.69" 
                fill="none" stroke="#ff6b35" strokeWidth="1" strokeLinecap="round"/>
          <path className="hands-left-fingers-path" 
                d="M403.22,420.18c-5.7-5.03-11.65-10.65-18.19-17.19-12.32-12.32-10.9-35.13-18.53-123.15v.5c0-10.31,8.3-18.61,18.61-18.61s16.85,7.04,18.61,18.61c.34,2.35,1.01,6.96,1.84,12.74" 
                fill="none" stroke="#ff6b35" strokeWidth="1" strokeLinecap="round"/>
          <path className="hands-left-thumb-path" 
                d="M450.84,399.64l-30.68-30.68c-7.29-7.29-7.29-19.03,0-26.32h0c7.29-7.29,19.03-7.29,26.32,0l19.28,19.28c25.4,25.4,38.81,21.63,53.4,36.3,10.56,10.56,14.92,25.82,14.92,47.62v9.47c0,13.5-10.9,24.39-24.39,24.39h-40.07c-9.98,0-18.61-6.2-22.63-15.34-2.01-4.44-5.11-9.47-9.89-14.67" 
                fill="none" stroke="#ff6b35" strokeWidth="1" strokeLinecap="round"/>
        </g>

        {/* Community - 1px Green */}
        <g className="community-section">
          <path className="community-center-body" 
                d="M508.55,290.34c-.06-.09-.13-.17-.19-.26-4.25-5.6-6.74-12.49-6.74-20.04v-39.86c0-4.59,3.55-8.14,8.14-8.14h51.43c4.59,0,8.14,3.55,8.14,8.14v39.86c0,18.52-15.02,33.44-33.85,33.44" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
          <path className="community-center-head" 
                d="M559.3,143.38c0,3.67-.74,7.17-2.09,10.34s-3.29,6.04-5.7,8.45-5.27,4.35-8.45,5.7-6.68,2.09-10.34,2.09s-7.17-.74-10.34-2.09c-3.18-1.34-6.04-3.29-8.45-5.7s-4.35-5.27-5.7-8.45c-1.34-3.18-2.09-6.68-2.09-10.34s.74-7.17,2.09-10.34c1.34-3.18,3.29-6.04,5.7-8.45s5.27-4.35,8.45-5.7c3.18-1.34,6.68-2.09,10.34-2.09s7.17.74,10.34,2.09c3.18,1.34,6.04,3.29,8.45,5.7s4.35,5.27,5.7,8.45c1.34,3.18,2.09,6.68,2.09,10.34" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
          <path className="community-left-body" 
                d="M474.74,275.75c.88-4.22-1.82-8.36-6.05-9.25-.12-.02-.24-.05-.36-.07-6.54-1.21-12.27-3.72-15.94-6.85-3.67-3.13-5.48-6.42-5.48-11.36,0-5.26,4.1-9.35,9.36-9.35h29.7" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
          <path className="community-left-head" 
                d="M508.24,187.91c0,3.67-.74,7.17-2.09,10.34s-3.29,6.04-5.7,8.45-5.27,4.35-8.45,5.7-6.68,2.09-10.34,2.09s-7.17-.74-10.34-2.09-6.04-3.29-8.45-5.7-4.35-5.27-5.7-8.45-2.09-6.68-2.09-10.34.74-7.17,2.09-10.34,3.29-6.04,5.7-8.45,5.27-4.35,8.45-5.7,6.68-2.09,10.34-2.09,7.17.74,10.34,2.09" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
          <path className="community-right-body" 
                d="M584.94,238.88h29.7c5.26,0,9.36,4.09,9.36,9.35,0,4.94-1.81,8.23-5.48,11.36-3.67,3.13-9.4,5.63-15.94,6.85-.12.02-.24.04-.36.07-4.22.88-6.93,5.03-6.05,9.25" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
          <path className="community-right-head" 
                d="M577.62,163.42c3.18-1.34,6.68-2.09,10.34-2.09s7.17.74,10.34,2.09,6.04,3.29,8.45,5.7,4.35,5.27,5.7,8.45c1.34,3.18,2.09,6.68,2.09,10.34s-.74,7.17-2.09,10.34c-1.34,3.18-3.29,6.04-5.7,8.45s-5.27,4.35-8.45,5.7-6.68,2.09-10.34,2.09s-7.17-.74-10.34-2.09-6.04-3.29-8.45-5.7-4.35-5.27-5.7-8.45-2.09-6.68-2.09-10.34" 
                fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round"/>
        </g>
      </svg>

      <style jsx>{`
        .design-for-good-animation {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .main-canvas {
          position: absolute;
          top: 50%;
          left: 65%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          opacity: 0.6;
        }

        /* STROKE DASH SETUP FOR ALL PATHS */
        .heart-section path,
        .roof-section polyline,
        .medical-section path,
        .globe-section circle,
        .globe-section line,
        .globe-section path,
        .hands-section path,
        .community-section path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }

        /* ANIMATION TIMELINE - 32 seconds total */
        .heart-section {
          animation: heartVisibility 32s infinite;
        }
        .roof-section {
          animation: roofVisibility 32s infinite;
        }
        .medical-section {
          animation: medicalVisibility 32s infinite;
        }
        .globe-section {
          animation: globeVisibility 32s infinite;
        }
        .hands-section {
          animation: handsVisibility 32s infinite, handsMovement 32s ease-out infinite;
        }
        .community-section {
          animation: communityVisibility 32s infinite;
        }

        /* INDIVIDUAL PATH DRAWING */
        .heart-left-path {
          animation: heartVisibility 32s infinite, drawHeartLeft 32s linear infinite;
        }
        .heart-right-path {
          animation: heartVisibility 32s infinite, drawHeartRight 32s linear infinite;
        }
        .roof-main-line {
          animation: roofVisibility 32s infinite, drawRoofMain 32s linear infinite;
        }
        .roof-chimney-outline {
          animation: roofVisibility 32s infinite, drawRoofChimney 32s linear infinite;
        }
        .medical-left-arm {
          animation: medicalVisibility 32s infinite, drawMedicalLeft 32s linear infinite;
        }
        .medical-right-arm {
          animation: medicalVisibility 32s infinite, drawMedicalRight 32s linear infinite;
        }
        .globe-main-circle {
          animation: globeVisibility 32s infinite, drawGlobeCircle 32s linear infinite;
        }
        .globe-vertical-line {
          animation: globeVisibility 32s infinite, drawGlobeVertical 32s linear infinite;
        }
        .globe-horizontal-line {
          animation: globeVisibility 32s infinite, drawGlobeHorizontal 32s linear infinite;
        }
        .globe-top-latitude {
          animation: globeVisibility 32s infinite, drawGlobeTopLat 32s linear infinite;
        }
        .globe-bottom-latitude {
          animation: globeVisibility 32s infinite, drawGlobeBotLat 32s linear infinite;
        }
        .globe-right-longitude {
          animation: globeVisibility 32s infinite, drawGlobeRightLong 32s linear infinite;
        }
        .globe-left-longitude {
          animation: globeVisibility 32s infinite, drawGlobeLeftLong 32s linear infinite;
        }
        .hands-left-thumb-path {
          animation: handsVisibility 32s infinite, handsMovement 32s ease-out infinite, drawHandsLeftThumb 32s linear infinite;
        }
        .hands-left-fingers-path {
          animation: handsVisibility 32s infinite, handsMovement 32s ease-out infinite, drawHandsLeftFingers 32s linear infinite;
        }
        .hands-right-thumb-path {
          animation: handsVisibility 32s infinite, handsMovement 32s ease-out infinite, drawHandsRightThumb 32s linear infinite;
        }
        .hands-right-fingers-path {
          animation: handsVisibility 32s infinite, handsMovement 32s ease-out infinite, drawHandsRightFingers 32s linear infinite;
        }
        .community-center-body {
          animation: communityVisibility 32s infinite, drawCommunityCenter 32s linear infinite;
        }
        .community-center-head {
          animation: communityVisibility 32s infinite, drawCommunityCenterHead 32s linear infinite;
        }
        .community-left-body {
          animation: communityVisibility 32s infinite, drawCommunityLeft 32s linear infinite;
        }
        .community-left-head {
          animation: communityVisibility 32s infinite, drawCommunityLeftHead 32s linear infinite;
        }
        .community-right-body {
          animation: communityVisibility 32s infinite, drawCommunityRight 32s linear infinite;
        }
        .community-right-head {
          animation: communityVisibility 32s infinite, drawCommunityRightHead 32s linear infinite;
        }

        /* VISIBILITY KEYFRAMES */
        @keyframes heartVisibility {
          0% { opacity: 1; }
          10.9375% { opacity: 1; }
          12.5% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes roofVisibility {
          0% { opacity: 0; }
          6.25% { opacity: 0; }
          6.26% { opacity: 1; }
          42.1875% { opacity: 1; }
          43.75% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes medicalVisibility {
          0% { opacity: 0; }
          10.9375% { opacity: 0; }
          10.94% { opacity: 1; }
          23.4375% { opacity: 1; }
          25% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes globeVisibility {
          0% { opacity: 0; }
          23.4375% { opacity: 0; }
          23.44% { opacity: 1; }
          46.875% { opacity: 1; }
          53.125% { opacity: 0.7; }
          59.375% { opacity: 0.3; }
          62.5% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes handsVisibility {
          0% { opacity: 0; }
          31.25% { opacity: 0; }
          31.26% { opacity: 1; }
          75% { opacity: 1; }
          75.01% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes communityVisibility {
          0% { opacity: 0; }
          56.25% { opacity: 0; }
          56.26% { opacity: 1; }
          93.75% { opacity: 1; }
          93.76% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes handsMovement {
          0% { transform: translateY(0); }
          40.625% { transform: translateY(0); }
          62.5% { transform: translateY(-15px); }
          100% { transform: translateY(-15px); }
        }

        /* DRAWING KEYFRAMES */
        @keyframes drawHeartLeft {
          0% { stroke-dashoffset: 1000; }
          1.5625% { stroke-dashoffset: 1000; }
          6.25% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawHeartRight {
          0% { stroke-dashoffset: 1000; }
          3.75% { stroke-dashoffset: 1000; }
          6.875% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawRoofMain {
          0% { stroke-dashoffset: 1000; }
          7.5% { stroke-dashoffset: 1000; }
          11.25% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawRoofChimney {
          0% { stroke-dashoffset: 1000; }
          9.375% { stroke-dashoffset: 1000; }
          11.875% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawMedicalLeft {
          0% { stroke-dashoffset: 1000; }
          10.9375% { stroke-dashoffset: 1000; }
          15.625% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawMedicalRight {
          0% { stroke-dashoffset: 1000; }
          13.125% { stroke-dashoffset: 1000; }
          17.5% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawGlobeCircle {
          0% { stroke-dashoffset: 1000; }
          23.4375% { stroke-dashoffset: 1000; }
          29.6875% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawGlobeVertical {
          0% { stroke-dashoffset: 1000; }
          27.1875% { stroke-dashoffset: 1000; }
          29.6875% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawGlobeHorizontal {
          0% { stroke-dashoffset: 1000; }
          28.75% { stroke-dashoffset: 1000; }
          31.25% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawGlobeTopLat {
          0% { stroke-dashoffset: 1000; }
          30% { stroke-dashoffset: 1000; }
          31.875% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawGlobeBotLat {
          0% { stroke-dashoffset: 1000; }
          31.25% { stroke-dashoffset: 1000; }
          32.8125% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawGlobeRightLong {
          0% { stroke-dashoffset: 1000; }
          32.5% { stroke-dashoffset: 1000; }
          35% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawGlobeLeftLong {
          0% { stroke-dashoffset: 1000; }
          33.75% { stroke-dashoffset: 1000; }
          36.25% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawHandsLeftThumb {
          0% { stroke-dashoffset: 1000; }
          31.25% { stroke-dashoffset: 1000; }
          35.9375% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawHandsLeftFingers {
          0% { stroke-dashoffset: 1000; }
          33.125% { stroke-dashoffset: 1000; }
          36.875% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawHandsRightThumb {
          0% { stroke-dashoffset: 1000; }
          34.375% { stroke-dashoffset: 1000; }
          39.0625% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawHandsRightFingers {
          0% { stroke-dashoffset: 1000; }
          35.625% { stroke-dashoffset: 1000; }
          39.375% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawCommunityCenter {
          0% { stroke-dashoffset: 1000; }
          56.25% { stroke-dashoffset: 1000; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawCommunityCenterHead {
          0% { stroke-dashoffset: 1000; }
          57.8125% { stroke-dashoffset: 1000; }
          60.9375% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawCommunityLeft {
          0% { stroke-dashoffset: 1000; }
          59.375% { stroke-dashoffset: 1000; }
          62.5% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawCommunityLeftHead {
          0% { stroke-dashoffset: 1000; }
          60.9375% { stroke-dashoffset: 1000; }
          63.4375% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawCommunityRight {
          0% { stroke-dashoffset: 1000; }
          62.5% { stroke-dashoffset: 1000; }
          65.625% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes drawCommunityRightHead {
          0% { stroke-dashoffset: 1000; }
          64.0625% { stroke-dashoffset: 1000; }
          66.5625% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        /* Accessibility - Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .heart-section path,
          .roof-section polyline,
          .medical-section path,
          .globe-section circle,
          .globe-section line,
          .globe-section path,
          .hands-section path,
          .community-section path {
            animation: none;
            opacity: 0.3;
            stroke-dashoffset: 0;
          }
        }

        /* Mobile optimization */
        @media (max-width: 768px) {
          .main-canvas {
            opacity: 0.4;
            width: 90%;
            height: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default DesignForGoodAnimation;