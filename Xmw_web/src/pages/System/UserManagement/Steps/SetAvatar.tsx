import { Form, Row } from 'antd'
import type { FC } from 'react'

import UploadImage from '@/components/UploadImage' // 上传头像组件

const SetAvatar: FC = () => {
  return (
    <Row justify="center" style={{ width: '100%' }}>
      <Form.Item
        name="avatar_url"
      >
        <UploadImage
          fieldProps={{
            listType: 'picture-circle',
            maxCount: 1,
          }} />
      </Form.Item>
    </Row>
  )
}
export default SetAvatar