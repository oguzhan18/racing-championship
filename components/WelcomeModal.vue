<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="racing-bg-effects">
          <div class="speed-lines"></div>
          <div class="grid-overlay"></div>
          <div class="glow-orbs"></div>
        </div>
        <div class="racing-container">
          <div class="racing-header">
            <div class="logo-container">
              <h1 class="racing-logo">
                <span class="logo-text primary">RACING</span>
                <span class="logo-text accent">CHAMPIONSHIP</span>
              </h1>
              <div class="logo-accent">
                <span class="line"></span>
                <span class="dot"></span>
                <span class="line"></span>
              </div>
            </div>
          </div>
          <div class="racing-grid">
            <div class="racing-panel features">
              <div class="panel-header">
                <div class="icon-badge">
                  <span class="icon">🏎</span>
                </div>
                <h2>Race Features</h2>
              </div>
              <div class="panel-content">
                <div class="feature-list">
                  <div class="feature-item" v-for="(feature, index) in features" :key="index">
                    <div class="feature-icon">
                      <span class="hex-bg"></span>
                      <span class="icon">{{ feature.icon }}</span>
                    </div>
                    <div class="feature-text">{{ feature.text }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="racing-panel stats">
              <div class="panel-header">
                <div class="icon-badge">
                  <span class="icon">⚡</span>
                </div>
                <h2>Performance</h2>
              </div>
              <div class="panel-content">
                <div class="stats-grid">
                  <div class="stat-item" v-for="(stat, index) in stats" :key="index">
                    <div class="stat-header">
                      <span class="stat-icon">{{ stat.icon }}</span>
                      <span class="stat-label">{{ stat.label }}</span>
                    </div>
                    <div class="stat-bar-container">
                      <div class="stat-bar">
                        <div class="stat-fill" :style="{ width: stat.value + '%' }"></div>
                      </div>
                      <span class="stat-value">{{ stat.value }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="racing-panel guide">
              <div class="panel-header">
                <div class="icon-badge">
                  <span class="icon">🎮</span>
                </div>
                <h2>Quick Start</h2>
              </div>
              <div class="panel-content">
                <div class="step-list">
                  <div class="step-item" v-for="(step, index) in steps" :key="index">
                    <div class="step-number">{{ index + 1 }}</div>
                    <div class="step-info">
                      <h3>{{ step.title }}</h3>
                      <p>{{ step.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="racing-footer">
            <button class="start-button" @click="closeModal">
              <span class="button-bg"></span>
              <span class="button-text">START ENGINE</span>
              <span class="button-shine"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'WelcomeModal',
  data() {
    return {
      features: [
        {icon: '🏁', text: '5 High-Stakes Championship Races'},
        {icon: '🚗', text: '12 Elite Racing Machines'},
        {icon: '⚡', text: 'Dynamic Boost Zones'},
        {icon: '🎯', text: 'Precision Overtaking System'},
        {icon: '📊', text: 'Real-time Performance Analytics'}
      ],
      stats: [
        {icon: '⚡', label: 'Acceleration', value: 92},
        {icon: '🎯', label: 'Handling', value: 88},
        {icon: '💨', label: 'Top Speed', value: 95}
      ],
      steps: [
        {
          title: 'Create Race',
          desc: 'Set up your championship series'
        },
        {
          title: 'Select Vehicle',
          desc: 'Choose your perfect racing machine'
        },
        {
          title: 'Race Start',
          desc: 'Begin your journey to victory'
        }
      ]
    }
  },
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/components/_welcome-modal.scss';
</style>