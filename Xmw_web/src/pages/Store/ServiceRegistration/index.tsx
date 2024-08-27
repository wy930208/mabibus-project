import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Form, message, Table } from 'antd';
import { FC } from 'react';

import FormCouponsSelect from '@/components/FormCouponsSelect';
import FormCustomerSelect from '@/components/FormCustomerSelect';
import FormStaffSelect from '@/components/FormStaffSelect';
import { fetchCouponsMembersCoupons } from '@/services/coupons';
import { createSaleOrder } from '@/services/sales';

/**
 * 服务登记
 * @returns 
 */
const ServiceRegistration: FC = () => {
  const [form] = Form.useForm<{
    [x: string]: any;
    name: string;
    company: string;
  }>();
  const onSubmit = async () => {
    const payload = await form.validateFields();
    await createSaleOrder(payload);
    message.success('信息提交成功!')
    form.resetFields();
  };

  const { data, run } = useRequest((id) => fetchCouponsMembersCoupons(undefined, id).then((resp) => resp.data), {
    manual: true,
  });

  return (
    <PageContainer header={{ title: '服务登记' }}>
      <ProCard gutter={8} ghost>
        <ProCard colSpan={12} gutter={0} bordered title={<></>}>
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
              onChange={(id) => {
                run(id)
              }}
              name="customer_id"
              label="会员卡号"
              rules={[{ required: true, message: '请选择客户' }]}
              placeholder="请选择或新建客户"
            />
            <FormCouponsSelect mode="multiple" name="product_items" label="销售项目" required />
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
              <ProFormDigit min={0} colProps={{ span: 12 }} name="payment_amount" label="付款金额" />
            </ProForm.Group>
            <ProForm.Group>
              <FormStaffSelect colProps={{ span: 12 }} name="sales" label="服务方式" />
              <ProFormText colProps={{ span: 12 }} name="remark" label="服务备注" />
            </ProForm.Group>
          </ProForm>
        </ProCard>
        <ProCard colSpan={12} bordered title="客户持卡情况">
          <Table
            pagination={false}
            columns={[
            {
              title: '产品名称',
              dataIndex: 'coupon_name',
            },
            {
              title: '余额',
              dataIndex: 'coupon_name',
              render: (_, record) => {
                return record.coupon_type === 'times'
                  ? `剩余 ${record.remaining_times} 次`
                  : `剩余 ${record.balance} 元`
              },
            },
          ]} dataSource={data} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default ServiceRegistration;
