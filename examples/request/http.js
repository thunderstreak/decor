import service from './index'
import { handleArrayToObject, isArray, isObject } from '../../src/utils'

const { get, post, put, delete: del } = service

/**
 * 请求参数处理
 **/
const handleRequestParams = (data = []) => {
  if (!data.length) {
    return null
  }
  // first参数是Api在具体调用的时候传递的
  const [first, ...other] = data
  let temp = {}
  let params = {}

  // 针对传入的额外扩展参数和header参数统一合并, other存在的时候一定是额外扩展参数
  if (other.length) {
    temp = handleArrayToObject(other)
    if (temp.extras) {
      temp.extras = {
        ...handleArrayToObject(temp.extras)
      }
    }
  } else if (first && first.extras) { // 当通过装饰器传递额外扩展参数的时候,且Api具体调用的地方没有传递任何参数
    temp.extras = {
      ...handleArrayToObject(first.extras)
    }
  }

  if (isArray(first)) {
    params = first.map(x => ({
      ...x,
      ...temp.extras
    }))
  } else if (isObject(first)) {
    params = {
      ...first,
      ...temp.extras
    }
  }

  return params
}

/*
 * 设置基本信息
 * */
const handleSetBase = (key = '') => (data = []) => {
  const other = data.slice(1)
  const {
    headers,
    config
  } = handleArrayToObject(other)
  let result = {}
  // 请求headers
  if (key === 'headers' && headers) {
    result = {
      headers: handleArrayToObject(headers)
    }
  }
  // 请求config
  if (key === 'config' && config) {
    result = {
      ...handleArrayToObject(config)
    }
  }
  return result
}

/**
 * 设置请求头
 **/
const handleSetHeader = handleSetBase('headers')

/**
 * 设置请求配置
 **/
const handleSetConfig = handleSetBase('config')

/**
 * 获取基本配置
 **/
const handleGetBase = (methods = '') => (data = []) => {
  const config = {
    ...handleSetHeader(data),
    ...handleSetConfig(data)
  }
  if (methods === 'GET') {
    config.params = handleRequestParams(data)
  }
  return config
}

/*
 * 获取get类型请求所需要的参数
 * */
const setParams = handleGetBase('GET')
/*
 * 获取post类型请求所需要的参数
 * */
const setData = handleGetBase('POST')
/**
 * GET 请求
 **/
export const wrapperGet = url => (...params) => get(url, setParams(params))

/**
 * POST 请求
 **/
export const wrapperPost = url => (...data) => post(url, handleRequestParams(data), setData(data))

/**
 * PUT 请求
 **/
export const wrapperPut = url => (...data) => put(url, handleRequestParams(data), setData(data))

/**
 * DELETE 请求
 **/
export const wrapperDel = url => (...params) => del(url, setParams(params))

/**
 * POST From 请求
 **/
export const wrapperFormPost = url => (...data) => {
  const params = handleRequestParams(data)
  const formData = Object.keys(params).reduce((prev, next) => {
    prev.append(next, params[next])
    return prev
  }, new FormData())
  return post(url, formData, setData(data))
}

/**
 * POST Params 请求
 **/
export const wrapperPostParams = url => (...params) => post(url, null, setParams(params))
