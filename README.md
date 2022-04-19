# decor
decorator

```shell
npm i decor-core -S
```
or
```shell
yarn add decor-core -S
```

### get prompt operation
```javascript
import { wrapperGet } from '@/js/http'
import { getPromptDecorator } from 'decor-core'
import { Modal } from 'view-design'

const handlePrompt = (args) => new Promise((resolve, reject) => {
  let value = ''
  Modal.confirm({
    ...args,
    onOk() { resolve({ value }) },
    onCancel() { reject(null) },
    render: (h) => h('Input', {
      props: { value, autofocus: true, placeholder: 'Please enter the reason' },
      on: { input: (val) => value = val }
    })
  })
})
const setConfirmRefusePromptDecorator = getPromptDecorator({ title: 'Determine refused to！' })
export default new class Api {
  @setConfirmRefusePromptDecorator(handlePrompt, 'reject')
  reject = wrapperGet('api/reject')
}()

```

### set confirm operation
```javascript
import { wrapperGet } from '@/js/http'
import { getConfirmDecorator } from 'decor-core'
import { Modal } from 'view-design'

const handleConfirmation = (args) => new Promise((resolve, reject) => {
  Modal.confirm({ 
    ...args,
    onOk() { resolve('resolve') },
    onCancel() { reject(null) }
  })
})
const setConfirmDeleteDecorator = getConfirmDecorator({ title: 'hint', content: 'Are you sure？' })
export default new class Api {
  @setConfirmDeleteDecorator(handleConfirmation)
  getList = wrapperGet('api/list')
}()
```

### set and get cache data
```javascript
import { wrapperGet } from '@/js/http'
import { getCacheDataDecorator } from 'decor-core'
import { setCache, getCache } from 'decor-core/handle'

const setSessStorage = setCache('sessionStorage')
const getSessStorage = getCache('sessionStorage')
const setCacheDecorator = getCacheDataDecorator(setSessStorage, getSessStorage)

export default new class Api {
  @setCacheDecorator('uniqueKey')
  getList = wrapperGet('api/list')
}()
```

### set delay
```javascript
import { wrapperGet } from '@/js/http'
import { setDelayDecorator } from 'decor-core'

export default new class Api {
  @setDelayDecorator(3000)
  getList = wrapperGet('api/list')
}()
```

### set extra extension params
```javascript
import { wrapperGet } from '@/js/http'
import { setExtraExtensionParameterDecorator } from 'decor-core'

export default new class Api {
  @setExtraExtensionParameterDecorator({ extra: 'text' })
  getList = wrapperGet('api/list')
}()
```

### set response data transforms or filter
```javascript
import { wrapperGet } from '@/js/http'
import { setResponseDataDecorator, setResponsePipeDecorator, setResponseComposeDecorator } from 'decor-core'
import { handleResponseDataToMap, handleResponseDataToList } from 'decor-core/handle'

const getTargetList = handleResponseDataToList('data')
const getTargetMap = handleResponseDataToMap({ labelKey: 'label', valueKey: 'value' })
export default new class Api {
  @setResponseDataDecorator(getTargetList)
  getList = wrapperGet('api/list')

  @setResponseComposeDecorator(getTargetMap, getTargetList)
  getRecord = wrapperGet('api/record')

  @setResponsePipeDecorator(getTargetList, getTargetMap)
  getRow = wrapperGet('api/row')
}()
```

### set request headers
```javascript
import { wrapperGet } from '@/js/http'
import { setRequestHeaderDecorator } from 'decor-core'

export default new class Api {
  @setRequestHeaderDecorator({ referer: 'test.com' })
  getList = wrapperGet('api/list')
}()
```

### api mock function
```javascript
import { wrapperGet } from '@/js/http'
import { getMockDecorator } from 'decor-core'

const setMockDecorator = getMockDecorator((...arg) => {
  console.log(arg)
  return Promise.resolve({
    data: [
      { labels: 'NO START', values: 0 },
      { labels: 'PENDING', values: 1 },
      { labels: 'END TIME', values: 2 },
    ]
  })
})
export default new class Api {
  @setMockDecorator('development')
  getList = wrapperGet('api/list')
  
  @setMockDecorator('test')
  getList = wrapperGet('api/list1')
}()
```

### set response message tips
```javascript
import { wrapperGet } from '@/js/http'
import { getMessageDecorator } from 'decor-core'
import { Message } from 'view-design'

const setMessageDecorator = getMessageDecorator({ success: Message.success, error: Message.error })
export default new class Api {
  @setMessageDecorator({ msgKey: 'errorMsg' })
  getList = wrapperGet('api/list')

  @setMessageDecorator({ successMsg: 'success!', errorMsg: 'error!' })
  getRecord = wrapperGet('api/record')
}()
```

### set request loading
```javascript
import { wrapperGet } from '@/js/http'
import { getLoadingDecorator } from 'decor-core'
import { LoadingBar } from 'view-design'

const setLoadingDecorator = getLoadingDecorator(LoadingBar.start, LoadingBar.finish)
export default new class Api {
  @setLoadingDecorator
  getList = wrapperGet('api/list')
}()
```

### set request config
```javascript
import { wrapperGet } from '@/js/http'
import { setRequestConfigDecorator } from 'decor-core'

const config = {
  url: '/user',
  baseURL: 'https://some-domain.com/api/',
  headers: {'X-Requested-With': 'XMLHttpRequest'},
}
export default new class ActivityApi{
  @setRequestConfigDecorator(config)
  get = wrapperGet('/api/list')
}()
```

### set request cancel
```javascript
import axios from 'axios'
import { wrapperGet } from '@/js/http'
import { setRequestConfigDecorator } from 'decor-core'

const CancelToken = axios.CancelToken

export default new class CouponApi {
  cancelExector = () => {}
  cancelToken = null

  constructor() {
    this.generateCancelToken()
  }

  generateCancelToken() {
    this.cancelToken = new CancelToken((c) => this.cancelExecutor = c)
  }

  get = () => {
    this.generateCancelToken()
    const handleSetConfig = setRequestConfigDecorator({ cancelToken: this.cancelToken })
    return handleSetConfig(wrapperPost('/api/list'))
  }
}()
```
