import {isArray, isObject} from "../utils";

/**
 * 获取目标字段值
 * */
export const handleGetTargetFiled = (data, field = '') => {
  let list = []
  for (const key in data) {
    const item = data[key]
    if (key === field) {
      list = item
      return list
    } else if (isObject(item) || isArray(item)) {
      return handleGetTargetFiled(item, field)
    }
  }
}

/**
 * 获取指定字段值list
 * */
export const handleResponseDataToList = (field = 'data') => (data = {}) => {
  const protoNum = Object.keys(data).length
  if (!data || (isObject(data) && !protoNum)) {
    return []
  }
  return handleGetTargetFiled(data, field)
}

/**
 * list 数据转换
 * */
export const handleResponseDataToMap = ({ labelKey = '', valueKey = '' }) => (list = []) => list.map(x => ({...x, label: x[labelKey], value: x[valueKey]}))

// 获取缓存中的数据
export const getCache = (type = 'localStorage') => ({ key }) => {
  const value = window[type].getItem(key)
  let cache = null
  try {
    cache = JSON.parse(value)
    // 保存数据为空
    const isEmpty = !cache.data
    // 没存储或已过期 或 保存数据为空
    if (!cache || cache.expiration < +new Date() - 30 * 60 * 1000 || isEmpty) {
      cache = null
    }
  } catch (e) {
    cache = null
  }
  return cache
}

// 设置缓存数据
export const setCache = (type = 'localStorage') => ({ key, ...data }) => {
  const value = JSON.stringify({
    ...data,
    expiration: +new Date()
  })
  window[type].setItem(key, value)
  return data
}
