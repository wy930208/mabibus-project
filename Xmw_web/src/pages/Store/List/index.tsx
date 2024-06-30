import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components'
import { useRequest } from 'ahooks'
import { Form } from 'antd';
import dayjs from 'dayjs';
import { FC, useMemo, useRef, useState } from 'react';

import FormCustomerSelect from '@/components/FormCustomerSelect';
import FormStoreSelect from '@/components/FormStoreSelect';
import { fetchCoupons } from '@/services/coupons';

const StoreManagement: FC = () => {
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '项目名称',
        dataIndex: 'coupon_name',
        ellipsis: true,
      },
      {
        title: '项目备注',
        dataIndex: 'remark',
        ellipsis: true,
      },
    ]
  }, [])

  const { runAsync: fetchStoreList } = useRequest(fetchCoupons);

  return <PageContainer header={{ title: null }}>

    <ProForm form={form} grid submitter={{
      resetButtonProps: {
        style: {
          // 隐藏重置按钮
          display: 'none',
        },
      },
    }}>
      <ProCard title="预约服务" gutter={8} ghost>
        <ProCard colSpan={10} bordered>
          <FormCustomerSelect
            colProps={{ span: 24 }}
            name="customer"
            label="会员卡号"
            rules={[{ required: true, message: '请选择客户' }]}
            placeholder="请选择或新建客户"
          />
        </ProCard>

        <ProCard colSpan={14} bordered>
          <ProForm.Item name="coupons" label="服务项目" required>
            <ProTable
              rowKey="id"
              options={false}
              ghost
              request={fetchStoreList}
              columns={columns}
              search={false}
              rowSelection={{
                type: 'checkbox', onChange: (ids) => {
                  form.setFieldsValue({
                    coupons: ids,
                  })
                },
              }}
              pagination={false}
            />
          </ProForm.Item>
          <ProForm.Group>
            <ProFormSelect
              colProps={{ span: 12 }}
              name="server_method"
              label="服务方式"
              options={[{
                label: '上门',
                value: 'house',
              }, {
                label: '到店',
                value: 'store',
              }]}
            />
            <ProFormDateTimePicker
              colProps={{ span: 12 }}
              name="book_time"
              label="预约时间"
              fieldProps={{
                showTime: {
                  format: 'HH:mm',
                },
                disabledDate: (current) => current && current < dayjs().startOf('day'),
              }}
            />
          </ProForm.Group>
          <ProForm.Group>
            <FormStoreSelect
              colProps={{ span: 12 }}
              name="store"
              label="服务门店"
            />
            <ProFormSelect
              colProps={{ span: 12 }}
              name="book_method"
              label="预约方式"
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              colProps={{ span: 12 }}
              name="tec"
              label="预约老师"
            />
            <ProFormText
              colProps={{ span: 12 }}
              name="remark"
              label="预约备注"
            />
          </ProForm.Group>

        </ProCard>

      </ProCard>
    </ProForm>

  </PageContainer>
}

export default StoreManagement;
