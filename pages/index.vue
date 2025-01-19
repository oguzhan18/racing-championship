<template>
  <div class="game-container">
    <AudioPlayer />
    <div class="background-grid"></div>
    <div class="background-particles"></div>
    <div class="game-content">
      <header class="game-header">
        <div class="logo">
          <h1 class="title">
            <span class="neon-text primary">RACING</span>
            <span class="neon-text accent">CHAMPIONSHIP</span>
          </h1>
        </div>
        <div class="control-panel">
          <button
            class="cyber-button"
            @click="showCarList"
            @mouseover="playSound('hover')"
            :disabled="!isCarListEnabled"
          >
            <span class="cyber-button__text">CAR LIST</span>
            <span class="cyber-button__glitch"></span>
          </button>

          <button
            class="cyber-button"
            @click="createRace"
            @mouseover="playSound('hover')"
            :disabled="isRaceCreated"
          >
            <span class="cyber-button__text">CREATE RACE</span>
            <span class="cyber-button__glitch"></span>
          </button>

          <button
            class="cyber-button success"
            @click="startRace"
            @mouseover="playSound('hover')"
            :disabled="!isRaceCreated || isRaceStarted"
          >
            <span class="cyber-button__text">START RACE</span>
            <span class="cyber-button__glitch"></span>
          </button>
        </div>
      </header>
      <main class="game-grid">
        <div class="race-track-section" :class="{ 'hidden': !showRaceTrack }">
          <transition name="fade">
            <race-track
              v-if="isRaceStarted && showRaceTrack"
              :current-race="getCurrentRace"
              :current-lap="currentLap"
              @lap-finished="onLapFinished"
              @next-lap="onNextLap"
            />
            <div v-else class="start-prompt">
              <div class="prompt-content">
                <div class="prompt-icon">🏎</div>
                <h2>Ready to Race?</h2>
                <p>Create a new race and press Start to begin!</p>
                <div class="decoration-lines">
                  <div class="line"></div>
                  <div class="line"></div>
                  <div class="line"></div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <program-list
          :program="raceProgram"
          :results="raceResults"
          :current-lap="currentLap"
          :is-race-started="isRaceStarted"
        />
      </main>
    </div>
    <welcome-modal
      :show="showWelcomeModal"
      @close="closeWelcomeModal"
    />

    <car-list-modal
      :show="showCarListModal"
      :cars="cars"
      @close="closeCarListModal"
    />

    <car-modal
      v-if="selectedCar"
      :show="!!selectedCar"
      :selected-car="selectedCar"
      @close="closeCarModal"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import RaceTrack from '../components/RaceTrack.vue'
import ProgramList from '../components/ProgramList.vue'
import CarModal from '../components/CarModal.vue'
import CarListModal from '../components/CarListModal.vue'
import WelcomeModal from '../components/WelcomeModal.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import SoundService from '../services/sound'

export default {
  components: {
    RaceTrack,
    ProgramList,
    CarModal,
    CarListModal,
    WelcomeModal,
    AudioPlayer
  },
  data() {
    return {
      showCarListModal: false,
      showWelcomeModal: true,
      showRaceTrack: true,
    }
  },
  computed: {
    ...mapState([
      'cars',
      'raceProgram',
      'raceResults',
      'currentLap',
      'isRaceCreated',
      'isRaceStarted',
      'selectedCar'
    ]),
    ...mapGetters([
      'getCurrentRace',
      'isCarListEnabled'
    ])
  },
  methods: {
    async requestFullscreen() {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen()
        }
      } catch (error) {
        console.log('Fullscreen request failed:', error)
      }
    },
    playSound(soundName) {
      SoundService.play(soundName)
    },
    createRace() {
      this.playSound('click')
      this.$store.dispatch('createRace')
      const raceTrack = document.querySelector('.race-track-section')
      raceTrack.classList.add('creating-race')
      setTimeout(() => {
        raceTrack.classList.remove('creating-race')
      }, 1000)
    },
    startRace() {
      this.playSound('start')
      this.$store.dispatch('startRace')
    },
    onLapFinished(results) {
      this.$store.commit('addRaceResult', results)
      if (this.currentLap === this.raceProgram.length - 1) {
        setTimeout(() => {
          this.showRaceTrack = false
        }, 2000)
      }
    },
    onNextLap() {
      this.$store.dispatch('nextLap')
    },
    showCarList() {
      this.playSound('click')
      this.showCarListModal = true
    },
    closeCarListModal() {
      this.showCarListModal = false
    },
    closeCarModal() {
      this.$store.dispatch('selectCar', null)
    },
    closeWelcomeModal() {
      this.showWelcomeModal = false
      SoundService.startBackgroundMusic()
      this.requestFullscreen()
    }
  },
  mounted() {
    //this.requestFullscreen()
  },
}
</script>

<style lang="scss">
@use '../assets/scss/main';
@use '../assets/scss/variables' as *;

.game-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-grid {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 255, 136, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: top;
  animation: gridMove 20s linear infinite;
  opacity: 0.2;
}

.background-particles {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background-image: radial-gradient(
      circle,
      rgba(0, 255, 136, 0.1) 1px,
      transparent 1px
    );
    background-size: 50px 50px;
    animation: particleMove 15s linear infinite;
  }
}

.game-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: calc(100vh - 120px);
  padding: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    flex-direction: row;

    .race-track-section {
      flex: 1;
    }

    .program-list {
      width: 400px;
    }
  }
}

.start-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .prompt-content {
    text-align: center;
    position: relative;
    padding: 2rem;

    .prompt-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: float 3s ease-in-out infinite;
    }

    h2 {
      color: #0f0;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }

    p {
      color: #0ff;
      font-size: 1.2rem;
    }

    .decoration-lines {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120%;
      height: 120%;
      z-index: -1;

      .line {
        position: absolute;
        background: rgba(0, 255, 136, 0.1);
        border-radius: 2px;

        &:nth-child(1) {
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          transform: rotate(15deg);
        }

        &:nth-child(2) {
          top: 0;
          left: 0;
          width: 2px;
          height: 100%;
          transform: rotate(-15deg);
        }

        &:nth-child(3) {
          bottom: 0;
          right: 0;
          width: 100%;
          height: 2px;
          transform: rotate(-15deg);
        }
      }
    }
  }
}

.race-track-section {
  height: 60vh;
  background: rgba(0, 13, 26, 0.8);
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 136, 0.2);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  @media (min-width: 1024px) {
    height: calc(100vh - 160px);
  }

  &.creating-race {
    animation: createRaceEffect 1s ease-out;
  }
  
  &.hidden {
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes gridMove {
  from { transform: perspective(500px) rotateX(60deg) translateY(0); }
  to { transform: perspective(500px) rotateX(60deg) translateY(50px); }
}

@keyframes particleMove {
  from { transform: translateY(0); }
  to { transform: translateY(50%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes createRaceEffect {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.02);
    filter: brightness(1.5);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

@media (max-width: 1023px) {
  .game-header {
    flex-direction: column;
    align-items: center;
    padding: 1rem;

    .logo {
      margin-bottom: 1rem;
    }

    .control-panel {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }
  }

  .game-grid {
    padding: 1rem;
  }
}

@media (max-width: 767px) {
  .game-header {
    .logo {
      .title {
        font-size: 1.5rem;
      }
    }
  }

  .start-prompt {
    .prompt-content {
      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }
  }
}
</style>