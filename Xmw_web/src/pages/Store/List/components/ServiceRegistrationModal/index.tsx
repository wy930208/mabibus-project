import {
  ProCard,
  ProForm, ProFormDigit, ProFormSelect, ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Form, InputNumber, message, Modal, ModalProps, Select, Table } from 'antd';
import { FC, useMemo, useState } from 'react';

import CustomerCouponsList from '@/components/CustomerCouponsList';
import FormCouponsSelect from '@/components/FormCouponsSelect';
import FormCustomerSelect from '@/components/FormCustomerSelect';
import FormStaffSelect from '@/components/FormStaffSelect';
import { fetchCouponsMembersCoupons } from '@/services/coupons';
import { createSaleOrder } from '@/services/sales';
import { getUserList } from '@/services/system/user-management';

import style from './index.module.less'

const ServiceRegistrationModal: FC<ModalProps> = (props) => {
  const [form] = Form.useForm<{
    [x: string]: any;
    name: string;
    company: string;
  }>();
  const onSubmit = async () => {
    const payload = await form.validateFields();
    await createSaleOrder(payload);
    message.success('信息提交成功!')
    props.onCancel?.(undefined as any);
  };

  const [customerId, setCustomerId] = useState<string | undefined>();

  const { data } = useRequest(() => {
    return customerId
      ? fetchCouponsMembersCoupons(undefined, customerId).then((resp) => resp.data)
      : Promise.resolve([])
  }, {
    refreshDeps: [customerId],
  });

  const selectOpt = useMemo(() => {
    return data?.map((u) => ({
      label: `${u.coupon_name}-[编号${u.id}]`,
      value: u.id,
      source: u,
    }));
  }, [data]);

  const [selectValue, setSelectValue] = useState<any>([]);

  const tableData = useMemo(() => {
    return data?.filter((row) => selectValue?.includes(row.id))
  }, [data, selectValue])

  const { data: userData } = useRequest(() => {
    return getUserList({
      current: 1,
      pageSize: 500,
    }).then((resp) => {
      return resp?.data?.list;
    })
  });

  const userSelectOpt = useMemo(() => {
    return userData?.map((u) => ({
      label: u.cn_name,
      value: u.user_id,
    }));
  }, [userData]);

  return <Modal
    title="服务登记"
    onClose={() => {
      form.resetFields()
    }}
    {...props}
    onOk={async () => {
      await onSubmit();
      props?.onCancel?.(undefined as any);
    }}>
    <ProCard gutter={8} ghost>
      <ProCard bordered colSpan={16} title={<></>}>
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
            submitButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          <FormCustomerSelect
            colProps={{ span: 24 }}
            onChange={(id) => {
              setCustomerId(id);
            }}
            name="customer_id"
            label="会员卡号"
            rules={[{ required: true, message: '请选择客户' }]}
            placeholder="请选择或新建客户"
          />
          <ProFormSelect
            style={{ width: 580 }}
            onChange={(value) => {
              setSelectValue(value);
            }}
            options={selectOpt}
            mode="multiple"
            name="product_items"
            label="本次服务项目"
            required
          />
          <Table size="small" bordered columns={[
            {
              title: '服务项目',
              dataIndex: 'coupon_name',
              ellipsis: true,
            },
            {
              title: '服务次数',
              dataIndex: 'sale_price',
              ellipsis: true,
              render: (_, record) => {
                return record.coupon_type === 'times' ?
                  <Form.Item className={style.formItem} required name={`count_${record.id}`}>
                    <InputNumber min={1} max={record.remaining_times} defaultValue={1} style={{ width: '100%' }} />
                  </Form.Item>
                  : '无'
              },
            },
            {
              title: '核销金额',
              dataIndex: 'sale_price',
              ellipsis: true,
              render: (_, record) => {
                return record.coupon_type === 'prepaid' ?
                  <Form.Item className={style.formItem} required name={`count_${record.id}`}>
                    <InputNumber min={1} max={record.remaining_times} defaultValue={1} style={{ width: '100%' }} />
                  </Form.Item>
                  : '无'
              },
            },
            {
              title: '服务老师',
              dataIndex: 'remark',
              ellipsis: true,
              render: (_, record) => {
                return <Form.Item className={style.formItem} required name={`teacher_${record.id}`}>
                  <Select style={{ width: '100%' }} options={userSelectOpt} />
                </Form.Item>
              },
            },
          ]}
            dataSource={tableData}
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
            <ProFormDigit min={0} colProps={{ span: 12 }} name="payment_amount" label="付款金额" />
          </ProForm.Group>
          <ProForm.Group>
            <FormStaffSelect colProps={{ span: 12 }} name="sales" label="服务方式" />
            <ProFormText colProps={{ span: 12 }} name="remark" label="服务备注" />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard bordered colSpan={8} title="客户持卡情况">
        {customerId && <CustomerCouponsList customerId={customerId} />}
      </ProCard>
    </ProCard>
  </Modal>;
};

export default ServiceRegistrationModal;
