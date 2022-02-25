import { createDecorator } from '@inkefe/create-decorator'
import { compose, pipe } from './utils'

// loading decorator
export const getLoadingDecorator = (show, hide) => createDecorator(fn => async (...args) => {
  if (show && hide) {
    show()
  }
  const res = await fn(...args)
  hide()
  return res
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
export const getMockDecorator = mockFn => createDecorator(fn => (...args) => {
  if (process.env.NODE_ENV === 'development') {
    return mockFn(...args)
  }
  return fn(...args)
})

// set request header config
export const setRequestHeaderDecorator = (...headers) => createDecorator(fn => (...args) => fn(...[...args, {headers}]))

// set request delay
export const setDelayDecorator = (wait = 0) => createDecorator(fn => (...args) => {
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(fn(...args))
      }, wait)
    })
  }
  return fn(...args)
})

// set response transform to target data
export const setResponseDataDecorator = handle => createDecorator(fn => async (...args) => {
  const data = await fn(...args)
  return handle(data)
})

// del confirm decorator
export const getConfirmDecorator = (...config) => handle => createDecorator(fn => async (...args) => {
  const confirm = await handle(...config)
  if (confirm) {
    const res = fn(...args)
    if (typeof res === 'function') {
      return res()
    }
    return res
  }
})

// set additional extension parameters
export const setExtraExtensionParameterDecorator = (...extras) => createDecorator((fn) => (...args) => fn(...[...args, {extras}]))

// set input prompt tips
export const getPromptDecorator = (...config) => (handle, key) => createDecorator(fn => async (...args) => {
  const confirm = await handle(...config)
  if (confirm) {
    const {value} = confirm
    args[0] = {...args[0], [key]: value}
    return fn(...args)
  }
})

// set response data compose pipe line
const composePipe = (key = 'compose') => (...handle) => createDecorator(fn => async (...args) => {
  const data = await fn(...args)
  let res = () => {}
  if (key === 'compose') {
    res = compose(...handle)
  } else if (key === 'pipe') {
    res = pipe(...handle)
  }
  return res(data)
})
export const setComposeDecorator = composePipe('compose')
export const setPipeDecorator = composePipe('pipe')

// get cache
export const getCacheDecorator = (handle) => createDecorator(fn => async (...args) => {
  const cache = handle()
  return cache ? cache : await fn(...args)
})

// cache
export const getCacheDataDecorator = (set, get) => (key) => createDecorator(fn => async (...args) => {
  const uniqueKey = key + JSON.stringify(args[0])
  const cache = get({key: uniqueKey, ...args[0]})
  if (cache) {
    return cache
  } else {
    const data = await fn(...args)
    return set({key: uniqueKey, ...data})
  }
})

