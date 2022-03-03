import { createDecorator } from './core'
export {
  getLoadingDecorator,
  getMessageDecorator,
  setRequestLogDecorator,
  getMockDecorator,
  setRequestHeaderDecorator,
  setDelayDecorator,
  setResponseDataDecorator,
  getConfirmDecorator,
  setExtraExtensionParameterDecorator,
  getPromptDecorator,
  setResponseComposeDecorator,
  setResponsePipeDecorator,
  getCacheDecorator,
  getCacheDataDecorator
} from './apply'

export default createDecorator
