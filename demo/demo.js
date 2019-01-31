import { menestrel, Actor, Scenario } from '../src/menestrel.js'

// Describe actors
const actor1 = new Actor(0, _ => {
  _.fillRect(0, 0, 50, 50)
})

const actor2 = new Actor(1000, _ => {
  _.fillText(100, 100, 'text')
})

// Describe scenario
const scenario = new Scenario(_ => {
  _.mount(actor1)
  _.call(() => console.log('called'))
  _.wait(1000)
  _.unmount(actor1)
  _.wait(1000)
  _.call(() => new Promise(r => setTimeout(r, 1000)))
  _.mount(actor1)
})

// Play scenario
const canvas = document.getElementById('canvas')
menestrel(canvas, scenario)
