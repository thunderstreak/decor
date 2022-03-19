# decor
decorator

```shell
npm i decor-core -S
```
or
```shell
yarn add decor-core -S
```

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
      props: { value, autofocus: true, placeholder: '请输入原因' },
      on: { input: (val) => value = val }
    })
  })
})
const setConfirmRefusePromptDecorator = getPromptDecorator({ title: '确定拒绝！' })
export default new class Api {
  @setConfirmRefusePromptDecorator(handlePrompt, 'reject')
  reject = wrapperGet('api/reject')
}()

```

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
const setConfirmDeleteDecorator = getConfirmDecorator({ title: '温馨提示', content: '确认删除该投票吗？' })
export default new class Api {
  @setConfirmDeleteDecorator(handleConfirmation)
  getList = wrapperGet('api/list')
}()
```
```javascript
import { wrapperGet } from '@/js/http'
import { getCacheDataDecorator } from 'decor-core'
import { setCache, getCache } from 'decor-core/handle'

const setSessStorage = setCache('sessStorage')
const getSessStorage = getCache('sessStorage')
const setCacheDecorator = getCacheDataDecorator(setSessStorage, getSessStorage)

export default new class Api {
  @setCacheDecorator('uniqueKey')
  getList = wrapperGet('api/list')
}()
```

```javascript
import { wrapperGet } from '@/js/http'
import { setExtraExtensionParameterDecorator } from 'decor-core'

export default new class Api {
  @setExtraExtensionParameterDecorator({ extra: 'text' })
  getList = wrapperGet('api/list')
}()
```

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

```javascript
import { wrapperGet } from '@/js/http'
import { setRequestHeaderDecorator } from 'decor-core'

export default new class Api {
  @setRequestHeaderDecorator({ referer: 'test.com' })
  getList = wrapperGet('api/list')
}()
```

```javascript
import { wrapperGet } from '@/js/http'
import { getMockDecorator } from 'decor-core'

const setMockDecorator = getMockDecorator((...arg) => {
  console.log(arg) // 接口调用处传递的参数，用于判断类型返回结果
  return Promise.resolve({
    data: [
      { labels: '未开始', values: 0 },
      { labels: '进行中', values: 1 },
      { labels: '已结束', values: 2 },
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

```javascript
import { wrapperGet } from '@/js/http'
import { getMessageDecorator } from 'decor-core'
import { Message } from 'view-design'

const setMessageDecorator = getMessageDecorator({ success: Message.success, error: Message.error })
export default new class Api {
  @setMessageDecorator({ msgKey: 'errorMsg' })
  getList = wrapperGet('api/list')

  @setMessageDecorator({ successMsg: '操作成功', errorMsg: '操作失败' })
  getRecord = wrapperGet('api/record')
}()
```

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
