import ninjaImage from "../images/ninja.png";
import boardImage from "../images/board.png";

export class Board  {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
    this.width = 72
    this.height = 18
    this.image = new Image()
    this.image.src = boardImage
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}
export class Bullet {
  constructor(x, y) {
    this.direction = {x, y}
  }
}
export class Ninja {
  constructor(x, y) {
    this.facing = 'left'
    this.defaultSpeed = 15
    this.speed = this.defaultSpeed
    this.width = 60
    this.height = 60
    this.x = x || 0
    this.y = y || 0
    this.distance = y || 0
    this.standpoint = y || 0
    this.image = new Image()
    this.image.src = ninjaImage
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}
export class Doodle {
  constructor(targetId) {
    this.width = 0
    this.height = 0
    this.context = null
    this.container = document.getElementById(targetId)

    this.gravity = 0.5
    this.alphaX = 0

    this.ninja = null
    this.boards = []
    this.bullets = []

    this.isPlaying = false
    this.isPaused = false
  }
  init() {
    const canvas = document.createElement('canvas')

    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.context = canvas.getContext('2d')
    this.ninja = new Ninja(this.width / 2, this.height)

    canvas.width = this.width
    canvas.height = this.height
    this.container.appendChild(canvas)

    window.addEventListener("deviceorientation", e => {
      this.alphaX = e.gamma / 3
    })

    this.run()
  }
  play() {
    this.isPlaying = false
  }
  end() {
    this.isPlaying = false
  }
  pause() {
    this.isPaused = true
  }
  resume() {
    this.isPaused = false
  }
  draw() {
    const {context, width, height, ninja, boards} = this

    context.clearRect(0, 0, width, height)

    // Boards
    boards.map(board => board.draw(context))

    // Ninja
    ninja.draw(context)

    this.calc()
  }
  calc() {
    const {ninja, boards, gravity, width, height} = this

    // Ninja
    ninja.speed -= gravity
    console.log(this.alphaX)
    ninja.x += this.alphaX
    console.log('ninja', ninja.x)
    if (ninja.x < 0) ninja.x = width
    if (ninja.x > width) ninja.x = 0
    ninja.y -= (ninja.speed + gravity / 2)

    // Boards
    if (boards.length === 0) {
      for (let i = 0; i < 8; i++) {
        boards.push(new Board((width - 80) * Math.random(), i * 100))
      }
    }
    boards.map(board => {
      if (ninja.speed < 0 && 
          board.y <= ninja.y + ninja.height && board.y + 20 >= ninja.y + ninja.height && 
          ninja.x + 10 >= board.x && ninja.x + 10 <= board.x + board.width 
        ) {
        ninja.standpoint = board.y
        ninja.speed = ninja.defaultSpeed
      }
      if (board.y > height) {
        board.y = 0
      }
      return false
    })

    // Screen
    const translate = ninja.speed > 0 && ninja.y < height / 2 ? (height / 2 - ninja.y) : 0
    ninja.y += translate
    boards.map(board => board.y += translate)
  }
  run() {
    !this.isPaused && this.draw()
    requestAnimationFrame(this.run.bind(this))
  }
}