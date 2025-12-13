'use client'

import { useEffect, useRef } from 'react'

export default function ConstellationBackground() {
  const constellationRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<any>(null)

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      class CenteredConstellation {
        mainLayers: any[]
        clusters: any[]
        settings: any
        mouseMoveHandler: ((e: MouseEvent) => void) | null = null

        constructor() {
          // Main constellation layers
          this.mainLayers = [
            { name: 'back', selector: '.nodes-back', connections: '.connections-back', nodeCount: 6, depth: 0.1 },
            { name: 'mid', selector: '.nodes-mid', connections: '.connections-mid', nodeCount: 8, depth: 0.3 },
            { name: 'front', selector: '.nodes-front', connections: '.connections-front', nodeCount: 10, depth: 0.5 }
          ]

          // Edge breakaway clusters
          this.clusters = [
            { name: 'cluster-1', nodes: '.cluster-nodes-1', connections: '.cluster-connections-1', nodeCount: 4, size: 280 },
            { name: 'cluster-2', nodes: '.cluster-nodes-2', connections: '.cluster-connections-2', nodeCount: 3, size: 200 },
            { name: 'cluster-3', nodes: '.cluster-nodes-3', connections: '.cluster-connections-3', nodeCount: 5, size: 240 },
            { name: 'cluster-4', nodes: '.cluster-nodes-4', connections: '.cluster-connections-4', nodeCount: 3, size: 180 }
          ]

          this.settings = {
            parallaxEnabled: true,
            parallaxIntensity: 100,  // Increased from 60 to 100 for extreme movement
            mainOpacity: 0.8,
            clusterOpacity: 0.6,
            animSpeed: 1.0,
            nodeSize: 4,  // Reduced from 8 to 4 for smaller, subtler nodes
            clusterNodeSize: 3,  // Reduced from 5 to 3
            nodeColor: '#FF6B35',
            connectionDensity: 40,
            particleCount: 35,
            pulseSpeed: 3,
            floatSpeed: 60
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
        node.setAttribute('class', 'node')
        node.setAttribute('cx', String(x))
        node.setAttribute('cy', String(y))
        node.setAttribute('r', String(size))

        const delay = index * 0.3
        node.style.animation = `nodePulse ${this.settings.pulseSpeed}s ease-in-out infinite ${delay}s, nodeFloat ${this.settings.floatSpeed}s ease-in-out infinite ${delay * 2}s`

        return node
      }

      createConnection(node1: any, node2: any) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('class', 'connection-line')
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
        const container = document.getElementById('particles')
        if (!container) return

        container.innerHTML = ''

        for (let i = 0; i < this.settings.particleCount; i++) {
          const particle = document.createElement('div')
          particle.className = 'particle'

          const size = Math.random() * 3 + 1
          particle.style.width = size + 'px'
          particle.style.height = size + 'px'

          particle.style.left = Math.random() * 100 + '%'
          particle.style.top = Math.random() * 100 + '%'

          const duration = 30 + Math.random() * 20
          const delay = Math.random() * -30

          particle.style.animation = `particleFloat ${duration}s ease-in-out infinite ${delay}s`

          container.appendChild(particle)
        }
      }

      setupParallax() {
        const layers = document.querySelectorAll('.constellation-layer')
        const clusters = document.querySelectorAll('.cluster')

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

        document.querySelectorAll('.layer-front').forEach(layer => {
          ;(layer as HTMLElement).style.opacity = String(this.settings.mainOpacity)
        })

        document.querySelectorAll('.constellation-main .node').forEach(node => {
          node.setAttribute('fill', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`)
          node.setAttribute('stroke', color)
          node.setAttribute('stroke-width', '2')
          ;(node as HTMLElement).style.filter = `drop-shadow(0 0 6px ${color})`
        })

        document.querySelectorAll('.constellation-main .connection-line').forEach(line => {
          line.setAttribute('stroke', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`)
          line.setAttribute('stroke-width', '1.5')
          ;(line as HTMLElement).style.filter = `drop-shadow(0 0 3px ${color})`
        })
      }

      applyClusterStyles() {
        const color = this.settings.nodeColor
        const rgb = this.hexToRgb(color)

        document.querySelectorAll('.cluster').forEach(cluster => {
          ;(cluster as HTMLElement).style.opacity = String(this.settings.clusterOpacity)
        })

        document.querySelectorAll('.cluster .node').forEach(node => {
          node.setAttribute('fill', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`)
          node.setAttribute('stroke', color)
          node.setAttribute('stroke-width', '1.5')
          ;(node as HTMLElement).style.filter = `drop-shadow(0 0 4px ${color})`
        })

        document.querySelectorAll('.cluster .connection-line').forEach(line => {
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
      instanceRef.current = new CenteredConstellation()
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
      <div className="constellation-background" ref={constellationRef}>
        {/* Ambient glow orbs */}
        <div
          className="glow-orb"
          style={{
            width: '500px',
            height: '500px',
            background: '#FF6B35',
            top: '20%',
            left: '30%'
          }}
        />
        <div
          className="glow-orb"
          style={{
            width: '400px',
            height: '400px',
            background: '#FF8964',
            bottom: '20%',
            right: '20%',
            animationDelay: '-10s'
          }}
        />

        {/* Floating particles */}
        <div className="particles" id="particles"></div>

        {/* Main Center Constellation (3 layers) */}
        <div className="constellation-main">
          <div className="constellation-layer layer-back" data-depth="0.1">
            <svg className="constellation-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
              <g className="connections-back"></g>
              <g className="nodes-back"></g>
            </svg>
          </div>

          <div className="constellation-layer layer-mid" data-depth="0.3">
            <svg className="constellation-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
              <g className="connections-mid"></g>
              <g className="nodes-mid"></g>
            </svg>
          </div>

          <div className="constellation-layer layer-front" data-depth="0.5">
            <svg className="constellation-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
              <g className="connections-front"></g>
              <g className="nodes-front"></g>
            </svg>
          </div>
        </div>

        {/* Edge Breakaway Clusters */}
        <div className="cluster cluster-top-right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280">
            <g className="cluster-connections-1"></g>
            <g className="cluster-nodes-1"></g>
          </svg>
        </div>

        <div className="cluster cluster-mid-right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <g className="cluster-connections-2"></g>
            <g className="cluster-nodes-2"></g>
          </svg>
        </div>

        <div className="cluster cluster-bottom-left">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
            <g className="cluster-connections-3"></g>
            <g className="cluster-nodes-3"></g>
          </svg>
        </div>

        <div className="cluster cluster-bottom-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
            <g className="cluster-connections-4"></g>
            <g className="cluster-nodes-4"></g>
          </svg>
        </div>
      </div>

      {/* Constellation Styles */}
      <style jsx global>{`
        .constellation-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* Main Center Constellation */
        .constellation-main {
          position: absolute;
          top: 50%;
          left: 60%;
          transform: translate(-50%, -50%);
          width: 700px;
          height: 700px;
          pointer-events: none;
        }

        .constellation-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: transform 0.1s ease-out;
          will-change: transform;
        }

        /* Layer depth via blur and opacity */
        .layer-back {
          filter: blur(3px);
          opacity: 0.25;
          z-index: 1;
          animation: mainDriftBack 80s ease-in-out infinite;
        }

        .layer-mid {
          filter: blur(1px);
          opacity: 0.5;
          z-index: 2;
          animation: mainDriftMid 60s ease-in-out infinite;
        }

        .layer-front {
          filter: blur(0px);
          opacity: 0.8;
          z-index: 3;
          animation: mainDriftFront 45s ease-in-out infinite;
        }

        /* Main constellation animations - EXTREME movement */
        @keyframes mainDriftBack {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(60px, -50px) scale(1.08);
          }
          50% {
            transform: translate(-50px, 60px) scale(0.92);
          }
          75% {
            transform: translate(-60px, -55px) scale(1.04);
          }
        }

        @keyframes mainDriftMid {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotateZ(0deg);
          }
          33% {
            transform: translate(-55px, 48px) scale(1.06) rotateZ(5deg);
          }
          66% {
            transform: translate(48px, -40px) scale(0.94) rotateZ(-5deg);
          }
        }

        @keyframes mainDriftFront {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotateZ(0deg);
          }
          30% {
            transform: translate(40px, -55px) scale(1.03) rotateZ(-2.5deg);
          }
          60% {
            transform: translate(-48px, 45px) scale(0.97) rotateZ(2.5deg);
          }
        }

        /* Edge Breakaway Clusters */
        .cluster {
          position: absolute;
          pointer-events: none;
          opacity: 0.6;
        }

        .cluster svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        /* Top Right Cluster */
        .cluster-top-right {
          top: 8%;
          right: 12%;
          width: 280px;
          height: 280px;
          animation: clusterDrift1 50s ease-in-out infinite;
        }

        @keyframes clusterDrift1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-50px, 35px) scale(1.15);
          }
        }

        /* Mid Right Cluster */
        .cluster-mid-right {
          top: 45%;
          right: 5%;
          width: 200px;
          height: 200px;
          animation: clusterDrift2 45s ease-in-out infinite -10s;
        }

        @keyframes clusterDrift2 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotateZ(0deg);
          }
          50% {
            transform: translate(-35px, -40px) scale(0.85) rotateZ(6deg);
          }
        }

        /* Bottom Left Cluster */
        .cluster-bottom-left {
          bottom: 12%;
          left: 8%;
          width: 240px;
          height: 240px;
          animation: clusterDrift3 55s ease-in-out infinite -20s;
        }

        @keyframes clusterDrift3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, -28px) scale(1.08);
          }
        }

        /* Bottom Center Cluster (subtle) */
        .cluster-bottom-center {
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 180px;
          opacity: 0.4;
          animation: clusterDrift4 60s ease-in-out infinite -15s;
        }

        @keyframes clusterDrift4 {
          0%, 100% {
            transform: translateX(-50%) translate(0, 0) scale(1);
          }
          50% {
            transform: translateX(-50%) translate(28px, 35px) scale(0.92);
          }
        }

        /* SVG Styles */
        .constellation-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .node {
          transform-origin: center;
          transition: all 0.3s ease;
        }

        .connection-line {
          stroke-linecap: round;
          fill: none;
          transition: all 0.3s ease;
        }

        /* Node animations - EXTREME dramatic effect */
        @keyframes nodePulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(2);
          }
        }

        @keyframes nodeFloat {
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

        /* Floating particles throughout */
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(255, 107, 53, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.9;
          }
          50% {
            transform: translate(120px, -120px) scale(2);
          }
        }

        /* Ambient glow orbs - EXTREME dramatic movement */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          opacity: 0.18;
          animation: orbFloat 25s ease-in-out infinite;
        }

        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(240px, -120px) scale(1.5);
          }
          66% {
            transform: translate(-180px, 150px) scale(0.7);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .constellation-main {
            left: 50%;
            width: 500px;
            height: 500px;
          }

          .cluster-top-right {
            width: 180px;
            height: 180px;
            right: 5%;
          }

          .cluster-mid-right {
            width: 140px;
            height: 140px;
          }

          .cluster-bottom-left {
            width: 160px;
            height: 160px;
          }

          .cluster-bottom-center {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
