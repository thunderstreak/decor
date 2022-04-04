const LOADING_DOM_ID = 'loading'

export default {
  div: null,

  hide() {
    const { div } = this
    if (div.parentNode) {
      div.parentNode.removeChild(div)
    }
  },

  show(props = {}) {
    const { mask = true, className = '' } = props
    let div = this.div || document.getElementById(LOADING_DOM_ID)
    if (!div) {
      const firstChild = document.body.children[0]
      div = document.createElement('div')

      div.setAttribute('id', LOADING_DOM_ID)
      // div.setAttribute('class', LOADING_DOM_ID)
      div.className = `${LOADING_DOM_ID} ${className}`
      div.innerHTML = `
        <div class="snake"></div>
        ${mask ? '<div class="mask"/>' : ''}
      `

      if (firstChild) {
        document.body.insertBefore(div, firstChild)
      } else {
        document.body.appendChild(div)
      }
    }
    this.div = div
  }

}
