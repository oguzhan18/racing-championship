export default ({ app }, inject) => {
  inject('race', {
    getCarImage(car) {
      const images = {
        'Ferrari F1': '/cars/ferrari.png',
        'McLaren P1': '/cars/mclaren.png',
        'Lamborghini Huracan': '/cars/lamborghini.png',
        'Porsche 911 GT3': '/cars/porsche.png',
        'Aston Martin Vantage': '/cars/aston.png',
        'Bugatti Chiron': '/cars/bugatti.png'
      }
      return images[car.name] || `/cars/default.png`
    },

    formatTime(time) {
      return `${time.toFixed(2)}s`
    },

    calculateProgress(car, distance, elapsedTime) {
      const maxSpeed = 100
      const acceleration = car.speed / maxSpeed
      const progress = (elapsedTime * acceleration * 100) / (distance / 100)
      return Math.min(progress, 100)
    }
  })
}
