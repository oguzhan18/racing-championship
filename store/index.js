import Vue from 'vue'

const carColors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFA500',
  '#800080',
  '#008000',
  '#FFC0CB',
  '#4B0082',
  '#FF4500'
]

const carNames = [
  'Ferrari SF90 Stradale',
  'McLaren P1 GTR',
  'Lamborghini Aventador SVJ',
  'Porsche 911 GT3 RS',
  'Aston Martin Valkyrie',
  'Bugatti Chiron Super Sport',
  'Koenigsegg Jesko Absolut',
  'Pagani Huayra R',
  'Mercedes-AMG One',
  'Rimac Nevera',
  'Gordon Murray T.50',
  'Lotus Evija'
]

export const state = () => ({
  cars: [],
  raceProgram: [],
  raceResults: [],
  currentLap: 0,
  isRaceCreated: false,
  isRaceStarted: false,
  selectedCar: null,
  carListEnabled: false
})

export const mutations = {
  setCars(state, cars) {
    state.cars = cars
  },
  setRaceProgram(state, program) {
    state.raceProgram = program
  },
  addRaceResult(state, result) {
    if (!Array.isArray(state.raceResults)) {
      state.raceResults = []
    }
    Vue.set(state.raceResults, state.currentLap, result)
  },
  setCurrentLap(state, lap) {
    state.currentLap = lap
  },
  setIsRaceCreated(state, value) {
    state.isRaceCreated = value
    state.carListEnabled = value
  },
  setIsRaceStarted(state, value) {
    state.isRaceStarted = value
  },
  setSelectedCar(state, car) {
    state.selectedCar = car
  },
  initializeRaceResults(state) {
    state.raceResults = []
  }
}

export const actions = {
  createRace({ commit }) {
    const cars = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: carNames[i],
      color: carColors[i],
      baseSpeed: Math.floor(Math.random() * 50) + 150,
      acceleration: Math.floor(Math.random() * 30) + 70,
      handling: Math.floor(Math.random() * 20) + 80,
      getRandomSpeed() {
        const variation = this.baseSpeed * 0.1
        return this.baseSpeed + (Math.random() * variation * 2 - variation)
      }
    }))

    commit('setCars', cars)

    const program = Array.from({ length: 5 }, () =>
      [...cars]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(car => ({
          ...car,
          speed: car.getRandomSpeed()
        }))
    )

    commit('setRaceProgram', program)
    commit('setCurrentLap', 0)
    commit('setIsRaceCreated', true)
    commit('setIsRaceStarted', false)
    commit('setSelectedCar', null)
    commit('initializeRaceResults')
  },

  startRace({ commit }) {
    commit('setIsRaceStarted', true)
  },

  nextLap({ commit, state }) {
    if (state.currentLap < 4) {
      commit('setCurrentLap', state.currentLap + 1)
    }
  },

  selectCar({ commit }, car) {
    commit('setSelectedCar', car)
  }
}

export const getters = {
  getCurrentRace: state => state.raceProgram[state.currentLap] || [],
  getRaceResults: state => state.raceResults,
  getSelectedCar: state => state.selectedCar,
  isCarListEnabled: state => state.carListEnabled
}