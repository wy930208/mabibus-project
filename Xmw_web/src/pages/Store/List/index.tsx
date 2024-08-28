import { AuditOutlined, HighlightOutlined, PhoneOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { FC, useMemo, useRef, useState } from 'react';

import { fetchCouponsMembersCoupons } from '@/services/coupons';
import { getAppointmentList } from '@/services/store';

import AppointmentModal from './components/AppointmentModal';
import CouponsManageModal from './components/CouponsManageModal';
import ServiceRegistrationModal from './components/ServiceRegistrationModal';

enum DataType {
  Today = 0,
  All = 1,
}

enum ModalType {
  CouponsManage = 'couponsManage',
  Appointment = 'appointment',
  ServiceRegistration = 'serviceRegistration'
}

const ModalStyles = {
  width: 1000,
  centered: true,
  destroyOnClose: true,
}

const StoreManagement: FC = () => {
  const [dataType, setDataType] = useState(DataType.Today);

  const appointmentRef = useRef<ActionType>();

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

  const { runAsync: fetchAppointmentList } = useRequest(() => getAppointmentList({
    date: dataType === DataType.Today ? dayjs().format('YYYY-MM-DD') : undefined,
  }));

  const onDataTypeChange = (value: DataType) => {
    setDataType(value);
    appointmentRef?.current?.reload()
  }

  const [modalStatus, setModalStatus] = useState({
    appointmentOpen: false,
    couponsManageOpen: false,
    serviceRegistrationOpen: false,
  });

  const updateModalStatus = (type: string, open: boolean) => {
    setModalStatus((prev) => ({
      ...prev,
      [`${type}Open`]: open,
    }))
  }

  return (
    <PageContainer header={{ title: null }}>
      <ProCard
        colSpan={24}
        bordered
        title={`${dataType === DataType.All ? '全部' : '今日'}门店预约`}
        extra={
          <Space size={4}>
            <Button type="primary" icon={<PhoneOutlined />} onClick={() => {
              updateModalStatus(ModalType.Appointment, true)
            }}>
              预约管理
            </Button>
            <Button type="primary" icon={<HighlightOutlined />} onClick={() => {
              updateModalStatus(ModalType.ServiceRegistration, true)
            }}>
              服务登记
            </Button>
            <Button type="primary" icon={<AuditOutlined />} onClick={() => {
              updateModalStatus(ModalType.CouponsManage, true)
            }}>
              开卡管理
            </Button>
            <Button
              key="tody"
              onClick={() => onDataTypeChange(DataType.Today)}
              type='primary'
            >
              今日预约
            </Button>
            <Button
              key="all"
              onClick={() => onDataTypeChange(DataType.All)}
              type='primary'
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

      {modalStatus.appointmentOpen && <AppointmentModal
        {...ModalStyles}
        open={modalStatus.appointmentOpen}
        onCancel={() => updateModalStatus('appointment', false)}
      />}
      {modalStatus.couponsManageOpen && <CouponsManageModal
        {...ModalStyles}
        open={modalStatus.couponsManageOpen}
        onCancel={() => updateModalStatus(ModalType.CouponsManage, false)}
      />}
      {modalStatus.serviceRegistrationOpen && <ServiceRegistrationModal
        {...ModalStyles}
        open={modalStatus.serviceRegistrationOpen}
        onCancel={() => updateModalStatus(ModalType.ServiceRegistration, false)}
      />}
    </PageContainer>
  );
};

export default StoreManagement;
