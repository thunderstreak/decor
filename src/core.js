import { isObject } from './utils'

export const createDecorator = function(wrapper, ...args) {
  if (typeof wrapper !== 'function') throw Error('[create-decorator]: createDecorator Please pass in a higher-order function')

  return function handleDescriptor(target, key, descriptor) {
    if (!descriptor && typeof target === 'function') {
      return wrapper(target)
    }

    if (descriptor && !isObject(descriptor)) {
      throw Error('[create-decorator]: Descriptor is not a description object. Please check that @decorator is the correct decorator structure: function (target, name, descriptor) { ... }')
    }

    const { configurable, enumerable } = descriptor
    const originalGet = descriptor.get
    const originalSet = descriptor.set
    let originalValue = descriptor.value
    const originInitializer = descriptor.initializer
    const isGetter = !!originalGet
    const defaultSetter = newValue => originalValue = newValue
    let wrappedFn

    const desc = {
      configurable,
      enumerable
    }

    if (typeof originInitializer === 'function') {
      desc.initializer = function initializer() {
        if (!wrappedFn) {
          const realMethod = originInitializer.call(this).bind(this)
          wrappedFn = wrapper.call(this, realMethod, ...args)
        }
        return function realMethodCall(...nextArgs) {
          return wrappedFn.call(this, ...nextArgs)
        }
      }
    } else {
      desc.get = function get() {
        if (wrappedFn) return wrappedFn

        let realMethod
        if (isGetter) {
          realMethod = originalGet.call(this).bind(this)
        } else if (typeof originalValue === 'function') {
          realMethod = originalValue.bind(this)
        } else {
          throw Error('[create-decorator]: descriptor\'s `value` or `get` property is not a function')
        }

        wrappedFn = wrapper.call(this, realMethod, ...args)
        return wrappedFn
      }
      desc.set = isGetter ? originalSet : defaultSetter
    }

    return desc
  }
}

