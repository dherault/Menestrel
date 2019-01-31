import { assert } from 'chai'
import BinarySearchTree from '../src/BinarySearchTree'

describe('BinarySearchTree', () => {
  it('Should insert the first entry as root', () => {
    const bst = new BinarySearchTree()

    bst.insert(1, 1)

    assert(bst.root.value === 1)
    assert(bst.root.data === 1)
  })

  function checkNodeIntegrity(node) {
    if (node.left && node.right) {
      assert(node.left.value < node.right.value, 'BST integrity corrupted')
      checkNodeIntegrity(node.left)
      checkNodeIntegrity(node.right)
    }
    else if (node.left) {
      checkNodeIntegrity(node.left)
    }
    else if (node.right) {
      checkNodeIntegrity(node.right)
    }
  }

  function checkBinarySearchTreeIntegrity(bst) {
    if (!bst.root) return

    checkNodeIntegrity(bst.root)
  }

  it('Should insert entries in the correct position', () => {
    const bst = new BinarySearchTree()

    bst.insert(4, 4)
    bst.insert(3, 3)
    bst.insert(5, 5)
    bst.insert(16, 16)
    bst.insert(1, 1)
    bst.insert(6, 6)
    bst.insert(8, 8)
    bst.insert(90, 90)
    bst.insert(57, 57)
    bst.insert(12, 12)
    bst.insert(88, 88)

    checkBinarySearchTreeIntegrity(bst)
  })

  it('Should remove entries correctly', () => {
    let bst = new BinarySearchTree()

    bst.insert(4, 4)
    bst.insert(3, 3)
    bst.insert(5, 5)
    bst.insert(16, 16)
    bst.insert(1, 1)
    bst.insert(6, 6)
    bst.insert(8, 8)
    bst.insert(90, 90)
    bst.insert(57, 57)
    bst.insert(12, 12)
    bst.insert(88, 88)

    bst.remove(4)
    checkBinarySearchTreeIntegrity(bst)
    bst.remove(16)
    checkBinarySearchTreeIntegrity(bst)
    bst.remove(6)
    checkBinarySearchTreeIntegrity(bst)
    bst.remove(90)
    checkBinarySearchTreeIntegrity(bst)
    bst.remove(88)
    checkBinarySearchTreeIntegrity(bst)

    bst = new BinarySearchTree()

    bst.insert(1, 1)
    bst.insert(2, 2)
    bst.insert(3, 3)
    bst.insert(4, 4)

    bst.remove(1)
    checkBinarySearchTreeIntegrity(bst)
    assert(bst.root.value === 2)
    assert(bst.size === 3)
    bst.remove(4)
    checkBinarySearchTreeIntegrity(bst)
    bst.remove(2)
    checkBinarySearchTreeIntegrity(bst)
    bst.remove(3)
    checkBinarySearchTreeIntegrity(bst)

    bst = new BinarySearchTree()

    bst.insert(4, 4)
    bst.insert(3, 3)
    bst.insert(2, 2)
    bst.insert(1, 1)

    bst.remove(4)
    checkBinarySearchTreeIntegrity(bst)
    assert(bst.root.value === 3)
    assert(bst.size === 3)
    bst.remove(1)
    checkBinarySearchTreeIntegrity(bst)
    bst.remove(3)
    checkBinarySearchTreeIntegrity(bst)
    bst.remove(2)
    checkBinarySearchTreeIntegrity(bst)
  })

  it('Should traverse entries correctly', () => {
    const bst = new BinarySearchTree()

    bst.insert(4, 4)
    bst.insert(5, 5)
    bst.insert(16, 16)
    bst.insert(1, 1)
    bst.insert(88, 88)

    let previous = 0

    bst.traverse(data => {
      assert(data > previous)
      previous = data
    })
  })


})
