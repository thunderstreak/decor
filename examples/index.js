import {
  getMockDecorator,
  setDelayDecorator,
  getLoadingDecorator,
  setRequestHeaderDecorator,
  setResponsePipeDecorator,
  setRequestConfigDecorator,
  setExtraExtensionParameterDecorator,
  getCacheDataDecorator
} from '../src'
import { handleResponseDataToMap, handleResponseTarget } from '../src/handle'
import { wrapperPost as posts, wrapperGet as gets } from './request/http'
import loading from './loading'
import { getCache, setCache } from '../src/handle'

const setLoading = getLoadingDecorator(() => loading.show({ mask: true, className: 'test' }), loading.hide)

const setMock = getMockDecorator(() => {
  return Promise.resolve({
    data: [ { test: 1, api: '2', key: 'num', code: '12' }, { key: 'num1', code: '121' } ],
    message: ['test']
  })
})
// const handleGetTargetData = handleResponseDataToList('message')
const handleGetTargetData = handleResponseTarget()
const handleGetTargetMap = handleResponseDataToMap({ labelKey: 'key', valueKey: 'code' })

const setSessStorage = setCache('sessionStorage')
const getSessStorage = getCache('sessionStorage')
const setCacheDecorator = getCacheDataDecorator(setSessStorage, getSessStorage)

const API = new class Api {
  @setResponsePipeDecorator(handleGetTargetData, handleGetTargetMap)
  @setCacheDecorator('uniqueKey')
  @setMock()
  @setLoading
  getMock = (id) => posts(`/api/list/${id}`)

  @setLoading
  @setDelayDecorator(3000)
  getList = gets('/api/list')

  @setLoading
  @setDelayDecorator(5000)
  getList1 = gets('/api/list1')
}()

// Promise.all([API.getList(), API.getList1()]).then(res => {
//   console.log(res)
// }).catch(e => {
//   console.log(e)
// })
const request = API.getMock(2)
request.then(res => {
  console.log(res)
})

