class SoundService {
  constructor() {
    this.initialized = false
    this.sounds = {}
    this.initializeAudio()
  }

  async initializeAudio() {
    if (typeof window === "undefined") return
    try {
      this.audioContext = new AudioContext()
      const soundBaseUrl = "https://cdn.jsdelivr.net/gh/username/repo@version/path/to/sounds"

      this.sounds = {
        hover: await this.loadSound(`https://cdn.freesound.org/previews/623/623990_13772754-lq.mp3`),
        click: await this.loadSound(`https://cdn.freesound.org/previews/707/707041_9658839-lq.mp3`),
        start: await this.loadSound(`https://cdn.freesound.org/previews/730/730715_15860783-lq.mp3`),
        background: await this.loadSound(`https://cdn.freesound.org/previews/237/237089_4019029-lq.mp3`, true),
        boost: await this.loadSound(`${soundBaseUrl}/boost.mp3`),
        finish: await this.loadSound(`https://cdn.freesound.org/previews/607/607207_7724198-lq.mp3`),
        overtake: await this.loadSound(`https://cdn.freesound.org/previews/101/101414_321967-lq.mp3`),
      }

      this.initialized = true
    } catch (error) {
      console.warn("Failed to initialize audio:", error)
    }
  }

  async loadSound(url, loop = false) {
    if (!this.audioContext) return null

    try {
      const response = await fetch(url, {
        mode: "cors",
        headers: {
          Accept: "audio/mp3",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()

      return new Promise((resolve, reject) => {
        this.audioContext.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              resolve({
                buffer,
                source: null,
                loop,
                volume: loop ? 0.3 : 0.5,
                gainNode: this.audioContext.createGain(),
              })
            },
            (error) => {
              console.warn("Audio decoding failed:", error)
              resolve(null)
            },
        )
      })
    } catch (error) {
      console.warn("Failed to load sound:", url, error)
      return null
    }
  }

  async play(soundName) {
    if (!this.initialized || !this.sounds[soundName]) {
      console.warn(`Sound ${soundName} not available`)
      return
    }

    try {
      const sound = this.sounds[soundName]
      if (!sound || !sound.buffer) {
        console.warn(`Invalid sound data for ${soundName}`)
        return
      }

      if (sound.source) {
        try {
          sound.source.stop()
        } catch (error) {
        }
      }
      const source = this.audioContext.createBufferSource()
      source.buffer = sound.buffer
      source.loop = sound.loop
      sound.gainNode.gain.value = sound.volume
      source.connect(sound.gainNode)
      sound.gainNode.connect(this.audioContext.destination)
      sound.source = source

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume()
      }

      source.start(0)
      source.onended = () => {
        sound.source = null
      }
    } catch (error) {
      console.warn("Failed to play sound:", soundName, error)
    }
  }

  stop(soundName) {
    if (!this.initialized || !this.sounds[soundName]) return

    const sound = this.sounds[soundName]
    if (sound?.source) {
      try {
        sound.source.stop()
        sound.source = null
      } catch (error) {
        console.warn("Failed to stop sound:", soundName, error)
      }
    }
  }

  async startBackgroundMusic() {
    try {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume()
      }
      await this.play("background")
    } catch (error) {
      console.warn("Failed to start background music:", error)
    }
  }

  stopBackgroundMusic() {
    this.stop("background")
  }

  fadeVolume(soundName, targetVolume, duration = 1) {
    if (!this.initialized || !this.sounds[soundName]) return

    const sound = this.sounds[soundName]
    if (!sound?.gainNode) return

    const currentTime = this.audioContext.currentTime
    sound.gainNode.gain.linearRampToValueAtTime(targetVolume, currentTime + duration)
  }
}

export default new SoundService()