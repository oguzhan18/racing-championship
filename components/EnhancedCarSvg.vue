<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="car-svg">
    <defs>
      <linearGradient :id="`bodyGradient-${uniqueId}`" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" :style="{ 'stop-color': darkenColor(color, 40), 'stop-opacity': 1 }" />
        <stop offset="30%" :style="{ 'stop-color': lightenColor(color, 10), 'stop-opacity': 1 }" />
        <stop offset="50%" :style="{ 'stop-color': color, 'stop-opacity': 1 }" />
        <stop offset="70%" :style="{ 'stop-color': lightenColor(color, 10), 'stop-opacity': 1 }" />
        <stop offset="100%" :style="{ 'stop-color': darkenColor(color, 40), 'stop-opacity': 1 }" />
      </linearGradient>

      <linearGradient :id="`metallic-${uniqueId}`" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color: rgba(255,255,255,0.7)" />
        <stop offset="50%" style="stop-color: rgba(255,255,255,0.2)" />
        <stop offset="100%" style="stop-color: rgba(255,255,255,0.1)" />
      </linearGradient>

      <filter :id="`glow-${uniqueId}`" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
        <feColorMatrix in="blur" type="matrix"
                       values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 15 -6"
                       result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <pattern :id="`carbon-${uniqueId}`" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#111" />
        <path d="M0 0L4 4M4 0L0 4" stroke="#222" stroke-width="0.5" />
      </pattern>
    </defs>

    <ellipse
        :cx="width * 0.5"
        :cy="height * 0.85"
        :rx="width * 0.35"
        :ry="height * 0.08"
        fill="rgba(0,0,0,0.25)"
        filter="blur(3px)"
    />

    <g class="car-body" :filter="`url(#glow-${uniqueId})`">
      <path
          :d="`
          M ${width * 0.2},${height * 0.3}
          L ${width * 0.15},${height * 0.7}
          L ${width * 0.85},${height * 0.7}
          L ${width * 0.8},${height * 0.3}
          Z
        `"
          :fill="`url(#bodyGradient-${uniqueId})`"
      />

      <path
          :d="`
          M ${width * 0.25},${height * 0.35}
          L ${width * 0.75},${height * 0.35}
          L ${width * 0.7},${height * 0.65}
          L ${width * 0.3},${height * 0.65}
          Z
        `"
          :fill="`url(#carbon-${uniqueId})`"
          fill-opacity="0.7"
      />

      <path
          :d="`
          M ${width * 0.1},${height * 0.65}
          L ${width * 0.9},${height * 0.65}
          L ${width * 0.85},${height * 0.7}
          L ${width * 0.15},${height * 0.7}
          Z
        `"
          :fill="darkenColor(color, 20)"
      />

      <path
          :d="`
          M ${width * 0.25},${height * 0.25}
          L ${width * 0.75},${height * 0.25}
          L ${width * 0.7},${height * 0.3}
          L ${width * 0.3},${height * 0.3}
          Z
        `"
          :fill="darkenColor(color, 20)"
      />

      <path
          :d="`
          M ${width * 0.48},${height * 0.25}
          L ${width * 0.52},${height * 0.25}
          L ${width * 0.52},${height * 0.7}
          L ${width * 0.48},${height * 0.7}
          Z
        `"
          fill="rgba(255,255,255,0.9)"
      />

      <path
          :d="`
          M ${width * 0.2},${height * 0.35}
          L ${width * 0.8},${height * 0.35}
          L ${width * 0.75},${height * 0.4}
          L ${width * 0.25},${height * 0.4}
          Z
        `"
          :fill="`url(#metallic-${uniqueId})`"
          opacity="0.4"
      />

      <g class="wheels">
        <g :transform="`translate(${width * 0.15}, ${height * 0.5})`">
          <rect width="8" height="16" fill="#1a1a1a" rx="2" />
          <rect x="2" y="2" width="4" height="12" fill="#333" rx="1" />
          <path d="M0 4L-8 4" stroke="#333" stroke-width="2" />
        </g>

        <g :transform="`translate(${width * 0.85}, ${height * 0.5})`">
          <rect x="-8" width="8" height="16" fill="#1a1a1a" rx="2" />
          <rect x="-6" y="2" width="4" height="12" fill="#333" rx="1" />
          <path d="M0 4L8 4" stroke="#333" stroke-width="2" />
        </g>

        <g :transform="`translate(${width * 0.2}, ${height * 0.3})`">
          <rect width="10" height="18" fill="#1a1a1a" rx="2" />
          <rect x="2" y="2" width="6" height="14" fill="#333" rx="1" />
          <path d="M0 4L-8 4" stroke="#333" stroke-width="2" />
        </g>

        <g :transform="`translate(${width * 0.8}, ${height * 0.3})`">
          <rect x="-10" width="10" height="18" fill="#1a1a1a" rx="2" />
          <rect x="-8" y="2" width="6" height="14" fill="#333" rx="1" />
          <path d="M0 4L8 4" stroke="#333" stroke-width="2" />
        </g>
      </g>

      <g v-if="showEffects" class="effects">
        <g class="motion-blur" opacity="0.6">
          <path
              :d="`
              M ${width * 0.1},${height * 0.4}
              L ${width * 0.15},${height * 0.6}
              L ${width * 0.05},${height * 0.6}
              L ${width * 0},${height * 0.4}
              Z
            `"
              :fill="color"
              opacity="0.3"
          >
            <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="0.5s"
                repeatCount="indefinite"
            />
          </path>
        </g>

        <g class="speed-lines">
          <line
              v-for="i in 3"
              :key="`line-${i}`"
              :x1="-width * 0.2"
              :y1="height * (0.3 + i * 0.15)"
              :x2="width * 0.1"
              :y2="height * (0.3 + i * 0.15)"
              :stroke="`url(#speedLines-${uniqueId})`"
              stroke-width="2"
              :style="{ 
              animation: `speedLine ${0.5 + i * 0.1}s infinite`,
              animationDelay: `${i * 0.1}s`
            }"
          />
        </g>

        <g class="particles">
          <circle
              v-for="i in 5"
              :key="`particle-${i}`"
              :cx="width * (0.2 + Math.random() * 0.6)"
              :cy="height * (0.3 + Math.random() * 0.4)"
              :r="2"
              :fill="lightenColor(color, 50)"
              :style="{
              animation: `particle ${1 + Math.random()}s infinite`,
              animationDelay: `${i * 0.2}s`
            }"
          />
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#ff0000'
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 60
    },
    showEffects: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uniqueId: `car-${Math.random().toString(36).substr(2, 9)}`
    }
  },
  methods: {
    darkenColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16)
      const amt = Math.round(2.55 * percent)
      const R = Math.max((num >> 16) - amt, 0)
      const G = Math.max((num >> 8 & 0x00FF) - amt, 0)
      const B = Math.max((num & 0x0000FF) - amt, 0)
      return '#' + (R * 0x10000 + G * 0x100 + B).toString(16).padStart(6, '0')
    },
    lightenColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16)
      const amt = Math.round(2.55 * percent)
      const R = Math.min((num >> 16) + amt, 255)
      const G = Math.min((num >> 8 & 0x00FF) + amt, 255)
      const B = Math.min((num & 0x0000FF) + amt, 255)
      return '#' + (R * 0x10000 + G * 0x100 + B).toString(16).padStart(6, '0')
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/components/enhanced-car-svg';
</style>