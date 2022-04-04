export default class LoadingCore {
  queue = []

  show() {
    this.queue.push(1)
  }

  hide() {
    this.queue.pop()
  }

  clearQueue() {
    for (let i = 0; i < this.queue.length; i++) {
      this.hide()
    }
  }

  get isQueueEmpty() {
    return this.queue.length === 0
  }
}
