<template>
  <div class="race-track-wrapper">
    <div class="race-track-container">
      <div v-if="showCountdown" class="countdown-overlay">
        <div class="countdown-number">{{ countdownNumber }}</div>
      </div>
      <div class="track">
        <div class="track-effects">
          <div class="track-glow"></div>
          <div class="track-grid"></div>
          <div class="track-lines"></div>
        </div>
        <div class="lanes">
          <div v-for="i in 6" :key="`lane-${i}`" class="lane" :style="{
            left: `${(i - 1) * (100 / 6)}%`,
            width: `${100 / 6}%`
          }">
            <div class="lane-line"></div>
            <div class="lane-number">{{ i }}</div>
            <div class="lane-glow"></div>
          </div>
        </div>
        <div class="distance-markers">
          <div v-for="(distance, index) in getDistanceMarkers()" :key="distance" class="distance-marker"
               :style="{ bottom: `${(index / 4) * 100}%` }">
            <span class="marker-line"></span>
            <span class="marker-text">{{ distance }}m</span>
          </div>
        </div>
        <div class="race-markers">
          <div class="finish-line">
            <div class="line-pattern"></div>
            <div class="line-glow"></div>
            <span class="line-text">FINISH {{ getLapDistance(currentLap) }}m</span>
          </div>

          <div class="start-line">
            <div class="line-pattern"></div>
            <div class="line-glow"></div>
            <span class="line-text">START 0m</span>
          </div>
        </div>
        <div class="cars-container">
          <div v-for="(car, index) in currentRace" :key="car.id" class="car-wrapper" :class="{
            'racing': isRaceActive,
            'overtaking': carStates[index]?.isOvertaking,
            'boosting': carStates[index]?.isBoosting,
            'finishing': carStates[index]?.isFinishing,
            'ready': showCountdown
          }" :style="getCarPositionStyle(index)">
            <div class="car-body">
              <enhanced-car-svg :color="car.color" :width="80" :height="120" :show-effects="true"/>
              <div class="racing-effects" v-if="isRaceActive">
                <div class="speed-lines">
                  <div v-for="n in 5" :key="n" class="line"></div>
                </div>
                <div class="boost-particles" v-if="carStates[index]?.isBoosting">
                  <div v-for="n in 8" :key="n" class="particle"></div>
                </div>
              </div>
              <div class="car-info" :class="{ 'is-leader': isLeader(index) }">
                <div class="position">{{ getPosition(index) }}</div>
                <div class="details">
                  <span class="name">{{ car.name }}</span>
                  <span class="speed">{{ getCarSpeed(car, index) }} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EnhancedCarSvg from './EnhancedCarSvg.vue'

