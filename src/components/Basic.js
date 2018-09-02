// factory
export const Board = {
  type: 'left'
}
export const Bullet = {
  direction: [0, 0]
}
// singleton
export const Ninja = () => ({
  facing: 'left'
})
export const Doodle = () => ({
  width: 0,
  height: 0,
  painter: null,
  ninja: new Ninja(),
  boards: [],
  bullets: [],
  isPlaying: false,
  isPaused: false,
  init: (width, height) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    console.log(canvas)
    this.painter = canvas.getContext('2d')
    this.width = width
    this.height = height
    document.body.appendChild(canvas)
  },
  play: () => this.isPlaying = false,
  end: () => this.isPlaying = false,
  pause: () => this.isPaused = true,
  resume: () => this.isPaused = false,
  draw: () => {
    this.context.clearRect(0, 0, this.width, this.height)
  },
  loop() {
    !this.isPaused && this.draw()
    requestAnimationFrame(this.loop)
  }
})