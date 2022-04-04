import { createDecorator } from './core'
export {
  /*
  * loading decorator
  * */
  getLoadingDecorator,
  /*
  * message decorator
  * */
  getMessageDecorator,
  /*
  * mock decorator
  * */
  getMockDecorator,
  /*
  * confirm decorator
  * */
  getConfirmDecorator,
  /*
  * prompt decorator
  * */
  getPromptDecorator,
  /*
  * cache decorator
  * */
  getCacheDecorator,
  /*
  * cache data decorator high function
  * */
  getCacheDataDecorator,
  /*
  * extra extension parameter
  * */
  setExtraExtensionParameterDecorator,
  /*
  * request header
  * */
  setRequestHeaderDecorator,
  /*
  * request config
  * */
  setRequestConfigDecorator,
  /*
  * delay
  * */
  setDelayDecorator,
  /*
  * request log
  * */
  setRequestLogDecorator,
  /*
   * response data
   * */
  setResponseDataDecorator,
  /*
  * response compose
  * */
  setResponseComposeDecorator,
  /*
  * response pipe
  * */
  setResponsePipeDecorator
} from './apply'

export default createDecorator
