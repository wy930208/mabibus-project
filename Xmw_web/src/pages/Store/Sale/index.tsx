import {
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components'
import { useRequest } from 'ahooks'
import { Form } from 'antd';
import { FC, useMemo } from 'react';

import FormCouponsSelect from '@/components/FormCouponsSelect';
import FormCustomerSelect from '@/components/FormCustomerSelect';
import FormStaffSelect from '@/components/FormStaffSelect';
import { fetchCoupons } from '@/services/coupons';

const StoreSale: FC = () => {
  const [form] = Form.useForm<{
    [x: string]: any; name: string; company: string
  }>();

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '项目',
        dataIndex: 'coupon_name',
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        ellipsis: true,
      },
    ]
  }, []);

  const { runAsync: fetchStoreList } = useRequest(fetchCoupons);

  return <PageContainer header={{ title: null }}>
    <ProCard gutter={0} bordered title={<></>}>
      <ProForm form={form} grid submitter={{
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}>
        <FormCustomerSelect
          colProps={{ span: 24 }}
          name="customer"
          label="会员卡号"
          rules={[{ required: true, message: '请选择客户' }]}
          placeholder="请选择或新建客户"
        />
        <FormCouponsSelect mode="multiple" name="coupons" label="销售项目" required />
        <ProForm.Group>
          <ProFormSelect
            colProps={{ span: 12 }}
            name="payment_method"
            label="付款方式"
            options={[{
              label: '现金',
              value: 'cash',
            }, {
              label: '电子支付',
              value: 'e-payment',
            }]}
          />
          <ProFormDigit
            min={0}
            colProps={{ span: 12 }}
            name="payment-amount"
            label="付款金额"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            colProps={{ span: 12 }}
            name="sales"
            min={0}
            label="业绩归属"
          />
          <ProFormDigit
            min={0}
            colProps={{ span: 12 }}
            name="sales-amount"
            label="业绩金额"
          />
        </ProForm.Group>
        <ProFormText
          colProps={{ span: 24 }}
          name="remark"
          label="服务备注"
        />
      </ProForm>
    </ProCard>
  </PageContainer>
}

export default StoreSale;
