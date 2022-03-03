const isType = type => data => Object.prototype.toString.call(data) === `[object ${type}]`
export const isObject = isType('Object')
export const isArray = isType('Array')
export const isFunction = isType('Function')
export const isNumber = isType('Number')

export const handleArrayToObject = (data) => data.reduce((prev, curr) => {
  Object.keys(curr).forEach(x => prev[x] = curr[x])
  return prev
}, {})

export const compose = (...fns) => {
  if (fns.length === 0) {
    return arg => arg
  }

  if (fns.length === 1) {
    return fns[0]
  }

  return fns.reduce((a, b) => (...args) => a(b(...args)))
}

export const composes = (...fns) => x => fns.reduceRight((arg, fn) => fn(arg), x)

export const pipe = (...fns) => x => fns.reduce((arg, fn) => fn(arg), x)