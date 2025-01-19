<template>
  <div class="race-program" :class="{ 'hidden': !isRaceStarted }">
    <div v-if="!isRaceCompleted" class="program-header">
      <div class="header-content">
        <h2 class="title">Race Progress</h2>
        <div class="lap-info">
          <span class="current-lap">LAP {{ currentLap + 1 }}/{{ program.length }}</span>
          <span class="distance">{{ distances[currentLap] }}m</span>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${(currentLap + 1) / program.length * 100}%` }"></div>
        </div>
        <div class="progress-markers">
          <div v-for="(_, index) in program"
               :key="index"
               class="marker"
               :class="{ 'completed': index <= currentLap }">
          </div>
        </div>
      </div>
    </div>
    <div v-if="isRaceCompleted" class="race-completion-screen">
      <div class="trophy-animation">
        <div class="trophy-glow"></div>
        <div class="trophy-icon">🏆</div>
      </div>
      <div class="completion-header">
        <div class="title-container">
          <h1 class="completion-title">
            <span class="text-line">RACE</span>
            <span class="text-line">COMPLETE</span>
          </h1>
          <div class="title-decoration">
            <span class="line"></span>
            <span class="dot"></span>
            <span class="line"></span>
          </div>
        </div>
      </div>
      <div class="results-container">
        <div class="program-section">
          <div class="section-header">
            <h2>Race Program</h2>
            <div class="stats">
              <div class="stat-item">
                <span class="label">Total Distance</span>
                <span class="value">{{ distances[currentLap] }}m</span>
              </div>
              <div class="stat-item">
                <span class="label">Participants</span>
                <span class="value">{{ currentRace.length }}</span>
              </div>
            </div>
          </div>

          <div class="cars-grid">
            <div v-for="(car, index) in currentRace"
                 :key="car.id"
                 class="car-card"
                 :style="{ '--delay': `${index * 0.1}s` }">
              <div class="car-preview">
                <enhanced-car-svg
                    :color="car.color"
                    :width="80"
                    :height="40"
                    :show-effects="true"
                />
              </div>
              <div class="car-info">
                <div class="car-indicator" :style="{ backgroundColor: car.color }"></div>
                <div class="details">
                  <span class="name">{{ car.name }}</span>
                  <span class="speed">{{ Math.round(car.speed) }} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="results-section">
          <div class="section-header">
            <h2>Race Results</h2>
            <div class="stats">
              <div class="stat-item">
                <span class="label">Laps</span>
                <span class="value">{{ program.length }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Best Lap</span>
                <span class="value">{{ formatTime(getBestLapTime()) }}</span>
              </div>
            </div>
          </div>

          <div class="results-grid">
            <div v-for="(car, index) in getSortedResults"
                 :key="car.id"
                 class="result-card"
                 :class="{ 'winner': index === 0 }"
                 :style="{ '--delay': `${index * 0.1}s` }">

              <div class="position-indicator">
                <div class="position-number">{{ index + 1 }}</div>
                <div class="position-bar"
                     :style="{
                       width: `${100 - (index * 15)}%`,
                       backgroundColor: index === 0 ? '#FFD700' : car.color
                     }">
                </div>
              </div>

              <div class="result-content">
                <div class="car-details">
                  <enhanced-car-svg
                      :color="car.color"
                      :width="60"
                      :height="30"
                      :show-effects="index === 0"
                  />
                  <div class="info">
                    <span class="name">{{ car.name }}</span>
                    <span class="speed">{{ Math.round(car.speed) }} km/h</span>
                  </div>
                </div>

                <div class="lap-times">
                  <div class="times-grid">
                    <div v-for="(lapTime, lapIndex) in car.lapTimes"
                         :key="lapIndex"
                         class="lap-time"
                         :class="{ 'best-lap': isBestLapTime(lapTime) }">
                      <span class="lap-number">L{{ lapIndex + 1 }}</span>
                      <span class="time">{{ formatTime(lapTime) }}</span>
                    </div>
                  </div>
                  <div class="total-time">
                    <span class="label">Total</span>
                    <span class="time">{{ formatTime(car.totalTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="decorative-elements">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
        <div class="grid-pattern"></div>
      </div>
    </div>
    <div v-if="!isRaceCompleted" class="current-race">
      <div class="section-title">
        <h3>Current Race</h3>
        <div class="lap-status" :class="{ 'active': isRaceActive, 'completed': isRaceCompleted }">
          {{ getRaceStatus }}
        </div>
      </div>

      <transition-group name="car-list" tag="div" class="cars-list">
        <div v-for="(car, index) in getSortedCurrentLapCars"
             :key="car.id"
             class="car-card"
             :class="{ 'finished': isCarFinished(car, currentLap) }"
             :style="{ '--delay': `${index * 0.1}s` }">
          <div class="position">{{ index + 1 }}</div>
          <div class="car-content">
            <enhanced-car-svg
                :color="car.color"
                :width="60"
                :height="30"
                :show-effects="isRaceActive && !isCarFinished(car, currentLap)"
            />
            <div class="car-info">
              <div class="car-name">{{ car.name }}</div>
              <div class="car-speed">{{ Math.round(car.speed) }} km/h</div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div v-if="!isRaceCompleted" class="previous-laps">
      <h3 class="section-title">Previous Laps</h3>
      <div class="laps-grid">
        <div v-for="(lap, index) in getPreviousLaps"
             :key="index"
             class="previous-lap">
          <div class="lap-header">
            <span class="lap-title">LAP {{ index + 1 }}</span>
            <span class="lap-distance">{{ distances[index] }}m</span>
          </div>
          <div class="winner-info" v-if="results[index] && results[index].length > 0">
            <div class="winner-label">WINNER</div>
            <div class="winner-details">
              <div class="winner-car">
                <enhanced-car-svg
                    :color="results[index][0].color"
                    :width="40"
                    :height="20"
                    :show-effects="false"
                />
                <span>{{ results[index][0].name }}</span>
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
import confetti from 'canvas-confetti'

export default {
  components: {
    EnhancedCarSvg
  },
  props: {
    program: {
      type: Array,
      required: true
    },
    results: {
      type: Array,
      required: true
    },
    currentLap: {
      type: Number,
      default: 0
    },
    isRaceStarted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      distances: [1000, 1500, 2000, 2500, 3000],
      isRaceActive: false
    }
  },
  computed: {
    isRaceCompleted() {
      return this.currentLap >= this.program.length - 1 &&
          this.results[this.program.length - 1]?.length === this.program[this.program.length - 1]?.length
    },
    getRaceStatus() {
      if (this.isRaceCompleted) return 'COMPLETED'
      if (this.isRaceActive) return 'IN PROGRESS'
      return 'READY'
    },
    getSortedCurrentLapCars() {
      const cars = this.results[this.currentLap] || this.program[this.currentLap] || []
      return [...cars].sort((a, b) => {
        const aFinished = this.isCarFinished(a, this.currentLap)
        const bFinished = this.isCarFinished(b, this.currentLap)
        if (aFinished && bFinished) {
          return this.getFinishTime(a, this.currentLap) - this.getFinishTime(b, this.currentLap)
        }
        if (aFinished) return -1
        if (bFinished) return 1
        return 0
      })
    },
    getPreviousLaps() {
      return this.program.slice(0, this.currentLap)
    },
    getSortedResults() {
      if (!this.isRaceCompleted || !this.program[0]) return []
      return this.program[0].map(car => {
        const lapTimes = this.results.map(lapResult =>
            lapResult.find(result => result.id === car.id)?.finishTime || Infinity
        )
        const totalTime = lapTimes.reduce((sum, time) => sum + (time !== Infinity ? time : 0), 0)
        return { ...car, totalTime, lapTimes }
      }).sort((a, b) => a.totalTime - b.totalTime)
    },
    getFinalResults() {
      if (!this.isRaceCompleted || !this.program[0]) return []
      return this.program[0].map(car => {
        const lapTimes = this.results.map(lapResult =>
            lapResult.find(result => result.id === car.id)?.finishTime || Infinity
        )
        const totalTime = lapTimes.reduce((sum, time) => sum + (time !== Infinity ? time : 0), 0)
        const bestLapTime = Math.min(...lapTimes)
        return { ...car, totalTime, bestLapTime }
      }).sort((a, b) => a.totalTime - b.totalTime)
    },
    currentRace() {
      return this.program[this.currentLap] || []
    }
  },
  methods: {
    formatTime(time) {
      if (!time || time === Infinity) return '--:--'
      const minutes = Math.floor(time / 60000)
      const seconds = Math.floor((time % 60000) / 1000)
      const milliseconds = Math.floor((time % 1000) / 10)
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
    },
    isCarFinished(car, lapIndex) {
      return this.results[lapIndex]?.some(result => result.id === car.id)
    },
    getFinishTime(car, lapIndex) {
      return this.results[lapIndex]?.find(result => result.id === car.id)?.finishTime
    },
    triggerConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    },
    getBestLapTime() {
      return Math.min(...this.results.flatMap(lapResult =>
          lapResult.map(car => car.finishTime)
      ).filter(time => time && time !== Infinity));
    },
    isBestLapTime(time) {
      return time === this.getBestLapTime();
    }
  },
  watch: {
    isRaceStarted(newValue) {
      if (newValue) {
        this.isRaceActive = true
      }
    },
    isRaceCompleted(newValue) {
      if (newValue) {
        this.isRaceActive = false
        this.triggerConfetti()
      }
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/components/program-list';
</style>