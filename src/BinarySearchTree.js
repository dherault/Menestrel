class Node {
  constructor(value, data) {
    this.value = value
    this.data = data
    this.left = null
    this.right = null
  }
}

export default class BinarySearchTree {
  constructor() {
    this.root = null
    this.size = 0
  }

  insert(value, data) {
    this.size++

    const node = new Node(value, data)

    if (this.root === null) {
      this.root = node
    }
    else {
      this.insertNode(this.root, node)
    }
  }

  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode
      }
      else {
        this.insertNode(node.left, newNode)
      }
    }
    else {
      if (node.right === null) {
        node.right = newNode
      }
      else {
        this.insertNode(node.right, newNode)
      }
    }
  }

  remove(data) {
    const [node, parent] = this.findNodeByData(data)

    if (node === null) return

    this.size--

    // Deleting the root
    if (node === this.root) {
      if (this.size === 0) {
        this.root = null
        return
      }

      const minNode = node.right ? this.findMinNode(node.right)[0] : node.left

      if (minNode === node.left) {
        this.root = node.left
        return
      }

      node.value = minNode.value
      node.data = minNode.data
      node.right = minNode.right
      return
    }

    const side = parent.left === node ? 'left' : 'right'

    // Deleting node without children
    if (node.left === null && node.right === null) {
      parent[side] = null
      return
    }

    // Deleting node with one children
    if (node.left === null) {
      parent[side] = node.right
      return
    }
    else if (node.right === null) {
      parent[side] = node.left
      return
    }

    // Deleting node with two children
    // minumum node of the right subtree
    // is stored in minNode
    const [minNode, minNodeParent] = this.findMinNode(node.right, node)
    node.value = minNode.value
    node.data = minNode.data

    if (minNodeParent.left === minNode) minNodeParent.left = null
    else minNodeParent.right = null
  }

  findNodeByData(data, node = this.root, parent=null) {
    if (node.data === data) return [node, parent]

    if (node.left !== null) {
      const [nextNode, nextParent] = this.findNodeByData(data, node.left, node)
      if (nextNode !== null) return [nextNode, nextParent]
    }
    if (node.right !== null) {
      const [nextNode, nextParent] = this.findNodeByData(data, node.right, node)
      if (nextNode !== null) return [nextNode, nextParent]
    }

    return [null, null]
  }

  findMinNode(node, parent) {
    // if left of a node is null
    // then it must be minimum node
    return node.left === null ? [node, parent] : this.findMinNode(node.left, node)
  }

  traverse(fn, node = this.root) {
    if (node !== null) {
      this.traverse(fn, node.left)
      fn(node.data)
      this.traverse(fn, node.right)
    }
  }

  toString() {
    return JSON.stringify(this, null, 2)
  }
}
