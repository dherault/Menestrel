import { menestrel, Actor, Scenario } from '../src/menestrel.js'

// Describe actors
const background = new Actor(0, _ => {
  _.fillStyle = 'black'
  _.fillRect(0, 0, _.canvas.width, _.canvas.height)
})

const title = new Actor(1000, _ => {
  _.font = '100px sans-serif'
  _.fillStyle = 'white'
  _.textAlign = 'center'
  _.textBaseline = 'middle'
  _.fillText('Menestrel', _.canvas.width / 2, _.canvas.height / 2)
})

// Describe scenario
const scenario = new Scenario(_ => {
  _.mount(background)
  _.mount(title)
  _.call(() => console.log('called'))
  _.wait(1000)
  _.unmount(title)
  _.wait(1000)
  _.call(() => new Promise(resolve => setTimeout(resolve, 1000)))
  _.mount(title)
})

// Play scenario
const canvas = document.getElementById('canvas')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
// console.log(canvas.width, canvas.height)

menestrel(canvas, scenario)
