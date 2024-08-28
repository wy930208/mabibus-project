import {
  ProForm, ProFormDigit, ProFormSelect, ProFormText,
} from '@ant-design/pro-components';
import { Form, message, Modal, ModalProps, Table } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';

import FormCouponsSelect from '@/components/FormCouponsSelect';
import FormCustomerSelect from '@/components/FormCustomerSelect';
import FormStaffSelect from '@/components/FormStaffSelect';
import { fetchCoupons } from '@/services/coupons';
import { createSaleOrder } from '@/services/sales';

const CouponsManageModal: FC<ModalProps> = (props) => {
  const [form] = Form.useForm<{
    [x: string]: any;
    name: string;
    company: string;
  }>();

  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<any>();

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

  useEffect(() => {
    fetchCoupons().then((resp) => {
      setDataSource(resp?.data);
    })
  }, []);

  const tableData = useMemo(() => {
    return dataSource?.filter((row) => selectedCoupons?.includes(row.id))
  }, [dataSource, selectedCoupons])

  const opt = useMemo(() => {
    return dataSource?.map((u) => ({
      label: u.coupon_name,
      value: u.id,
    }));
  }, [dataSource])

  return <Modal title="开卡管理" {...props} onOk={async () => {
    await onSubmit();
    props?.onCancel?.(undefined as any);
  }}>
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
        name="customer_id"
        label="会员卡号"
        rules={[{ required: true, message: '请选择客户' }]}
        placeholder="请选择或新建客户"
      />
      <ProFormSelect
        options={opt}
        style={{ width: 580 }}
        onChange={onCouponSelect}
        mode="multiple"
        name="product_items"
        label="销售项目"
        required
      />
      <Table
        columns={[
          {
            title: '项目',
            dataIndex: 'coupon_name',
            ellipsis: true,
          },
          {
            title: '价格',
            dataIndex: 'sale_price',
            ellipsis: true,
          },
          {
            title: '备注',
            dataIndex: 'remark',
            ellipsis: true,
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
        <ProFormDigit min={0} colProps={{ span: 12 }} name="sale_amount" label="付款金额" />
      </ProForm.Group>
      <ProForm.Group>
        <FormStaffSelect colProps={{ span: 12 }} name="sales" label="业绩归属" />
        <ProFormText colProps={{ span: 12 }} name="remark" label="服务备注" />
      </ProForm.Group>
    </ProForm>
  </Modal>;
};

export default CouponsManageModal;
