import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { FC, useState } from 'react';

import FormCouponsSelect from '@/components/FormCouponsSelect';
import FormCustomerSelect from '@/components/FormCustomerSelect';
import FormStaffSelect from '@/components/FormStaffSelect';
import { createSaleOrder } from '@/services/sales';

const StoreSale: FC = () => {
  const [form] = Form.useForm<{
    [x: string]: any;
    name: string;
    company: string;
  }>();

  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

  const onSubmit = async () => {
    const payload = await form.validateFields();
    await createSaleOrder(payload);
    message.success('信息提交成功!')
    form.resetFields();
    setSelectedCoupons([]);
  };

  const onCouponSelect = (values: string[]) => {
    setSelectedCoupons(values);
  }

  return (
    <PageContainer header={{ title: null }}>
      <ProCard gutter={0} bordered title={<></>}>
        <ProForm
          form={form}
          grid
          submitter={{
            onSubmit: onSubmit,
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          <FormCustomerSelect
            colProps={{ span: 24 }}
            name="customer_id"
            label="会员卡号"
            rules={[{ required: true, message: '请选择客户' }]}
            placeholder="请选择或新建客户"
          />
          <FormCouponsSelect
            value={selectedCoupons}
            onChange={onCouponSelect}
            mode="multiple"
            name="product_items"
            label="销售项目"
            required 
          />
          <ProForm.Group>
            <ProFormSelect
              colProps={{ span: 12 }}
              name="payment_method"
              label="付款方式"
              options={[
                {
                  label: '现金',
                  value: 'cash',
                },
                {
                  label: '电子支付',
                  value: 'ePayment',
                },
                {
                  label: '账户余额',
                  value: 'balance',
                },
              ]}
            />
            <ProFormDigit min={0} colProps={{ span: 12 }} name="sale_amount" label="付款金额" />
          </ProForm.Group>
          <ProForm.Group>
            <FormStaffSelect colProps={{ span: 12 }} name="sales" label="业绩归属" />
            <ProFormText colProps={{ span: 12 }} name="remark" label="服务备注" />
          </ProForm.Group>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default StoreSale;
