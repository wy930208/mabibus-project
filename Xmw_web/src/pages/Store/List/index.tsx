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
import { groupBy } from 'lodash-es';
import { FC, useMemo, useRef, useState } from 'react';

import { fetchCouponsMembersCoupons } from '@/services/coupons';
import { getAppointmentList } from '@/services/store';
import { getUserList } from '@/services/system/user-management';

import AppointmentModal from './components/AppointmentModal';
import CouponsManageModal from './components/CouponsManageModal';
import CustomerListModal from './components/CustomerListModal';
import ServiceRegistrationModal from './components/ServiceRegistrationModal';
import { generateHalfHourIntervals, getTimeInterVal } from './components/ServiceRegistrationModal/utils';

enum DataType {
  Today = 0,
  All = 1,
}

enum ModalType {
  CouponsManage = 'couponsManage',
  Appointment = 'appointment',
  ServiceRegistration = 'serviceRegistration',
  CustomerManage = 'customerManage',
}

const ModalStyles = {
  width: 1000,
  centered: true,
  destroyOnClose: true,
}

const StoreManagement: FC = () => {
  const appointmentRef = useRef<ActionType>();

  const { data: staffData } = useRequest(() => {
    return getUserList({
      current: 1,
      pageSize: 500,
    }).then((resp) => {
      return resp?.data?.list;
    })
  });

  const { data: appointmentData } = useRequest(() => {
    return getAppointmentList({
      date: dayjs().format('YYYY-MM-DD'),
    }).then((resp) => resp.data);
  });


  // 表格数据
  const dataSource = useMemo(() => {
    const appointmentMap: Record<string, any> = {};

    appointmentData?.forEach((record) => {
      const timeInterval = getTimeInterVal(record.appointment_time);
      if (appointmentMap[timeInterval]) {
        appointmentMap[timeInterval].push(record);
      } else {
        appointmentMap[timeInterval] = [record];
      }
    });

    return generateHalfHourIntervals(9, 18).map((time) => {
      return {
        timeStamp: time,
        aa: appointmentMap[time],
        appointments: groupBy(appointmentMap[time], 'teacher_name') || {},
      }
    });
  }, [appointmentData]);


  console.log('====timeLines===', staffData, dataSource);

  const columns2: ProColumns<any>[] = useMemo(() => {
    const col: ProColumns<any>[] = [
      {
        title: '时间',
        dataIndex: 'timeStamp',
        ellipsis: true,
        width: 140,
      },
    ]

    staffData?.forEach((staff) => {
      col.push({
        title: staff.cn_name,
        dataIndex: staff.cn_name,
        render: (_, record) => {
          const data = record.appointments[staff.user_name];
          return <Space>
            {data?.map((o: any) => {
              const method = o.service_mode === 'home' ? '上门' : '到店';
              return <Space size={2} style={{ fontSize: 12, fontWeight: 700 }} key={o.service_id} direction="vertical">
                <div>客户姓名: {o.customer_name}</div>
                <div>服务方式: {method}</div>
                <Space size={4}>
                  服务项目: {o.service_items.map((c: any) => <Tag color='blue' key={c.id}>{c.coupon_name}</Tag>)}
                </Space>
              </Space>
            })}
          </Space>;
        },
      })
    });
   
    return col;

  }, [staffData]);


  const [modalStatus, setModalStatus] = useState({
    appointmentOpen: false,
    couponsManageOpen: false,
    serviceRegistrationOpen: false,
    customerManageOpen: false,
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
        title={`${dayjs().format('YYYY年MM月DD日')}预约`}
        extra={
          <Space size={4}>
            <Button type="primary" icon={<AuditOutlined />} onClick={() => {
              updateModalStatus(ModalType.CustomerManage, true)
            }}>
              客户管理
            </Button>
            <Button type="primary" icon={<AuditOutlined />} onClick={() => {
              updateModalStatus(ModalType.CouponsManage, true)
            }}>
              销售收款
            </Button>
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
            {/* <Button
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
            </Button> */}
          </Space>
        }
      >
        <ProTable
          bordered
          pagination={false}
          actionRef={appointmentRef}
          rowKey="id"
          dataSource={dataSource}
          // request={fetchAppointmentList}
          options={false}
          columns={columns2}
          search={false}
          ghost
        />
      </ProCard>
      {modalStatus.customerManageOpen && <CustomerListModal
        {...ModalStyles}
        open={modalStatus.customerManageOpen}
        onCancel={() => updateModalStatus('customerManage', false)}
      />}
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
