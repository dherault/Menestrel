import * as Promise from 'bluebird'
import BinarySearchTree from './BinarySearchTree'

export class Actor {
  constructor(draw, props = {}) {
    this.draw = draw
    this.zIndex = props.zIndex
    this.animationDuration = props.animationDuration || 0
    this.animationLoop = props.animationLoop || false
    this.animationOver = false
    this.animationStartTime = null
  }
}

export class Scenario {
  constructor(stepsFunction) {
    this.stepsFunction = stepsFunction
    this.queue = []
    this.actorsBinarySearchTree = new BinarySearchTree()

    this.$ = {
      mount: actor => {
        this.queue.push((_, actorsBinarySearchTree) => {
          console.log('mounting')

          actor.animationStartTime = Date.now()
          actorsBinarySearchTree.insert(
            typeof actor.zIndex === 'number' ? actor.zIndex : this.actorsBinarySearchTree.size,
            actor
          )

          return Promise.resolve()
        })
      },

      unmount: actor => {
        this.queue.push((_, actorsBinarySearchTree) => {
          console.log('unmounting')

          actorsBinarySearchTree.remove(actor)

          return Promise.resolve()
        })
      },

      wait: duration => {
        this.queue.push(() => new Promise(resolve => {
          console.log('waiting')
          setTimeout(resolve, duration)
        }))
      },

      awaitClick: (x, y, width, height, fn) => {
        this.queue.push(_ => new Promise(resolve => {
          console.log('await click')

          _.canvas.addEventListener('click', ({ offsetX: px, offsetY: py }) => {
            if (px >= x && px <= x + width && py >= y && py <= y + height) {
              if (typeof fn === 'function') fn()
              resolve()
            }
          })
        }))
      },

      call: fn => {
        this.queue.push(() => {
          console.log('calling')

          return Promise.resolve(fn())
        })
      },

      play: scenario => {
        this.queue.push((_, actorsBinarySearchTree) => {
          console.log('play')

          scenario.stepsFunction(scenario.$, _)

          return Promise.resolve(scenario.run(_, actorsBinarySearchTree))
        })
      }
    }
  }

  run(_, actorsBinarySearchTree) {
    let promise = Promise.resolve()

    const runStep = () => {
      let nextStep = this.queue[0]

      while (nextStep && promise.isFulfilled()) {
        nextStep = this.queue.shift()

        if (typeof nextStep === 'function') {
          promise = nextStep(_, actorsBinarySearchTree)
        }
      }

      _.clearRect(0, 0, _.canvas.width, _.canvas.height)

      actorsBinarySearchTree.traverse(actor => {
        const diffTime = Date.now() - actor.animationStartTime

        if (diffTime >= actor.animationDuration) {
          actor.animationOver = true
        }

        const t = actor.animationLoop || !actor.animationOver ?
          actor.animationDuration === 0 ? 0 : diffTime % actor.animationDuration :
          actor.animationDuration

        actor.draw(_, t)
      })

      requestAnimationFrame(runStep)
    }

    requestAnimationFrame(runStep)
  }
}

export function menestrel(canvas, scenario) {
  const _ = canvas.getContext('2d')
  const actors = new BinarySearchTree()

  scenario.stepsFunction(scenario.$, _)

  return scenario.run(_, actors)
}
