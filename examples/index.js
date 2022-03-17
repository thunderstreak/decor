import { getMockDecorator } from '../src'

const setMock = getMockDecorator(() => {
  return Promise.resolve({
    data: [ { test: 1, api: '2'} ]
  })
})
const API = new class Api {
  @setMock('ttt')
  get = () => Promise.resolve({data: 'tt'})
}()

API.get('1').then(res => {
  console.log(res)
})
