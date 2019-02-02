import { menestrel, Actor, Scenario } from '../src/menestrel.js'

// Describe actors
const background = new Actor(_ => {
  _.fillStyle = 'black'
  _.fillRect(0, 0, _.canvas.width, _.canvas.height)
})

const title = new Actor((_, t) => {
  _.globalAlpha = t / 2500
  _.font = '105px sans-serif'
  _.fillStyle = 'white'
  _.textAlign = 'center'
  _.textBaseline = 'middle'
  _.fillText('Menestrel', _.canvas.width / 2, _.canvas.height / 2 - 50)
  _.globalAlpha = 1
}, {
  animationDuration: 2500,
})

const subtitle = new Actor((_, t) => {
  _.globalAlpha = t / 2500
  _.font = '50px sans-serif'
  _.fillStyle = 'white'
  _.textAlign = 'center'
  _.textBaseline = 'middle'
  _.fillText('A storytelling librairy', _.canvas.width / 2, _.canvas.height / 2 + 70 - 50)
  _.globalAlpha = 1
}, {
  animationDuration: 2500,
})

const startButtonImage = new Image()
startButtonImage.src = 'demo/start.png'

const startButton = new Actor(_ => {
  _.drawImage(startButtonImage, _.canvas.width / 2 - 332 / 3, _.canvas.height / 2 - 129 / 3 + 130, 332 / 1.5, 129 / 1.5)
})

const star = new Actor((_, t) => {
  _.translate(3 * _.canvas.width / 4 + 50, _.canvas.height / 3 + 10)
  _.rotate(t / 1000 * Math.PI)
  _.fillStyle = 'red'
  _.fillRect(-50, -10, 100, 20)
  _.setTransform(1, 0, 0, 1, 0, 0)
}, {
  animationDuration: 2000,
  animationLoop: true,
})

// Describe scenario
const scenario = new Scenario(($, _) => {
  $.mount(background)
  $.mount(title)
  $.wait(1500)
  $.mount(subtitle)
  $.wait(1000)
  $.mount(startButton)
  $.awaitClick(_.canvas.width / 2 - 332 / 3, _.canvas.height / 2 - 129 / 3 + 130, 332 / 1.5, 129 / 1.5, () => {
    $.play(new Scenario(($, _) => {
      $.unmount(title)
      $.unmount(subtitle)
      $.unmount(startButton)
    }))
  })
})

// Play scenario
const canvas = document.getElementById('canvas')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
// console.log(canvas.width, canvas.height)

menestrel(canvas, scenario)
