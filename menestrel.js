console.log('Hello world')

class Actor {
  constructor(draw) {
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

  run(_) {
    if (!this.queue.length) return Promise.resolve()

    let promise = this.queue.shift()(_)
    this.draw(_)

    while(this.queue.length) {
      const nextPromise = this.queue.shift()
      promise = promise
        .then(() => nextPromise(_))
        .then(() => this.draw(_))
    }

    return promise
  }

  draw(_) {
    _.clearRect(0, 0, _.canvas.width, _.canvas.height)
    this.actors.forEach(actor => actor.draw(_))
  }
}

function menestrel(canvas, scenario) {
  return scenario.run(canvas.getContext('2d'))
}

// Describe actors
const actor1 = new Actor(_ => {
  _.fillRect(0, 0, 50, 50)
})

// Describe scenario
const scenario = new Scenario(_ => {
  _.mount(actor1)
  _.wait(1000)
  _.unmount(actor1)
  _.wait(1000)
  _.mount(actor1)
})

// Play scenario
const canvas = document.getElementById('canvas')
menestrel(canvas, scenario)
