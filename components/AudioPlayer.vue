<template>
  <div class="audio-controls">
    <button
        class="audio-button"
        @click="handleClick"
        :class="{ 'is-playing': isPlaying }"
    >
      <div class="button-content">
        <div v-if="isPlaying" class="playing-indicator">
          <div class="sound-wave">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
        </div>
        <div v-else class="play-icon">
          <div class="triangle"></div>
        </div>
      </div>
    </button>
  </div>
</template>

<script>
import SoundService from '../services/sound'

export default {
  name: 'AudioPlayer',
  data() {
    return {
      isPlaying: false,
      hasInteracted: false
    }
  },
  methods: {
    async handleClick() {
      try {
        this.hasInteracted = true

        if (this.isPlaying) {
          await SoundService.stopBackgroundMusic()
        } else {
          await SoundService.startBackgroundMusic()
        }

        this.isPlaying = !this.isPlaying
      } catch (error) {
        console.warn('Failed to toggle audio:', error)
      }
    }
  },
  mounted() {
    const handleFirstInteraction = async () => {
      if (!this.hasInteracted) {
        try {
          await this.handleClick()
        } catch (error) {
          console.warn('Failed to auto-start audio:', error)
        }
      }
    }

    document.addEventListener('click', handleFirstInteraction, { once: true })

    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('click', handleFirstInteraction)
    })
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/components/audio-player';
</style>