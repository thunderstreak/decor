import { getMockDecorator, setDelayDecorator, getLoadingDecorator } from '../src'
import { wrapperGet } from './request/http'
import loading from './loading'

const setLoading = getLoadingDecorator(() => loading.show({ mask: true, className: 'test' }), loading.hide)

const setMock = getMockDecorator(() => {
  return Promise.resolve({
    data: [ { test: 1, api: '2'} ]
  })
})
const API = new class Api {
  @setMock('ttt')
  get = () => Promise.resolve({data: 'tt'})

  @setLoading
  @setDelayDecorator(3000)
  getList = wrapperGet('/api/list')

  @setLoading
  @setDelayDecorator(5000)
  getList1 = wrapperGet('/api/list1')
}()

Promise.all([API.getList(), API.getList1()]).then(res => {
  console.log(res)
}).catch(e => {
  console.log(e)
})
// API.getList(null).then(res => {
//   console.log(res)
// })

