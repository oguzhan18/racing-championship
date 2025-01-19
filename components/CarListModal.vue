<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="title">
            <span class="neon-text primary">AVAILABLE CARS</span>
            <span class="neon-text accent">{{ cars.length }} VEHICLES</span>
          </h2>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>

        <div class="cars-grid">
          <div
              v-for="car in cars"
              :key="car.id"
              class="car-card"
              @click="selectCar(car)"
          >
            <div class="car-preview">
              <enhanced-car-svg
                  :color="car.color"
                  :width="160"
                  :height="80"
                  :show-effects="true"
              />
            </div>
            <div class="car-info">
              <h3 class="car-name">{{ car.name }}</h3>
              <div class="car-stats">
                <div class="stat">
                  <span class="label">Speed</span>
                  <div class="stat-bar">
                    <div
                        class="stat-fill"
                        :style="{ width: `${car.speed}%` }"
                    ></div>
                  </div>
                </div>
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
    show: {
      type: Boolean,
      default: false
    },
    cars: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectCar(car) {
      this.$store.dispatch('selectCar', car)
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/components//_car-list-modal';
</style>