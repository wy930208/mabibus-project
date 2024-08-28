import {
  ProCard,
  ProColumns, ProForm, ProFormDateTimePicker, ProFormSelect, ProFormText, ProTable,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Col, Form, message, Modal, ModalProps, Row } from 'antd';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';

import CustomerCouponsList from '@/components/CustomerCouponsList';
import FormCustomerSelect from '@/components/FormCustomerSelect';
import FormStaffSelect from '@/components/FormStaffSelect';
import FormStoreSelect from '@/components/FormStoreSelect';
import { fetchCoupons } from '@/services/coupons';
import { createAppointment } from '@/services/store';

const AppointmentModal: FC<ModalProps> = (props) => {
  const [form] = Form.useForm<{
    [x: string]: any;
    name: string;
    company: string;
  }>();

  const [customerId, setCustomerId] = useState<string | undefined>();

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '服务项目',
        dataIndex: 'coupon_name',
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        ellipsis: true,
      },
    ];
  }, []);

  const { runAsync: fetchStoreList } = useRequest(fetchCoupons);

  return <Modal title="预约管理" {...props} onOk={async () => {
    const values = await form.validateFields();
    createAppointment({
      ...values,
      appointment_time: values.appointment_time.toDate(),
    });
    message.success('预约成功');
    props?.onCancel?.(undefined as any);
  }}>
    <ProCard gutter={12} ghost>
      <ProCard bordered colSpan={16}>
        <ProForm
          form={form}
          grid
          submitter={{
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
            onChange={(id) => {
              setCustomerId(id);
            }}
          />
          <ProForm.Item
            name="service_items"
            label="本次预约项目"
            rules={[
              {
                required: true,
                message: '请选择服服务项目',
              },
            ]}
          >
            <ProTable
              rowKey="id"
              options={false}
              ghost
              request={fetchStoreList}
              columns={columns}
              search={false}
              rowSelection={{
                type: 'checkbox',
                onChange: (ids) => {
                  form.setFieldsValue({
                    service_items: ids,
                  });
                },
              }}
              pagination={false}
            />
          </ProForm.Item>
          <ProForm.Group>
            <ProFormSelect
              colProps={{ span: 12 }}
              name="service_mode"
              label="服务方式"
              rules={[
                {
                  required: true,
                  message: '请选择服务方式',
                },
              ]}
              options={[
                {
                  label: '上门',
                  value: 'home',
                },
                {
                  label: '到店',
                  value: 'store',
                },
              ]}
            />
            <ProFormDateTimePicker
              colProps={{ span: 12 }}
              name="appointment_time"
              label="预约时间"
              dataFormat="'YYYY-MM-DD HH:mm:ss"
              rules={[
                {
                  required: true,
                  message: '请选择预约时间',
                },
              ]}
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
              name="org_id"
              label="服务门店"
              rules={[
                {
                  required: true,
                  message: '请选择门店',
                },
              ]}
            />
            <ProFormSelect
              colProps={{ span: 12 }}
              name="appointment_method"
              options={[
                {
                  label: '门店',
                  value: 'store',
                },
                {
                  label: '电话',
                  value: 'phone',
                },
                {
                  label: '微信',
                  value: 'wechat',
                },
              ]}
              label="预约方式"
            />
          </ProForm.Group>
          <ProForm.Group>
            <FormStaffSelect
              colProps={{ span: 12 }}
              name="appointment_teacher"
              label="预约老师"
              rules={[
                {
                  required: true,
                  message: '请选择预约老师',
                },
              ]}
            />
            <ProFormText colProps={{ span: 12 }} name="remark" label="预约备注" />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard bordered title={<span style={{ fontSize: 14, fontWeight: 500 }}>客户持卡明细</span>} colSpan={8}>
        {customerId && <CustomerCouponsList customerId={customerId} />}
      </ProCard>
    </ProCard>
  </Modal>;
};

export default AppointmentModal;
