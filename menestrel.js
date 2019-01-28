import * as Promise from 'bluebird'

console.log('Hello world')

class Actor {
  constructor(animationDuration, draw) {
    this.iteration = 0
    this.animationDuration = animationDuration
    this.draw = draw
  }
}

class Scenario {
  constructor(stepFunction) {
    this.queue = []
    this.actors = new Set()
    stepFunction(this)
  }

  mount(actor) {
    this.queue.push(() => {
      console.log('mounting')
      this.actors.add(actor)

      return Promise.resolve()
    })
  }

  unmount(actor) {
    this.queue.push(() => {
      console.log('unmounting')
      this.actors.delete(actor)

      return Promise.resolve()
    })
  }

  wait(duration) {
    this.queue.push(() => new Promise(resolve => {
      console.log('waiting')
      setTimeout(resolve, duration)
    }))
  }

  call(fn) {
    this.queue.push(_ => fn(_))
  }

  run2(_) {
    if (!this.queue.length) return Promise.resolve()

    let promise = this.queue.shift()(_)
    this.draw(_)

    while(this.queue.length) {
      const nextPromise = this.queue.shift()
      promise = promise.then(() => nextPromise(_))
    }

    return promise
  }

  draw(_) {
    _.clearRect(0, 0, _.canvas.width, _.canvas.height)
    this.actors.forEach(actor => actor.draw(_))
  }

  run(_) {
    let promise = Promise.resolve()

    setInterval(() => {
      let nextStep = this.queue[0]

      while (nextStep && promise.isFulfilled()) {
        nextStep = this.queue.shift()

        if (typeof nextStep === 'function') {
          promise = nextStep(_)
        }
      }

      // TODO: know when to ;
      _.clearRect(0, 0, _.canvas.width, _.canvas.height)

      this.actors.forEach(actor => {
        actor.iteration++

        if (actor.iteration * 50 / 3 > actor.animationDuration) {
          actor.iteration = 1
        }

        actor.draw(_, actor.iteration * 50 / 3)
      })
    }, 50 / 3)
  }
}

function menestrel(canvas, scenario) {
  return scenario.run(canvas.getContext('2d'))
}

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
  _.call(() => Promise.resolve(console.log('called')))
  _.wait(1000)
  _.unmount(actor1)
  _.wait(1000, () => new Promise(resolve => setTimeout(resolve, 1000)))
  _.mount(actor1)
})

// Play scenario
const canvas = document.getElementById('canvas')
menestrel(canvas, scenario)
