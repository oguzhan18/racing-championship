<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="title-container">
            <h2 class="neon-text primary">{{ selectedCar.name }}</h2>
            <span class="neon-text accent">TECHNICAL SPECS</span>
          </div>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>

        <div class="car-showcase">
          <div class="car-preview">
            <enhanced-car-svg
                :color="selectedCar.color"
                :width="400"
                :height="200"
                :show-effects="true"
            />
            <div class="preview-overlay">
              <div class="stat-badge">
                <span class="label">TOP SPEED</span>
                <span class="value">{{ selectedCar.speed }} km/h</span>
              </div>
            </div>
          </div>

          <div class="car-stats">
            <div class="stat-group">
              <h3 class="stat-title">Performance Metrics</h3>

              <div class="stat-item">
                <span class="stat-label">Acceleration</span>
                <div class="stat-bar-container">
                  <div
                      class="stat-bar"
                      :style="{ width: `${calculateAcceleration(selectedCar.speed)}%` }"
                  ></div>
                </div>
                <span class="stat-value">{{ calculateAcceleration(selectedCar.speed) / 10 }}s</span>
              </div>

              <div class="stat-item">
                <span class="stat-label">Handling</span>
                <div class="stat-bar-container">
                  <div
                      class="stat-bar"
                      :style="{ width: `${calculateHandling(selectedCar.speed)}%` }"
                  ></div>
                </div>
                <span class="stat-value">{{ calculateHandling(selectedCar.speed) }}/10</span>
              </div>

              <div class="stat-item">
                <span class="stat-label">Top Speed</span>
                <div class="stat-bar-container">
                  <div
                      class="stat-bar"
                      :style="{ width: `${(selectedCar.speed / 100) * 100}%` }"
                  ></div>
                </div>
                <span class="stat-value">{{ selectedCar.speed }} km/h</span>
              </div>
            </div>

            <div class="car-badges">
              <div class="badge">
                <span class="badge-value">{{ calculateRating(selectedCar.speed) }}</span>
                <span class="badge-label">RATING</span>
              </div>
              <div class="badge">
                <span class="badge-value">{{ calculateClass(selectedCar.speed) }}</span>
                <span class="badge-label">CLASS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import EnhancedCarSvg from './EnhancedCarSvg.vue'

export default {
  components: {
    EnhancedCarSvg
  },
  props: {
    show: Boolean,
    selectedCar: {
      type: Object,
      required: true
    }
  },
  methods: {
    calculateAcceleration(speed) {
      return Math.min((speed / 100) * 100, 100)
    },
    calculateHandling(speed) {
      return Math.min(Math.floor(speed / 10), 10) * 10
    },
    calculateRating(speed) {
      const rating = Math.floor((speed / 100) * 5)
      return 'S'.repeat(Math.min(rating, 1)) +
          'A'.repeat(Math.max(Math.min(rating - 1, 1), 0)) +
          'B'.repeat(Math.max(Math.min(rating - 2, 1), 0)) +
          'C'.repeat(Math.max(Math.min(rating - 3, 1), 0)) +
          'D'.repeat(Math.max(Math.min(rating - 4, 1), 0))
    },
    calculateClass(speed) {
      if (speed >= 90) return 'ELITE'
      if (speed >= 80) return 'PRO'
      if (speed >= 70) return 'EXPERT'
      if (speed >= 60) return 'ADVANCED'
      return 'ROOKIE'
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/components/car-modal';
</style>