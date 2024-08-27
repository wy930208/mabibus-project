import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components'
import { useRequest } from '@umijs/max';
import { Button, message, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { FC, useMemo, useRef, useState } from 'react';

import DropdownMenu from '@/components/DropdownMenu';
import { columnScrollX, CreateButton, operationColumn } from '@/components/TableColumns';
import { createCoupons, createMembersCoupons, deleteCoupons, fetchCoupons, updateCoupons } from '@/services/coupons';
import { getStoreList } from '@/services/store';
import { ROUTES } from '@/utils/enums';

import CouponsFormModal from './components/CouponsFormModal';
import DistributeCouponsModal from './components/DistributeCouponsModal';
import { CouponsTypeNameMap } from './constants';

const CouponsList: FC = () => {
  const [visible, setVisible] = useState(false);
  const [couponsModalVisible, setCouponsModalVisible] = useState(false);

  const { data: storeList = [] } = useRequest(getStoreList, {
    formatResult(resp) {
      return resp.data.map((o: { id: string; store_name: string; }) => ({ value: o.id, label: o.store_name }));
    },
  });

  // 当前操作的数据
  const [currentRecord, setCurrentRecord] = useState<{
    id: string;
  }>();

  const tableRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '卡券名称',
        dataIndex: 'coupon_name',
        ellipsis: true,
        width: 100,
        fixed: true,
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'coupon_type',
        ellipsis: true,
        width: 100,
        fixed: true,
        align: 'center',
        render(_, record) {
          return CouponsTypeNameMap[record.coupon_type]
        },
      },
      {
        title: '售价',
        dataIndex: 'sale_price',
        width: 80,
        fixed: true,
        align: 'center',
      },
      {
        title: '有效期',
        dataIndex: 'expire',
        width: 100,
        fixed: true,
        align: 'center',
        render(_, record) {
          if (record.expire_type === 'fix') {
            return <Space direction="vertical"><span>{record.beginTime}</span><span>{record.endTime}</span></Space>;
          }
          return <span>领取后 <Typography.Text type='warning'>{record.expireDay} </Typography.Text>天过期</span>

        },
      },

      {
        title: '创建时间',
        dataIndex: 'created_time',
        width: 140,
        align: 'center',
      },
      {
        ...operationColumn,
        width: 140,
        align: 'center',
        render: (_, record) => {
          return <Space size={20}>
            <Button size="small" onClick={() => {
              setCouponsModalVisible(true);
              setCurrentRecord(record)
            }} key="detail">发券</Button>
            <DropdownMenu
              key="opt"
              pathName={ROUTES.STORE_MANAGEMENT}
              editCallback={() => {
                setCurrentRecord({
                  ...record,
                  expireTimeRange: [record.beginTime, record.endTimes],
                });
                setVisible(true);
              }}
              deleteParams={{
                request: deleteCoupons,
                id: record.id,
              }}
              reloadTable={() => tableRef.current?.reload()}
            />
          </Space>
        },
      },
    ]
  }, [storeList]);

  const fetchTableData = async (params: any) => {
    return fetchCoupons()
  }

  const onCreateCoupon = () => {
    setCurrentRecord(undefined);
    setVisible(true);
  }

  return <PageContainer header={{ title: null }}>
    <ProTable
      rowKey="id"
      actionRef={tableRef}
      request={fetchTableData}
      columns={columns}
      toolBarRender={() => [
        <CreateButton
          key="create"
          pathName={ROUTES.STORE_MANAGEMENT}
          callback={onCreateCoupon}
        />,
      ]}
      scroll={{ x: columnScrollX(columns) }}
    />
    <CouponsFormModal
      title="卡券管理"
      width={500}
      open={visible}
      initialValues={currentRecord}
      onFinish={async (values) => {
        const { expireTimeRange, ...payload } = values;
        if (expireTimeRange) {
          payload.beginTime = dayjs(expireTimeRange[0]).startOf('milliseconds');
          payload.endTime = dayjs(expireTimeRange[1]).endOf('milliseconds');
        }

        const msgPrix = currentRecord ? '更新' : '新建';
        if (currentRecord) {
          await updateCoupons({
            id: currentRecord.id,
            ...payload,
          });
        } else {
          await createCoupons(payload);
        }
        message.success(`${msgPrix}成功`);
        setVisible(false);
        tableRef.current?.reload();
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setVisible(false),
      }}
      storeList={storeList}
    />
    <DistributeCouponsModal
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setCouponsModalVisible(false),
      }}
      initialValues={currentRecord}
      onFinish={async (values) => {
        await createMembersCoupons({
          ...values,
          coupon_id: currentRecord?.id,
        });
        message.success('发券成功');
        setCouponsModalVisible(false);
      }} open={couponsModalVisible} />
  </PageContainer>
}

export default CouponsList;
