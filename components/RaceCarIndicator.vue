<template>
    <div class="race-car-indicator" :class="{ 'is-leader': isLeader, 'is-active': isActive }">
      <div class="position" :style="{ backgroundColor: getPositionColor }">
        {{ position }}
      </div>
      <div class="car-info">
        <div class="car-name">{{ car.name }}</div>
        <div class="speed-indicator">
          <div class="speed-bar">
            <div class="speed-fill" 
                 :style="{ 
                   width: `${(car.speed / maxSpeed) * 100}%`,
                   backgroundColor: car.color 
                 }">
            </div>
          </div>
          <span class="speed-value">{{ Math.round(car.speed) }} km/h</span>
        </div>
      </div>
      <div class="car-preview">
        <enhanced-car-svg
          :color="car.color"
          :width="40"
          :height="24"
          :show-effects="isActive"
        />
      </div>
    </div>
  </template>
  
  <script>
  import EnhancedCarSvg from './EnhancedCarSvg.vue'
  
  export default {
    name: 'RaceCarIndicator',
    components: {
      EnhancedCarSvg
    },
    props: {
      car: {
        type: Object,
        required: true
      },
      position: {
        type: Number,
        required: true
      },
      isLeader: {
        type: Boolean,
        default: false
      },
      isActive: {
        type: Boolean,
        default: false
      },
      maxSpeed: {
        type: Number,
        default: 200
      }
    },
    computed: {
      getPositionColor() {
        if (this.position === 1) return '#FFD700'
        if (this.position === 2) return '#C0C0C0'
        if (this.position === 3) return '#CD7F32'
        return 'rgba(0, 255, 136, 0.2)'
      }
    }
  }
  </script>
  
  <style scoped>
  .race-car-indicator {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .race-car-indicator:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(5px);
  }
  
  .position {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;
    font-weight: bold;
    font-size: 1.1rem;
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
  }
  
  .car-info {
    flex: 1;
    min-width: 0;
  }
  
  .car-name {
    color: #fff;
    font-weight: 500;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .speed-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .speed-bar {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  
  .speed-fill {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .speed-value {
    color: #0ff;
    font-size: 0.9rem;
    font-family: monospace;
    min-width: 80px;
    text-align: right;
  }
  
  .car-preview {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .is-leader {
    border: 1px solid rgba(255, 215, 0, 0.3);
    background: rgba(255, 215, 0, 0.05);
  }
  
  .is-leader::before {
    content: 'LEADER';
    position: absolute;
    top: -0.5rem;
    right: 1rem;
    background: #FFD700;
    color: #000;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    animation: pulse 1s ease-in-out infinite;
  }
  
  .is-active .car-preview {
    transform: scale(1.1);
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  </style>