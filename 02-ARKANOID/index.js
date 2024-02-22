const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const $sprite = document.getElementById('sprite')
const $bricks = document.getElementById('bricks')

canvas.width = 448
canvas.height = 400

const ballRadius = 3
let x = canvas.width / 2
let y = canvas.height -30

let BALLSPEED = 3

let dx = BALLSPEED
let dy = -BALLSPEED

const paddleHeight = 10
const paddleWidth = 50

let paddleX = (canvas.width - paddleWidth) /2
let paddleY = canvas.height - paddleHeight - 10

let rightPress = false
let leftPress = false

let PADDLE_SENSITIVITY = 7

const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32
const brickHeight = 16
const brickPadding = 0
const brickOffsetTop = 80
const brickOffsetLeft = 17
const bricks = []
const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0
}

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop

    const random = Math.floor(Math.random() * 8)

    bricks[c][r] = {
      x: brickX, 
      y: brickY, 
      status: BRICK_STATUS.ACTIVE, 
      color: random
    }
  }
}

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.drawImage(
    $sprite, 29, 174, paddleWidth, paddleHeight, paddleX, paddleY, paddleWidth, paddleHeight
  )
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++){
      const currentBrick = bricks[c][r]
      if(currentBrick.status === BRICK_STATUS.DESTROYED) continue

      ctx.strokeStyle = '#000'
      ctx.stroke()
      ctx.fill()

      const clipX = currentBrick.color * 32
      ctx.drawImage(
        $bricks, clipX, 0, brickWidth, brickHeight, currentBrick.x, currentBrick.y, brickWidth, brickHeight
      )
  }}
} 

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++){
      const currentBrick = bricks[c][r]
      if(currentBrick.status === BRICK_STATUS.DESTROYED) continue

      const isBallSameXAsBrick = x > currentBrick.x && x < currentBrick.x + brickWidth

      const isBallSameYAsBrick = y > currentBrick.y && y < currentBrick.y + brickHeight

      if(isBallSameXAsBrick && isBallSameYAsBrick){
        dy = -dy
        currentBrick.status = BRICK_STATUS.DESTROYED
      }
    }
  }
}

function ballMovement() {
  if (
    x + dx > canvas.width - ballRadius || 
    x + dx < ballRadius
    ) {
    dx = -dx
  }

  if (y + dy < ballRadius) {
    dy = -dy
  }

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth
  
  const isBallTouchingPaddle = y + dy > paddleY && y < canvas.height

  if ( isBallSameXAsPaddle && isBallTouchingPaddle ) {
    dy = -dy
  } else if ( y + dy > canvas.height - ballRadius) {
    console.log('game over')
  }
  x += dx
  y += dy
}

function paddleMovement() {
  if (rightPress && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSITIVITY
  } else if (leftPress && paddleX > 0) {
    paddleX -=PADDLE_SENSITIVITY
  }
}

function cleanCanvas()  {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvents () {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)

  function keyDownHandler(event) {
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight') {
      rightPress = true
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPress = true
    }
  }

  function keyUpHandler(event) {
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight') {
      rightPress = false
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPress = false
    }
  }
}

function draw() {
  cleanCanvas()
  drawBall()
  drawPaddle()
  drawBricks()

  collisionDetection()
  ballMovement()
  paddleMovement()

  window.requestAnimationFrame(draw);
}

draw()
initEvents()