/*
 * @Description: 全局组件 loading 配置
 * @Version: 2.0
 * @Author: 白雾茫茫丶
 * @Date: 2023-08-24 09:05:47
 * @LastEditors: 白雾茫茫丶
 * @LastEditTime: 2023-08-24 17:24:19
 */
import { Spin } from 'antd'
import { FC } from 'react'

const ComponentLoading: FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <Spin size="large" />
    </div>
  )
}
export default ComponentLoading