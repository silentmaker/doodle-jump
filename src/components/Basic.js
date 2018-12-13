import ninjaLeftImage from "../images/ninja-left.png";
import ninjaRightImage from "../images/ninja-right.png";
import sumoLeftImage from "../images/sumo-left.png";
import sumoRightImage from "../images/sumo-right.png";
import boardOneImage from "../images/board-one.png";
import boardTwoImage from "../images/board-two.png";
import trampolineImage from "../images/trampoline.png";
import monsterImage from "../images/monster.png";

export class Board  {
  constructor(x, y) {
    const isStatic = Math.random() > 0.5

    this.x = x || 0
    this.y = y || 0
    this.width = 72
    this.height = 18
    this.vx = isStatic ? 0 : 1
    this.image = new Image()
    this.image.src = isStatic ? boardOneImage : boardTwoImage
    this.hasSpring = false
    this.springImage = new Image()
    this.springImage.src = trampolineImage
  }
  draw(context) {
    if (this.hasSpring) {
      context.drawImage(this.image, this.x, this.y + 14, this.width, this.height)
      context.drawImage(this.springImage, this.x + 12, this.y - 2, 48, 16)
    } else {
      context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
  }
}
export class Monster {
  constructor(x, y) {
    this.width = 60
    this.height = 80
    this.x = x || 0
    this.y = y || 0
    this.vx = 2
    this.vy = 2
    this.image = new Image()
    this.image.src = monsterImage
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}
export class Ninja {
  constructor(x, y) {
    const isNinja = Math.random() > 0.5

    this.facing = 'left'
    this.defaultSpeed = 15
    this.speed = this.defaultSpeed
    this.width = 80
    this.height = 64
    this.x = x || 0
    this.y = y || 0
    this.distance = y || 0
    this.standpoint = y || 0
    this.leftImage = new Image()
    this.leftImage.src = isNinja ? ninjaLeftImage : sumoLeftImage
    this.rightImage = new Image()
    this.rightImage.src = isNinja ? ninjaRightImage : sumoRightImage
  }
  draw(context) {
    const image = this.facing === 'left' ? this.leftImage : this.rightImage
    context.drawImage(image, this.x, this.y, this.width, this.height)
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
    this.score = 0

    this.isOver = false
    this.isPaused = false
  }
  init() {
    const canvas = document.createElement('canvas')

    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.context = canvas.getContext('2d')
    this.ninja = new Ninja(this.width / 2, this.height)
    this.monster = new Monster(this.width / 2, -Math.random() * 10 * this.height)
    for (let i = 0; i < 8; i++) {
      this.boards.push(new Board((this.width - 80) * Math.random(), i * 100))
    }

    canvas.width = this.width
    canvas.height = this.height
    this.container.appendChild(canvas)

    window.addEventListener('deviceorientation', e => {
      this.alphaX = e.gamma / 3
    })
    canvas.addEventListener('click', e => {
      if (this.isOver && 
        e.clientX >= this.width / 2 - 80 && e.clientX <= this.width / 2 + 80 &&
        e.clientY >= this.height / 2 + 60 && e.clientY <= this.height / 2 + 108
      ) this.restart()
    })

    this.run()
  }
  draw() {
    const {context, width, height, ninja, monster, boards} = this

    context.clearRect(0, 0, width, height)
    
    if (this.isOver) {
      // Game Over
      context.textAlign = 'center'
      context.fillStyle = '#fff'
      context.font = '40px Arial'
      context.fillText('Game Over', width / 2, height / 2 - 20)
      context.font = '20px Arial'
      context.fillText(`Your Score: ${this.score}`, width / 2, height / 2 + 20)
      context.rect(width / 2 - 80, height / 2 + 60, 160, 48)
      context.fill()
      context.fillStyle = '#203243'
      context.font = '24px Arial'
      context.fillText('RESTART', width / 2, height / 2 + 92)
    } else {
      // Boards
      boards.map(board => board.draw(context))
      // Ninja
      ninja.draw(context)
      // Monster
      monster.draw(context)
      // Score
      context.textAlign = 'left'
      context.fillStyle = '#fff'
      context.font = '20px Arial';
      context.fillText(`Score: ${this.score}`,15,30);

      this.calc()
    }
  }
  calc() {
    const {ninja, monster, boards, gravity, width, height} = this

    // Ninja
    ninja.speed -= gravity
    ninja.x += this.alphaX
    ninja.facing = this.alphaX < 0 ? 'left' : 'right'
    if (ninja.x + ninja.width / 2 < 0) ninja.x = width - ninja.width / 2
    if (ninja.x + ninja.width / 2 > width) ninja.x = ninja.width / 2
    if (ninja.y > height) {
      this.isOver = true
    } else {
      ninja.y -= (ninja.speed + gravity / 2)
    }
    if (ninja.x > monster.x - ninja.width && ninja.x < monster.x + ninja.width &&
      ninja.y > monster.y - ninja.height && ninja.y < monster.y + monster.height
    ) this.isOver = true

    // Boards
    boards.map(board => {
      // Step and Jump
      if (ninja.speed < 0 && 
          board.y <= ninja.y + ninja.height && board.y + 20 >= ninja.y + ninja.height && 
          ninja.x + ninja.width - 20 >= board.x && ninja.x + 20 <= board.x + board.width 
        ) {
        ninja.standpoint = board.y
        ninja.speed = board.hasSpring ? ninja.defaultSpeed * 2 : ninja.defaultSpeed
      }
      // Back to Top
      if (board.y > height) {
        board.x = (width - 80) * Math.random()
        board.y = 0
        board.hasSpring = Math.random() > 0.95
      }
      // Hovering
      board.x += board.vx
      if (board.x >= width - board.width || board.x <= 0) board.vx = -board.vx 
      return false
    })

    // Monster
    monster.x += monster.vx
    monster.y += monster.vy
    if (monster.y > height) monster.y = -Math.random() * 10 * height
    if (monster.x >= width - monster.width || monster.x <= 0) monster.vx = -monster.vx 

    // Screen
    const translate = ninja.speed > 0 && ninja.y < height / 2 ? (height / 2 - ninja.y) : 0
    ninja.y += translate
    monster.y += translate
    boards.map(board => board.y += translate)
    this.score += Math.round(Math.abs(translate))
  }
  pause() {
    this.isPaused = !this.this.isPaused
  }
  restart() {
    this.isOver = false
    this.ninja.y = this.height
    this.ninja.speed = this.ninja.defaultSpeed
    this.monster.y = -Math.random() * 10 * this.height
    this.score = 0
  }
  run() {
    !(this.isPaused) && this.draw()
    requestAnimationFrame(this.run.bind(this))
  }
}