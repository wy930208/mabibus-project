import {
  ModalForm,
  ModalFormProps,
  ProForm,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import dayjs from 'dayjs';
import { FC } from 'react';

import { createCustomer } from '@/services/customer';

const CreateCustomerModal: FC<Partial<ModalFormProps>> = (props) => {
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  return <ModalForm
    title="新建客户"
    width={500}
    style={{ height: 500, overflow: 'auto' }}
    form={form}
    {...props}
    onFinish={async (values) => {
      const newCustomer = await createCustomer(values).then((r) => r.data);
      message.success('创建成功');
      props?.onFinish?.(newCustomer);
    }}
  >
    <ProFormText
      colProps={{ span: 24 }}
      name="user_name"
      label="姓名"
      rules={[{ required: true, message: '名称不能为空' }]}
      placeholder="请输入姓名"
    />
    <ProFormText
      rules={[{ required: true, message: '手机号码不能为空' }, { max: 11, message: '手机号码不能超过11位' }]}
      name="phone"
      label="联系方式"
      placeholder="手机号码"
    />
    <ProFormText
      name="address"
      label="家庭地址"
      placeholder="请输入家庭地址"
    />
    <ProForm.Group>
      <ProFormDateTimePicker
        colProps={{ span: 12 }}
        name="last_visit_store_time"
        label="最近到店时间"
      // disabled
      />
      <ProFormDateTimePicker
        colProps={{ span: 12 }}
        name="next_visit_store_time"
        label="预约下次到店时间"
        fieldProps={{
          showTime: {
            format: 'HH:mm',
          },
          disabledDate: (current) => current && current < dayjs().startOf('day'),
        }}
      />
    </ProForm.Group>
    <ProFormRadio.Group
      disabled
      initialValue={2}
      label="性别"
      name="sex"
      options={[{
        value: 0,
        label: '女性',
      },
      {
        value: 1,
        label: '男性',
      },
      {
        value: 2,
        label: '隐私',
      },
      ]}
    />
    <ProFormRadio.Group
      initialValue={1}
      label="状态"
      name="status"
      options={[{
        value: 0,
        label: '禁用',
      },
      {
        value: 1,
        label: '启用',
      }]}
    />
  </ModalForm>
}

export default CreateCustomerModal