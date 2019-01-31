import * as Promise from 'bluebird'
import BinarySearchTree from './BinarySearchTree'

export class Actor {
  constructor(draw, props = {}) {
    this.draw = draw
    this.zIndex = props.zIndex
    this.animationDuration = props.animationDuration || 0
  }
}

export class Scenario {
  constructor(stepsFunction) {
    this.queue = []
    this.actorsBinarySearchTree = new BinarySearchTree()
    stepsFunction(this)
  }

  mount(actor) {
    this.queue.push(() => {
      console.log('mounting')

      this.actorsBinarySearchTree.insert(
        typeof actor.zIndex === 'number' ? actor.zIndex : this.actorsBinarySearchTree.size,
        actor
      )

      return Promise.resolve()
    })
  }

  unmount(actor) {
    this.queue.push(() => {
      console.log('unmounting')

      this.actorsBinarySearchTree.remove(actor)

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
    this.queue.push(_ => {
      console.log('calling')

      return Promise.resolve(fn(_))
    })
  }

  run(_) {
    let promise = Promise.resolve()
    const startTime = Date.now()

    const runStep = () => {
      let nextStep = this.queue[0]

      while (nextStep && promise.isFulfilled()) {
        nextStep = this.queue.shift()

        if (typeof nextStep === 'function') {
          promise = nextStep(_)
        }
      }

      _.clearRect(0, 0, _.canvas.width, _.canvas.height)

      this.actorsBinarySearchTree.traverse(actor => {
        actor.draw(_, actor.animationDuration === 0 ? 0 : (Date.now() - startTime) % actor.animationDuration)
      })

      requestAnimationFrame(runStep)
    }

    requestAnimationFrame(runStep)
  }
}

export function menestrel(canvas, scenario) {
  return scenario.run(canvas.getContext('2d'))
}
