<template>
  <svg :width="width" :height="height" viewBox="0 0 240 100" :style="{ transform: flipped ? 'scaleX(-1)' : 'none' }">
    <g :fill="color">
      <path d="M40,65 L200,65 C215,65 220,55 220,45 L220,40 C220,30 215,20 200,20 L180,20 L170,10 L70,10 L60,20 L40,20 C25,20 20,30 20,40 L20,45 C20,55 25,65 40,65 Z" />
      <path d="M170,10 L180,20 L200,20 C215,20 220,30 220,40 L222,40 C222,25 215,18 200,18 L182,18 L172,8 L170,10 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M80,20 L160,20 L150,35 L90,35 Z" fill="rgba(200,200,255,0.3)" />
      <path d="M40,45 L200,45 L200,50 L40,50 Z" fill="rgba(0,0,0,0.3)" />
    </g>
    <g>
      <circle cx="180" cy="65" r="20" fill="#222" />
      <circle cx="180" cy="65" r="15" fill="#444" />
      <circle cx="180" cy="65" r="10" fill="#666" />
      <circle cx="180" cy="65" r="5" fill="#888" />
      <circle cx="60" cy="65" r="20" fill="#222" />
      <circle cx="60" cy="65" r="15" fill="#444" />
      <circle cx="60" cy="65" r="10" fill="#666" />
      <circle cx="60" cy="65" r="5" fill="#888" />
    </g>
    <path
      :d="'M40,67 L200,67 C215,67 222,57 222,47 L222,42 C222,32 215,22 200,22 L180,22 L170,12 L70,12 L60,22 L40,22 C25,22 18,32 18,42 L18,47 C18,57 25,67 40,67 Z'"
      :stroke="neonColor"
      fill="none"
      stroke-width="2"
      style="filter: drop-shadow(0 0 3px currentColor);"
    />
    <g v-if="isMoving" style="opacity: 0.6">
      <line
        v-for="(_, i) in 5"
        :key="i"
        :x1="10 - (i * 10)"
        :y1="30 + (i * 5)"
        :x2="30 - (i * 10)"
        :y2="30 + (i * 5)"
        :stroke="neonColor"
        stroke-width="2"
      >
        <animate
          attributeName="opacity"
          values="0;1;0"
          :dur="`${0.5 + (i * 0.1)}s`"
          repeatCount="indefinite"
        />
      </line>
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
      default: 120
    },
    height: {
      type: Number,
      default: 50
    },
    isMoving: {
      type: Boolean,
      default: true
    },
    flipped: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    neonColor() {
      return this.color.replace(')', ', 0.8)')
                      .replace('rgb', 'rgba')
    }
  }
}
</script>

<style scoped>
svg {
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));
  transition: transform 0.3s ease;
}
</style>
