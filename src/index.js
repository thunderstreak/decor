import { createDecorator } from './core'
export {
  getLoadingDecorator,
  getMessageDecorator,
  getMockDecorator,
  getConfirmDecorator,
  getPromptDecorator,
  getCacheDecorator,
  getCacheDataDecorator,

  setExtraExtensionParameterDecorator,
  setRequestHeaderDecorator,
  setDelayDecorator,
  setResponseDataDecorator,
  setRequestLogDecorator,
  setResponseComposeDecorator,
  setResponsePipeDecorator
} from './apply'

export default createDecorator