export default {
  name: 'RaceTrack',
  components: {
    EnhancedCarSvg
  },
  props: {
    currentRace: {
      type: Array,
      default: () => []
    },
    currentLap: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      progress: [],
      positions: [],
      carStates: [],
      carSpeeds: [],
      isRaceActive: false,
      showCountdown: false,
      countdownNumber: 3,
      raceTimer: null,
      updateInterval: null,
      trackConfig: {
        laneCount: 6,
        startArea: {
          width: 20,
          offset: 15
        },
        laneWidth: 16.66,
        carSpacing: {
          initial: 5,
          racing: 15
        },
        finishLine: 85
      },
      finishTimes: [],
    }
  },
  methods: {
    getCarPositionStyle(index) {
      const {laneWidth} = this.trackConfig
      const laneIndex = index % this.trackConfig.laneCount
      const horizontalPos = (laneIndex * laneWidth) + (laneWidth / 2) - 4

      if (!this.isRaceActive) {
        return {
          transform: `translate3d(${horizontalPos}%, calc(95% + 80px), 0)`,
          left: `${(index % 6) * 120}px`,
          zIndex: this.currentRace.length - index,
        }
      }

      const progress = this.progress[index] || 0
      const verticalRange = 95;
      let verticalPos
      if (progress >= 99.5) {
        const extraDistance = (progress - 99.5) * 12;
        verticalPos = Math.max(-600, -232 - extraDistance);
      } else {
        verticalPos = 95 - (verticalRange * this.easeInOutQuad(progress / 100)) - 80
      }
      if (progress >= 99.5 && !this.finishTimes[index]) {
        this.finishTimes[index] = Date.now()
        this.carStates[index].isFinishing = true
      }
      const minSpacing = 15
      const carsInSameLane = this.positions.filter((pos, i) =>
          i !== index && (i % this.trackConfig.laneCount) === laneIndex
      )

      for (const otherIndex of carsInSameLane) {
        const otherPos = verticalRange - (verticalRange * this.easeInOutQuad(this.progress[otherIndex] / 100)) - 80
        if (Math.abs(verticalPos - otherPos) < minSpacing) {
          verticalPos = otherPos + minSpacing
        }
      }

      const randomOffset = this.carStates[index]?.lateralOffset || 0
      const boostOffset = this.carStates[index]?.isBoosting ? 2 : 0

      return {
        transform: `translate3d(${horizontalPos + randomOffset}%, calc(${verticalPos}% + 80px), ${boostOffset}px)`,
        left: `${(index % 6) * 120}px`,
        zIndex: this.getCarZIndex(index)
      }
    },
    getLapDistance(lap) {
      const lapDistances = [1000, 1500, 2000, 2500, 3000]
      return lapDistances[lap - 1] || 1000
    },
    getCarZIndex(index) {
      let zIndex = this.isRaceActive ? this.positions[index] : index
      if (this.carStates[index]?.isOvertaking) zIndex += 100
      return 10 - zIndex
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    getPosition(index) {
      return (this.positions[index] || index) + 1
    },
    getCarSpeed(car, index) {
      return Math.floor(this.carSpeeds[index] || car.speed)
    },
    isLeader(index) {
      return this.positions[index] === 0;
    },
    startCountdown() {
      this.showCountdown = true
      this.countdownNumber = 3

      const countdownInterval = setInterval(() => {
        this.countdownNumber--
        if (this.countdownNumber === 0) {
          clearInterval(countdownInterval)
          setTimeout(() => {
            this.showCountdown = false
            this.startRace()
          }, 1000)
        }
      }, 1000)
    },
    initializeRace() {
      const carsCount = this.currentRace.length
      this.progress = new Array(carsCount).fill(0)
      this.positions = Array.from({length: carsCount}, (_, i) => i)
      this.carStates = new Array(carsCount).fill(null).map(() => ({
        isOvertaking: false,
        isBoosting: false,
        isFinishing: false,
        lateralOffset: 0
      }))
      this.carSpeeds = this.currentRace.map(car => car.speed)

      this.finishTimes = new Array(carsCount).fill(null);
      this.startCountdown()
    },
    startRace() {
      this.isRaceActive = true
      this.updateInterval = setInterval(this.updateRace, 50)
      this.raceTimer = setInterval(() => {
        this.checkRaceProgress()
      }, 100)
    },
    updateRace() {
      if (!this.isRaceActive) return

      const newProgress = this.progress.map((p, i) => {
        if (p >= 99.5) return 100

        const car = this.currentRace[i]
        const baseSpeed = car.speed / 1000
        const boostFactor = this.carStates[i].isBoosting ? 1.5 : 1
        const randomFactor = 1 + (Math.random() * 0.2 - 0.1)

        const targetSpeed = car.speed + (Math.random() * 20 - 10)
        this.carSpeeds[i] = this.carSpeeds[i] || car.speed
        this.carSpeeds[i] += (targetSpeed - this.carSpeeds[i]) * 0.1
        return Math.min(p + (baseSpeed * boostFactor * randomFactor), 100)
      })

      this.progress = newProgress
      this.updatePositions()
      this.tryOvertakes()
    },
    updatePositions() {
      const sortedIndices = this.progress
          .map((p, i) => ({progress: p, index: i}))
          .sort((a, b) => b.progress - a.progress)
          .map(item => item.index)

      this.positions = sortedIndices.reduce((pos, index, i) => {
        pos[index] = i
        return pos
      }, [])
    },
    tryOvertakes() {
      this.positions.forEach((pos, index) => {
        if (pos === 0 || this.carStates[index].isOvertaking) return

        const canOvertake = Math.random() > 0.92
        if (canOvertake) {
          this.initiateOvertake(index)
        }
      })
    },
    initiateOvertake(index) {
      const state = this.carStates[index]
      state.isOvertaking = true
      state.isBoosting = true
      state.lateralOffset = -5

      setTimeout(() => {
        state.lateralOffset = 0
        state.isOvertaking = false
        state.isBoosting = false
      }, 1500)
    },
    checkRaceProgress() {
      this.progress.forEach((p, index) => {
        if (p >= 99.5 && !this.finishTimes[index]) {
          this.finishTimes[index] = Date.now()
          this.carStates[index].isFinishing = true
        }
      })
      const allCarsFinished = this.progress.every(p => p >= 99.5)
      if (allCarsFinished) {
        this.finishRace()
      }
    },
    finishRace() {
      clearInterval(this.updateInterval)
      clearInterval(this.raceTimer)
      this.isRaceActive = false
      const results = this.currentRace.map((car, index) => ({
        ...car,
        finishTime: this.finishTimes[index]
      }));
      const sortedResults = results.sort((a, b) => a.finishTime - b.finishTime);
      this.$emit('lap-finished', sortedResults)
      this.progress = new Array(this.currentRace.length).fill(0)
      this.finishTimes = new Array(this.currentRace.length).fill(null)

      setTimeout(() => {
        if (this.currentLap < 4) {
          this.$emit('next-lap')
        }
      }, 7000)
    },
    getDistanceMarkers() {
      const totalDistance = this.getLapDistance(this.currentLap)
      const markerCount = 5
      const markers = []

      for (let i = 0; i < markerCount; i++) {
        markers.push(Math.floor((totalDistance / (markerCount - 1)) * i))
      }

      return markers
    }
  },
  watch: {
    currentRace: {
      immediate: true,
      handler(newRace) {
        if (newRace && newRace.length) {
          this.initializeRace()
        }
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.updateInterval)
    clearInterval(this.raceTimer)
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/components/race-track';
</style>