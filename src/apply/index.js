import { createDecorator } from '../core'
import { compose, pipe } from '../utils'
import { COMPOSE, DEVELOPMENT, PIPE } from '../constant'

const NODE_ENV = process.env.NODE_ENV

// loading decorator
export const getLoadingDecorator = (show, hide) => createDecorator(fn => async (...args) => {
  if (show && hide) {
    show()
  }
  const res = fn(...args)
  if (typeof res === 'function') {
    return res().finally(hide)
  }
  return await res.finally(hide)
})

// success or error message notify
export const getMessageDecorator = toast => ({successMsg, errorMsg, msgKey} = {}) => {
  const alert = typeof window !== 'undefined' ? window.alert : console.log
  const getToast = key => typeof toast === 'object' && typeof toast[key] === 'function' ? toast[key] : alert
  const successToast = getToast('success')
  const errorToast = getToast('error')

  return createDecorator(fn => (...args) => {
    const middleFn = fn(...args)
    const request = middleFn.then ? middleFn : middleFn()
    return typeof fn === 'function' && request.then(res => {
      const msg = msgKey ? res[msgKey] : successMsg
      msg && successToast(msgKey ? res[msgKey] : successMsg)
      return Promise.resolve(res)
    }, err => {
      const msg = msgKey ? err[msgKey] : errorMsg
      msg && errorToast(msgKey ? err[msgKey] : errorMsg)
      return Promise.reject(err)
    })
  })
}

// request log
export const setRequestLogDecorator = createDecorator(fn => async (...args) => {
  const name = fn ? fn.name : 'anonymity'
  console.log(`[log] ${name} before: `, ...args)
  const result = await fn(...args)
  console.log(`[log] ${name} after: `, result)
  return result
})

// mock decorator
export const getMockDecorator = mock => (env = DEVELOPMENT) => createDecorator(fn => (...args) => {
  const res = env === NODE_ENV ? mock(...args) : fn(...args)
  return typeof res === 'function' ? res() : res
})

// set request header config
export const setRequestHeaderDecorator = (...headers) => createDecorator(fn => (...args) => {
  const params = [...args, { headers }]
  const res = fn(...params)
  return typeof res === 'function' ? res(...params) : res
})

// set request config
export const setRequestConfigDecorator = (...config) => createDecorator(fn => (...args) => {
  const params = [...args, { config }]
  const res = fn(...params)
  return typeof res === 'function' ? res(...params) : res
})

// set request delay
export const setDelayDecorator = (wait = 0) => createDecorator(fn => (...args) => {
  if (NODE_ENV === DEVELOPMENT) {
    return new Promise(resolve => {
      setTimeout(() => {
        const res = fn(...args)
        resolve(typeof res === 'function' ? res() : res)
      }, wait)
    })
  }
  const res = fn(...args)
  return typeof res === 'function' ? res() : res
})

// set response transform to target data
export const setResponseDataDecorator = handle => createDecorator(fn => async (...args) => {
  const data = await fn(...args)
  if (typeof data === 'function') {
    const res = await data()
    return handle(res)
  }
  return handle(data)
})

// del confirm decorator
export const getConfirmDecorator = (...config) => handle => createDecorator(fn => async (...args) => {
  const confirm = await handle(...config)
  if (confirm) {
    const res = fn(...args)
    return typeof res === 'function' ? res() : res
  }
})

// set additional extension parameters
export const setExtraExtensionParameterDecorator = (...extras) => createDecorator((fn) => (...args) => {
  const params = [...args, { extras }]
  const res = fn(...params)
  return typeof res === 'function' ? res(...params) : res
})

// set input prompt tips
export const getPromptDecorator = (...config) => (handle, key) => createDecorator(fn => async (...args) => {
  const confirm = await handle(...config)
  if (confirm) {
    const { value } = confirm
    args[0] = { ...args[0], [key]: value }
    const res = await fn(...args)
    return typeof res === 'function' ? res() : res
  }
})

// set response data compose pipe line
const composeOrPipe = (key = COMPOSE) => (...handle) => createDecorator(fn => async (...args) => {
  let data = await fn(...args)
  if (typeof data === 'function') {
    data = await data()
  }
  let res = _ => _
  if (key === COMPOSE) {
    res = compose(...handle)
  } else if (key === PIPE) {
    res = pipe(...handle)
  }
  return res(data)
})
export const setResponseComposeDecorator = composeOrPipe(COMPOSE)
export const setResponsePipeDecorator = composeOrPipe(PIPE)

// get cache
export const getCacheDecorator = (handle) => createDecorator(fn => async (...args) => {
  const cache = handle()
  if (cache) {
    return cache
  } else {
    const res = await fn(...args)
    return typeof res === 'function' ? res() : res
  }
})

// cache
export const getCacheDataDecorator = (set, get) => (key) => createDecorator(fn => async (...args) => {
  const uniqueKey = key + JSON.stringify(args[0])
  const cache = get({key: uniqueKey, ...args[0]})
  if (cache) {
    return cache
  } else {
    const data = await fn(...args)
    const res = typeof data === 'function' ? data() : data
    return set({key: uniqueKey, ...res})
  }
})

