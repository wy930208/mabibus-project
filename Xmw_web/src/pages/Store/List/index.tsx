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
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Form, message, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { FC, useMemo, useRef, useState } from 'react';

import FormCustomerSelect from '@/components/FormCustomerSelect';
import FormStaffSelect from '@/components/FormStaffSelect';
import FormStoreSelect from '@/components/FormStoreSelect';
import { fetchCoupons } from '@/services/coupons';
import { createAppointment, getAppointmentList } from '@/services/store';

enum DataType {
  Today = 0,
  All = 1,
}

const StoreManagement: FC = () => {
  const [form] = Form.useForm<{
    [x: string]: any;
    name: string;
    company: string;
  }>();

  const [dataType, setDataType] = useState(DataType.Today);

  const appointmentRef = useRef<ActionType>();

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

  const columns2: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '客户',
        dataIndex: 'customer_name',
        ellipsis: true,
      },
      {
        title: '预约时间',
        dataIndex: 'appointment_time',
        ellipsis: true,
        align: 'center',
        render: (_, record) => {
          return dayjs(record.appointment_time).format('MM/DD HH:mm');
        },
      },
      {
        title: '预约老师',
        dataIndex: 'teacher_name',
        ellipsis: true,
      },
      {
        title: '预约项目',
        dataIndex: 'service_items',
        render: (value: any) => {
          return (
            <Space size={4} direction="vertical">
              {value?.map((o) => (
                <Tag color="blue" key={o.id}>
                  {o.coupon_name}
                </Tag>
              ))}
            </Space>
          );
        },
      },
    ];
  }, []);

  const { runAsync: fetchStoreList } = useRequest(fetchCoupons);

  const { runAsync: fetchAppointmentList } = useRequest(() => getAppointmentList({
    date: dataType === DataType.Today ? dayjs().format('YYYY-MM-DD') : undefined,
  }));

  const onDataTypeChange = (value: DataType) => {
    setDataType(value);
    appointmentRef?.current?.reload()
  }

  return (
    <PageContainer header={{ title: null }}>
      <ProCard gutter={8} ghost>
        <ProCard
          colSpan={13}
          bordered
          title={`${dataType === DataType.All ? '全部' : '今日'}门店预约`}
          extra={
            <Space>
              <Button
                key="tody"
                onClick={() => onDataTypeChange(DataType.Today)}
                type={dataType === DataType.Today ? 'primary' : undefined}
              >
                今日预约
              </Button>
              <Button
                key="all"
                onClick={() => onDataTypeChange(DataType.All)}
                type={dataType === DataType.All ? 'primary' : undefined}
              >
                全部预约
              </Button>
            </Space>
          }
        >
          <ProTable
            actionRef={appointmentRef}
            rowKey="id"
            request={fetchAppointmentList}
            options={false}
            columns={columns2}
            search={false}
            ghost
          />
        </ProCard>

        <ProCard colSpan={11} bordered title="去预约">
          <ProForm
            form={form}
            grid
            submitter={{
              resetButtonProps: {
                style: {
                  display: 'none',
                },
              },
              onSubmit: async () => {
                const values = await form.validateFields();
                createAppointment({
                  ...values,
                  appointment_time: values.appointment_time.toDate(),
                });
                message.success('预约成功');
                form.resetFields();
                setTimeout(() => {
                  appointmentRef?.current?.reload();
                }, 1000);
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
            <ProForm.Item
              name="service_items"
              label="服务项目"
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
      </ProCard>
    </PageContainer>
  );
};

export default StoreManagement;
