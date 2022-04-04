import LoadingCore from './loadingCore'
import LoadingView  from './loadingView'

const loadingCore = new LoadingCore()
const DEFAULT_TIMEOUT = 5000

let timer

const show = (props) => {
  const timeout = props?.timeout ?? DEFAULT_TIMEOUT

  loadingCore.show()
  LoadingView.show(props)

  if (timer) {
    clearTimeout(timer)
  }

  if (timeout && typeof timeout === 'number') {
    // 超时保护
    timer = setTimeout(() => {
      if (!loadingCore.isQueueEmpty) {
        loadingCore.clearQueue()
        LoadingView.hide()
      }
    }, timeout)
  }
}

const hide = () => {
  loadingCore.hide()
  if (loadingCore.isQueueEmpty) {
    LoadingView.hide()
  }
}

export default {
  show,
  hide
}
