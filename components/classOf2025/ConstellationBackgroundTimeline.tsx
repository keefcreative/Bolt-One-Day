'use client'

import { useEffect, useRef } from 'react'

export default function ConstellationBackgroundTimeline() {
  const constellationRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<any>(null)

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      class TimelineConstellation {
        mainLayers: any[]
        clusters: any[]
        settings: any
        mouseMoveHandler: ((e: MouseEvent) => void) | null = null

        constructor() {
          // Reduced main constellation layers (60% of nodes)
          this.mainLayers = [
            { name: 'back', selector: '.timeline-nodes-back', connections: '.timeline-connections-back', nodeCount: 4, depth: 0.1 },
            { name: 'mid', selector: '.timeline-nodes-mid', connections: '.timeline-connections-mid', nodeCount: 5, depth: 0.3 },
            { name: 'front', selector: '.timeline-nodes-front', connections: '.timeline-connections-front', nodeCount: 6, depth: 0.5 }
          ]

          // Only 2 edge clusters instead of 4
          this.clusters = [
            { name: 'timeline-cluster-1', nodes: '.timeline-cluster-nodes-1', connections: '.timeline-cluster-connections-1', nodeCount: 3, size: 200 },
            { name: 'timeline-cluster-2', nodes: '.timeline-cluster-nodes-2', connections: '.timeline-cluster-connections-2', nodeCount: 3, size: 180 }
          ]

          this.settings = {
            parallaxEnabled: true,
            parallaxIntensity: 100,  // Keep same for consistent interactivity
            mainOpacity: 0.5,  // Reduced from 0.8 to 0.5 (50% opacity)
            clusterOpacity: 0.4,  // Reduced from 0.6 to 0.4
            animSpeed: 1.0,
            nodeSize: 4,
            clusterNodeSize: 3,
            nodeColor: '#FF6B35',
            connectionDensity: 40,
            particleCount: 20,  // Reduced from 35 to 20
            pulseSpeed: 4.2,  // Slower (was 3, now 40% slower)
            floatSpeed: 84  // Slower (was 60, now 40% slower)
          }

          this.init()
        }

        init() {
          this.createMainConstellation()
          this.createClusters()
          this.createParticles()
          this.mouseMoveHandler = this.setupParallax()
        }

      cleanup() {
        if (this.mouseMoveHandler) {
          document.removeEventListener('mousemove', this.mouseMoveHandler)
        }
      }

      createMainConstellation() {
        this.mainLayers.forEach(layer => {
          const nodesGroup = document.querySelector(layer.selector)
          const connectionsGroup = document.querySelector(layer.connections)

          if (!nodesGroup || !connectionsGroup) return

          nodesGroup.innerHTML = ''
          connectionsGroup.innerHTML = ''

          const nodes: any[] = []
          const centerX = 350
          const centerY = 350
          const spread = 200

          // Create nodes in organic pattern
          for (let i = 0; i < layer.nodeCount; i++) {
            const angle = (i / layer.nodeCount) * Math.PI * 2 + (i * 2.4)
            const distance = 0.3 + (i / layer.nodeCount) * 0.7

            const x = centerX + Math.cos(angle) * spread * distance + (Math.random() - 0.5) * 50
            const y = centerY + Math.sin(angle) * spread * distance + (Math.random() - 0.5) * 50

            const node = this.createNode(x, y, this.settings.nodeSize, i)
            nodesGroup.appendChild(node)
            nodes.push({ x, y })
          }

          // Create connections
          const maxDistance = spread * (this.settings.connectionDensity / 50)

          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const distance = this.getDistance(nodes[i], nodes[j])

              if (distance < maxDistance) {
                const line = this.createConnection(nodes[i], nodes[j])
                connectionsGroup.appendChild(line)
              }
            }
          }
        })

        this.applyMainStyles()
      }

      createClusters() {
        this.clusters.forEach(cluster => {
          const nodesGroup = document.querySelector(cluster.nodes)
          const connectionsGroup = document.querySelector(cluster.connections)

          if (!nodesGroup || !connectionsGroup) return

          nodesGroup.innerHTML = ''
          connectionsGroup.innerHTML = ''

          const nodes: any[] = []
          const centerX = cluster.size / 2
          const centerY = cluster.size / 2
          const spread = cluster.size * 0.3

          // Create smaller, more delicate nodes
          for (let i = 0; i < cluster.nodeCount; i++) {
            const angle = (i / cluster.nodeCount) * Math.PI * 2
            const distance = 0.4 + Math.random() * 0.5

            const x = centerX + Math.cos(angle) * spread * distance
            const y = centerY + Math.sin(angle) * spread * distance

            const node = this.createNode(x, y, this.settings.clusterNodeSize, i)
            nodesGroup.appendChild(node)
            nodes.push({ x, y })
          }

          // Create connections (fewer, more sparse)
          const maxDistance = spread * 1.2

          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const distance = this.getDistance(nodes[i], nodes[j])

              if (distance < maxDistance && Math.random() > 0.3) {
                const line = this.createConnection(nodes[i], nodes[j])
                connectionsGroup.appendChild(line)
              }
            }
          }
        })

        this.applyClusterStyles()
      }

      createNode(x: number, y: number, size: number, index: number) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        node.setAttribute('class', 'timeline-node')
        node.setAttribute('cx', String(x))
        node.setAttribute('cy', String(y))
        node.setAttribute('r', String(size))

        const delay = index * 0.3
        node.style.animation = `timelineNodePulse ${this.settings.pulseSpeed}s ease-in-out infinite ${delay}s, timelineNodeFloat ${this.settings.floatSpeed}s ease-in-out infinite ${delay * 2}s`

        return node
      }

      createConnection(node1: any, node2: any) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('class', 'timeline-connection-line')
        line.setAttribute('x1', String(node1.x))
        line.setAttribute('y1', String(node1.y))
        line.setAttribute('x2', String(node2.x))
        line.setAttribute('y2', String(node2.y))

        return line
      }

      getDistance(node1: any, node2: any) {
        const dx = node2.x - node1.x
        const dy = node2.y - node1.y
        return Math.sqrt(dx * dx + dy * dy)
      }

      createParticles() {
        const container = document.getElementById('timeline-particles')
        if (!container) return

        container.innerHTML = ''

        for (let i = 0; i < this.settings.particleCount; i++) {
          const particle = document.createElement('div')
          particle.className = 'timeline-particle'

          const size = Math.random() * 3 + 1
          particle.style.width = size + 'px'
          particle.style.height = size + 'px'

          particle.style.left = Math.random() * 100 + '%'
          particle.style.top = Math.random() * 100 + '%'

          const duration = 30 + Math.random() * 20
          const delay = Math.random() * -30

          particle.style.animation = `timelineParticleFloat ${duration}s ease-in-out infinite ${delay}s`

          container.appendChild(particle)
        }
      }

      setupParallax() {
        const layers = document.querySelectorAll('.timeline-constellation-layer')
        const clusters = document.querySelectorAll('.timeline-cluster')

        const handleMouseMove = (e: MouseEvent) => {
          if (!this.settings.parallaxEnabled) return

          const x = (e.clientX / window.innerWidth - 0.5) * 2
          const y = (e.clientY / window.innerHeight - 0.5) * 2

          // Main constellation parallax
          layers.forEach(layer => {
            const depth = parseFloat((layer as HTMLElement).dataset.depth || '0')
            const moveX = x * this.settings.parallaxIntensity * depth
            const moveY = y * this.settings.parallaxIntensity * depth

            ;(layer as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`
          })

          // Subtle parallax on clusters
          clusters.forEach((cluster, index) => {
            const depth = 0.15 + (index * 0.05)
            const moveX = x * this.settings.parallaxIntensity * depth * 0.5
            const moveY = y * this.settings.parallaxIntensity * depth * 0.5

            ;(cluster as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`
          })
        }

        document.addEventListener('mousemove', handleMouseMove)

        // Store the handler for cleanup
        return handleMouseMove
      }

      applyMainStyles() {
        const color = this.settings.nodeColor
        const rgb = this.hexToRgb(color)

        document.querySelectorAll('.timeline-layer-front').forEach(layer => {
          ;(layer as HTMLElement).style.opacity = String(this.settings.mainOpacity)
        })

        document.querySelectorAll('.timeline-constellation-main .timeline-node').forEach(node => {
          node.setAttribute('fill', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`)
          node.setAttribute('stroke', color)
          node.setAttribute('stroke-width', '2')
          ;(node as HTMLElement).style.filter = `drop-shadow(0 0 6px ${color})`
        })

        document.querySelectorAll('.timeline-constellation-main .timeline-connection-line').forEach(line => {
          line.setAttribute('stroke', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`)
          line.setAttribute('stroke-width', '1.5')
          ;(line as HTMLElement).style.filter = `drop-shadow(0 0 3px ${color})`
        })
      }

      applyClusterStyles() {
        const color = this.settings.nodeColor
        const rgb = this.hexToRgb(color)

        document.querySelectorAll('.timeline-cluster').forEach(cluster => {
          ;(cluster as HTMLElement).style.opacity = String(this.settings.clusterOpacity)
        })

        document.querySelectorAll('.timeline-cluster .timeline-node').forEach(node => {
          node.setAttribute('fill', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`)
          node.setAttribute('stroke', color)
          node.setAttribute('stroke-width', '1.5')
          ;(node as HTMLElement).style.filter = `drop-shadow(0 0 4px ${color})`
        })

        document.querySelectorAll('.timeline-cluster .timeline-connection-line').forEach(line => {
          line.setAttribute('stroke', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`)
          line.setAttribute('stroke-width', '1')
          ;(line as HTMLElement).style.filter = `drop-shadow(0 0 2px ${color})`
        })
      }

      hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 255, g: 107, b: 53 }
      }
    }

      // Initialize constellation
      instanceRef.current = new TimelineConstellation()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (instanceRef.current) {
        instanceRef.current.cleanup()
      }
    }
  }, [])

  return (
    <>
      <div className="timeline-constellation-background" ref={constellationRef}>
        {/* Ambient glow orbs - positioned on opposite sides to fill empty spaces */}
        <div
          className="timeline-glow-orb"
          style={{
            width: '450px',
            height: '450px',
            background: '#FF6B35',
            top: '25%',
            right: '5%'
          }}
        />
        <div
          className="timeline-glow-orb"
          style={{
            width: '400px',
            height: '400px',
            background: '#FF8964',
            top: '60%',
            left: '5%',
            animationDelay: '-10s'
          }}
        />

        {/* Floating particles */}
        <div className="timeline-particles" id="timeline-particles"></div>

        {/* Main Center Constellation (3 layers) */}
        <div className="timeline-constellation-main">
          <div className="timeline-constellation-layer timeline-layer-back" data-depth="0.1">
            <svg className="timeline-constellation-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
              <g className="timeline-connections-back"></g>
              <g className="timeline-nodes-back"></g>
            </svg>
          </div>

          <div className="timeline-constellation-layer timeline-layer-mid" data-depth="0.3">
            <svg className="timeline-constellation-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
              <g className="timeline-connections-mid"></g>
              <g className="timeline-nodes-mid"></g>
            </svg>
          </div>

          <div className="timeline-constellation-layer timeline-layer-front" data-depth="0.5">
            <svg className="timeline-constellation-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
              <g className="timeline-connections-front"></g>
              <g className="timeline-nodes-front"></g>
            </svg>
          </div>
        </div>

        {/* Only 2 Edge Clusters */}
        <div className="timeline-cluster timeline-cluster-top-left">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <g className="timeline-cluster-connections-1"></g>
            <g className="timeline-cluster-nodes-1"></g>
          </svg>
        </div>

        <div className="timeline-cluster timeline-cluster-bottom-right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
            <g className="timeline-cluster-connections-2"></g>
            <g className="timeline-cluster-nodes-2"></g>
          </svg>
        </div>
      </div>

      {/* Constellation Styles */}
      <style jsx global>{`
        .timeline-constellation-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* Main Center Constellation - subtle background layer */
        .timeline-constellation-main {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          pointer-events: none;
          opacity: 0.25;
        }

        .timeline-constellation-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: transform 0.1s ease-out;
          will-change: transform;
        }

        /* Layer depth via blur and opacity - reduced from hero */}
        .timeline-layer-back {
          filter: blur(3px);
          opacity: 0.2;
          z-index: 1;
          animation: timelineMainDriftBack 112s ease-in-out infinite;
        }

        .timeline-layer-mid {
          filter: blur(1px);
          opacity: 0.35;
          z-index: 2;
          animation: timelineMainDriftMid 84s ease-in-out infinite;
        }

        .timeline-layer-front {
          filter: blur(0px);
          opacity: 0.5;
          z-index: 3;
          animation: timelineMainDriftFront 63s ease-in-out infinite;
        }

        /* Main constellation animations - 30% reduced movement, 40% slower */
        @keyframes timelineMainDriftBack {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(42px, -35px) scale(1.056);
          }
          50% {
            transform: translate(-35px, 42px) scale(0.944);
          }
          75% {
            transform: translate(-42px, -38.5px) scale(1.028);
          }
        }

        @keyframes timelineMainDriftMid {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotateZ(0deg);
          }
          33% {
            transform: translate(-38.5px, 33.6px) scale(1.042) rotateZ(3.5deg);
          }
          66% {
            transform: translate(33.6px, -28px) scale(0.958) rotateZ(-3.5deg);
          }
        }

        @keyframes timelineMainDriftFront {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotateZ(0deg);
          }
          30% {
            transform: translate(28px, -38.5px) scale(1.021) rotateZ(-1.75deg);
          }
          60% {
            transform: translate(-33.6px, 31.5px) scale(0.979) rotateZ(1.75deg);
          }
        }

        /* Edge Clusters */
        .timeline-cluster {
          position: absolute;
          pointer-events: none;
          opacity: 0.7;
        }

        .timeline-cluster svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        /* Top Right Cluster - fills space when cards are LEFT */
        .timeline-cluster-top-left {
          top: 20%;
          right: 5%;
          width: 280px;
          height: 280px;
          animation: timelineClusterDrift1 70s ease-in-out infinite;
        }

        @keyframes timelineClusterDrift1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(35px, 24.5px) scale(1.105);
          }
        }

        /* Bottom Left Cluster - fills space when cards are RIGHT */
        .timeline-cluster-bottom-right {
          top: 60%;
          left: 5%;
          width: 260px;
          height: 260px;
          animation: timelineClusterDrift2 63s ease-in-out infinite -10s;
        }

        @keyframes timelineClusterDrift2 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotateZ(0deg);
          }
          50% {
            transform: translate(-24.5px, 28px) scale(0.895) rotateZ(4.2deg);
          }
        }

        /* SVG Styles */
        .timeline-constellation-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .timeline-node {
          transform-origin: center;
          transition: all 0.3s ease;
        }

        .timeline-connection-line {
          stroke-linecap: round;
          fill: none;
          transition: all 0.3s ease;
        }

        /* Node animations - same as hero */
        @keyframes timelineNodePulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(2);
          }
        }

        @keyframes timelineNodeFloat {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(24px, -24px);
          }
          50% {
            transform: translate(-12px, 24px);
          }
          75% {
            transform: translate(-24px, -12px);
          }
        }

        /* Floating particles */
        .timeline-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .timeline-particle {
          position: absolute;
          background: radial-gradient(circle, rgba(255, 107, 53, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        @keyframes timelineParticleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          50% {
            transform: translate(120px, -120px) scale(2);
          }
        }

        /* Ambient glow orbs - reduced opacity */
        .timeline-glow-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          opacity: 0.1;
          animation: timelineOrbFloat 35s ease-in-out infinite;
        }

        @keyframes timelineOrbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(168px, -84px) scale(1.35);
          }
          66% {
            transform: translate(-126px, 105px) scale(0.77);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .timeline-constellation-main {
            width: 350px;
            height: 350px;
            opacity: 0.2;
          }

          .timeline-cluster-top-left {
            width: 180px;
            height: 180px;
            right: 2%;
            top: 15%;
          }

          .timeline-cluster-bottom-right {
            width: 160px;
            height: 160px;
            left: 2%;
            top: 65%;
          }
        }
      `}</style>
    </>
  )
}
